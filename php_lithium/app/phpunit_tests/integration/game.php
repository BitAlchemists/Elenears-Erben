<?php
namespace app\phpunit\tests\integration;


class game extends \PHPUnit_Framework_TestCase
{

	public $gamename = 'integration_testgame';


	public function setUp(){

		\lithium\data\Connections::add('default', array(
			'type' => 'MongoDb',
			'host' => 'localhost',
			'database' => 'game_test'
		));
	}

	public function tearDown(){

	}


	public function testCreateGame()
	{
		$game =  \app\models\Games::create(array('name' => $this->gamename));
		$game->save();
	}
	public function testDestroyGame()
	{
		\app\models\Games::remove(array('_id' => $this->gamename));
	}

}


