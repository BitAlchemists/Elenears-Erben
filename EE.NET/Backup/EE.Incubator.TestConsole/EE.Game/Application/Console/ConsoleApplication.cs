using System;
using EE.Game.Interfaces;
using EE.Game.Services;
using EE.Game.Model;
using EE.Game.Application.Console;
using EE.Common.Application.Console;
using System.Collections;
using System.Collections.Generic;


namespace EE.Incubator.TestConsole
{
	public class ConsoleApplication
	{
		ConsoleInterpreter interpreter;
		bool done;
		
		public ConsoleApplication ()
		{
			done = false;
			SetupInterpreter();
		}
		
		#region Setup
		public void SetupInterpreter()
		{
			interpreter = new ConsoleInterpreter();
			
			#region Quit
			interpreter.RegisterCommand(new ConsoleCommand(){
				CommandText = "quit",
				CommandDescription = "Quits the app",
				ParserMethod = x => { done = true; }
			});
			#endregion

			#region Help
			
			interpreter.RegisterCommand(new ConsoleCommand(){
				CommandText = "help",
				CommandDescription = "Prints the help",
				ParserMethod = _ =>
				{
					var commandList = interpreter.RegisteredCommands;
					foreach (var command in commandList) {
						Console.WriteLine ("{0}... {1}", command.CommandText, command.CommandDescription);
					}
				}
			});
			
			#endregion
			interpreter.RegisterCommand(new ConsoleCommand(){
				CommandText = "echo",
				CommandDescription = "prints the params",
				ParserMethod = x => { Console.WriteLine("'{0]'", x); }
			});
			
			#region Echo
			
			
			
			#endregion
			
			#region random map
			
			interpreter.RegisterCommand(new ConsoleCommand(){
				CommandText = "map",
				CommandDescription = "shows a randomly generated map",
				ParserMethod = (string param) =>
				{
					IList<string> paramList = new List<string>(param.Split(" ".ToCharArray()));
					
					int sizeX = 10;
					int sizeY = 10;
					
					if(paramList.Count >= 1)
					{
						int.TryParse(paramList[0], out sizeX);
					}
					
					if(paramList.Count >= 2)
					{
						int.TryParse(paramList[1], out sizeY);	
					}
					
					IMapGenerator generator = new RandomMapGenerator();
					Console.WriteLine("Generating map with x = {0}, y = {1}", sizeX, sizeY);
					Map map = generator.GenerateMap(sizeX, sizeY);
					IMapRenderer renderer = new MapRenderer();
					renderer.Render(map);
				}
			});
			
			#endregion
		}
		#endregion
		
		#region Runtime
		public void Run()
		{
			PrintWelcome();
						
			while(!done)
			{
				Console.Write(">");
				string input = Console.ReadLine();
				interpreter.ProcessLine(input);	
				Console.WriteLine ();
			}
	
		}
		
		public static void PrintWelcome()
		{
			Console.WriteLine ();	
			Console.WriteLine ("EE Incubator Console");
			Console.WriteLine ("Type 'help' to get help");
			Console.WriteLine ();
		}
		
		#endregion
	}
}

