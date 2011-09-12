<?php if ($avatarExists): ?>
	Ein Avatar mit diesem Namen existiert bereits. Bitte probiere einen anderen Namen.
<?php endif; ?>

<?=$this->form->create(); ?>
	<?=$this->form->field('avatarname', array('label' => 'Avatarname')); ?>
	<?=$this->form->submit('Weiter');?>
<?=$this->form->end(); ?>

