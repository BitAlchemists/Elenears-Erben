<?php
/**
 * Elenears Erben: Wir tragen das Licht weiter
 *
 * @copyright     Copyright 2011, Elenears Erben (http://elenear.net)
 * @license       http://creativecommons.org/licenses/by-sa/3.0/legalcode Creative Commons Attribution-ShareAlike 3.0
 * @author        Tommi Enenkel
 */
 
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
	<?=$this->html->link($h($game->name), array('controller' => 'games', 'action' => 'view', 'args' => array($game->_id)));?>
	<?php if($isAdmin): ?>
		<?=$this->html->link('[Entfernen]', array('controller' => 'games', 'action' => 'remove', 'args' => array($game->_id)));?>
	<?php endif; ?>
	</p>
</article>
<?php endforeach; ?>
