<?php

	if ( ! defined('BASEPATH')) exit('No direct script access allowed');
	require_once APPPATH."/third_party/parsecsv.lib.php";
	
	use \ForceUTF8\Encoding;
	require_once APPPATH."/third_party/Encoding.php";

	class CSV extends parseCSV
	{
		public function __construct()
		{ 
			parent::__construct();
			setLocale(LC_CTYPE, 'nl_NL.UTF-8');
		}
		
		public function load($file)
		{
			$csv = new parseCSV();
			$csv->auto($file);
			return $csv->data;
		}
		
		public function rows($obj)
		{
			$rows = array();
			foreach ($obj[0] as $key => $val)
			{
				if (mb_detect_encoding($key, 'UTF-8', TRUE) === FALSE)
				{
					$key = Encoding::toUTF8($key);
				}
				$rows[0][] = $key;
			}
			
			foreach ($obj as $row)
			{
				$items = array();
				foreach ($row as $val)
				{
					if (mb_detect_encoding($val, 'UTF-8', TRUE) === FALSE)
					{
						$val = Encoding::toUTF8($val);
					}
					$items[] = $val;
				}
				$rows[] = $items;
			}

			return $rows;
		}
	}