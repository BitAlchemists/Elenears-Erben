using System;
namespace EE.Common.Application.Console
{
	public class ConsoleCommand
	{	
		public delegate void CommandDelegate(string arg);
		
		public string CommandText {
			get;
			set;
		}
		
		public string CommandDescription {
			get;
			set;
		}
		
		public CommandDelegate ParserMethod {
			get;
			set;
		}
		
		public ConsoleCommand ()
		{

		}

	}
}

