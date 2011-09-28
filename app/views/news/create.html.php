<?php
/**
 * Elenears Erben: Wir tragen das Licht weiter
 *
 * @copyright     Copyright 2011, Elenears Erben (http://elenear.net)
 * @license       http://creativecommons.org/licenses/by-sa/3.0/legalcode Creative Commons Attribution-ShareAlike 3.0
 * @author        Tommi Enenkel
 */

?>

<?=$this->form->create(); ?>
	<?=$this->form->field('title', array('label' => 'Title')); ?>
	<?=$this->form->field('text', array('label' => 'Text')); ?>
	<?=$this->form->submit('Weiter');?>
<?=$this->form->end(); ?>

