<?php
/**
 * Elenears Erben: Wir tragen das Licht weiter
 *
 * @copyright     Copyright 2011, Elenears Erben (http://elenear.net)
 * @license       http://creativecommons.org/licenses/by-sa/3.0/legalcode Creative Commons Attribution-ShareAlike 3.0
 * @author        Tommi Enenkel, Daniel Fahlke
 */

	if($avatar == null) {
		echo "Du hast noch keinen Avatar für dieses Spiel.";
		echo $this->html->link('[Jetzt beitreten]', array('controller' => 'avatars', 'action' => 'join', 'args' => array($game->_id)));
		echo "<br/>";
	}
	else {
		echo "Möchtest Du Deinen Avatar löschen?";
		echo $this->html->link('[Jetzt loschen]', array('controller' => 'avatars', 'action' => 'leave', 'args' => array($avatar->_id)));
		echo "<br/>";
	}
?>

<h3><?= $game->name ?></h3>

Euer Kartenzeichner hat Euch die neueste Karte der Welt schicken lassen:<br/>
<?php
	$this->scripts($this->html->script('jquery.js'));
	//$this->scripts($this->html->script('jquery.event.drag-2.0.js'));
	$this->scripts($this->html->script('caat.js'));
	$this->scripts($this->html->script('jquerymx.js'));
	$this->scripts($this->html->script('graph.js'));
	$this->scripts($this->html->script('astar.js')); //required by map.js

	$this->scripts($this->html->script('CAATBootstrap.js'));
	$this->scripts($this->html->script('map.js'));
	$this->scripts($this->html->script('agent.js'));

?>
	<script type="text/javascript">


		/**
		* This function will be called to let you define new scenes that will be
		* shown after the splash screen.
		* @param director
		*/
		function createScenes(director) {
			var mapView = new MapView(director, jQuery('#map-info-container').get(0));
			var mapController = new MapController(mapView);
			var agentsController = new AgentsController();
			
			EE.style = EE.style || {};
			EE.style.map = EE.style.map || {};
			EE.style.map.images = EE.style.map.images || {};
			EE.style.map.images.water = new CAAT.SpriteImage().initialize(director.getImage('water'),1,1);
			EE.style.map.images.grasland = new CAAT.SpriteImage().initialize(director.getImage('grasland'),1,1);
			EE.style.map.images.hunter = new CAAT.SpriteImage().initialize(director.getImage('hunter'),1,1);
			EE.style.map.fieldLength = 50;
			
			Map.findOne({id: "<?php echo($game->_id)?>"}, function(map){
				mapController.loadMap(map);
				mapController.presentMap();	
			}, function(){alert("could not load map");});
			Agent.findAll({id: "<?php echo($game->_id)?>"}, function(agents){
				agentsController.agents(agents);
				agentsController.presentAgents(mapView);
			}, function(){alert("could not load agents");});
		};

		jQuery(document).ready(function(){

			CAAT.modules.initialization.init(
				/* canvas will be 800x600 pixels */
				700, 500,

				/* and will be added to the end of document. set an id of a canvas or div element */
				'map',
				/*
				 load these images and set them up for non splash scenes.
				 image elements must be of the form:
				 {id:'<unique string id>',    url:'<url to image>'}

				 No images can be set too.
				 */
				[
					{'id':'grasland', 'url': EE.paths.image + 'field_grasland.png'},
					{'id':'water', 	'url': EE.paths.image + 'field_water.png'},
					{'id':'hunter',	'url': EE.paths.image + 'units/baddie_Ninja.png'}
				],

				/*
				 onEndSplash callback function.
				 Create your scenes on this method.
				*/
				createScenes
			);

/*
$.fixture.on = false;

$.Model('Todo',{
  findAll: 'GET /todos.json',
  findOne: 'GET /todos/{id}.json',
  create:  'POST '+EE.paths.base+'agents/order',
  update:  'PUT /todos/{id}.json',
  destroy: 'DELETE /todos/{id}.json' 
},{});

// create a todo instance
var todo = new Todo({name: "do the dishes"})

// save it on the server
//todo.save(function(){alert('success');},function(){alert('fail');});
*/
		});


		</script> 

<h3>Avatare:</h3>
<?php
	if( is_array($game->avatars) ){
		foreach($game->avatars as $avatar)
		{
			echo "<p>".$h($avatar->name)." - ".$h($avatar->age)."</p>";
		}
	}else{
		echo 'derzeit bevölkern keine Avatare diese Welt';
	}
?>

<div id="map"></div>
<div id="map-info-container"></div>
