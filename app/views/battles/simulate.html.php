<?php
/**
 * Elenears Erben: Wir tragen das Licht weiter
 *
 * @copyright     Copyright 2011-2012, Elenears Erben (http://elenear.net)
 * @license       http://creativecommons.org/licenses/by-sa/3.0/legalcode Creative Commons Attribution-ShareAlike 3.0
 * @author        Tommi Enenkel
 */

?>

<?=$this->form->create(); ?>
	<?=$this->form->field('party1', array('label' => 'Armee A', 'value' => $party1)); ?>
	<?=$this->form->field('party2', array('label' => 'Armee Z', 'value' => $party2)); ?>
	<?=$this->form->submit('Weiter');?>
<?=$this->form->end(); ?>

<?php
echo $log;
?>