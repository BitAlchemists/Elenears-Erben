using System;
using EE.Game.Model.World;
using EE.Game.Interfaces;
using EE.Common.Helpers;

namespace EE.Game.Services
{
	
	public class RandomMapGenerator : IMapManipulator
	{
		public RandomMapGenerator ()
		{
			
		}

		public void Manipulate (Map map)
		{
            Lot[,] lots = map.Lots;
            int sizeX = map.SizeX;
            int sizeY = map.SizeY;

			for(int x = 0; x < sizeX; x++)
			{
				for(int y = 0; y < sizeY; y++)
				{
                    lots[x, y].Height = RandomNumberGenerator.Instance.Next(-3, 10);
				}
			}
			
		}
		
	}
}

