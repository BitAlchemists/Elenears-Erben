<?php
/**
 * Elenears Erben: Wir tragen das Licht weiter
 *
 * @copyright     Copyright 2011-2012, Elenears Erben (http://elenear.net)
 * @license       http://creativecommons.org/licenses/by-sa/3.0/legalcode Creative Commons Attribution-ShareAlike 3.0
 * @author        Tommi Enenkel
 */
namespace app\models;

use app\models\Avatars;
use app\models\Agents;
use MongoId;

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

		Games::applyFilter('remove', function($self, $params, $chain) {

			$conditions = array( 'game_id' => new MongoId($params['conditions']['_id']) );

			if(!Agents::remove($conditions)) { $message->addErrorMessage('Es konnten nicht alle Agents geloescht werden.'); };
			if(!Avatars::remove($conditions)) { $message->addErrorMessage('Es konnten nicht alle Avatare geloescht werden.'); };
			
			return $chain->next($self, $params, $chain);
		});

	}

	static function _generateMap()
	{
		$waterfield['type'] = 0;
		$waterfield = Games::_waterfield();
		$landfield = Games::_grasland();

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
		$positions = $this->freeHabitablePositions();
		return $positions [rand(0, count($positions ) - 1)];
	}

	public function freeHabitablePositions($position = null) {

		$xOffset = 0;
		$yOffset = 0;
		$xSize = $this->map['xSize'];
		$ySize = $this->map['ySize'];



		$fields = array();

		//if we want the fields around $position, we change the parameters
		if($position != null) {
			$xPos = $position['xPos'];
			$yPos = $position['yPos'];

			$possibleFields = array();
			$fields = array();

			$possiblePositions = array();
			$possiblePositions[] = array('xPos' => ($xPos - 1), 'yPos' => $y - 1);
			$possiblePositions[] = array('xPos' => $xPos - 1, 'yPos' => $y + 1);
			$possiblePositions[] = array('xPos' => $xPos + 1, 'yPos' => $y - 1);
			$possiblePositions[] = array('xPos' => $xPos + 1, 'yPos' => $y + 1);
			$possiblePositions[] = array('xPos' => $xPos, 'yPos' => $y);

			for($i = 0; $i < 5; $i++) {
				$field = $this->map['data'][$possiblePositions[$i]['xPos']][$possiblePositions[$i]['yPos']];
				if(Games::_grasland($field)) {
					$fields[] = $possiblePositions[$i];
				}
			}
			return $fields;
		}

		for($x = $xOffset; $x < $xOffset + $xSize; $x++) {
			for($y = $yOffset; $y < $yOffset + $ySize; $y++) {

				$field = $this->map['data'][$x][$y];

				if(Games::_grasland($field)) {
					$fields[] = array('xPos' => $x, 'yPos' => $y);
				}
			}
		}

		return $fields;
	}

	static function _grasland($grasland) {
		if(isset($grasland)) {
			return $grasland['type'] == 1 ? true : false;
		}

		return array('type' => 1);
	}

	static function _waterfield($waterfield) {
		if(isset($waterfield)) {
			return $waterfield['type'] == 0 ? true : false;
		}

		return array('type' => 0);
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
