<?php
/**
 * Elenears Erben: Wir tragen das Licht weiter
 *
 * @copyright     Copyright 2012, Elenears Erben (http://elenear.net)
 * @license       http://creativecommons.org/licenses/by-sa/3.0/legalcode Creative Commons Attribution-ShareAlike 3.0
 * @author        Tommi Enenkel
 */
namespace app\models;

use MongoId;

class Agents extends \lithium\data\Model
{

	public static function __init($options = array()) {
		parent::__init($options);
		$self = static::_instance(__CLASS__);

		Agents::applyFilter('save', function($self, $params, $chain) {

			$agent = $params['entity'];

			if(is_string($agent->game_id)) {
				$agent->game_id = new MongoId($agent->game_id);
			}
			if(is_string($agent->owner_id)) {
				$agent->owner_id = new MongoId($agent->owner_id);
			}
			
			return $chain->next($self, $params, $chain);
		});
	}
}
