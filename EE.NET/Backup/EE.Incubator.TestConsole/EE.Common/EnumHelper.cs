using System;
namespace EE.Common
{
	public static class EnumHelper
	{		
		public static T RandomEnum<T>()
		{ 
  			T[] values = (T[]) Enum.GetValues(typeof(T));
  			return values[new Random().Next(0,values.Length)];
		}
	}
}

