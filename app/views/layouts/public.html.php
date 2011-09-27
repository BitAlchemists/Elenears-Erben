<?php
/**
 * Lithium: the most rad php framework
 *
 * @copyright     Copyright 2011, Union of RAD (http://union-of-rad.org)
 * @license       http://opensource.org/licenses/bsd-license.php The BSD License
 */
use lithium\security\Auth;
 
 ?>
<!doctype html>
<html>
<head>
	<?php echo $this->html->charset();?>
	<title>Elenears Erben > <?php echo $this->title(); ?></title>
	<?php echo $this->html->style(array('debug', 'lithium')); ?>
	<?php echo $this->scripts(); ?>
	<?php echo $this->html->link('Icon', null, array('type' => 'icon')); ?>
</head>
<body class="app">
	<div id="top-nav">
		<div id="top-nav-left">
			<ul>
				<li><?php echo $this->html->link('Home', '/'); ?></li>
				<li><?php echo $this->html->link('Impressum', array('controller' => 'pages', 'action' => 'impressum')); ?></li>
				<li><?php echo $this->html->link('Forum', 'http://elenear.net/phpbb'); ?></li>		
			</ul>
		</div>
		<div id="top-nav-right">
			<ul>
				<li>	
					<?php 
						if(!Auth::check('default'))
						{
							echo $this->html->link('Registrieren', array('controller' => 'users', 'action' => 'create')); 
						}
					?>
				</li>
				<li>
					<?php 
						if(Auth::check('default'))
						{
							echo $this->html->link('Ausloggen', array('controller' => 'users', 'action' => 'logout'));
						}
						else
						{
							echo $this->html->link('Einloggen', array('controller' => 'users', 'action' => 'login'));
						}
					?>
				</li>
			</ul>
		</div>
	</div>
	<div id="container">
		<div id="header">
			<h1><?php echo $this->html->link('Elenears Erben', '/'); ?></h1>
			<h2>Wir tragen das Licht weiter.</h2>
		</div>
		<div id="content">
			<?php echo $this->content(); ?>
		</div>
	</div>
</body>
</html>
