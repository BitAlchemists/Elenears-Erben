<?php
/**
 * Lithium: the most rad php framework
 *
 * @copyright     Copyright 2011, Union of RAD (http://union-of-rad.org)
 * @license       http://opensource.org/licenses/bsd-license.php The BSD License
 */

/**
 * This configures your session storage. The Cookie storage adapter must be connected first, since
 * it intercepts any writes where the `'expires'` key is set in the options array.
 */
use lithium\storage\Session;

Session::config(array(
	// 'cookie' => array('adapter' => 'Cookie'),
	'default' => array('adapter' => 'Php')
));

/**
 * Uncomment the lines below to enable forms-based authentication. This configuration will attempt
 * to authenticate users against a `Users` model. In a controller, run
 * `Auth::check('default', $this->request)` to authenticate a user. This will check the POST data of
 * the request (`lithium\action\Request::$data`) to see if the fields match the `'fields'` key of
 * the configuration below. If successful, it will write the data returned from `Users::first()` to
 * the session using the default session configuration.
 *
 * Once the session data is written, you can call `Auth::check('default')` to check authentication
 * status or retrieve the user's data from the session. Call `Auth::clear('default')` to remove the
 * user's authentication details from the session. This effectively logs a user out of the system.
 * To modify the form input that the adapter accepts, or how the configured model is queried, or how
 * the data is stored in the session, see the `Form` adapter API or the `Auth` API, respectively.
 *
 * @see lithium\security\auth\adapter\Form
 * @see lithium\action\Request::$data
 * @see lithium\security\Auth
 */
 use lithium\security\Auth;
 use lithium\security\Password;
 use app\models\Users;

 Auth::config(array(
 	'default' => array(
 		'adapter' => 'Form',
 		'model' => 'Users',
 		'fields' => array('username', 'password')
 	)
 ));

 
 use lithium\action\Dispatcher;
 use lithium\action\Response;

 
/**
 * This filter checks if the user is authenticated.
 * 
 * Unauthenticated users will only be allowed to view actions markeed as publicAction by the 
 * controller. If the user is not allowed to view the page, he is redirected to the landing page
 */
Dispatcher::applyFilter('_callable', function($self, $params, $chain) {
	$ctrl = $chain->next($self, $params, $chain);

	//if the user is authenticated he is allowed to do anything
	if (Auth::check('default')) {
		return $ctrl;
	}
    	
	//unauthenticated users may only perform public actions
	if (isset($ctrl->publicActions) && in_array($params['request']->action, $ctrl->publicActions)) {
		return $ctrl;
	}
	

	return function($request) {
		return new Response(array(
			'location' => array('controller' => 'pages', 'action' => 'home'),
			'request' => $request		
		));
	};

});

?>
