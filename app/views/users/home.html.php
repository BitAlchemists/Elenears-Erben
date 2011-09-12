<?php echo "<h3>Willkommen ".$username."!</h3>"; ?>
Du bist eingeloggt.<br/>
<?=$this->html->link('Ausloggen', array('controller' => 'users', 'action' => 'logout'));?><br/>
<?=$this->html->link('Spiel erstellen', array('controller' => 'games', 'action' => 'add'));?><br/>
<?=$this->html->link('Spiellist', array('controller' => 'games', 'action' => 'index'));?>

