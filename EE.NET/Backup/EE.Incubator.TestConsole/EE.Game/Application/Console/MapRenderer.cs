using System;
using EE.Game.Model;
using System.Text;

namespace EE.Game.Application.Console
{
	public class MapRenderer : IMapRenderer
	{
		public MapRenderer ()
		{
		}
	

		#region IMapRenderer implementation
		public void Render (Map map)
		{
			StringBuilder builder = new StringBuilder();
			
			for(int j = 0; j < map.SizeY; j++)
			{	
									
				for(int i = 0; i < map.SizeX; i++)
				{
					char c = ' ';
					switch(map.Lots[i,j].Type)
					{
						case LotType.Water:
						{
							c = '~';
							break;
						}
						case LotType.Field:
						{
							c = '#';
							break;
						}
						case LotType.Mountain:
						{
							c = 'X';
							break;
						}
					
					}
					builder.Append(c);
				}
				builder.Append(Environment.NewLine);
			}
			
			System.Console.Write(builder.ToString());
		}
		#endregion
}
}

