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
			$game = Games::create(array('name' => $gamename)); 
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
		
		Games::remove(array('_id' => $gameId));
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
		
		$visibleUnits = '[]';

		if(isset($avatar))
		{
//var_dump($avatar->units->to('json'));
			$visibleUnits = $avatar->units->to('json');
		}

		return compact('game', 'map', 'avatar', 'visibleUnits');
	}
	
	function avatarForSessionUser($gameId)
	{
		$userId = Session::read('user._id');
		return Games::avatar(compact('userId', 'gameId'));
	}

}

?>
