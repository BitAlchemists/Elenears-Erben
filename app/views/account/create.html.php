Hier kannst Du Dein Konto erstellen. Bedenke bitte, dass sich EE noch in der Entwicklung befindet, und wir keine hundertprozentige Sicherheit f�r Dein Passwort gew�hrleisten k�nnen. W�hle deshalb bitte f�r EE ein eigenes Passwort, das Du sonst nirgendst verwendest.<br/>
Viel Spa� bei EE =)

<?=$this->form->create(); ?>
	<?=$this->form->field('username', array('label' => 'Benutzername')); ?>
	<?=$this->form->field('username', array('label' => 'Passwort')); ?>
	<?=$this->form->submit('Weiter');?>
<?=$this->form->end(); ?>