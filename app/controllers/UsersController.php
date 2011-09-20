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
use lithium\security\Password;
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
			$user->salt = Password::salt();
			$user->password = Password::hash($this->request->data['password'], $user->salt);
			$user->save();
			//var_dump($user->data());
			
			Auth::check('default', $this->request);
			$this->redirect('Users::home');
			//$account = Account::create($this->request->data);
			//$success = $account->save();
		}
	}

			//return $this->render(array('template' => join('/', $path)));

		//return $this->render(array('layout' => false));

	
	public function destroy(){
		$userId = Session::read('user._id');
		Users::remove(array('_id' => $userId));
		Auth::clear('default');
		$this->redirect('/');
	}

	public function index()
	{
		$users = Users::all();
		return compact('users');
	}
	
	public function home()
	{
		$username = Session::read('user.username');
		$isAdmin = Session::read('user.isAdmin');
		return compact('username', 'isAdmin');
	}
	
	public function login() {
        if ($this->request->data) {
			if(Auth::check('default', $this->request))
			{
				$username = $this->request->data['username'];
				$user = Users::first(array('conditions' => array('username' => $username)));
				
				Session::write('user.username', $username);
				Session::write('user._id', $user->_id);
				Session::write('user.isAdmin', ($user->isAdmin != 0));
					
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
	Session::clear();
        return $this->redirect('/');
    }
}

?>
