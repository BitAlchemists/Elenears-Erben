using System;
using System.Collections.Generic;
using System.Text;

namespace EE.Game.Model
{
    public enum WeaponType
    {
		Dagger,
		Sword,
		Lance,
		Bow
    }

    public enum ArmorType
    {
		None,
		Leather,
		Metal
    }

    public class Troop
    {
		public WeaponType WeaponType {
			get;
			set;
		}
		
		public ArmorType ArmorType {
			get;
			set;
		}
		
		public int UnitCount {
			get;
			set;
		}
    }
}
