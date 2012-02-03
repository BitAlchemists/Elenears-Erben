<?php
/**
 * Elenears Erben: Wir tragen das Licht weiter
 *
 * @copyright     Copyright 2011-2012, Elenears Erben (http://elenear.net)
 * @license       http://creativecommons.org/licenses/by-sa/3.0/legalcode Creative Commons Attribution-ShareAlike 3.0
 * @author        Tommi Enenkel
 */
namespace app\models;

class Games extends \lithium\data\Model
{

	public $hasMany = array(
		'Avatars' => array(
			'class'      => 'Avatars',
			'key'       => 'game_id',
			'conditions' => array(),
			'fields'     => array(),
			'order'      => null,
			'limit'      => null),
		'Agents' => array(
			'class' => 'Agents',
			'key'       => 'game_id',
			'conditions' => array(),
			'fields'     => array(),
			'order'      => null,
			'limit'      => null),
		'Mobs' => array(
			'class' => 'Agents',
			'name' => 'Agents',
			'key'       => 'game_id',
			'conditions' => array('owner_id' => null),
			'fields'     => array(),
			'order'      => null,
			'limit'      => null)
	);

	public static function __init($options = array()) {
		parent::__init($options);
		$self = static::_instance(__CLASS__);
		
		Games::applyFilter('save', function($self, $params, $chain) {
			$game = $params['entity'];
			
			//if the game is just being created, we add a map and avatars 
			if(!isset($game->_id)) {
				$game->map = $self::_generateMap();
			}
			
			$params['entity'] = $game;
			return $chain->next($self, $params, $chain);
		});
	}

	static function _generateMap()
	{
		$waterfield['type'] = 0;
		$landfield['type'] = 1;
		return array('xSize' => 10, 'ySize' => 10, 'data' => array(
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

	public function freeHabitableField() {
		$xPos = 5;
		$yPos = 5;
		return compact('xPos', 'yPos');
	}
}


/*
Games::finder('mobs', function($self, $params, $chain){

    $defaults = array(
        'owner_id' => null
    );

    // Merge with supplied params
    $params['options']['conditions'] = $defaults + (array) $params['options']['conditions'];

    // Do a bit of reformatting
    return $chain->next($self, $params, $chain);
});
*/

?>
