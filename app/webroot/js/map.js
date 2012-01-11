
/**
 * Elenears Erben: Wir tragen das Licht weiter
 *
 * @copyright     Copyright 2011, Elenears Erben (http://elenear.net)
 * @license       http://creativecommons.org/licenses/by-sa/3.0/legalcode Creative Commons Attribution-ShareAlike 3.0
 * @author        Daniel Fahlke
 */

/**
 * @license
 * 
 * The MIT License
 * Copyright (c) 2010-2011 Ibon Tolosana, Hyperandroid || http://labs.hyperandroid.com/

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

// CAAT bootstrap

CAAT.modules.initialization= CAAT.modules.initialization || {};


CAAT.modules.initialization.init= function( width, height, runHere, imagesURL, onEndLoading )   {

    /**
     * infere whether runhere is on a DIV, canvas, or none at all.
     * If none at all, just append the created canvas to the document.
     */
    var isCanvas= false;
    var canvascontainer= document.getElementById(runHere);

    if ( canvascontainer ) {
        if ( canvascontainer instanceof HTMLDivElement ) {
            isCanvas= false;
        } else if ( canvascontainer instanceof HTMLCanvasElement ) {
            isCanvas= true;
        } else {
            canvascontainer= document.body;
        }
    } else {
        canvascontainer= document.createElement('div');
        document.body.appendChild(canvascontainer);
    }
    
    /**
     * create a director.
     */
    var director = new CAAT.Director().
            initialize(
                width||800,
                height||600,
                isCanvas?canvascontainer:undefined)
            ;

    if ( !isCanvas ) {
        canvascontainer.appendChild( director.canvas );
    }

    /**
     * Load splash images. It is supossed the splash has some images.
     */
    new CAAT.ImagePreloader().loadImages(
        imagesURL,
        function on_load( counter, images ) {

            if ( counter==images.length ) {

                director.emptyScenes();
                director.setImagesCache(images);

                onEndLoading(director);

                /**
                 * Change this sentence's parameters to play with different entering-scene
                 * curtains.
                 * just perform a director.setScene(0) to play first director's scene.
                 */
                director.easeIn(
                        0,
                        CAAT.Scene.prototype.EASE_SCALE,
                        2000,
                        false,
                        CAAT.Actor.prototype.ANCHOR_CENTER,
                        new CAAT.Interpolator().createElasticOutInterpolator(2.5, .4) );

                CAAT.loop(60);

            }
        }
    );
};

function MapRenderer(director) {
	var selectedField = null;
	this.director = director;
	this.map = null;
	var images = {};
	images.water = new CAAT.SpriteImage().initialize(director.getImage('water'),1,1);
	images.grasland = new CAAT.SpriteImage().initialize(director.getImage('grasland'),1,1);

	this.loadMap = function(map) {
		this.map = map;
	}

	var setFieldStyle = function(actor, field) {

		var imagimageeName = null;

		switch(field.type) {
			case 0:
			{
				image= images.water;
				break;
			}
			case 1:
			{
				image= images.grasland;
				break;
			}
			default:
			{
				image= images.water;
				break;
			}
		}

		actor.setBackgroundImage(image.getRef(),true);
	}

	/**
	* function to select on-screen actors.
	* @param e
	*/
	var mouseClick= function( e ) {
		if ( selectedField ) {
			selectedField.setAlpha(1);
		}
		this.setAlpha(.5);
		selectedField = this;
	};

	this.drawMap = function(node) {
		var fieldLength = 50;
		var fieldOffset = 5;

	        var background = new CAAT.ShapeActor().
			setShape(CAAT.ShapeActor.prototype.SHAPE_RECTANGLE).
			setLocation(0,0).
			setSize(500,500).
			setFillStyle('rgb(0,0,0)');
		node.addChild(background);

		for(var y = 0; y < this.map.fields.length; y++) {
			var fieldRow = this.map.fields[y];
			for(var x = 0; x < fieldRow.length; x++) {
				var field = fieldRow[x];

				var fieldActor = new CAAT.Actor().
					setLocation(x*fieldLength + (x+1)*fieldOffset, y*fieldLength + (y+1)*fieldOffset).
					setSize(fieldLength, fieldLength);
				fieldActor.mouseClick = mouseClick;
				setFieldStyle(fieldActor, field);

				background.addChild(fieldActor);
			}
		}

	};

	return this;
}

var map2DFramework = function(container){
	
	var container = container;
	var mapData;
	var map = [];
	var images = {};
	images.fields = {};
	images.units = {};
	this.fieldSize = 30;
	
	var init = function(){
        container.style.width = '600px';
        container.style.height = '600px';
		var layer = document.createElement('canvas');
        layer.width = 600;
		layer.height = 600;
        layer.style.position = 'absolute';
		container.appendChild(layer);
		map[0] = layer.getContext('2d');
		
		map[0].fillStyle = "green";  
		map[0].strokeStyle = "black";  
		
		layer = document.createElement('canvas');
        layer.width = 600;
		layer.height = 600;
        layer.style.position = 'absolute';
		container.appendChild(layer);
		map[1] = layer.getContext('2d');
		map[1].fillStyle = "green";  
		map[1].strokeStyle = "black";  
		
		
		images.fields.grasland = new Image();   // Create new img element  
		images.fields.grasland.src = EE.basePaths.image + 'field_grasland.png'; // Set source path  
		images.fields.water = new Image();   // Create new img element  
		images.fields.water.src = EE.basePaths.image + 'field_water.png'; // Set source path  
		images.units.type0 = new Image();   // Create new img element  
		images.units.type0.src = EE.basePaths.image + 'units/baddie_Ninja.png'; // Set source path  
		
	};
	
	this.test = function(){
		console.log(map);
	};
	
	this.loadMap = function(input){
		mapData = input;
		this.drawMap();
	};
	
	this.clearLayer = function( n ){
		map[n].clearRect(0,0,600,600);
	}
	
	this.drawMap = function(){
		this.clearLayer(0);
		this.clearLayer(1);
		var fields = mapData.fields;
		var field,xLength,yLength,unitsLength;
		var x;
		xLength = fields.length;
		for(x = 0; x < xLength; x++){
			yLength = fields[x].length;
			for(var y = 0; y < yLength; y++){
				this.drawField(x,y);
			}
		}
		unitsLength = mapData.units.length;
		for(x = 0; x < unitsLength; x++){
			this.drawUnit( mapData.units[x] );
		}
	};
	
	this.drawField = function(x,y){
		this.drawImageField(x,y);
	};
	
	this.drawBasicField = function(x,y){
		var oldFillStyle = map[0].fillStyle;
		switch( mapData.fields[x][y].type ){
			case 0:
				map[0].fillStyle = 'blue';
				break;
			case 1:
				map[0].fillStyle = 'green';
				break;
		}
		map[0].fillRect(
			(y) * this.fieldSize,
			Math.round( x) * this.fieldSize,
			this.fieldSize,
			this.fieldSize
		);
					
		map[0].fillStyle = oldFillStyle;
	};
	
	this.drawImageField = function(x,y){
		var image;
		switch( mapData.fields[x][y].type ){
			case 0:
				image = images.fields.water;
				break;
			case 1:
				image = images.fields.grasland;
				break;
		}
		map[0].drawImage(
			image,
			(y) * this.fieldSize,
			Math.round( x) * this.fieldSize,
			this.fieldSize,
			this.fieldSize
		);
	};
	
	this.drawUnit = function(unit){
		var image;
		switch( unit.type ){
			default:
				image = images.units.type0;
				break;
		}
		map[1].drawImage(
			image,
			Math.round( unit.yPos) * this.fieldSize,
			Math.round( unit.xPos) * this.fieldSize,
			this.fieldSize,
			this.fieldSize
		);
	}
	
	init();
	
	return this;
};
