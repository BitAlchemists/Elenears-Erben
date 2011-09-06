using System;
using System.Collections.Generic;
using System.Text;

namespace EE.Common.Services.Authentication
{
    interface IAuthenticationProvider
    {
        AuthenticationContext Authenticate(string username, string password);
        bool Validate(AuthenticationContext context);
    }
}
