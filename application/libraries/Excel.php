<?php

	if ( ! defined('BASEPATH')) exit('No direct script access allowed');
	require_once APPPATH."/third_party/PHPExcel.php"; 

	class Excel extends PHPExcel
	{
		public function __construct()
		{ 
			parent::__construct();
		}
		
		public function load($file)
		{
			$obj = PHPExcel_IOFactory::load($file);
			$obj->setActiveSheetIndex(0);
			return $obj->getActiveSheet();
		}
		
		public function values($obj)
		{
			$values = array();
			$matrix = $obj->toArray();
			foreach ($matrix as $list)
			{
				foreach ($list as $value)
				{
					if ( ! empty($value))
					{
						$values[] = $value;
					}
				}
			}
			return $values;
		}
		
		public function rows($obj)
		{
			$rows = array();
			$matrix = $obj->toArray();
			$xy = $this->area($matrix);
			
			for ($i = 0; $i <= $xy[1]; $i++)
			{
				for ($j = 0; $j <= $xy[0]; $j++)
				{
					$rows[$i][$j] = $matrix[$i][$j];
				}
			}

			return $rows;
		}
		
		public function area($matrix)
		{
			$items = array(0, 0);
			foreach ($matrix as $y => $list)
			{
				foreach ($list as $x => $value)
				{
					if ( ! empty($value))
					{
						$items[0] = max($items[0], $x);
						$items[1] = max($items[1], $y);
					}
				}
			}

			return $items;
		}
		
		public function cols_list($obj)
		{
			$cols = array();
			$last = $obj->getHighestColumn();
			for ($i = ord('A'); $i <= ord($last); $i++)
			{
				$cols[] = chr($i);
			}
			return $cols;
		}
		
		public function rows_list($obj)
		{
			$rows = array();
			$last = $obj->getHighestRow();
			for ($i = 1; $i <= $last; $i++)
			{
				$rows[] = $i;
			}
			return $rows;
		}
	}