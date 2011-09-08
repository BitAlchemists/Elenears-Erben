<?php
/**
 * Lithium: the most rad php framework
 *
 * @copyright     Copyright 2011, Union of RAD (http://union-of-rad.org)
 * @license       http://opensource.org/licenses/bsd-license.php The BSD License
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
 use app\models\Accounts;
 use lithium\net\http\Router;
 
class AccountsController extends \lithium\action\Controller {
	
	public function create() {
		if($this->request->data)
		{
		
			//$this->request->data
			var_dump($this->request->data);
			$username = $this->request->data['username'];
			echo "username: ".$username."<br/>";
			$accounts = Accounts::all(array('conditions' => array('username' => true), 'limit' => 10));
			var_dump($accounts->to());
			//$account = Account::create($this->request->data);
			//$success = $account->save();
			//$this->redirect(array('controller' => 'account', 'action' => 'view'));
		}
	}

			//return $this->render(array('template' => join('/', $path)));

		//return $this->render(array('layout' => false));

	
	public function destroy(){
	
	}
	
	public function login(){
	
	}
	
	public function logout(){
	
	}

	public function to_string() {
		return "Hello World";
	}
}

?>