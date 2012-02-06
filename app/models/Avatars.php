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

class Avatars extends \lithium\data\Model
{
	public static function __init($options = array()) {
		parent::__init($options);
		$self = static::_instance(__CLASS__);

		Avatars ::applyFilter('remove', function($self, $params, $chain) {

			$agentsConditions = array(
				'game_id' => $params['conditions']['game_id'],
				'owner_id' => $params['conditions']['_id']);
			Agents::remove($agentsConditions);
			
			return $chain->next($self, $params, $chain);
		});

	}

}

?>
