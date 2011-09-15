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
		$games = Games::all();
		$this->out($games->count().' games live');
		
		foreach($games as $key => $game)
		{
			//var_dump($game);
			$this->out('manipulating game: '.$game->name);
			foreach($game->avatars as $avatar)
			{
				$this->out('manipulating avatar: '.$avatar->name);
				$this->out('age: '.$avatar->age);
				$avatar->age++;
				$this->out('new age: '.$avatar->age);
			}
			$game->avatars = $game->avatars;

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
}

?>
