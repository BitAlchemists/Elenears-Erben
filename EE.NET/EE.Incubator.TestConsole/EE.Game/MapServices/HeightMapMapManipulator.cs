using System;
using System.Collections.Generic;
using System.Text;
using EE.Game.Interfaces;
using EE.Game.Model.World;
using EE.Common.Helpers;

namespace EE.Incubator.TestConsole.EE.Game.Services
{
    enum Direction { Up, Down, Left, Right }

    class HeightMapMapManipulator : IMapManipulator
    {
        public void Manipulate(global::EE.Game.Model.World.Map map)
        {
            Lot[,] lots = map.Lots;
            int x = 1; //we begin at the top left
            int y = 1;
            int sizeX = map.SizeX;
            int sizeY = map.SizeY;
            Direction direction = Direction.Right; //we begin going to the right

            int maxX = sizeX - 2; // we always go left until we reach maxX
            int maxY = sizeY - 2; //we alway go down until we reach maxY
            int minX = 1; //we always go left until we reach minX
            int minY = 2; //we always go up until we reach minY

            //all the neccessary steps, looks way nerdier than while(!done)
            for (int i = (sizeX - 2) * (sizeY - 2); i > 0; i--)
            {
				//1. set new height
				float sumDirect = 0;
				float sumDiagonal = 0;
				int divisorDirect = 0;
				int divisorDiagonal = 0;
				
				
				//Direct connections
				Lot lot1 = lots[x,y-1];
				Lot lot2 = lots[x,y+1];
				Lot lot3 = lots[x+1,y];
				Lot lot4 = lots[x-1,y];
				
				
				if(lot1.Height != null)
				{
					sumDirect += (float)lot1.Height;
					divisorDirect++;
				}
				
				if(lot2.Height != null)
				{
					sumDirect += (float)lot2.Height;
					divisorDirect++;
				}
				
				if(lot3.Height != null)
				{
					sumDirect += (float)lot3.Height;
					divisorDirect++;
				}
				
				if(lot4.Height != null)
				{
					sumDirect += (float)lot4.Height;
					divisorDirect++;
				}
				
				//Diagonal connections
				Lot lot5 = lots[x-1,y-1];
				Lot lot6 = lots[x-1,y+1];
				Lot lot7 = lots[x+1,y-1];
				Lot lot8 = lots[x+1,y+1];
				
				
				if(lot5.Height != null)
				{
					sumDiagonal += (float)lot5.Height;
					divisorDiagonal++;
				}
				
				if(lot6.Height != null)
				{
					sumDiagonal += (float)lot6.Height;
					divisorDiagonal++;
				}
				
				if(lot7.Height != null)
				{
					sumDiagonal += (float)lot7.Height;
					divisorDiagonal++;
				}
				
				if(lot8.Height != null)
				{
					sumDiagonal += (float)lot8.Height;
					divisorDiagonal++;
				}
				
				sumDirect /= divisorDirect;
				sumDiagonal /= divisorDiagonal;
				
				float sum = (sumDirect * 2 + sumDiagonal) / 3;
				sumDirect += GenerateRisingValue();
				
				
				
				if(sumDirect < 0)
					sumDirect = 0;
				
				lots[x,y].Height = (int)sumDirect;
				
                //Console.WriteLine("Painting x: {0} y: {1}", x, y);
				
				//2. move drawing point
                switch (direction)
                {
                    case Direction.Right:
                        if (++x >= maxX) //when we reached the right "wall"
                        {
                            direction = Direction.Down; //we turn down
                            maxX--; //next round we go one step fewer
                            //Console.WriteLine("Turn Down, minX: {0} maxX: {1} minY: {2} maxY: {3}", minX, maxX, minY, maxY);
                        }
                        break;
                    case Direction.Down:
                        if (++y >= maxY) //when we reached the bottom "wall"
                        {
                            direction = Direction.Left; //we turn left
                            maxY--; //next round we go one step fewer
                            //Console.WriteLine("Turn Left, minX: {0} maxX: {1} minY: {2} maxY: {3}", minX, maxX, minY, maxY);
                        }
                        break;
                    case Direction.Left:
                        if (--x <= minX) //when we reached the left "wall"
                        {
                            direction = Direction.Up; //we turn up
                            minX++; //next round we go one step fewer
                            //Console.WriteLine("Turn Up, minX: {0} maxX: {1} minY: {2} maxY: {3}", minX, maxX, minY, maxY);
                        }
                        break;
                    case Direction.Up:
                        if (--y <= minY) //when we reached the top "wall"
                        {
                            direction = Direction.Right; //we turn right
                            minY++; //next round we go one step fewer
                            //Console.WriteLine("Turn Right, minX: {0} maxX: {1} minY: {2} maxY: {3}", minX, maxX, minY, maxY);
                        }
                        break;
                }
            }
			
        }
		
		private int GenerateRisingValue()
		{
			int caseValue = RandomNumberGenerator.Instance.Next(0,10);	
			if(caseValue <= 5)
				return 0;
			else if( caseValue == 6)
				return -1;
			else return 1;
		}
    }
}
