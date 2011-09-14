<?php

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
		return $this->out('ticking');
	
		$games = Games::all();
		
		foreach($games as $game)
		{
			foreach($game->avatars as $avatar)
			{
				if(!isset($avatar->age))
				{
					$avatar->age = 1;
				}
				else
				{
					$avatar->age++;
				}
			}
		}
		
		$games->save();
	}
}

?>