using System;
using EE.Game.Model;
using EE.Game.Interfaces;
using EE.Common;

namespace EE.Game.Services
{
	public class RandomMapGenerator : IMapGenerator
	{
		public RandomMapGenerator ()
		{
			
		}

		public Map GenerateMap (int sizeX, int sizeY)
		{
			Map map = new Map (sizeX, sizeY);
			
			for(int i = 0; i < map.SizeX; i++)
			{
				for(int j = 0; j < map.SizeY; j++)
				{
					map.Lots[i,j].Type = EnumHelper.RandomEnum<LotType>();		
				}
			}
			
			return map;
		}
		
	}
}

