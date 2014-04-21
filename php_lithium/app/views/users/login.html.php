<?php
/**
 * Elenears Erben: Wir tragen das Licht weiter
 *
 * @copyright     Copyright 2011, Elenears Erben (http://elenear.net)
 * @license       http://creativecommons.org/licenses/by-sa/3.0/legalcode Creative Commons Attribution-ShareAlike 3.0
 * @author        Tommi Enenkel
 */

	if(isset($failed)) {
		echo "Du konntest leider nicht eingeloggt werden. Bitte probiere es erneut.<br/>";
	}

?>

<?=$this->form->create(null); ?>
    <?=$this->form->field('username'); ?>
    <?=$this->form->field('password', array('type' => 'password')); ?>
    <?=$this->form->submit('Log in'); ?>
<?=$this->form->end(); ?>