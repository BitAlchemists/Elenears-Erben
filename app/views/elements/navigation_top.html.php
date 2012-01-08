<?php
/**
 * Elenears Erben: Wir tragen das Licht weiter
 *
 * @copyright     Copyright 2011, Elenears Erben (http://elenear.net)
 * @license       http://creativecommons.org/licenses/by-sa/3.0/legalcode Creative Commons Attribution-ShareAlike 3.0
 * @author        Tommi Enenkel
 */


use lithium\security\Auth;
use lithium\net\http\Media;
 
 ?>
<div id="top-nav">
	<div id="top-nav-left">
		<ul>
			<li><?php echo $this->html->link('Home', '/'); ?></li>
			<li><?php echo $this->html->link('Community', array('controller' => 'pages', 'action' => 'community')); ?></li>
			<li><?php echo $this->html->link('Mach mit!', array('controller' => 'pages', 'action' => 'join')); ?></li>
			<li><?php echo $this->html->link('Roadmap', array('controller' => 'pages', 'action' => 'roadmap')); ?></li>
			<li><?php echo $this->html->link('Impressum', array('controller' => 'pages', 'action' => 'impressum')); ?></li>
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

<!-- refactoring for community-support
<div id="audio-container">
	<audio controls="false" loop="loop" autoplay="autoplay" onEnded="this.currentTime = 0; this.play();">
  <source src="<?php echo $this->url('audio/music/Dulcimer_Dance-Forest_Elves.ogg');?>" type="audio/ogg" />
</audio>
-->
<div>
  <a href="http://www.youtube.com/watch?v=MrBRJRt2i-c">Dulcimer Dance</a> by <a href="http://www.youtube.com/user/ForestElves">?~Forest Elves~?</a>
  <div xmlns:cc="http://creativecommons.org/ns#" about="http://creativecommons.org"><a rel="cc:attributionURL" property="cc:attributionName" href="http://creativecommons.org">Creative Commons</a> / <a rel="license" href="http://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a></div>
</div>