<?php
/**
 * Elenears Erben: Wir tragen das Licht weiter
 *
 * @copyright     Copyright 2011, Elenears Erben (http://elenear.net)
 * @license       http://creativecommons.org/licenses/by-sa/3.0/legalcode Creative Commons Attribution-ShareAlike 3.0
 * @author        Tommi Enenkel
 */

namespace app\controllers;

/**
 * This controller is used for serving static pages by name, which are located in the `/views/pages`
 * folder.
 *
 * A Lithium application's default routing provides for automatically routing and rendering
 * static pages using this controller. The default route (`/`) will render the `home` template, as
 * specified in the `view()` action.
 *
 * Additionally, any other static templates in `/views/pages` can be called by name in the URL. For
 * example, browsing to `/pages/about` will render `/views/pages/about.html.php`, if it exists.
 *
 * Templates can be nested within directories as well, which will automatically be accounted for.
 * For example, browsing to `/pages/about/company` will render
 * `/views/pages/about/company.html.php`.
 */
use app\models\News;
use lithium\storage\Session;
use lithium\net\http\Router;
 
class NewsController extends \lithium\action\Controller {

	public function create() {
	
		$isAdmin = Session::read('user.isAdmin');
		if(!$isAdmin)
		{
			return $this->redirect('/');
		}
	
		if($this->request->data)
		{
			$news = News::create($this->request->data);
			$news->author = Session::read('user.username');
			$news->date = date("d.m.Y");
			$news->save();
			$this->redirect('/');
		}
	}
}

?>
