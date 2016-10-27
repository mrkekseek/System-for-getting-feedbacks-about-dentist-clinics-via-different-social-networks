<?php

	defined('BASEPATH') OR exit('No direct script access allowed');
	class Migration_Add_doctors_category extends CI_Migration
	{

		public function up()
		{
			$this->db->query('ALTER TABLE `doctors` ADD COLUMN `cat` VARCHAR(255) NOT NULL AFTER `zorgkaart`');
		}

		public function down()
		{
			$this->db->query('ALTER TABLE `doctors` DROP COLUMN `cat`');
		}
	}