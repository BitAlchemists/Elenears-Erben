<?= "<h3>Willkommen ".$username."!</h3>"; ?>
Du bist eingeloggt.<br/>
<?=$self->html->link('Ausloggen', array('controller' => 'sessions', 'action' => 'delete'));?>