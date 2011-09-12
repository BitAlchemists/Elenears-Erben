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
use app\models\Users;
use lithium\net\http\Router;
use lithium\util\String;
use lithium\security\Auth;
use lithium\storage\Session;

 
class UsersController extends \lithium\action\Controller {
	
	public $publicActions = array('create', 'login');

	public function create() {
	
		if($this->request->data)
		{
			$username = $this->request->data['username'];
			
			$users = Users::all(array('conditions' => array('username' => $username), 'limit' => 10));
			
			if($users->count() != 0)
			{
				$userExists = true;
				return compact('userExists');
			}
			
			$user = Users::create();
			$user->username = $username;
			$user->password = String::hash($this->request->data['password']);
			$user->save();
			
			$this->redirect('Users::home');
			//$account = Account::create($this->request->data);
			//$success = $account->save();
		}
	}

			//return $this->render(array('template' => join('/', $path)));

		//return $this->render(array('layout' => false));

	
	public function destroy(){
	
	}

	
	public function home()
	{
		$username = Session::read('username');
		echo "Username: ".$username."<br/>";
		return compact('username');
	}
	
	public function login() {
        if ($this->request->data) {
			if(Auth::check('default', $this->request))
			{
				echo "Success<br/>";
				Session::write('username', $this->request->data['username']);
				var_dump($this->request->data);
				echo "Username: ".$this->request->data['username']."<br/>";
				return $this->redirect('Users::home');
			}
			else
			{
				echo "Failed<br/>";
			}
        }
		// Handle failed authentication attempts

    }
	
	public function logout() {
        Auth::clear('default');
		Session::delete('username');
        return $this->redirect('/');
    }
}

?>