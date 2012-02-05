<?php
/**
 * Elenears Erben: Wir tragen das Licht weiter
 *
 * @copyright     Copyright 2011-2012, Elenears Erben (http://elenear.net)
 * @license       http://creativecommons.org/licenses/by-sa/3.0/legalcode Creative Commons Attribution-ShareAlike 3.0
 * @author        Flyingmana
 */
namespace app\extensions\helper;



class Message extends \lithium\template\Helper{


	/**
	 * Classes used by this helper.
	 *
	 * @var array Key/value pair of classes.
	 */
	protected $_classes = array('session' => '\lithium\storage\Session');

	/**
	 * @var string key used for session variable
	 */
	protected $_key = 'messages';

	/**
	 * @param $message the message to show
	 * @param string $category a category for using specialized styles for display
	 */
	public function addMessage($message , $category = ''){
		$class 		= $this->_classes['session'];
		$messages 	= (array) $class::read($this->_key);
		$messages[] = array(
			'message'=>$message,
			'category'=>$category
		);
		$class::write($this->_key, $messages);
	}

	/**
	 * @param $message the success Message to show
	 */
	public function addSuccessMessage($message){
		$this->addMessage($message, 'success');
	}

	/**
	 * @param $message the error Message to show
	 */
	public function addErrorMessage($message){
		$this->addMessage($message, 'error');
	}

	/**
	 * returns all messages in storage
	 * @return array messages which still need to get displayed
	 */
	public function getMessages(){
		$class 		= $this->_classes['session'];
		return (array) $class::read($this->_key);
	}

	/**
	 * clears the storage from all messages
	 */
	public function clearMessages(){
		$class 		= $this->_classes['session'];
		$class::delete($this->_key);
	}

}
