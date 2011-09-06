// 
//  ColoredMapRenderer.cs
//  
//  Author:
//       Tommi Enenkel <tomen@elenear.net>
//  
//  Copyright (c) 2011 2011 Tommi Enenkel
using System;
namespace EE.Game.Application.Console
{
	public class ColoredMapRenderer : IMapRenderer
	{
		public ColoredMapRenderer ()
		{
		}
	
		public bool WithNumbers{get;set;}

		#region IMapRenderer implementation
		public void Render (Model.World.Map map)
		{	
			int x = 0;
			int y = 0;
			int sizeX = map.SizeX;
			int sizeY = map.SizeY;
			
			//┌┐└┘─│
			
			System.Console.Write('┌');
			for(x = 0; x < sizeX; x++)
			{
				System.Console.Write('─');
			}
			System.Console.Write('┐');
			System.Console.WriteLine();
			
			for(y = 0; y < sizeY; y++)
			{	
				System.Console.Write('│');				
				for(x = 0; x < sizeX; x++)
				{
					switch(map.Lots[x,y].Height)
					{
					case -3:
						System.Console.BackgroundColor = ConsoleColor.DarkBlue;
						break;
					case -2:
						System.Console.BackgroundColor = ConsoleColor.Blue;
						break;
					case -1:
						System.Console.BackgroundColor = ConsoleColor.DarkCyan;
						break;
					case 0:
						System.Console.BackgroundColor = ConsoleColor.Cyan;
						break;
					case 1:
						System.Console.BackgroundColor = ConsoleColor.Green;
						break;
					case 2:
						System.Console.BackgroundColor = ConsoleColor.DarkGreen;
						break;
					case 3:
						System.Console.BackgroundColor = ConsoleColor.DarkYellow;
						break;
					case 4:
						System.Console.BackgroundColor = ConsoleColor.DarkGray;
						break;
					case 5:
						System.Console.BackgroundColor = ConsoleColor.Gray;
						break;
					}
					System.Console.ForegroundColor = ConsoleColor.Black;
					if (WithNumbers) {
						System.Console.Write(map.Lots[x,y].Height);	
					}
					else {
						System.Console.Write(' ');
					}
					System.Console.ForegroundColor = ConsoleColor.Gray;
				}
				System.Console.BackgroundColor = ConsoleColor.Black;
				System.Console.Write('│');				
				System.Console.WriteLine();
			}
			
			System.Console.Write('└');
			for(x = 0; x < sizeX; x++)
			{
				System.Console.Write('─');
			}
			System.Console.Write('┘');
			System.Console.WriteLine();
		#endregion
		}
	}
}


