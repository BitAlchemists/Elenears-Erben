<?php

use lithium\storage\Session;

	$isAdmin = Session::read('user.isAdmin');

?>

﻿<?php echo "<h3>Willkommen ".$username."!</h3>"; ?>
Du bist eingeloggt.<br/>
<?php echo $this->html->link('Ausloggen', array('controller' => 'users', 'action' => 'logout')); ?><br/>
<?php if($isAdmin) echo $this->html->link('Spiel erstellen', array('controller' => 'games', 'action' => 'add')); ?><br/>
<?php echo $this->html->link('Spiellist', array('controller' => 'games', 'action' => 'index')); ?><br/><br/><br/><br/>
<?php echo $this->html->link('Konto unwiderruflich und für immer und ewig ohne Sicherheitsabfrage löschen', array('controller' => 'users', 'action' => 'destroy')); ?><br/>
