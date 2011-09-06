using System;
namespace EE.Common.Helpers
{
	public static class EnumHelper
	{		
		public static T RandomEnum<T>()
		{ 
  			T[] values = (T[]) Enum.GetValues(typeof(T));
  			return values[RandomNumberGenerator.Instance.Next(0,values.Length)];
		}
	}
}

