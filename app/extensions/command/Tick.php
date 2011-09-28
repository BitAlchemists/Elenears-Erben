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
			$game->tickCount++;
			$game->save();
		/*	//var_dump($game);
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
			}*/

		}
		//https://github.com/UnionOfRAD/lithium/issues/42
		//var_dump($games->first()->avatars->first()->data());

	}
}

?>
