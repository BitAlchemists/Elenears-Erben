// 
//  ArmyBattleData.cs
//  
//  Author:
//       Tommi Enenkel <tomen@elenear.net>
//  
//  Copyright (c) 2011 2011 Tommi Enenkel
using System;
using System.Collections.Generic;
namespace EE.Incubator.TestConsole.EE.Game.Services
{
	public class ArmyBattleData
	{
		public IList<TroopBattleData> Troops {
			get;
			set;
		}
		
		
		public ArmyBattleData ()
		{
			this.Troops = new List<TroopBattleData>();
		}
	}
}

