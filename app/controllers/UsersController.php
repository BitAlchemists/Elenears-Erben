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
 
class UsersController extends \lithium\action\Controller {
	
	public function index() {
        $users = Users::all();
        return compact('users');
    }
	
	public function create() {
	
		$users = Users::all();
		echo "All users<br/>";
		var_dump($users->to('json'));
		echo get_class($users);
	
		if($this->request->data)
		{
			$username = $this->request->data['username'];
			
			$users = Users::all(array('conditions' => array('username' => $username), 'limit' => 10));

			echo "All users with username ".$username."<br/>";
			var_dump($users->to('json'));


			echo "Type: ".gettype($users)."<br/>";
			var_dump($users->data);
			
			if($users->data)
			{
				$userExists = true;
				return comptact('userExists');
			}
			
			$user = Users::create();
			$user->username = $username;
			$user->password = md5($this->request->data['password']);
			$user->save();
			
			//$this->redirect('Users::index');
			//$account = Account::create($this->request->data);
			//$success = $account->save();
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