<?php
/**
 * Elenears Erben: Wir tragen das Licht weiter
 *
 * @copyright     Copyright 2011, Elenears Erben (http://elenear.net)
 * @license       http://creativecommons.org/licenses/by-sa/3.0/legalcode Creative Commons Attribution-ShareAlike 3.0
 * @author        Tommi Enenkel
 */

?>

Hier kannst Du Dein Konto erstellen. Bedenke bitte, dass sich EE noch in der Entwicklung befindet, und wir keine hundertprozentige Sicherheit für Dein Passwort gewährleisten können. Wähle deshalb bitte für EE ein eigenes Passwort, das Du sonst nirgendst verwendest.<br/>
Viel Spaß bei EE =)

<?php
	if(isset($userExists) && $userExists == true)
	{
		echo "<h3>Benutzername bereits vergeben.</h3><br/>Bitte probier es mit einem anderen Namen.";
	}
?>

<?=$this->form->create(); ?>
	<?=$this->form->field('username', array('label' => 'Benutzername')); ?>
	<?=$this->form->field('password', array('label' => 'Passwort', 'type' => 'password')); ?>
	<?=$this->form->submit('Weiter');?>
<?=$this->form->end(); ?>

