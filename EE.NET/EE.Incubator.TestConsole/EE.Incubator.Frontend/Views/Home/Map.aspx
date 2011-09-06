<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
	<title>@ViewBag.Title</title>
</head>
<body>
	<div>
		<%= Html.Encode(ViewData["Message"]) %>
	</div>
</body>
