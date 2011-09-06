using System;
namespace EE.Game.Model
{
	public class Map
	{
		private int sizeX;
		private int sizeY;
		
		public int SizeX
		{
			get
			{
				return sizeX;
			}
		}
		public int SizeY
		{
			get
			{
				return sizeY;	
			}
		}
		
		public Lot[,] Lots {
			get;
			set;
		}
		
		public Map (int sizeX, int sizeY)
		{
			this.sizeX = sizeX;
			this.sizeY = sizeY;
			
			Lots = new Lot[sizeX, sizeY];
			for(int i = 0; i < sizeX; i++)
			{
				for(int j = 0; j < sizeY; j++)
				{
					Lots[i,j] = new Lot();	
				}
			}
		}
	}
}

