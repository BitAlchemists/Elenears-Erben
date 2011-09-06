// 
//  TroopBattleData.cs
//  
//  Author:
//       Tommi Enenkel <tomen@elenear.net>
//  
//  Copyright (c) 2011 2011 Tommi Enenkel
using System;

using EE.Game.Model;

namespace EE.Incubator.TestConsole.EE.Game.Services
{
	public class TroopBattleData
	{
		public string Name {
			get;
			set;
		}
		
		public Troop Troop {
			get;
			set;
		}
		
		public double BattlePoints {
			get;
			set;
		}
		
		public double BaseDamageMultiplier {
			get;
			set;
		}
		
		public TroopBattleData OpposingTroop
		{
			get;
			set;
		}
		
		public double EffectiveDamageMultiplier {
			get;
			set;
		}
		
		public double PotentialDamagePoints {
			get;
			set;
		}
		
		public double ProportionValue {
			get;
			set;
		}
		
		public double LifePoints {
			get;
			set;
		}
		
		public double DamagePoints {
			get;
			set;
		}
		
		public TroopBattleData ()
		{
			
		}
	}
}

