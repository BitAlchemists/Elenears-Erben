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
<?php
	$username = Session::read('username');
	if(is_string($username))
	{
		echo "<h3>Willkommen ".$username."!</h3>";
	}
	else
	{
		echo "<h3>Willkommen!</h3>";
	}
?>
	<p>
		Die Kisten waren verstaut, das Vieh versperrt, draußen brannte die Welt. Die Götter hatten ihr Werk getan, und setzen sich nun wohlverdient zur Ruhe. Elenear loderte auf und ward sobald verbrannt.
	</p>
	<p>
		Die meißten blieben.
	</p>
	<p>
		Doch eine Handvoll Männer und Frauen machte sich auf den Weg. Auf den Weg ins Nichts. Die Welt hinter uns brannte und so konnten wir nur unsere Schiffe beladen, losfahren... und... hoffen. Hoffen, dass wir irgendwann auf Land stoßen würden, oder auf offener See verhungern oder gar... verdursten. Elenear liegt im sterben und das einzige was davon noch übrig ist, sind wir...	
	</p>
	<p>
		Elenears Erben
	</p>
	<p>
		<?php echo $self->html->link('Registrieren', array('controller' => 'users', 'action' => 'create')); ?>
	</p>
	
	<p>
		<?php 
			if(Auth::check('default'))
			{
				echo $self->html->link('Ausloggen', array('controller' => 'sessions', 'action' => 'delete'));
			}
			else
			{
				echo $self->html->link('Einloggen', array('controller' => 'sessions', 'action' => 'add'));
			}
		?>
		
	</p>
	<p>
		<?php echo $this->html->link('Forum', 'http://elenear.net/phpbb'); ?>
	</p>
	<p>
		<?php echo $this->html->link('News', 'http://elenear.net/wordpress'); ?>
	</p>
	<p>
		<?php echo $this->html->link('Impressum', array('controller' => 'pages', 'action' => 'impressum')); ?>
	</p>