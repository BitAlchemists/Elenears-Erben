<?php
/**
 * Elenears Erben: Wir tragen das Licht weiter
 *
 * @copyright     Copyright 2011, Elenears Erben (http://elenear.net)
 * @license       http://creativecommons.org/licenses/by-sa/3.0/legalcode Creative Commons Attribution-ShareAlike 3.0
 * @author        Tommi Enenkel
 */

?>

<?php
	if($confirmationFailed == true) {
		echo $h('Bitte schreibe "löschen" in das Bestätigungsfeld.');
	}
?>

	Um Deinen Avatar zu löschen, klicke bitte auf 'Bestätigen'.

<?=$this->form->create(); ?>	
	<?=$this->form->field('confirmation', array('label' => 'Schreibe "löschen"'));?>
	<?=$this->form->submit('Bestätigen');?>
<?=$this->form->end(); ?>

