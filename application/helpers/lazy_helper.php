<?php
	
	if ( ! function_exists('_sort_callback'))
	{
		function _sort_callback($a, $b)
		{
			global $key;
			return $a[$key] > $b[$key] ? 1 : ($a[$key] < $b[$key] ? -1 : 0);
		}
	}
	
	if ( ! function_exists('_rsort_callback'))
	{
		function _rsort_callback($a, $b)
		{
			global $key;
			return $a[$key] < $b[$key] ? 1 : ($a[$key] > $b[$key] ? -1 : 0);
		}
	}
	
	if ( ! function_exists('_sort'))
	{
		function _sort($array, $array_key)
		{
			global $key;
			$key = $array_key;
			usort($array, "_sort_callback");
			return $array;
		}
	}
	
	if ( ! function_exists('_rsort'))
	{
		function _rsort($array, $array_key)
		{
			global $key;
			$key = $array_key;
			usort($array, "_rsort_callback");
			return $array;
		}
	}
	
	if ( ! function_exists('_asort'))
	{
		function _asort($array, $array_key)
		{
			global $key;
			$key = $array_key;

			uasort($array, "_sort_callback");
			return $array;
		}
	}
	
	if ( ! function_exists('_rasort'))
	{
		function _rasort($array, $array_key)
		{
			global $key;
			$key = $array_key;
			uasort($array, "_rsort_callback");
			return $array;
		}
	}