<?php if (isset($avatarExists) && $avatarExists): ?>
	Ein Avatar mit diesem Namen existiert bereits. Bitte probiere einen anderen Namen.
<?php endif; ?>

<?php echo $this->form->create(); ?>
	<?php echo $this->form->field('avatarname', array('label' => 'Avatarname')); ?>
	<?php echo $this->form->submit('Weiter'); ?>
<?php echo $this->form->end(); ?>

