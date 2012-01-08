<?php
/**
 * Elenears Erben: Wir tragen das Licht weiter
 *
 * @copyright     Copyright 2011, Elenears Erben (http://elenear.net)
 * @license       http://creativecommons.org/licenses/by-sa/3.0/legalcode Creative Commons Attribution-ShareAlike 3.0
 * @author        Tommi Enenkel
 */
 
 ?><!doctype html>
<html>
<head>
	<?php echo $this->html->charset();?>
	<title>Elenears Erben > <?php echo $this->title(); ?></title>
	<?php echo $this->html->style(array('debug', 'lithium')); ?>
	<?php echo $this->scripts(); ?>
	<?php echo $this->html->script(array('ga.js')); ?>
	<?php echo $this->html->link('Icon', null, array('type' => 'icon')); ?>
	
	<link href="https://plus.google.com/118204036021426288668/" rel="publisher" />
</head>
<body class="app">
	<?php echo $this->_render( 'element', 'navigation_top' );?>
	<div id="container">
		<div id="header">
			<h1><?php echo $this->html->link('Elenears Erben', '/'); ?> - Alpha!</h1>
			<h2>Wir tragen das Licht weiter.</h2>
		</div>
		<div id="content">
			<?php echo $this->content(); ?>
		</div>
	</div>
</body>
</html>
