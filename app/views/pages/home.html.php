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

<h3>Willkommen!</h3>
<ul>
	<li>
		Die Kisten waren verstaut, das Vieh versperrt, draußen brannte die Welt. Die Götter hatten ihr Werk getan, und setzen sich nun wohlverdient zur Ruhe. Elenear loderte auf und ward sobald verbrannt.
	</li>
	<li>
		Die meißten blieben.
	</li>
	<li>
		Doch eine Handvoll Männer und Frauen machte sich auf den Weg. Auf den Weg ins Nichts. Die Welt hinter uns brannte und so konnten wir nur unsere Schiffe beladen, losfahren... und... hoffen. Hoffen, dass wir irgendwann auf Land stoßen würden, oder auf offener See verhungern oder gar... verdursten. Elenear liegt im sterben und das einzige was davon noch übrig ist, sind wir...	
	</li>
	<li>
		Elenears Erben
	</li>
		<li>
		<?php echo $self->html->link('Registrieren', array('controller' => 'Account', 'action' => 'create')); ?>
	</li>
	<li>
		<?php echo $self->html->link('Einloggen', array('controller' => 'Account', 'action' => 'login')); ?>
	</li>
	<li>
		<?php echo $this->html->link('Forum', 'http://elenear.net/phpbb'); ?>
	</li>
	<li>
		<?php echo $this->html->link('News', 'http://elenear.net/wordpress'); ?>.
	</li>
</ul>