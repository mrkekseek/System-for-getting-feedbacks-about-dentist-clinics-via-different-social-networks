<?php

	defined('BASEPATH') OR exit('No direct script access allowed');
	class Migration_Add_file_to_send_dates extends CI_Migration
	{

		public function up()
		{
			$this->db->query('ALTER TABLE `sent_dates` ADD COLUMN `file` VARCHAR(255) NOT NULL AFTER `sent_date`');
		}

		public function down()
		{
			$this->db->query('ALTER TABLE `doctors` DROP COLUMN `file`');
		}
	}