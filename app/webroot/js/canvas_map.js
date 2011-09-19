var map2DFramework = function(container){
	
	var container = container;
	var mapData;
	var map = [];
	var images = {};
	this.fieldSize = 30;
	
	var init = function(){
		var layer = document.createElement('canvas');
		container.appendChild(layer);
		map[0] = layer.getContext('2d');
		
		map[0].fillStyle = "green";  
		map[0].strokeStyle = "black";  
		
		layer = document.createElement('canvas');
		container.appendChild(layer);
		map[1] = layer.getContext('2d');
		
		
		images.grasland = new Image();   // Create new img element  
		images.grasland.src = 'field_grasland.png'; // Set source path  
		images.water = new Image();   // Create new img element  
		images.water.src = 'field_water.png'; // Set source path  
		
	}
	
	this.test = function(){
		console.log(map);
	}
	
	this.loadMap = function(input){
		mapData = input;
		this.drawMap();
	}
	
	this.drawMap = function(){
		var fields = mapData.data;
		var field,xLength,yLength;
		xLength = fields.length
		for(var x = 0; x < xLength; x++){
			yLength = fields[x].length;
			for(var y = 0; y < yLength; y++){
				this.drawField(x,y);
			}
		}
	}
	
	this.drawField = function(x,y){
		this.drawImageField(x,y);
	}
	
	this.drawBasicField = function(x,y){
		var oldFillStyle = map[0].fillStyle;
		switch( mapData.data[x][y].type ){
			case 0:
				map[0].fillStyle = 'blue'
				break;
			case 1:
				map[0].fillStyle = 'green'
				break;
		}
		map[0].fillRect(
			(y) * this.fieldSize,
			Math.round( x) * this.fieldSize,
			this.fieldSize,
			this.fieldSize
		);
					
		map[0].fillStyle = oldFillStyle;
	}
	
	this.drawImageField = function(x,y){
		var image;
		switch( mapData.data[x][y].type ){
			case 0:
				image = images.water;
				break;
			case 1:
				image = images.grasland;
				break;
		}
		map[0].drawImage(
			image,
			(y) * this.fieldSize,
			Math.round( x) * this.fieldSize,
			this.fieldSize,
			this.fieldSize
		);
	}
	
	
	init();
	
	return this;
}