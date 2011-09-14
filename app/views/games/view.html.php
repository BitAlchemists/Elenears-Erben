<?php
	if($avatar == null)
	{
		echo "Du hast noch keinen Avatar für dieses Spiel. ";
		echo $this->html->link('[Jetzt beitreten]', array('controller' => 'games', 'action' => 'join', 'args' => array($game->_id)));
		echo "<br/>";
	}
?>

<h3><?= $game->name ?></h3>

Map:<br/>
<?php echo($map); ?>

<h3>Avatare:</h3>
<?php
	foreach($game->avatars as $avatar)
	{
		echo "<p>".$avatar->name." - ".$avatar->age."</p>";
	}
?>
