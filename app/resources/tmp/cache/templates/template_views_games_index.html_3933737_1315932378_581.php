<?php

use lithium\storage\Session;

	$isAdmin = Session::read('user.isAdmin');

	if($isAdmin)
	{
		echo $this->html->link('Spiel erstellen', array('controller' => 'games', 'action' => 'add'));
	}
	

?><br/>

<?php foreach($games as $game): ?>
<article>
	<p>
	<?php echo $this->html->link($game->name, array('controller' => 'games', 'action' => 'view', 'args' => array($game->_id))); ?>
	<?php if($isAdmin): ?>
		<?php echo $this->html->link('[Entfernen]', array('controller' => 'games', 'action' => 'remove', 'args' => array($game->_id))); ?>
	<?php endif; ?>
	</p>
</article>
<?php endforeach; ?>
