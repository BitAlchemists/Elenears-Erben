using System;
using EE.Game.Interfaces;
using EE.Game.Services;
using EE.Game.Model.World;
using EE.Game.Application.Console;
using EE.Common.Application.Console;
using System.Collections;
using System.Collections.Generic;
using EE.Incubator.TestConsole.EE.Game.Services;


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

            #region Echo
            interpreter.RegisterCommand(new ConsoleCommand(){
				CommandText = "echo",
				CommandDescription = "prints the params",
				ParserMethod = x => { Console.WriteLine("'{0}'", x); }
			});
			
			#endregion
			
			#region random map
			
			interpreter.RegisterCommand(new ConsoleCommand(){
				CommandText = "map",
				CommandDescription = "shows a randomly generated map",
				ParserMethod = (string param) =>
				{
                    // 1. Parse
					IList<string> paramList = new List<string>(param.Split(" ".ToCharArray()));
					
					int sizeX = 10;
					int sizeY = 10;
					
					if(paramList.Count >= 1 && paramList[0] != "")
					{
						int.TryParse(paramList[0], out sizeX);
					}
					
					if(paramList.Count >= 2)
					{
						int.TryParse(paramList[1], out sizeY);	
					}
					
                    // 2. Render
					IMapManipulator manipulator1 = new WaterEdgeMapManipulator();
                    IMapManipulator manipulator2 = new HeightMapMapManipulator();
                    ColoredMapRenderer renderer = new ColoredMapRenderer();
                    Map map = new Map(sizeX, sizeY);

					Console.WriteLine("Generating map with x = {0}, y = {1}", sizeX, sizeY);
					manipulator1.Manipulate(map);
                    manipulator2.Manipulate(map);
                    renderer.Render(map);
					renderer.WithNumbers = true;
					renderer.Render(map);
					
					//System.Web.Script.Serialization.JavaScriptSerializer serializer = new System.Web.Script.Serialization.JavaScriptSerializer();
					//string json = serializer.Serialize(map);
                    //Console.WriteLine(json);
				}
			});
			
			#endregion
			
			#region Battle
			
			interpreter.RegisterCommand(new ConsoleCommand(){
				CommandText = "fight",
				CommandDescription = "simulates a battle",
				ParserMethod = (string param) => 
				{
					// 1. Parse
					IList<string> paramList = new List<string>(param.Split(" ".ToCharArray()));
					
					int party1 = 10;
					int party2 = 10;
					
					if(paramList.Count >= 1 && paramList[0] != "")
					{
						int.TryParse(paramList[0], out party1);
					}
					
					if(paramList.Count >= 2)
					{
						int.TryParse(paramList[1], out party2);	
					}
					
					BattleService battleService = new BattleService();
					Console.WriteLine(battleService.SimulateBattle(party1, party2));
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

