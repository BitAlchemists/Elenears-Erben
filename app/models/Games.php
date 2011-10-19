<?php
/**
 * Elenears Erben: Wir tragen das Licht weiter
 *
 * @copyright     Copyright 2011, Elenears Erben (http://elenear.net)
 * @license       http://creativecommons.org/licenses/by-sa/3.0/legalcode Creative Commons Attribution-ShareAlike 3.0
 * @author        Tommi Enenkel
 */
namespace app\models;

class Games extends \lithium\data\Model
{

	public static function __init($options = array()) {
		parent::__init($options);
		$self = static::_instance(__CLASS__);
		
		Games::applyFilter('save', function($self, $params, $chain) {
			$game = $params['entity'];
			
			//if the game is just being created, we add a map and avatars 
			if(!isset($document->_id)) {
				$game->map = $self::_generateMap();
				$game->avatars = array();
			}
			
			$params['entity'] = $game;
			return $chain->next($self, $params, $chain);
		});
	}

	static function _generateMap()
	{
		$waterfield['type'] = 0;
		$landfield['type'] = 1;
		return array(xSize => 10, ySize => 10, data => array(
			array($waterfield,$waterfield,$waterfield,$waterfield,$waterfield,$waterfield,$waterfield,$waterfield,$waterfield,$waterfield),
			array($waterfield,$waterfield,$waterfield,$waterfield,$landfield ,$landfield ,$waterfield,$waterfield,$waterfield,$waterfield),
			array($waterfield,$waterfield,$waterfield,$landfield ,$landfield ,$landfield ,$landfield ,$waterfield,$waterfield,$waterfield),
			array($waterfield,$waterfield,$waterfield,$landfield ,$waterfield,$waterfield,$landfield ,$waterfield,$waterfield,$waterfield),
			array($waterfield,$waterfield,$landfield ,$landfield ,$waterfield,$waterfield,$landfield ,$landfield ,$waterfield,$waterfield),
			array($waterfield,$waterfield,$landfield ,$waterfield,$waterfield,$waterfield,$waterfield,$landfield ,$waterfield,$waterfield),
			array($waterfield,$landfield ,$landfield ,$landfield ,$landfield ,$landfield ,$landfield ,$landfield ,$landfield ,$waterfield),
			array($waterfield,$landfield ,$waterfield,$waterfield,$waterfield,$waterfield,$waterfield,$waterfield,$landfield ,$waterfield),
			array($landfield ,$landfield ,$waterfield,$waterfield,$waterfield,$waterfield,$waterfield,$waterfield,$landfield ,$landfield ),
			array($waterfield,$waterfield,$waterfield,$waterfield,$waterfield,$waterfield,$waterfield,$waterfield,$waterfield,$waterfield),
		));
	}
	
	public static function avatar($params = array()) {
		
		$userId = $params['userId'];
		$gameId = $params['gameId'];
		echo "GameID '{$gameId}'<br/>";
		echo "UserID '{$userId}'<br/>";
		if(!$userId || !$gameId)
		{
			return null;
		}
		
		$game = Games::first(array('conditions' => array('_id' => $gameId)));
		var_dump($game->data());

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