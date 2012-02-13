<?php
/**
 * Elenears Erben: Wir tragen das Licht weiter
 *
 * @copyright     Copyright 2011-2012, Elenears Erben (http://elenear.net)
 * @license       http://creativecommons.org/licenses/by-sa/3.0/legalcode Creative Commons Attribution-ShareAlike 3.0
 * @author        Tommi Enenkel
 */

namespace app\controllers;

 
class BattlesController extends \lithium\action\Controller {

	const $time = 0.25;
		
		
	public function battle($party1, $party2)
	{
		$log = 
			"Begin of Battle<br/>".
			"Attacker Army: ".$party1." Peasants<br/>".
			"Defender Army: ".$party2." Peasants<br/><br/>";
		
		$log .= "time: ".$time."<br/><br/>";
		
		$armyAtt = array( 
			'troops' => array(
				array( 
					'count' => $party1,
					'name' => 'Army A' )
				)
			);

		$armyDeff = array( 
			'troops' => array(
				array(
					'count' => $party2,
					'name' => 'Army Z'
				)
			); //todo: change name to unit type) );
		
		//1 - Preconditions			
		//1.1 - Calculate Battle Points
		foreach ($armyAtt['troops'] as $troop) {
			$troop['bp'] = $troop['count'];
			$log .= $troop['name']." - BP: ".$troop['bp']."<br/>";
		}

		foreach ($armyDeff['troops'] as $troop) {
			$troop['bp'] = $troop['count'];
			$log .= $troop['name']." - BP: ".$troop['bp']."<br/>";
		}
		
		//1.2 - Base Damage Multiplier Calculation
		foreach ($armyAtt['troops'] as $AT) { //AT = attacking troup
			foreach ($armyDeff['troops'] as $DT) { //DT = defending troup
				$AT['bdm'] = 1; //fix to be AT-DM against DT // BDM = base damage multiplier
				$log .= $AT['name']." - BDM: ".$AT['bdm']."<br/>";
			}
		}
			
		foreach ($armyDeff['troops'] as $AT) { //AT = attacking troup
			foreach ($armyAtt['troops'] as $DT) { //DT = defending troup
				$AT['bdm'] = 1; //fix to be AT-DM against DT // BDM = base damage multiplier
				$log .= $AT['name']." - BDM: ".$AT['bdm']."<br/>";
			}
		}
			
		//2 - Encounters
		$log .= $this->_encounter($armyAtt, $armyDeff);						
		//3 - Postconditions
			
		$log .= "<br/>End of Battle<br/>".
			"Attacker Army: ".$armyAtt['troops'][0]['count']." Peasants<br/>".
			"Defender Army: ".$armyDeff['troops'][0]['count']." Peasants<br/>";
		

	}

	function _rand() {
		return rand(0,1000) / 1000.;
	}
		
	function _encounter($armyAtt, $armyDeff)
	{
		//Todo: add multiple maneuvers if BP are left

		//simulate AI move by manually assigning troops		
		$maneuvers = array(
			array('at' => $armyAtt['troops'][0], 'dt' => $armyDeff['troops'][0]),
			array('at' => $armyDeff['troops'][0], 'dt' => $armyAtt['troops'][0])
		);
		
		$log = "";
				
		//2.2 Maneuvers
		foreach ($maneuvers as $maneuver) {
			//2.2.1
			$maneuver['dt']['lp'] = $maneuver['dt']['count'];
			$log .= $maneuver['dt']['name']." - LP: ".$maneuver['dt']['lp']."<br/>";
		}
			
		foreach ($maneuvers as $maneuver) {
			$at = $maneuver['at'];
			$dt = $maneuver['dt'];			

			$log .= $at['name']." attacking ".$dt['name']."<br/>";
			
			$luck = 0.95 + $this->_rand * 0.1;
			$log .= $at['name']." - luck: ".$luck."<br/>";
			//2.2.2
			$at['edm'] = $at['bdm'] * $time * $luck;
			$log .= $at['name']." - EDM: ".$at['edm']."<br/>";
			//2.2.3
			$at['pdp'] = $at['bp'] * $at['edm'];
			$log .= $at['name']." - PDP: ".$at['pdp']."<br/>";
			//2.2.4 obsolete
			$at['pv'] = $at['bp'] / $at['pdp'];
			//log += deff.Name + " - PV: ".$at['edm']."<br/>";
			//2.2.5
			$at['dp'] = min($dt['lp'], $at['pdp']);
			$log .= $at['name']." - DP: ".$at['dp']."<br/>";
			//2.2.6
			$at['pdp'] -= $at['dp'];
			$log .= $at['name']." - remaining PDP: ".$at['pdp']."<br/>";
			//2.2.7
			$at['bp'] = $at['pdp'] * $at['pv'];
			$log .= $at['name']." - remaining BP: ".$at['bp']."<br/>";
		}
		
		//2.3 - Post-Maneuver
		foreach ($maneuvers as $maneuver) {
			$at = $maneuver['at'];
			$dt = $maneuver['dt'];	
 
			//2.3.1
			$dt['count'] -= $at['dp'];
			$log .= $dt['name']." - remaining Peasants: ".$dt['count']."<br/>";
			//2.3.2
			//TE I am not sure if these two lines are correct, too tired now, look over it again
			$pv = $at['dp'] / $dt['lp'];
			$dt['bp'] -= $dt['bp'] * $pv;
			$log .= $dt['name']." - remaining BP: ".$dt['bp']."<br/>";
		}
			
		return $log;
	}
}
?>
