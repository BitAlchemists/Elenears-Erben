<?php
/**
 * Elenears Erben: Wir tragen das Licht weiter
 *
 * @copyright     Copyright 2011-2012, Elenears Erben (http://elenear.net)
 * @license       http://creativecommons.org/licenses/by-sa/3.0/legalcode Creative Commons Attribution-ShareAlike 3.0
 * @author        Tommi Enenkel
 */

namespace app\controllers;
 
use app\models\Agents;

class AgentsController extends \lithium\action\Controller {
	public function order() {
		if(isset($this->request->data)) {
			Agents::create($this->request->data)->save();
			return new Response();
		}
	}

	public function view()
	{
		$gameId = $this->request->params['id'];
		if($gameId == null)
		{
			return new Response();
		}
		
		$units = Agents::all(array('game_id' => $gameId));
		return compact('units');
	}
}

?>
