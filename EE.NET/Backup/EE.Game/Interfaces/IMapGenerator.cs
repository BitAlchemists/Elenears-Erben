using System;
using EE.Game.Model;

namespace EE.Game.Interfaces
{
	public interface IMapGenerator
	{
		Map GenerateMap (int sizeX, int sizeY);
	}
}

