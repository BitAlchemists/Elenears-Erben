$.Model('Agent',{
  findAll: 'GET '+EE.paths.base+'agents/view/{id}.json'
},{});

$.Class('AgentsRenderer',{
	renderAgents : function(agents, fieldsRenderer) {
		fieldsRenderer.agentActors = [];
		for(var i = 0; i < agents.length; i++) {
			var agentActor = this.createAgentActor(agents[i]);
			agentActor.
				setFrameTime(fieldsRenderer.scene.time,this.lifetime).
				setDiscardable(true)
			fieldsRenderer.mapContainer.addChild(agentActor);
			fieldsRenderer.mapContainer.setZOrder(agentActor, 100);
			fieldsRenderer.agentActors.push(agentActor);
		}
	},
	createAgentActor : function(unit) {
		var fieldLength = EE.style.map.fieldLength;
		var agentActor = new CAAT.Actor().
			setLocation(unit.xPos * fieldLength, unit.yPos * fieldLength).
			setBackgroundImage(EE.style.map.images.hunter.getRef(), true).
			setAlpha(0.8);
		agentActor.actorType = ActorType.AGENT;
		agentActor.fieldPosition = new FieldPosition(unit.xPos, unit.yPos);
		return agentActor;
	},
	setLifetime : function( lifetime ){
		this.lifetime = lifetime;
	}
},{});

$.Class('AgentsController',{
	loadAgents : function(agents) {
		if(agents) {
			this.agents = agents;
			return;
		}
		
		return this.agents;
	},
	presentAgents : function(fieldsRenderer) {
		if(this.agents) {
			AgentsRenderer.renderAgents(this.agents, fieldsRenderer);
		}
	}
});