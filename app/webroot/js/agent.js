$.Model('Agent',{
  findAll: 'GET '+EE.paths.base+'agents/view/{id}.json',
},{});

$.Class('AgentsRenderer',{
	drawAgents : function(agents) {
		for(var i = 0; i < agents.length; i++) {
			this.drawUnit(agents[i], this.mapContainer);
		}
	},
	drawUnit : function(unit, container) {
		var unitActor = new CAAT.Actor().
			setLocation(unit.xPos * this.fieldLength, unit.yPos * this.fieldLength).
			setBackgroundImage(images.hunter.getRef(), true).
			setAlpha(0.8);
		container.addChild(unitActor);
		unitActor.mouseClick = this.delegate.onSelectUnit;
		unitActor.actorType = ActorType.UNIT;
		unitActor.fieldPosition = new FieldPosition(unit.xPos, unit.yPos);
	}
},{});

$.Class('AgentsController',{

},{
	agents : function(agents) {
		if(agents) {
			this.agents = agents;
			return;
		}
		
		return this.agents;
	},
	presentAgents : function(mapView) {
		if(this.agents) {
			mapView.drawAgents(this.agents);
		}
	}
});