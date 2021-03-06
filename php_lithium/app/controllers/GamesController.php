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
use app\models\Agents;
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
		if(!Session::read('user.isAdmin'))
		{
			$this->redirect('/');
		}

		$games = Games::all();
		return compact('games');
	}
	
	public function view($gameId)
	{
		$user_id = Session::read('user._id');
		$avatar = Avatars::first(compact('user_id', 'game_id'));
		$game = Games::first($gameId);
		return compact('game', 'avatar');
	}
	

}

?>
