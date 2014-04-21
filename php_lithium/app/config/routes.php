<?php
/**
 * Lithium: the most rad php framework
 *
 * @copyright     Copyright 2011, Union of RAD (http://union-of-rad.org)
 * @license       http://opensource.org/licenses/bsd-license.php The BSD License
 */

use lithium\net\http\Router;
use lithium\core\Environment;

//Default landing page
Router::connect('/', 'Users::home');
//static pages
Router::connect('/pages/{:args}', 'Pages::view');
//perform action on object with id
Router::connect('/{:controller}/{:action}/{:id:[0-9a-f]{24}}.{:type}', array('id' => null));
//default route for everythin
Router::connect('/{:controller}/{:action}/{:args}');



/* the test suite doesnt work in our config and i didnt bother to check why
if (!Environment::is('production')) {
	Router::connect('/test/{:args}', array('controller' => 'lithium\test\Controller'));
	Router::connect('/test', array('controller' => 'lithium\test\Controller'));
}
*/



?>
