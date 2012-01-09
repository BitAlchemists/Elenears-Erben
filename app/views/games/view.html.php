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
	$this->scripts($this->html->script('canvas_map.js'));
?>
		<script type="text/javascript"> 
			var map;
			jQuery(document).ready(function(){
				map = new map2DFramework( document.getElementById('map') );
				map.loadMap(
					{ 
						"xSize":10,
						"ySize":10,
						"data":<?php echo($map); ?>,
						"units":<?php echo($visibleUnits); ?>
					}	
				);
				map.test();
				setTimeout("map.drawMap()",500); //we redraw after a half second to be sure, that images are already loadedsetTimeout("map.drawMap()",500); //we redraw after a half second to be sure, that images are already loaded

			})
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

		<button onclick="map.drawMap();">Karte zeigen</button>
		<br/> 
		<div id="map" style="width: 200px; height: 200px;"></div> 
<h3>Avatare:</h3>
<?php
	foreach($game->avatars as $avatar)
	{
		echo "<p>".$h($avatar->name)." - ".$h($avatar->age)."</p>";
	}
?>
