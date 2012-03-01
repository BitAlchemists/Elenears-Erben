$.Model('Agent',{
  findAll: 'GET '+EE.paths.base+'agents/view/{id}.json',
},{});

$.Class('AgentsRenderer',{
	renderAgents : function(agents, mapView) {
		for(var i = 0; i < agents.length; i++) {
			this.drawUnit(agents[i], mapView.mapContainer);
		}
	},
	drawUnit : function(unit, container) {
		var fieldLength = EE.style.map.fieldLength;
		var unitActor = new CAAT.Actor().
			setLocation(unit.xPos * fieldLength, unit.yPos * fieldLength).
			setBackgroundImage(EE.style.map.images.hunter.getRef(), true).
			setAlpha(0.8);
		container.addChild(unitActor);
		//unitActor.mouseClick = this.delegate.onSelectUnit;
		//unitActor.actorType = ActorType.UNIT;
		unitActor.fieldPosition = new FieldPosition(unit.xPos, unit.yPos);
		container.setZOrder(unitActor, 100);
	}
},{});

$.Class('AgentsController',{
	agents : function(agents) {
		if(agents) {
			this.agents = agents;
			return;
		}
		
		return this.agents;
	},
	presentAgents : function(mapView) {
		if(this.agents) {
			AgentsRenderer.renderAgents(this.agents, mapView);
		}
	}
});