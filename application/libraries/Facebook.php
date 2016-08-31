<?php

	if ( ! defined('BASEPATH')) exit('No direct script access allowed');
	require_once APPPATH."/third_party/Facebook/autoload.php"; 

	class Facebook
	{
		var $app_id = '816105301769238';
		var $app_secret = '0d256ed4c6080e94abe6bf3f624204d2';
		public function __construct()
		{ 
			$this->init();
		}
		
		public function init()
		{
			$this->fb = new Facebook\Facebook([
			  'app_id' => $this->app_id,
			  'app_secret' => $this->app_secret
			]);
		}
		
		public function get_link()
		{
			if ( ! session_id())
			{
				session_start();
			}

			$helper = $this->fb->getRedirectLoginHelper();
			$permissions = ['email', 'manage_pages'];
			$loginUrl = $helper->getLoginUrl(base_url().'pub/fb_logged/', $permissions);
			return $loginUrl;
		}
		
		public function save_token()
		{
			if ( ! session_id())
			{
				session_start();
			}

			$helper = $this->fb->getRedirectLoginHelper();

			try
			{
				$accessToken = $helper->getAccessToken();
			}
			catch(Facebook\Exceptions\FacebookResponseException $e)
			{
				// When Graph returns an error
				//echo 'Graph returned an error: ' . $e->getMessage();
				return FALSE;
			}
			catch(Facebook\Exceptions\FacebookSDKException $e)
			{
				// When validation fails or other local issues
				//echo 'Facebook SDK returned an error: ' . $e->getMessage();
				return FALSE;
			}

			if ( ! isset($accessToken))
			{
				/*if ($helper->getError())
				{
					header('HTTP/1.0 401 Unauthorized');
					echo "Error: " . $helper->getError() . "\n";
					echo "Error Code: " . $helper->getErrorCode() . "\n";
					echo "Error Reason: " . $helper->getErrorReason() . "\n";
					echo "Error Description: " . $helper->getErrorDescription() . "\n";
				}
				else
				{
					header('HTTP/1.0 400 Bad Request');
					echo 'Bad request';
				}*/
				return FALSE;
			}

			// The OAuth 2.0 client handler helps us manage access tokens
			$oAuth2Client = $this->fb->getOAuth2Client();

			if ( ! $accessToken->isLongLived())
			{
				try
				{
					$accessToken = $oAuth2Client->getLongLivedAccessToken($accessToken);
				}
				catch (Facebook\Exceptions\FacebookSDKException $e)
				{
					//echo "<p>Error getting long-lived access token: " . $helper->getMessage() . "</p>\n\n";
				}
			}

			$_SESSION['fb_access_token'] = (string) $accessToken;
			return $_SESSION['fb_access_token'];
		}
		
		public function is_token($offline_token = FALSE)
		{
			if ( ! session_id())
			{
				session_start();
			}
			
			$token = ! empty($offline_token) ? $offline_token : ( ! empty($_SESSION['fb_access_token']) ? $_SESSION['fb_access_token'] : FALSE);
			if ( ! empty($token))
			{
				$this->fb->setDefaultAccessToken($token);
				return TRUE;
			}
			return FALSE;
		}
		
		public function get_facebook_id($alias)
		{
			try
			{
				$response = $this->fb->get('/'.$alias);
			}
			catch(Facebook\Exceptions\FacebookResponseException $e)
			{
				//echo 'Graph returned an error: ' . $e->getMessage();
				return FALSE;
			}
			catch(Facebook\Exceptions\FacebookSDKException $e)
			{
				//echo 'Facebook SDK returned an error: ' . $e->getMessage();
				return FALSE;
			}

			$info = $response->getGraphUser();
			return $info['id'];
		}
		
		public function get_accounts()
		{
			try
			{
				$response = $this->fb->get('/me/accounts');
			}
			catch(Facebook\Exceptions\FacebookResponseException $e)
			{
				//echo 'Graph returned an error: ' . $e->getMessage();
				return FALSE;
			}
			catch(Facebook\Exceptions\FacebookSDKException $e)
			{
				//echo 'Facebook SDK returned an error: ' . $e->getMessage();
				return FALSE;
			}

			$info = $response->getGraphList();
			return $info;
		}

		public function get_page_token($facebook_id)
		{
			$accounts = $this->get_accounts();
			foreach ($accounts as $account)
			{
				if ($account['id'] == $facebook_id)
				{
					return $account['access_token'];
				}
			}
			
			return FALSE;
		}
		
		public function get_ratings($facebook_id, $page_token)
		{
			try
			{
				$response = $this->fb->get('/'.$facebook_id.'/ratings', $page_token);
			}
			catch(Facebook\Exceptions\FacebookResponseException $e)
			{
				//echo 'Graph returned an error: ' . $e->getMessage();
				return FALSE;
			}
			catch(Facebook\Exceptions\FacebookSDKException $e)
			{
				//echo 'Facebook SDK returned an error: ' . $e->getMessage();
				return FALSE;
			}

			$info = $response->getGraphList();
			return $info;
		}
	}