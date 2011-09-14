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
			$this->out('manipulating game: '.$game->name);
			foreach($game->avatars as $avatar)
			{
				$this->out('manipulating avatar: '.$avatar->name);
				$this->out('age: '.$avatar->age);
				$avatar->age++;
				$this->out('new age: '.$avatar->age);
				if(!isset($avatar->age))
				{
					$avatar->age = 1;
				}
				else
				{
					$avatar->age++;
				}
				$this->out('new new age: '.$avatar->age);
			}
		}
		
		if($games->save())
		{
			$this->out('saving successful');
		}
		else
		{
			$this->out('saving failed');
		}
	}
}

?>