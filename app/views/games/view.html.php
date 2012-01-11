<?php
/**
 * Elenears Erben: Wir tragen das Licht weiter
 *
 * @copyright     Copyright 2011, Elenears Erben (http://elenear.net)
 * @license       http://creativecommons.org/licenses/by-sa/3.0/legalcode Creative Commons Attribution-ShareAlike 3.0
 * @author        Tommi Enenkel, Daniel Fahlke
 */
 
	if($avatar == null)
	{
		echo "Du hast noch keinen Avatar für dieses Spiel.";
		echo $this->html->link('[Jetzt beitreten]', array('controller' => 'games', 'action' => 'join', 'args' => array($game->_id)));
		echo "<br/>";
	}
?>

<h3><?= $game->name ?></h3>

Euer Kartenzeichner hat Euch die neueste Karte der Welt schicken lassen:<br/>
<?php
	$this->scripts($this->html->script('jquery-1.4.2.js'));
	$this->scripts($this->html->script('jquery.event.drag-2.0.js'));
	$this->scripts($this->html->script('caat.js'));
	$this->scripts($this->html->script('map.js'));
?>
	<script type="text/javascript"> 
		var map1;

		var mapData = { 
			"xSize":10,
			"ySize":10,
			"fields":<?php echo($map); ?>,
			"units":<?php echo($visibleUnits); ?>
		};

		/**
		* This function will be called to let you define new scenes that will be
		* shown after the splash screen.
		* @param director
		*/
		function createScenes(director) {

              	var scene=              director.createScene();
			var mapRenderer = new MapRenderer(director);
			mapRenderer.loadMap(mapData);
			mapRenderer.drawMap(scene);
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
					{'id':'grasland', 	'url': EE.basePaths.image + 'field_grasland.png'},
					{'id':'water', 	'url': EE.basePaths.image + 'field_water.png'},
					{'id':'hunter',	'url': EE.basePaths.image + 'units/baddie_Ninja.png'}
				],

				/*
				 onEndSplash callback function.
				 Create your scenes on this method.
				*/
				createScenes
			);

/*
				map1 = new map2DFramework( document.getElementById('map') );
				map1.loadMap(mapData);
				map1.test();
				setTimeout("map1.drawMap()",500); //we redraw after a half second to be sure, that images are already loadedsetTimeout("map.drawMap()",500); //we redraw after a half second to be sure, that images are already loaded
*/


			});


		</script> 
<!--		TE: Manas Umrahmung fÃ¼r die Map
<style type="text/css"> 
			div{
				border: 1px #000 solid;
				min-height: 10px;
				min-width: 10px;
				display: inline-block;
			}
			#map canvas{
				position:absolute;
			}
		</style>  -->

		<button onclick="map1.drawMap();">Karte zeigen</button>
		<br/> 
		<div id="map" style="width: 800; height: 600px;"></div> 
<h3>Avatare:</h3>
<?php
	foreach($game->avatars as $avatar)
	{
		echo "<p>".$h($avatar->name)." - ".$h($avatar->age)."</p>";
	}
?>
