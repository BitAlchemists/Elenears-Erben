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
		
		
	public battle($party1, $party2)
	{
		$log = 
			"Begin of Battle<br/>".
			"Attacker Army: ".$party1." Peasants<br/>".
			"Defender Army: ".$party2." Peasants<br/><br/>";
		
		$log .= "time: ".$time."<br/><br/>";
		
		$troopAtt = array( 
			'count' => $party1,
			'name' => 'Army A' );
			
		$troopDeff = array(
			'count' => $party2,
			'name' => 'Army Z' ); //todo: change name to unit type
		
		$armyAtt = array( 'troops' => array($troopAtt) );
		$armyDeff = array( 'troops' => array($troopDeff) );
		
		//1 - Preconditions			
		//1.1 - Calculate Battle Points
		foreach ($armyAtt['troops'] as $troop) {
			$troop['battlePoints'] = $troop['count'];
			$log .= $troop['name']." - BP: ".$troop['battlePoints']."<br/>";
		}

		foreach ($armyDeff['troops'] as $troop) {
			$troop['battlePoints'] = $troop['count'];
			$log .= $troop['name']." - BP: ".$troop['battlePoints']."<br/>";
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
			"Attacker Army: ".$troopAtt['count']." Peasants<br/>".
			"Defender Army: ".$troopDeff['count']." Peasants<br/>";
		
		return log;
	}
		
	private string Encounter(ArmyBattleData armyAtt, ArmyBattleData armyDeff)
	{
		//Todo: add multiple maneuvers if BP are left
		Random rand = new Random();
		
		List<TroopBattleData> attackingTroops = new List<TroopBattleData>();
		List<TroopBattleData> defendingTroops = new List<TroopBattleData>();
		
		string log = "";
		
		//2.1 Pre-Maneuver
		//2.1.1 Maneuver-Selection
		armyAtt.Troops[0].OpposingTroop = armyDeff.Troops[0];
		armyDeff.Troops[0].OpposingTroop = armyAtt.Troops[0];
		
		attackingTroops.Add(armyAtt.Troops[0]);
		attackingTroops.Add(armyDeff.Troops[0]);
		
		defendingTroops.Add(armyAtt.Troops[0]);
		defendingTroops.Add(armyDeff.Troops[0]);
		
		//2.2 Maneuvers
		foreach (TroopBattleData deff in defendingTroops) {
			//2.2.1
			deff.LifePoints = deff.Troop.UnitCount;
			log += deff.Name + " - LP: " + deff.LifePoints + Environment.NewLine;
		}
			
		foreach (TroopBattleData att in attackingTroops) {
			log += att.Name + " attacking " + att.OpposingTroop.Name + Environment.NewLine;
			
			double luck = 0.95 + rand.NextDouble() * 0.1;
			log += att.Name + " - luck: " + luck + Environment.NewLine;
			//2.2.2
			att.EffectiveDamageMultiplier = att.BaseDamageMultiplier * time * luck;
			log += att.Name + " - EDM: " + att.EffectiveDamageMultiplier + Environment.NewLine;
			//2.2.3
			att.PotentialDamagePoints = att.BattlePoints * att.EffectiveDamageMultiplier;
			log += att.Name + " - PDP: " + att.PotentialDamagePoints + Environment.NewLine;
			//2.2.4 obsolete
			att.ProportionValue = att.BattlePoints / att.PotentialDamagePoints;
			//log += deff.Name + " - PV: " + att.EffectiveDamageMultiplier + Environment.NewLine;
			//2.2.5
			att.OpposingTroop.DamagePoints = Math.Min(att.OpposingTroop.LifePoints, att.PotentialDamagePoints);
			log += att.Name + " - DP: " + att.DamagePoints + Environment.NewLine;
			//2.2.6
			att.PotentialDamagePoints -= att.OpposingTroop.DamagePoints;
			log += att.Name + " - remaining PDP: " + att.PotentialDamagePoints + Environment.NewLine;
			//2.2.7
			att.BattlePoints = att.PotentialDamagePoints / att.EffectiveDamageMultiplier;
			log += att.Name + " - remaining BP: " + att.BattlePoints + Environment.NewLine;
		}
		
		//2.3 - Post-Maneuver
		foreach (TroopBattleData deff in defendingTroops) {
			double proportionValue = deff.DamagePoints / deff.LifePoints;
			//2.3.1
			deff.Troop.UnitCount -= (int)deff.DamagePoints;
			log += deff.Name + " - remaining Peasants: " + deff.Troop.UnitCount + Environment.NewLine;
			//2.3.2
			deff.BattlePoints -= deff.BattlePoints * proportionValue;
			log += deff.Name = " - remafffffffasdfining BP: " + deff.BattlePoints + Environment.NewLine;
		}
			
		return log;
	}
}
?>
