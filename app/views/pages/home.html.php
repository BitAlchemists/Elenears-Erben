<?php
/**
 * Elenears Erben: Wir tragen das Licht weiter
 *
 * @copyright     Copyright 2011, Elenears Erben (http://elenear.net)
 * @license       http://creativecommons.org/licenses/by-sa/3.0/legalcode Creative Commons Attribution-ShareAlike 3.0
 * @author        Tommi Enenkel
 */



use lithium\core\Libraries;
use lithium\data\Connections;
use lithium\storage\Session;
use lithium\security\Auth;
use lithium\util\String;


$this->title('Willkommen');

?>
<div id="teaser">


<?php
	$username = Session::read('user.username');
	if(is_string($username))
	{
		echo "<h3>Willkommen ".$h($username)."!</h3>";
	}
	else
	{
		echo "<h3>Willkommen!</h3>";
	}
?>
	<p>
		Die Kisten waren verstaut, das Vieh versperrt, draussen brannte die Welt. Die Götter hatten ihr Werk getan, und setzen sich nun wohlverdient zur Ruhe. Elenear loderte auf und ward sobald verbrannt.
	</p>
	<p>
		Die meisten blieben.
	</p>
	<p>
		Doch eine Handvoll Männer und Frauen machte sich auf den Weg. Auf den Weg ins Nichts. Die Welt hinter uns brannte und so konnten wir nur unsere Schiffe beladen, losfahren... und... hoffen. Hoffen, dass wir irgendwann auf Land stoßen würden, oder auf offener See verhungern oder gar... verdursten. Elenear liegt im Sterben und das Einzige was davon noch übrig ist, sind wir...	
	</p>
	<p>
		Elenears Erben
	</p>
</div>
<div id="about">
	<h3>Was ist Elenears Erben?</h3>
	<p>
		Elenears Erben ist ist ein Open Source Projekt, in dem wir gemeinschaftlich ein mittelalterliches Browsergame erschaffen. Wirtschaft, Diplomatie und Krieg sind die Säulen, auf denen wir eines der vielschichtigsten Browsergames aufbauen wollen. Das Spiel ist derzeit in der Alpha-Phase: Das heisst, es gibt noch nicht sehr viel zu sehen. Während unsere Entwickler fleissig damit beschäftigt sind, die erste Beta-Version zu erstellen, diskutieren wir derzeit primär auf Facebook über neue Features.<br/>
		Besuche unsere <?php echo $this->html->link('Facebook-Gruppe', 'http://www.facebook.com/groups/163490240349780/');?> oder <a href="https://plus.google.com/118204036021426288668/?prsrc=3" style="text-decoration: none; color: #333;"><div style="display: inline-block;"><span style="float: left; font: bold 13px/16px arial,sans-serif; margin-right: 4px; margin-top: 7px;">Elenears Erben</span><span style="float: left; font: 13px/16px arial,sans-serif; margin-right: 11px; margin-top: 7px;">auf</span><div style="float: left;"><img src="https://ssl.gstatic.com/images/icons/gplus-32.png" width="32" height="32" style="border: 0;"/></div><div style="clear: both"></div></div></a>.
	</p>
</div>
<div id="news">
	<h3>News</h3>
	<?php 
		foreach($news as $newsEntry)
		{
			echo "<h4>" . $h($newsEntry->title) . "</h4>";
			echo "on " . $newsEntry->date . " by " . $h($newsEntry->author) . "<br/>";
			echo $h($newsEntry->text);
		}
	
	?>
</div>