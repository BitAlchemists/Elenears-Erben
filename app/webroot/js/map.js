
/**
 * Elenears Erben: Wir tragen das Licht weiter
 *
 * @copyright     Copyright 2011, Elenears Erben (http://elenear.net)
 * @license       http://creativecommons.org/licenses/by-sa/3.0/legalcode Creative Commons Attribution-ShareAlike 3.0
 * @author        Daniel Fahlke
 */



var ActorType = { FIELD : 1, UNIT : 2 };
var FieldPosition = function(x, y){ this.x = x; this.y = y; return this; };

$.Model('Map',{
  findOne: 'GET '+EE.paths.base+'maps/view/{id}.json'
},{});

function MapView(director, infoContainerDom) {
	var scene = director.createScene();
	this.delegate = null;
	this.director = director;
	this.infoContainerDom = infoContainerDom;
	this.map = null;
	this.mapContainer = null;
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

		for(var x = 0; x < map.fields.length; x++) {
			var fieldColumn = map.fields[x];
			this.fieldActors[x] = [];
			for(var y = 0; y < fieldColumn.length; y++) {
				var field = fieldColumn[y];

				var fieldActor = this.createFieldActor(field, x, y);
				mapContainer.addChild(fieldActor);
				this.fieldActors[x][y] = fieldActor;
			}
		}

		this.mapContainer = mapContainer;
	};

	this.drawAgents = function(agents) {
		for(var i = 0; i < agents.length; i++) {
			this.drawUnit(agents[i], this.mapContainer);
		}
	}

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

		this.fieldActors[x][y].setAlpha(alpha);
	};

	this.getUnitsFromField = function(x,y){
		var actors = this.mapContainer.childrenList;
		actors = jQuery.grep(actors,function(e){
			return e.actorType == ActorType.UNIT && e.fieldPosition.x == x && e.fieldPosition.y == y;
		});
		return actors;
	}

	this.showFieldInfo = function(x,y){
		var infoContainerDom = this.infoContainerDom
		jQuery(infoContainerDom).html('');
		jQuery(infoContainerDom).append('<h3>Feldübersicht</h3>');
		jQuery(infoContainerDom).append('<div>x:'+x+' / y:'+y+'</div>');
		jQuery(infoContainerDom).append('<h4>Einheiten</h4>');
		jQuery.each(
			this.getUnitsFromField(x,y),
			function(i,e){
				jQuery(infoContainerDom).append('actorType:'+e.actorType+'<br/>');
			}
		);
	}

	return this;
}

function MapController(view) {
	this.view = view;
	view.delegate = this;
	var astarMap = null;

	this.map = null;	
	this.agents = null;

	var selection = null;
	var currentRoute = null;

	this.loadMap = function(map) {
		this.map = map;
		//calc the astarMap
		astarMap = [];
		for(var x = 0; x < map.fields.length; x++) {
			var fieldColumn = map.fields[x];
			astarMap[x] = [];
			for(var y = 0; y < fieldColumn.length; y++) {
				var field = fieldColumn[y];
				var weight = 0;
				
				switch(field.type) {
				case 0: // water
					weight = 1;
					break;
				case 1: //grasland
					weight = 0;
					break;
				}	

				astarMap[x][y] = weight;
			}
		}
	};
	
	this.loadAgents = function(agents) {
		this.agents = agents;
	};

	this.presentMap = function() {
		this.view.drawMap(this.map);
		this.view.drawAgents(this.agents);
	};


	this.onSelectField = function ( e ) {
		var position = e.source.fieldPosition;
		view.showFieldInfo( position.x, position.y);
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
						view.setHighlightField(node.x, node.y, false);
					}
				}
				//find the new route

				var graph = new Graph(astarMap);
				var start = graph.nodes[selection.fieldPosition.x][selection.fieldPosition.y];
				var end = graph.nodes[this.fieldPosition.x][this.fieldPosition.y];
				currentRoute = astar.search(graph.nodes, start, end);

				//highlight the new route
					for(var i = 0; i < currentRoute.length; i++) {
						var node = currentRoute[i]
						view.setHighlightField(node.x, node.y, true);
					}
			}
		}
	}

	this.onSelectUnit = function( e ) {
		var position = e.source.fieldPosition;
		view.showFieldInfo( position.x, position.y);
		if ( selection ) {
			selection.deselect();
		}
		this.deselect = function() { this.setAlpha(0.8); };
		this.setAlpha(1.0);
		selection = this;
	};


	return this;
}

