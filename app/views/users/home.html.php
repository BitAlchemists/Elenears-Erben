<?php echo "<h3>Willkommen ".$username."!</h3>"; ?>
Du bist eingeloggt.<br/>
<?=$this->html->link('Ausloggen', array('controller' => 'users', 'action' => 'logout'));?>