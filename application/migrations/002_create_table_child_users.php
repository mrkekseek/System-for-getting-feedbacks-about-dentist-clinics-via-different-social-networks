<?php

	defined('BASEPATH') OR exit('No direct script access allowed');
	class Migration_Create_table_child_users extends CI_Migration
	{

		public function up()
		{
			$this->db->query('CREATE TABLE `users_child`( `rows_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT, `users_id` INT(10) UNSIGNED NOT NULL, `child_id` INT(10) UNSIGNED NOT NULL, PRIMARY KEY (`rows_id`) ) CHARSET=utf8 COLLATE=utf8_general_ci;');
		}

		public function down()
		{
			$this->db->query('DROP TABLE `users_child`;');
		}
	}