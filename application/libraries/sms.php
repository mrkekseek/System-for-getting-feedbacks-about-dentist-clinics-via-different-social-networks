<?php

	if ( ! defined('BASEPATH')) exit('No direct script access allowed');
	require_once APPPATH."/third_party/messagebird.php"; 

	class SMS
	{
		public function message($numbers = array(), $code = '', $date = '')
		{
			$MessageBird = new \MessageBird\Client('live_aWcCGkKCYHuF6RH2QYIGO7Ezg');
			$Message = new \MessageBird\Objects\Message();
			$Message->originator = 'Pat.review';
			$Message->recipients = $numbers;
			$Message->body = 'Uw inlogcode is: '.$code.'. U kunt inloggen tot: '.$date;
			
			try {
				$MessageBird->messages->create($Message);
			} catch (\MessageBird\Exceptions\AuthenticateException $e) {
				// Authentication failed. Is this a wrong access_key?
				return FALSE;
			} catch (\MessageBird\Exceptions\BalanceException $e) {
				// That means that you are out of credits. Only called on creation of a object.
				return FALSE;
			} catch (\Exception $e) {
			  // Request failed. More information can be found in the body.

			  // Echo's the error messages, split by a comma (,)
			  //echo $e->getMessage();
			  return FALSE;
			}
			
			return TRUE;
		}
	}