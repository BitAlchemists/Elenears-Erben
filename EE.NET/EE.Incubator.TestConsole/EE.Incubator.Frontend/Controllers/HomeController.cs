using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Ajax;

namespace Controllers
{

	[HandleError]
	public class HomeController : Controller
	{
		public ActionResult Index ()
		{
			ViewData["Message"] = "Welcome to ASP.NET MVC on Mono! <a href=\"Home/Map?x=10&y=10\">Map</a>";
			return View ();
		}
		
		public ActionResult Map(int x, int y)
		{
			ViewData["Message"] = "Params - x:" + x  + ", y:" + y;
			ViewData["Title"] = "Test Page";
			return View();
		}
	}
}

