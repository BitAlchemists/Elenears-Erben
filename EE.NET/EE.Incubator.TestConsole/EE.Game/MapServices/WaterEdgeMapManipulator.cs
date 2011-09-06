using System;
using System.Collections.Generic;
using System.Text;
using EE.Game.Interfaces;
using EE.Game.Model.World;

namespace EE.Incubator.TestConsole.EE.Game.Services
{
    class WaterEdgeMapManipulator : IMapManipulator
    {
        public void Manipulate(global::EE.Game.Model.World.Map map)
        {
            Lot[,] lots = map.Lots;

            int edgeValue = 0;
            int x = 0;
            int y = 0;
            int sizeX = map.SizeX;
            int sizeY = map.SizeY;

            for (x = 0; x < sizeX; x++)
            {
                lots[x, 0].Height = edgeValue;
                lots[x, sizeY - 1].Height = edgeValue;
            }

            for (y = 0; y < sizeY; y++)
            {
                lots[0, y].Height = edgeValue;
                lots[sizeX - 1, y].Height = edgeValue;
            }
        }
    }
}
