<?php
	if($avatar == null)
	{
		echo "Du hast noch keinen Avatar für dieses Spiel. ";
		echo $this->html->link('[Jetzt beitreten]', array('controller' => 'games', 'action' => 'join', 'args' => array($game->_id)));
		echo "<br/>";
	}
?>

<h3><?php echo $h($game->name); ?></h3>

Map:<br/>
<?php
	echo $this->html->script('jquery-1.4.2.js');
	echo $this->html->script('jquery.event.drag-2.0.js');
	echo $this->html->script('canvas_map.js');
?>
		<script type="text/javascript"> 
			var map;
			jQuery(document).ready(function(){
				map = new map2DFramework( document.getElementById('map') );
				map.loadMap(
					{ 
						xSize:3,
						ySize:3,
						data:[
							[{type:0},{type:0},{type:1}],
							[{type:0},{type:1},{type:1}],
							[{type:1},{type:1},{type:1}]
						] 
					}	
				);
				map.test();
			})
		</script> 
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
		</style> 

<?php echo($map); ?>

<h3>Avatare:</h3>
<?php
	foreach($game->avatars as $avatar)
	{
		echo "<p>".$avatar->name." - ".$avatar->age."</p>";
	}
?>
