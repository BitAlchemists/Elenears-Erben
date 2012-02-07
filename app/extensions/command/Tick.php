<?php
/**
 * Elenears Erben: Wir tragen das Licht weiter
 *
 * @copyright     Copyright 2011-2012, Elenears Erben (http://elenear.net)
 * @license       http://creativecommons.org/licenses/by-sa/3.0/legalcode Creative Commons Attribution-ShareAlike 3.0
 * @author        Tommi Enenkel
 */
namespace app\extensions\command;

use app\models\Games;
use app\models\Agents;
/**
 * The EE Heart
 */
class Tick extends \lithium\console\Command {

	/**
	 * The main method of the command.
	 *
	 * @return void
	 */
	public function run() {	
		$games = Games::all();
		$this->out($games->count().' games live');
		
		foreach($games as $key => $game)
		{
			$this->out('manipulating game: '.$game->name);
			//$this->_spawnMobs($game);
			$this->_generateMobMovementOrders($game);

			if($game->save())
			{
				$this->out('saving successful');
			}
			else
			{
				$this->out('saving failed');
			}

		}
	}
	
	//#63
	function _spawnMobs($game) {
		$mobCount = Agents::count(
			array(
				'game_id' => $game->_id,
				'owner_id' => null
			)
		);

		if($mobCount >= 3) {
			return;
		}

		//spawn a mob
		$position = $game->freeHabitableField();
		$mob = Agents::create(array(
			'game_id' => $game->_id,
			'type' => 'army',
			'subtype' => 'deer',
			'units' => 5) +
			$position
		);
		$mob->save();
	}
	
	//#65
	function _generateMobMovementOrders($game) {
		$mobs = Agents::all(
			array(
				'game_id' => $game->_id,
				'owner_id' => null
			)
		);

		foreach($mobs as $mob) {
			$position = array('xPos' => $mob->xPos, 'yPos' => $mob->yPos, 'this is a message for you');
			$positions = $game->freeHabitablePositions($position);
			$position = $positions[rand(0, count($positions) - 1)];
			$mob->orders = array('move' => $position);
			$mob->save();
		}
	}

	function _processAgentMovements($game) {

	}
}

?>
