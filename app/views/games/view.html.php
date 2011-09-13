<?php

?>

<h3><?= $game->name ?></h3>

Map:<br/>
<?php var_dump($map); ?>

<h3>Avatare:</h3>
<?php
	foreach($game->avatars as $avatar)
	{
		echo "<p>".$avatar->name."</p>";
	}
?>
