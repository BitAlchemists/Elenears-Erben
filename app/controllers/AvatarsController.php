<?php
/**
 * Elenears Erben: Wir tragen das Licht weiter
 *
 * @copyright     Copyright 2011-2012, Elenears Erben (http://elenear.net)
 * @license       http://creativecommons.org/licenses/by-sa/3.0/legalcode Creative Commons Attribution-ShareAlike 3.0
 * @author        Tommi Enenkel
 */

namespace app\controllers;

use app\models\Games;
use app\models\Avatars;
use lithium\storage\Session;
 
class AvatarsController extends \lithium\action\Controller {

	public function join($gameId) {
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
					'user_id' => $userId
				)			
			);
			if($avatar != null) {
				echo "maeh 2<br/>";
				var_dump($avatar->data());
				//return $this->redirect('/');
			}

			//check if the avatarName is free
			$avatar = Avatars::first(array('name' => $avatarname));

			if($avatar != null)
			{
				$avatarExists = true;
				return compact('avatarExists');
			}

			//the avatar's name is free, we can use it
			
			$avatar = Avatars::create(array(
				'name' => $avatarname, 
				'user_id' => Session::read('user._id'),
				'game_id' => $gameId,
				'units' => array(
					array(
						'type' => '0', 
						'xPos' => 5, 
						'yPos' => 1, 
						'count' => 5)
					)
				)
			);

			$avatar->save();

			return $this->redirect(array('controller' => 'Games', 'action' => 'view', 'args' => array($gameId)));
        	}
	}

	public function leave($avatarId) {

		if($this->request->data)
		{
			$avatar = Avatars::first($avatarId);

			//does this avatar exist?
			if($avatar == null) {
				return $this->redirect('/');
			}

			// does this avatar belong to the user?
			if($avatar->user_id != Session::read('user_id')) {
				return $this->redirect('/');
			}

			if($this->request->data['confirmation'] != 'löschen')  {
				return array('confirmationFailed' => true);
			}

			$gameId = $avatar->game_id;

			$avatar->delete();

			return $this->redirect(array('controller' => 'Games', 'action' => 'view', 'args' => array($gameId)));
		}
	}

}

?>
