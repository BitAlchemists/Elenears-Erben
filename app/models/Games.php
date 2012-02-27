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
use app\models\Maps;
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

	public $hasOne = array(
		'map' => array('name' => 'Maps', 'key' => 'game_id')
	);

	public static function __init($options = array()) {
		parent::__init($options);
		$self = static::_instance(__CLASS__);
		
		Games::applyFilter('save', function($self, $params, $chain) {

			$created = false;
			$game = $params['entity'];
			if(!isset($game->_id)) {
				$created = true;
			}

			$result = $chain->next($self, $params, $chain);

			$game = $params['entity'];
			
			//if the game is just being created, we add a map
			if($created) {
				Maps::create(array('game_id' => $game->_id))->save();
			}

			return $result;
		});

		Games::applyFilter('remove', function($self, $params, $chain) {

			$conditions = array( 'game_id' => new MongoId($params['conditions']['_id']) );

			if(!Agents::remove($conditions)) { $message->addErrorMessage('Es konnten nicht alle Agents geloescht werden.'); };
			if(!Avatars::remove($conditions)) { $message->addErrorMessage('Es konnten nicht alle Avatare geloescht werden.'); };
			
			return $chain->next($self, $params, $chain);
		});

	}

}


?>
