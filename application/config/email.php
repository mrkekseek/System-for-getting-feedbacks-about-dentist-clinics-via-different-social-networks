<?php
	
	if (ENVIRONMENT == 'development')
	{
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
	}
	
	if (ENVIRONMENT == 'production')
	{
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
	}