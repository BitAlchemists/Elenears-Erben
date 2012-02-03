<?php
/**
 * Elenears Erben: Wir tragen das Licht weiter
 *
 * @copyright     Copyright 2011-2012, Elenears Erben (http://elenear.net)
 * @license       http://creativecommons.org/licenses/by-sa/3.0/legalcode Creative Commons Attribution-ShareAlike 3.0
 * @author        Tommi Enenkel
 */

namespace app\controllers;

 
class AvatarsController extends \lithium\action\Controller {

	public function join($gameId) {
        	if ($this->request->data) {
			$avatarname = $this->request->data['avatarname'];
			$game = Games::first(array('conditions' => array('_id' => $gameId)));
			
			//check if the avatarName is free
			foreach($game->avatars as $avatar)
			{
				if($avatarname == $avatar->name)
				{
					$avatarExists = true;
					return compact('avatarExists');
				}
			}
			//the avatarName is free, we can use it

			
			$avatar = array(
				'name' => $avatarname, 
				'user_id' => Session::read('user._id'), 
				'units' => array(
					array(
						'type' => '0', 
						'xPos' => 5, 
						'yPos' => 1, 
						'count' => 5)
					)
				);
			$avatars = $game->avatars->data();
			$avatars[count($avatars)] = $avatar;
			$game->avatars = $avatars;

			$game->save();

			return $this->redirect(array('controller' => 'Games', 'action' => 'view', 'args' => array($gameId)));
        	}
	}

	public function leave() {
		Auth::clear('default');
		Session::delete('username');
		return $this->redirect('/');
	}

}

?>
