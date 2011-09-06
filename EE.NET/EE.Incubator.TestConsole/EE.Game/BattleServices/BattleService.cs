// 
//  BattleService.cs
//  
//  Author:
//       Tommi Enenkel <tomen@elenear.net>
//  
//  Copyright (c) 2011 2011 Tommi Enenkel
using System;
using EE.Game.Model;
using System.Collections.Generic;

namespace EE.Incubator.TestConsole.EE.Game.Services
{
	public class BattleService
	{
		const double time = 0.25;
		
		public BattleService ()
		{

		}
		
		public string SimulateBattle(int party1, int party2)
		{
			string log = 
				"Begin of Battle" + Environment.NewLine +
				"Attacker Army: " + party1 + " Peasants" + Environment.NewLine + 
				"Defender Army: " + party2 + " Peasants" + Environment.NewLine + Environment.NewLine;
			
			log += "time: " + time + Environment.NewLine + Environment.NewLine;
			
			TroopBattleData troopAtt = new TroopBattleData();
			troopAtt.Troop = new Troop(){ UnitCount = party1 };
			troopAtt.Name = "Army A";
			
			TroopBattleData troopDeff = new TroopBattleData();
			troopDeff.Troop = new Troop(){ UnitCount = party2 };
			troopDeff.Name = "Army Z";
			
			ArmyBattleData armyAtt = new ArmyBattleData();
			armyAtt.Troops.Add(troopAtt);
			
			ArmyBattleData armyDeff = new ArmyBattleData();
			armyDeff.Troops.Add(troopDeff);
			
			
			//1 - Preconditions			
			//1.1 - Calculate Battle Points
			foreach (TroopBattleData item in armyAtt.Troops) {
				item.BattlePoints = item.Troop.UnitCount;
				log += item.Name + " - BP: " + item.BattlePoints + Environment.NewLine;
			}
			
			foreach (TroopBattleData item in armyDeff.Troops) {
				item.BattlePoints = item.Troop.UnitCount;
				log += item.Name + " - BP: " + item.BattlePoints + Environment.NewLine;
			}
			
			//1.2 - Base Damage Multiplier Calculation
			foreach (TroopBattleData att in armyAtt.Troops) {
				foreach (TroopBattleData deff in armyDeff.Troops) {
					att.BaseDamageMultiplier = 1; //fix to be AT-DM against DT
					log += att.Name + " - BDM: " + att.BaseDamageMultiplier + Environment.NewLine;
				}
			}
			
			foreach (TroopBattleData deff in armyDeff.Troops) {
				foreach (TroopBattleData att in armyAtt.Troops) {
					deff.BaseDamageMultiplier = 1; //fix to be AT-DM against DT
					log += deff.Name + " - BDM: " + deff.BaseDamageMultiplier + Environment.NewLine;
				}
			}
			
			//2 - Encounters
			//Todo: add multiple rounds if BP are left
			log += this.Encounter(armyAtt, armyDeff);						
			//3 - Postconditions
			
			log += Environment.NewLine + "End of Battle" + Environment.NewLine + 
				"Attacker Army: " + troopAtt.Troop.UnitCount + " Peasants" + Environment.NewLine + 
				"Defender Army: " + troopDeff.Troop.UnitCount + " Peasants" + Environment.NewLine;				
			
			return log;
		}
		
		private string Encounter(ArmyBattleData armyAtt, ArmyBattleData armyDeff)
		{
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
	
	
}

/*
 * 
 * Encounter (one Tick of a battle):
2.3 Post-Maneuver
2.3.1 DT are reduced by DP, remaining BP are reduced proportionaly
2.3.1 If a troop has BP left, these troop moves on to the next Encounter
3 End: Calc Postconditions/Result
 * */