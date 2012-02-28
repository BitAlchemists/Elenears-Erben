$.Model('Agent',{
  findAll: 'GET '+EE.paths.base+'agents/view/{id}.json',
},{});

function AgentView() {

	this.drawAgents = function(agents) {
		for(var i = 0; i < agents.length; i++) {
			this.drawUnit(agents[i], this.mapContainer);
		}
	}

	this.drawUnit = function(unit, container) {
		var unitActor = new CAAT.Actor().
			setLocation(unit.xPos * this.fieldLength, unit.yPos * this.fieldLength).
			setBackgroundImage(images.hunter.getRef(), true).
			setAlpha(0.8);
		container.addChild(unitActor);
		unitActor.mouseClick = this.delegate.onSelectUnit;
		unitActor.actorType = ActorType.UNIT;
		unitActor.fieldPosition = new FieldPosition(unit.xPos, unit.yPos);
	};

	return this;
}