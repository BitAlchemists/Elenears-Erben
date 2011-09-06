using System;
using System.Collections.Generic;
namespace EE.Common.Application.Console
{	
	public class ConsoleInterpreter
    {
        List<string> textBuffer;
        LinkedList<string> typedCommands;

        Dictionary<string, ConsoleCommand> registeredCommandsBuffer;
		
		public IEnumerable<ConsoleCommand> RegisteredCommands
		{
			get
			{
				return registeredCommandsBuffer.Values;	
			}
		}
		

		public ConsoleInterpreter ()
        {
            textBuffer = new List<string>();
            typedCommands = new LinkedList<string>();
            registeredCommandsBuffer = new Dictionary<string, ConsoleCommand>();
        }

        public void RegisterCommand(ConsoleCommand command)
        {
            registeredCommandsBuffer.Add(command.CommandText, command);
        }

        public void ProcessLine(string line)
        {
            typedCommands.AddLast(line);
            textBuffer.Add(line);

            if (line.Length == 0)
                return;

            List<string> lineParts = new List<string>(line.Split(" ".ToCharArray()));
            string commandText = lineParts[0];
            lineParts.RemoveAt(0);

            ConsoleCommand command;
            if (registeredCommandsBuffer.TryGetValue(commandText, out command))
            {
                command.ParserMethod.Invoke(String.Join(" ", lineParts.ToArray()));
            }
        }
    }
}

