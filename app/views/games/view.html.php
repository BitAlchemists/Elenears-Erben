<?php
	if($avatar == null)
	{
		echo "Du hast noch keinen Avatar für dieses Spiel. ";
		echo $this->html->link('[Jetzt beitreten]', 'Users::join');
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
		echo "<p>".$avatar->userid." - ".$avatar->name."</p>";
	}
?>
