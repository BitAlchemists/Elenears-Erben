<?php
/**
 * Elenears Erben: Wir tragen das Licht weiter
 *
 * @copyright     Copyright 2011-2012, Elenears Erben (http://elenear.net)
 * @license       http://creativecommons.org/licenses/by-sa/3.0/legalcode Creative Commons Attribution-ShareAlike 3.0
 * @author        Tommi Enenkel
 */

namespace app\controllers;


use app\models\Maps;

 
class MapsController extends \lithium\action\Controller {

	public function view()
	{
		$gameId = $this->request->params['id'];
		if($gameId == null)
		{
			return new Response();
		}
		
		$xSize = 10;
		$ySize = 10;
		$fields = Maps::first(array('game_id' => $gameId))->fields;
		return compact('xSize', 'ySize', 'fields');
	}
}
