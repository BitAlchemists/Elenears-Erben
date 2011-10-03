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
			$displayName = $this->request->data['username'];
			$username = strtolower($displayName);
			
			$users = Users::all(array('conditions' => array('username' => $username), 'limit' => 10));
			
			if($users->count() != 0)
			{
				$userExists = true;
				return compact('userExists');
			}
			
			$user = Users::create();
			$user->username = $username;
			$user->displayName = $displayName;
			$user->salt = Password::salt();
			$user->password = Password::hash($this->request->data['password'], $user->salt);
			$user->save();
			//var_dump($user->data());
			
			Auth::check('default', $this->request);
			$this->_login($username);
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
				$username = strtolower($this->request->data['username']);
				$this->_login($username);
				
				return $this->redirect('Users::home');
			}
			else
			{
				echo "Failed<br/>";
			}
        }
		// Handle failed authentication attempts

    }
	
	function _login($username)
	{
		$user = Users::first(array('conditions' => array('username' => $username)));
			
		Session::write('user.username', $user->displayName);
		Session::write('user._id', $user->_id);
		Session::write('user.isAdmin', ($user->isAdmin != 0));
	}
	
	public function logout() {
        Auth::clear('default');
		Session::clear();
        return $this->redirect('/');
    }
}

?>
