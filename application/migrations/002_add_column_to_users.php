<?php 

	defined('BASEPATH') OR exit('No direct script access allowed');
	class Migration_Add_column_to_users extends CI_Migration 
	{
	
		public function up()
		{
			$this->db->query('ALTER TABLE `users` ADD COLUMN `two_step_auth` TINYINT(4) UNSIGNED DEFAULT 0 NOT NULL AFTER `organization`;');
		}
		
		public function down()
		{
			$this->db->query('ALTER TABLE `users` DROP COLUMN `two_step_auth`');
		}
	}