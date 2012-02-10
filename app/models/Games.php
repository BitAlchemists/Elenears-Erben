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
		$w = Games::_waterfield();
		$g = Games::_grasland();

		return array('xSize' => 10, 'ySize' => 10, 'data' => array(
			array($w,$w,$w,$w,$w,$w,$w,$w,$w,$w),
			array($w,$w,$w,$w,$g,$g,$w,$w,$w,$w),
			array($w,$w,$w,$g,$g,$g,$g,$w,$w,$w),
			array($w,$w,$w,$g,$w,$w,$g,$w,$w,$w),
			array($w,$w,$g,$g,$w,$w,$g,$g,$w,$w),
			array($w,$w,$g,$w,$w,$w,$w,$g,$w,$w),
			array($w,$g,$g,$g,$g,$g,$g,$g,$g,$w),
			array($w,$g,$w,$w,$w,$w,$w,$w,$g,$w),
			array($g,$g,$w,$w,$w,$w,$w,$w,$g,$g),
			array($w,$w,$w,$w,$w,$w,$w,$w,$w,$w),
		));
	}

	public function freeHabitableField($entity) {
		$positions = $entity->freeHabitablePositions();
		return $positions[rand(0, count($positions) - 1)];
	}

	public function freeHabitablePositions($entity, $position = null) {

		$xOffset = 0;
		$yOffset = 0;
		$xSize = $entity->map['xSize'];
		$ySize = $entity->map['ySize'];

		$fields = array();

		//if we want the fields around $position, we change the parameters
		if($position != null) {
			$xPos = $position['xPos'];
			$yPos = $position['yPos'];

			$possibleFields = array();
			$fields = array();

			$possiblePositions = array();
			if($xPos - 1 >= 0)	$possiblePositions[] = array('xPos' => $xPos - 1, 'yPos' => $yPos);
			if($xPos + 1 < $xSize)	$possiblePositions[] = array('xPos' => $xPos + 1, 'yPos' => $yPos);
			if($yPos - 1 >= 0)	$possiblePositions[] = array('xPos' => $xPos, 'yPos' => $yPos - 1);
			if($yPos + 1 < $ySize)	$possiblePositions[] = array('xPos' => $xPos, 'yPos' => $yPos + 1);
			$possiblePositions[] = array('xPos' => $xPos, 'yPos' => $yPos);

			for($i = 0; $i < count($possiblePositions); $i++) {
				$field = $entity->map['data'][$possiblePositions[$i]['xPos']][$possiblePositions[$i]['yPos']];
				if(Games::_grasland($field)) {
					$fields[] = $possiblePositions[$i];
				}
			}
			return $fields;
		}

		for($x = $xOffset; $x < $xOffset + $xSize; $x++) {
			for($y = $yOffset; $y < $yOffset + $ySize; $y++) {

				$field = $entity->map['data'][$x][$y];

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
