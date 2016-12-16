<?php
	
	if (ENVIRONMENT == 'development')
	{
		/* SMTP Settings */
		$config['protocol'] = 'smtp';
		$config['smtp_user'] = 'hallo@cloudrocket.co';
		$config['smtp_pass'] = 'mango1906';
		$config['smtp_host'] = 'mail.cloudrocket.co';
		$config['smtp_port'] = '587';
		$config['smtp_timeout'] = '4';
		$config['charset'] = 'utf-8';
		$config['mailtype'] = 'html';
		$config['newline'] = "\r\n";
		$config['crlf'] = "\n";
		
		/* Mailgun API Settings */
		$config['domain'] = "sandbox429579dd675e4f83990188240e7899b4.mailgun.org";
		$config['key'] = "key-056af7bb02f60742f81339201aab3741";
	}
	
	if (1)//ENVIRONMENT == 'production')
	{
		/* SMTP Settings */
		$config['protocol'] = 'smtp';
		$config['smtp_user'] = 'postmaster@mg.patientenreview.nl';
		$config['smtp_pass'] = '4add968a0a17e23db8752874334c9ae2';
		$config['smtp_host'] = 'ssl://smtp.mailgun.org';
		$config['smtp_port'] = '465';
		$config['smtp_timeout'] = '4';
		$config['charset'] = 'utf-8';
		$config['mailtype'] = 'html';
		$config['newline'] = "\r\n";
		$config['crlf'] = "\n";
		
		/* Mailgun API Settings */
		$config['domain'] = "mg.patientenreview.nl";
		$config['key'] = "key-056af7bb02f60742f81339201aab3741";
	}