<?php
/**
 * Elenears Erben: Wir tragen das Licht weiter
 *
 * @copyright     Copyright 2012, Elenears Erben (http://elenear.net)
 * @license       http://creativecommons.org/licenses/by-sa/3.0/legalcode Creative Commons Attribution-ShareAlike 3.0
 * @author        Flyingmana
 */

use \app\extensions\helper\Message;

foreach($this->message->getMessages() as $message){
	if( $message['category'] != '' ){
		echo '<div class="message message-'.$message['category'].'">';
	}else{
		echo '<div class="message">';
	}
	echo $message['message'];
	echo '</div>';
}
$this->message->clearMessages();
