<?php
/**
 * Lithium: the most rad php framework
 *
 * @copyright     Copyright 2011, Union of RAD (http://union-of-rad.org)
 * @license       http://opensource.org/licenses/bsd-license.php The BSD License
 */

namespace app\controllers;

/**
 * This controller is used for serving static pages by name, which are located in the `/views/pages`
 * folder.
 *
 * A Lithium application's default routing provides for automatically routing and rendering
 * static pages using this controller. The default route (`/`) will render the `home` template, as
 * specified in the `view()` action.
 *
 * Additionally, any other static templates in `/views/pages` can be called by name in the URL. For
 * example, browsing to `/pages/about` will render `/views/pages/about.html.php`, if it exists.
 *
 * Templates can be nested within directories as well, which will automatically be accounted for.
 * For example, browsing to `/pages/about/company` will render
 * `/views/pages/about/company.html.php`.
 */
use app\models\Games;
use app\models\Users;
use lithium\net\http\Router;
use lithium\storage\Session;
use \lithium\data\collection\DocumentSet;

 
class GamesController extends \lithium\action\Controller {
	
	public function add() {
	
		if(!Session::read('user.isAdmin'))
		{
			$this->redirect('/');
		}
	
		if($this->request->data)
		{
			$gamename = $this->request->data['gamename'];			
			$game = Games::create();
			$game->name = $gamename;
			$waterfield['type'] = 0;
			$landfield['type'] = 1;
			$game->map = array(xSize => 10, ySize => 10, data => array(
array($waterfield,$waterfield,$waterfield,$waterfield,$waterfield,$waterfield,$waterfield,$waterfield,$waterfield,$waterfield),
array($waterfield,$landfield ,$landfield ,$waterfield,$waterfield,$waterfield,$waterfield,$landfield ,$landfield ,$waterfield),
array($waterfield,$waterfield,$landfield ,$landfield ,$waterfield,$waterfield,$waterfield,$landfield ,$landfield ,$waterfield),
array($waterfield,$waterfield,$landfield ,$landfield ,$landfield ,$landfield ,$waterfield,$waterfield,$waterfield,$waterfield),
array($waterfield,$waterfield,$waterfield,$waterfield,$landfield ,$landfield ,$waterfield,$waterfield,$waterfield,$waterfield),
array($waterfield,$waterfield,$waterfield,$waterfield,$landfield ,$landfield ,$waterfield,$waterfield,$waterfield,$waterfield),
array($waterfield,$waterfield,$waterfield,$landfield ,$landfield ,$landfield ,$landfield ,$waterfield,$waterfield,$waterfield),
array($waterfield,$landfield ,$landfield ,$landfield ,$landfield ,$landfield ,$landfield ,$waterfield,$waterfield,$waterfield),
array($waterfield,$waterfield,$landfield ,$landfield ,$landfield ,$landfield ,$landfield ,$waterfield,$landfield ,$waterfield),
array($waterfield,$waterfield,$waterfield,$waterfield,$waterfield,$waterfield,$waterfield,$waterfield,$waterfield,$waterfield)
));
			$game->avatars = array();
			$game->save();
			
			$this->redirect('Games::index');
		}
	}

			//return $this->render(array('template' => join('/', $path)));

		//return $this->render(array('layout' => false));

	
	public function remove($gameId){
		if(!Session::read('user.isAdmin'))
		{
			$this->redirect('/');
		}
		
		$game = Games::first(array('conditions' => array('_id' => $gameId)));
		$game->delete();
		
		$this->redirect('Games::index');
	}

	
	public function index()
	{
		$games = Games::all();
		return compact('games');
	}
	
	public function view($gameId)
	{
		$avatar = $this->avatarForSessionUser($gameId);
		$game = Games::first(array('conditions' => array('_id' => $gameId)));
		$map = $game->map->data->to('json');
		
		return compact('game', 'map', 'avatar');
	}
	
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
			$avatar = array('name' => $avatarname, 'userid' => Session::read('user._id'));
			$avatars = $game->avatars->data();
			$avatars[count($avatars)] = $avatar;
			$game->avatars = $avatars;

			$game->save();

			return $this->redirect(array('controller' => 'Games', 'action' => 'view', 'args' => array($gameId)));
        	}
		// Handle failed authentication attempts

    }
	
	public function leave() {
        Auth::clear('default');
		Session::delete('username');
        return $this->redirect('/');
    }
	
	function avatarForSessionUser($gameId)
	{
		$userId = Session::read('user._id');
		if(!$userId)
		{
			return false;
		}
		$game = Games::first(array('conditions' => array('_id' => $gameId)));

		foreach($game->avatars as $avatar)
		{
			if($avatar->userid == $userId)
			{
				return $avatar;
			}
		}
		
		return null;
	}

}

?>
