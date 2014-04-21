<?php
/**
 * Elenears Erben: Wir tragen das Licht weiter
 *
 * @copyright     Copyright 2012, Elenears Erben (http://elenear.net)
 * @license       http://creativecommons.org/licenses/by-sa/3.0/legalcode Creative Commons Attribution-ShareAlike 3.0
 * @author        Tommi Enenkel
 */
namespace app\models;

use app\models\Agents;
use MongoId;

class Avatars extends \lithium\data\Model
{
	public static function __init($options = array()) {
		parent::__init($options);
		$self = static::_instance(__CLASS__);

		Avatars ::applyFilter('save', function($self, $params, $chain) {

			$avatar = $params['entity'];

			if(is_string($avatar->game_id)) {
				$avatar->game_id = new MongoId($avatar->game_id);
			}
			if(is_string($avatar->user_id)) {
				$avatar->user_id = new MongoId($avatar->user_id);
			}
			
			return $chain->next($self, $params, $chain);
		});

		Avatars ::applyFilter('remove', function($self, $params, $chain) {


			$agentsConditions = array(
				'game_id' => $params['conditions']['game_id'],
			);
			if( isset( $params['conditions']['_id'] ) ){
				$agentsConditions['owner_id'] = $params['conditions']['_id'];
			}
			Agents::remove($agentsConditions);
			
			return $chain->next($self, $params, $chain);
		});

	}

}

?>
