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


class Maps extends \lithium\data\Model
{
	public static function __init($options = array()) {
		parent::__init($options);
		$self = static::_instance(__CLASS__);
		
		Maps::applyFilter('create', function($self, $params, $chain) {
			$map = $chain->next($self, $params, $chain);
			$map->_generate();
			return $map;
		});
	}

	function _generate($entity)
	{
		$w = Maps::_waterfield();
		$g = Maps::_grasland();

		$entity->xSize = 10;
		$entity->ySize = 10;
		$entity->fields =  array(
			array($w,$w,$w,$w,$w,$w,$w,$w,$w,$w),
			array($w,$w,$w,$w,$g,$g,$w,$w,$w,$w),
			array($w,$w,$w,$g,$g,$g,$g,$w,$w,$w),
			array($w,$w,$w,$g,$w,$w,$g,$w,$w,$w),
			array($w,$w,$g,$g,$w,$w,$g,$g,$w,$w),
			array($w,$w,$g,$w,$w,$w,$w,$g,$w,$w),
			array($w,$g,$g,$g,$g,$g,$g,$g,$g,$w),
			array($w,$g,$w,$w,$w,$w,$w,$w,$g,$w),
			array($g,$g,$w,$w,$w,$w,$w,$w,$g,$g),
			array($w,$w,$w,$w,$w,$w,$w,$w,$w,$w)
		);
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
				if(Maps::_grasland($field)) {
					$fields[] = $possiblePositions[$i];
				}
			}
			return $fields;
		}

		for($x = $xOffset; $x < $xOffset + $xSize; $x++) {
			for($y = $yOffset; $y < $yOffset + $ySize; $y++) {

				$field = $entity->map['data'][$x][$y];

				if(Maps::_grasland($field)) {
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
