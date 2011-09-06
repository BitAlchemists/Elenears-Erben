using System;
using System.Collections.Generic;
using System.Text;

namespace EE.Common.Services.Authentication
{
    class MockAuthenticationProvider : IAuthenticationProvider
    {
        public AuthenticationContext Authenticate(string username, string password)
        {
            return new AuthenticationContext();
        }

        public bool Validate(AuthenticationContext context)
        {
            return true;
        }
    }
}
