<?php
/**
 * Lithium: the most rad php framework
 *
 * @copyright     Copyright 2011, Union of RAD (http://union-of-rad.org)
 * @license       http://opensource.org/licenses/bsd-license.php The BSD License
 */

use lithium\core\Libraries;
use lithium\data\Connections;

$this->title('Willkommen');

$self = $this;
?>
<h3>Willkommen!</h3>
	<p>
		Die Kisten waren verstaut, das Vieh versperrt, drau�en brannte die Welt. Die G�tter hatten ihr Werk getan, und setzen sich nun wohlverdient zur Ruhe. Elenear loderte auf und ward sobald verbrannt.
	</p>
	<p>
		Die mei�ten blieben.
	</p>
	<p>
		Doch eine Handvoll M�nner und Frauen machte sich auf den Weg. Auf den Weg ins Nichts. Die Welt hinter uns brannte und so konnten wir nur unsere Schiffe beladen, losfahren... und... hoffen. Hoffen, dass wir irgendwann auf Land sto�en w�rden, oder auf offener See verhungern oder gar... verdursten. Elenear liegt im sterben und das einzige was davon noch �brig ist, sind wir...	
	</p>
	<p>
		Elenears Erben
	</p>
	<p>
		<?php echo $self->html->link('Registrieren', array('controller' => 'Account', 'action' => 'create')); ?>
	</p>
	<p>
		<?php echo $self->html->link('Einloggen', array('controller' => 'Account', 'action' => 'login')); ?>
	</p>
	<p>
		<?php echo $this->html->link('Forum', 'http://elenear.net/phpbb'); ?>
	</p>
	<p>
		<?php echo $this->html->link('News', 'http://elenear.net/wordpress'); ?>.
	</p>