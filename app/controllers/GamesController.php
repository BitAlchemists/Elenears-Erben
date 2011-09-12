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
use app\models\Games;
use lithium\net\http\Router;
use lithium\storage\Session;

 
class GamesController extends \lithium\action\Controller {
	
	public function add() {
	
		if(!Session::read('isAdmin'))
		{
			$this->redirect('/');
		}
	
		if($this->request->data)
		{
			$gamename = $this->request->data['gamename'];			
			$game = Games::create();
			$game->name = $gamename;
			$waterfield['type'] = 0;
			$landfield['type'] = 1;
			$borderlane = array(waterfield, waterfield, waterfield, waterfield, waterfield);
			$midlane = array(waterfield, landfield, landfield, landfield, waterfield);
			$game->map = array(xSize => 5, ySize => 5, data => array(borderlane, midlane, midlane, midlane, borderlane);
			$game->save();
			
			$this->redirect('Games::index');
		}
	}

			//return $this->render(array('template' => join('/', $path)));

		//return $this->render(array('layout' => false));

	
	public function remove(){
		if(!Session::read('isAdmin'))
		{
			$this->redirect('/');
		}
	}

	
	public function index()
	{
		$username = Session::read('username');
		return compact('username');
	}
	
	public function join() {
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
	
	public function leave() {
        Auth::clear('default');
		Session::delete('username');
        return $this->redirect('/');
    }
}

?>