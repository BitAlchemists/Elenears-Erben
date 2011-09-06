using System;
namespace EE.Game.Model
{
	public class Lot
	{	
		public LotType Type {
			get;
			set;
		}
		
		public Lot ()
		{
			Type = LotType.Water;
		}
	}
}

