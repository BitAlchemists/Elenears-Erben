using System;
using System.Collections.Generic;
using System.Text;

namespace EE.Common.Helpers
{
    public static class RandomNumberGenerator
    {
        static Random ran = null;

        public static Random Instance
        {
            get
            {
                if (ran == null)
                {
                    ran = new Random();
                }

                return ran;
            }
        }

    }
}
