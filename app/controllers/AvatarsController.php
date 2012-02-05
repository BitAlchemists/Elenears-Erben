<?php
/**
 * Elenears Erben: Wir tragen das Licht weiter
 *
 * @copyright     Copyright 2011-2012, Elenears Erben (http://elenear.net)
 * @license       http://creativecommons.org/licenses/by-sa/3.0/legalcode Creative Commons Attribution-ShareAlike 3.0
 * @author        Tommi Enenkel
 */

namespace app\controllers;

use app\models\Agents;
use app\models\Games;
use app\models\Avatars;
use app\extensions\helper\Message;
use lithium\storage\Session;
 
class AvatarsController extends \lithium\action\Controller {

	public function join($gameId) {
			$message = new Message();
        	if ($this->request->data) {
			$avatarname = $this->request->data['avatarname'];
			$game = Games::first($gameId);

			if($game == null) {
				echo "maeh 1<br/>";
				//return $this->redirect('/');
			}			

			//check if the player does have an avatar already
			$avatar = Avatars::first(
				array(
					'game_id' => $gameId,
					'user_id' => Session::read('user._id')
				)			
			);
			if($avatar != null) {
				$message->addErrorMessage('Du hast bereits einen Avatar');
				$message->addDebugMessage($avatar->data());
				//return $this->redirect('/');
			}

			//check if the avatarName is free
			$avatar = Avatars::first(array('name' => $avatarname));

			if($avatar != null)
			{
				$avatarExists = true;
				return compact('avatarExists');
				$message->addErrorMessage('Ein Avatar mit diesem Namen existiert bereits');
			}

			//the avatar's name is free, we can use it
			
			$avatar = Avatars::create(array(
				'name' => $avatarname, 
				'user_id' => Session::read('user._id'),
				'game_id' => $gameId
			));

			if( $avatar->save() ){
				$message->addSuccessMessage('Es wurde erfolgreich ein Avatar für dich erschaffen');
			}

			Agents::create(array(
				'type' => 'army', 
				'subtype' => 'hunters',
				'xPos' => 5, 
				'yPos' => 1, 
				'units' => 5
			))->save();

			return $this->redirect(array('controller' => 'Games', 'action' => 'view', 'args' => array($gameId)));
        	}
	}

	public function leave($avatarId) {
		$message = new Message();

		if($this->request->data)
		{
			$avatar = Avatars::first($avatarId);

			//does this avatar exist?
			if($avatar == null) {
				$message->addErrorMessage('Dieser Avatar existierte nicht');
				return $this->redirect('/');
			}

			// does this avatar belong to the user?
			if($avatar->user_id != Session::read('user._id')) {
				$message->addErrorMessage('Du kannst nur über deinen eigenen Avatar verfügen');
				return $this->redirect('/');
			}

			if($this->request->data['confirmation'] != 'löschen')  {
				return array('confirmationFailed' => true);
			}

			$gameId = $avatar->game_id;

			if( $avatar->delete() ){
				$message->addSuccessMessage('Der Avatar wurde erfolgreich entfernt');
			}

			return $this->redirect(array('controller' => 'Games', 'action' => 'view', 'args' => array($gameId)));
		}
		return array('confirmationFailed' => false);
	}

}

?>
