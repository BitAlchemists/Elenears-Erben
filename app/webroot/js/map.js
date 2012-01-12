
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
/*
                director.easeIn(
                        0,
                        CAAT.Scene.prototype.EASE_SCALE,
                        2000,
                        false,
                        CAAT.Actor.prototype.ANCHOR_CENTER,
                        new CAAT.Interpolator().createElasticOutInterpolator(2.5, .4) );
*/
                CAAT.loop(60);

            }
        }
    );
};

var ActorType = { FIELD : 1, UNIT : 2 };
var FieldPosition = function(x, y){ this.x = x; this.y = y; return this; };


function MapView(director) {
      	var scene = director.createScene();
	this.delegate = null;
	this.director = director;
	this.map = null;
	var images = {};
	this.fieldActors = null;
	images.water = new CAAT.SpriteImage().initialize(director.getImage('water'),1,1);
	images.grasland = new CAAT.SpriteImage().initialize(director.getImage('grasland'),1,1);
	images.hunter = new CAAT.SpriteImage().initialize(director.getImage('hunter'),1,1);
	var astarMap = null;	

	var fieldLength = 50;


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

	this.drawMap = function(map) {

	        var mapContainer = new CAAT.ActorContainer().
			setLocation(0,0).
			setSize(500,500);
		scene.addChild(mapContainer);

		this.fieldActors = [];

		for(var y = 0; y < map.fields.length; y++) {
			var fieldRow = map.fields[y];
			this.fieldActors[y] = [];
			for(var x = 0; x < fieldRow.length; x++) {
				var field = fieldRow[x];

				var fieldActor = this.createFieldActor(field, x, y);
				mapContainer.addChild(fieldActor);
				this.fieldActors[y][x] = fieldActor;
			}
		}

		for(var i = 0; i < map.units.length; i++) {
			this.drawUnit(map.units[i], mapContainer);
		}

	};

	this.createFieldActor= function(field, x, y) {
		var fieldActor = new CAAT.Actor().
			setLocation(x*fieldLength, y*fieldLength).
			setSize(fieldLength, fieldLength);
		setFieldStyle(fieldActor, field);
		fieldActor.mouseClick = this.delegate.onSelectField;
		fieldActor.mouseEnter = this.delegate.onHoverField;
		fieldActor.actorType = ActorType.FIELD;
		fieldActor.fieldPosition = new FieldPosition(x, y);
		return fieldActor;
	};

	this.drawUnit = function(unit, container) {
		var unitActor = new CAAT.Actor().
			setLocation(unit.xPos * fieldLength, unit.yPos * fieldLength).
			setBackgroundImage(images.hunter.getRef(), true).
			setAlpha(0.8);
		container.addChild(unitActor);
		unitActor.mouseClick = this.delegate.onSelectUnit;
		unitActor.actorType = ActorType.UNIT;
		unitActor.fieldPosition = new FieldPosition(unit.xPos, unit.yPos);
	};

	this.setHighlightField = function(x,y,highlight) {
		var alpha = 1.0;
		if(highlight) {
			alpha = 0.5;
		}

		this.fieldActors[y][x].setAlpha(alpha);
	};

	return this;
}

function MapController(view) {
	this.view = view;
	view.delegate = this;
	var astarMap = null;
	this.map = null;
	var selection = null;
	var currentRoute = null;

	this.loadMap = function(map) {
		this.map = map;

		//calc the astarMap
		astarMap = [];
		for(var y = 0; y < map.fields.length; y++) {
			var fieldRow = map.fields[y];
			astarMap[y] = [];
			for(var x = 0; x < fieldRow.length; x++) {
				var field = fieldRow[x];
				var weight = 0;
				
				switch(field.type) {
				case 0: // water
					weight = 1;
					break;
				case 1: //grasland
					weight = 0;
					break;
				}	

				astarMap[y][x] = weight;
			}
		}
	}
	
	this.presentMap = function() {
		this.view.drawMap(this.map);
	}


	this.onSelectField = function ( e ) {
		if(selection)	{
			selection.deselect();
		}
		this.deselect = function() { };
		selection = this;
	};

	this.onHoverField = function ( e ) {
		if(selection) {
			if(selection.actorType == ActorType.UNIT) {
				//unhighlight the current route
				if(currentRoute) {
					for(var i = 0; i < currentRoute.length; i++) {
						var node = currentRoute[i]
						view.setHighlightField(node.y, node.x, false);
					}
				}
				//find the new route

				var graph = new Graph(astarMap);
				var start = graph.nodes[selection.fieldPosition.y][selection.fieldPosition.x];
				var end = graph.nodes[this.fieldPosition.y][this.fieldPosition.x];
				currentRoute = astar.search(graph.nodes, start, end);

				//highlight the new route
					for(var i = 0; i < currentRoute.length; i++) {
						var node = currentRoute[i]
						view.setHighlightField(node.y, node.x, true);
					}
			}
		}
	}

	this.onSelectUnit = function( e ) {
		if ( selection ) {
			selection.deselect();
		}
		this.deselect = function() { this.setAlpha(0.8); };
		this.setAlpha(1.0);
		selection = this;
	};


	return this;
}