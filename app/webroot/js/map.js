
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

function MapRenderer(director) {
	var selection = null;
	this.director = director;
	this.map = null;
	var images = {};
	images.water = new CAAT.SpriteImage().initialize(director.getImage('water'),1,1);
	images.grasland = new CAAT.SpriteImage().initialize(director.getImage('grasland'),1,1);
	images.hunter = new CAAT.SpriteImage().initialize(director.getImage('hunter'),1,1);

	var fieldLength = 50;


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
	var onDeselect = function ( e ) {
		if(selection)	{
			selection.setAlpha(1);
		}
		selection = null;
	};

	var onSelectUnit = function( e ) {
		if ( selection ) {
			selection.setAlpha(1);
		}
		this.setAlpha(.5);
		selection = this;
	};

	this.drawMap = function(node) {

	        var mapContainer = new CAAT.ActorContainer().
			setLocation(0,0).
			setSize(500,500);
			//setFillStyle('rgb(0,0,0)');
		node.addChild(mapContainer);

		for(var y = 0; y < this.map.fields.length; y++) {
			var fieldRow = this.map.fields[y];
			for(var x = 0; x < fieldRow.length; x++) {
				var field = fieldRow[x];

				this.drawField(field, mapContainer, x, y);
			}
		}

		for(var i = 0; i < this.map.units.length; i++) {
			this.drawUnit(this.map.units[i], mapContainer);
		}

	};

	this.drawField = function(field, container, x, y) {
		var fieldActor = new CAAT.Actor().
			setLocation(x*fieldLength, y*fieldLength).
			setSize(fieldLength, fieldLength);
		setFieldStyle(fieldActor, field);
		container.addChild(fieldActor);
		fieldActor.mouseClick = onDeselect;
	};

	this.drawUnit = function(unit, container) {
		var unitActor = new CAAT.Actor().
			setLocation(unit.xPos * fieldLength, unit.yPos * fieldLength).
			setBackgroundImage(images.hunter.getRef(), true);
		container.addChild(unitActor);
		unitActor.mouseClick = onSelectUnit;
	}

	return this;
}
