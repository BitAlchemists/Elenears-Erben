
/**
 * Elenears Erben: Wir tragen das Licht weiter
 *
 * @copyright     Copyright 2011, Elenears Erben (http://elenear.net)
 * @license       http://creativecommons.org/licenses/by-sa/3.0/legalcode Creative Commons Attribution-ShareAlike 3.0
 * @author        Daniel Fahlke
 */



//var ActorType = { FIELD : 1, UNIT : 2 };
var FieldPosition = function(x, y){ this.x = x; this.y = y; return this; };

$.Model('Map',{
  findOne: 'GET '+EE.paths.base+'maps/view/{id}.json'
},{});

$.Class('FieldsRenderer', {
	init : function(director) {
		this.scene = director.createScene();
		this.mapContainer = new CAAT.ActorContainer().
			setLocation(0,0).
			setSize(500,500);
		this.scene.addChild(this.mapContainer);
		this.loggingVisitor = new LoggingMapVisitor(jQuery('#map-info-container').get(0), this);
	},
	renderMap : function(map) {
		this.fieldActors = []; //we store our fields in this matrix to use them later

		for(var x = 0; x < map.fields.length; x++) {
			var fieldColumn = map.fields[x];
			this.fieldActors[x] = [];
			for(var y = 0; y < fieldColumn.length; y++) {
				var field = fieldColumn[y];

				var fieldActor = this.createFieldActor(field, x, y);
				this.mapContainer.addChild(fieldActor);
				this.mapContainer.setZOrder(fieldActor, 0);
				this.fieldActors[x][y] = fieldActor;
				
				//we also create an invisible actor that provides the actors that the user can interact with
				var interActor = this.createInterActor(x, y);
				this.mapContainer.addChild(interActor);
				this.mapContainer.setZOrder(interActor, 200);
			}
		}
	},
	createFieldActor : function(field, x, y) {
		var fieldLength = EE.style.map.fieldLength;
		var fieldActor = new CAAT.Actor().
			setLocation(x*fieldLength, y*fieldLength).
			setSize(fieldLength, fieldLength);
		this.setFieldStyle(fieldActor, field);
//		fieldActor.actorType = ActorType.FIELD; //this will tell visitors about the type of the field	
		return fieldActor;
	},
	createInterActor : function(x, y) {
		var fieldLength = EE.style.map.fieldLength;
		var interActor = new CAAT.Actor().
			setLocation(x*fieldLength, y*fieldLength).
			setSize(fieldLength, fieldLength);
		interActor.mouseClick = this.callback('delegateOnSelectField');
		interActor.mouseEnter = this.callback('delegateOnHoverField');
		interActor.fieldPosition = new FieldPosition(x, y); //we set the field position to allow visitors extract information

		return interActor;
	},
	setFieldStyle : function(actor, field) {

		var imagimageeName = null;

		switch(field.type) {
			case 0:
			{
				image = EE.style.map.images.water;
				break;
			}
			case 1:
			{
				image = EE.style.map.images.grasland;
				break;
			}
			default:
			{
				image = EE.style.map.images.water;
				break;
			}
		}

		actor.setBackgroundImage(image.getRef(),true);
	},
	visitor : function(visitor) {
		if(visitor) {
			this.visitor = visitor;
			return;
		}
		return visitor;
	},
	delegateOnHoverField : function(e) {
		this.loggingVisitor.onHoverField(e);
		this.visitor.onHoverField(e);
	},
	delegateOnSelectField : function(e) {
		this.loggingVisitor.onSelectField(e);
		this.visitor.onSelectField(e);
	}
});

$.Class('LoggingMapVisitor',{
	init : function(infoContainerDom, fieldsRenderer) {
		this.infoContainerDom = infoContainerDom;
		this.fieldsRenderer = fieldsRenderer;
	},
	onSelectField : function(e) {
		var position = e.source.fieldPosition;
		console.log(position);
	},
	onHoverField : function(e) {
		var position = e.source.fieldPosition;
		this.showFieldInfo( position.x, position.y);
		console.log(position);
	},
	showFieldInfo : function(x,y){
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
	},
	getUnitsFromField : function(x,y){
		var actors = this.fieldsRenderer.mapContainer.childrenList;
		actors = jQuery.grep(actors,function(e){
			return e.actorType == ActorType.UNIT && e.fieldPosition.x == x && e.fieldPosition.y == y;
		});
		return actors;
	}
});

function MapView(director, infoContainerDom) {
	
	this.setHighlightField = function(x,y,highlight) {
		this.fieldActors[x][y].setAlpha(highlight ? 0.5 : 1.0);
	};
}

function MapController(fieldsRenderer) {
	this.fieldsRenderer = fieldsRenderer;
	fieldsRenderer.delegate = this;
	var astarMap = null;

	this.map = null;	

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
	

	this.presentFields = function() {
		if(this.map) {
			this.fieldsRenderer.renderMap(this.map, this.view);
		}
	};


	this.onSelectField = function ( e ) {
		var position = e.source.fieldPosition;
		
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

