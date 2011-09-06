using System;
using System.Text;
using EE.Game.Model.World;

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
			
			int x = 0;
			int y = 0;
			int sizeX = map.SizeX;
			int sizeY = map.SizeY;
			
			//┌┐└┘─│
			
			builder.Append('┌');
			for(x = 0; x < sizeX; x++)
			{
				builder.Append('─');
			}
			builder.Append('┐');
			builder.AppendLine();
			
			for(y = 0; y < sizeY; y++)
			{	
				builder.Append('│');				
				for(x = 0; x < sizeX; x++)
				{
					char c = ' ';
					if (map.Lots[x,y].Height < 0) {
						c = ' ';
					}		
					else if (map.Lots[x,y].Height == 0) {
						c = '~';
					}
					else if (map.Lots[x,y].Height > 0) {
						c = map.Lots[x,y].Height.ToString().ToCharArray()[0];
					}
					else {
						c = '#';	
					}
					
					builder.Append(c);
				}
				builder.Append('│');				
				builder.AppendLine();
			}
			
			builder.Append('└');
			for(x = 0; x < sizeX; x++)
			{
				builder.Append('─');
			}
			builder.Append('┘');
			builder.AppendLine();
			
			System.Console.Write(builder.ToString());
		}
		#endregion
}
}

