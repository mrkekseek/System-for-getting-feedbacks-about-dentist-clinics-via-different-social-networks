<?php

	if ( ! defined('BASEPATH')) exit('No direct script access allowed');
	require_once APPPATH."/third_party/parsecsv.lib.php"; 

	class CSV extends parseCSV
	{
		public function __construct()
		{ 
			parent::__construct();
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
				$rows[0][] = $key;
			}
			
			foreach ($obj as $row)
			{
				$items = array();
				foreach ($row as $val)
				{
					$items[] = $val;
				}
				$rows[] = $items;
			}

			return $rows;
		}
	}