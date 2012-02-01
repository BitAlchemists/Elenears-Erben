<?php
/**
 * Elenears Erben: Wir tragen das Licht weiter
 *
 * @copyright     Copyright 2011, Elenears Erben (http://elenear.net)
 * @license       http://creativecommons.org/licenses/by-sa/3.0/legalcode Creative Commons Attribution-ShareAlike 3.0
 * @author        Tommi Enenkel
 */
namespace app\extensions\command;

use app\models\Games;
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
			//$game->avatars = $game->avatars;

			if($game->save())
			{
				$this->out('saving successful');
			}
			else
			{
				$this->out('saving failed');
			}

		}
		//https://github.com/UnionOfRAD/lithium/issues/42
		//var_dump($games->first()->avatars->first()->data());

	}
	
	//#63
	function _spawnMobs($game) {
		$mobs = $game->mobs;
		if($mobs->count < 3) {
			//spawn a mob
			$position = $game->map->freeHabitableField();
			$mob = AgentFactory::createAgent('deer', array('position' => $position, 'units' => 5));
			$mobs->add($mob);
		}
	}
	
	//#65
	function _roamMobs($game) {
		foreach($game->mobs as $key => $mob) {
			$positions = $game->map->freeHabitableFields($mob->position);
			$position = $positions[rnd(count($positions))];
			$mob->orders->empty();
			$order = OrderFactory::createOrder('move', array('position' => $position));
			$mob->orders->add($order);
		}
	}
}

?>
