<?php

	if ( ! defined('BASEPATH')) exit('No direct script access allowed');
	
	require 'mailgun-php/vendor/autoload.php';
	use Mailgun\Mailgun;
	
	class Pub_model extends CI_Model
	{
		//6aCX1c9CgDUA.
		var $errors = array();
		var $google_key = "AIzaSyCektmWg5NTvgzkwnRGq95_EPXYNOuhTGI";
		var $per_hour = 350;
		var $base_amount = 275;
		var $pro_amount = 450;
		var $ultimate_amount = 600;
		var $account_amount = 0;
		var $doctor_amount = 60;
		var $free_doctors_number = 3;
		var $period = 365;
		var $last_time = 0;
		var $tags = array('subject' => '{{Onderwerp van E-mail}}',
						  'title' => '{{Aanhef Patiënt}}',
						  'name' => '{{Voornaam Patiënt}}',
						  'sname' => '{{Achternaam Patiënt}}',
						  'doctors_title' => '{{Aanhef Zorgverlener}}',
						  'doctors_name' => '{{Voornaam Zorgverlener}}',
						  'doctors_sname' => '{{Achternaam Zorgverlener}}',
						  'doctors_avatar' => '{{Profielfoto Zorgverlener}}',
						  'username' => '{{Naam Praktijk}}',
						  'q_name' => '{{Vraagstelling}}',
						  'q_desc' => '{{Formulering van de vraagstelling}}');
						  
		var $defaults = array('subject' => "Hoe was uw behandeling bij {{Naam Praktijk}}?",
							  'header' => "Hoe was uw behandeling?",
							  'header_mq' => "{{Vraagstelling}}",
							  'text1' => "Geachte heer/mevrouw,\n\nU bent onlangs behandeld in onze praktijk. We sturen u deze e-mail omdat we benieuwd zijn hoe u uw behandeling heeft ervaren. Uw mening is van onmisbaar belang voor de zorgverlener. Bovendien kunt u bijdragen aan het bevorderen van transparantie in de gezondheidszorg door uw beoordeling te plaatsen op online kanalen.\n\nOp een schaal van 1 tot 5 sterren, hoe waarschijnlijk is het dat u onze praktijk zou aanbevelen bij familie of vrienden?",
							  'text1_mq' => 'Geachte {{Aanhef Patiënt}} {{Voornaam Patiënt}} {{Achternaam Patiënt}},<br />We sturen u deze e-mail omdat we benieuwd zijn hoe u patientenreview heeft ervaren. Uw mening is ook van onmisbaar belang voor onze dienstverlening.',
							  'text2' => "Klik op de knop hierboven om aan te geven in hoeverre u ons zou aanbevelen. Op de pagina die wordt geopend kunt u uw mening delen met anderen of ons team van feedback voorzien.\n\nBedankt voor het delen van uw mening!\n\nMet vriendelijke groet,\n\n{{Naam Praktijk}}",
							  'promo' => "Beoordeel ons en win een ... t.w.v. €..,..!",
							  'footer' => "U ontvangt deze eenmalige e-mail omdat uw e-mailadres is opgenomen in het patiëntenbestand van {{Naam Praktijk}}. Deze e-mail is een eenmalige uitnodiging volgend op uw behandeling. Uw e-mailadres wordt uitsluitend gebruikt voor het verzoek tot deelname aan dit patiënttevredenheidsonderzoek en wordt op geen enkele manier openbaar gemaakt.");
						  
		var $reserved = array('pub', 'welcome', 'send_new', 'cron', 'invitation', 'excel-tpl', 'excel-basis-tpl');
		function __construct()
		{
			parent::__construct();
			if (date("n") <= 2 && (date("Y") % 4 == 0) || date("n") > 2 && ((date("Y") + 1) % 4 == 0))
			{
				$this->period = 366;
			}
			$this->last_time = time();
			$this->set_defaults();
			$this->renew_logout();
		}
		
		function set_test_data()
		{
			$users_id = 1;

			$questions_ids = array(0, 1, 2, 3, 4);
			$title = array('Mr.', 'Dr.', '');
			$name = array('John', 'Sam', 'Jack', 'Tom', 'Bill', 'George', 'William', 'Roger', 'Andrew', 'Jim');
			$sname = array('Peterson', 'Smith', 'Doe', 'Gordon', 'Jackson', 'Clinton', 'Burns', 'Dent', 'Walker', 'Eastwood');
			$age = array(0, 25, 35, 60, 87, 54, 21, 16, 5, 18);
			
			$treatment = array('', '', 'Treatment A', 'Treatment B', 'Treatment C', 'Treatment D', 'Treatment E', 'Treatment F');
			$feedback = array('I want my money back', 'I want more service', 'I want better service');
			$reply = array('', '', 'You do not get it', 'We will give you all what you want', 'Thanks for your feedback');
			$onlines = array('facebook', 'google', 'zorgkaart', 'telefoonboek', 'vergelijkmondzorg', 'independer', 'kliniekoverzicht', 'own');
			
			$zorgkaart_doctor = 'https://www.zorgkaartnederland.nl/zorgverlener/basisarts-basisarts-nickolson-v-m-hoorn-120456/waardeer';
			$zorgkaart_location = 'https://www.zorgkaartnederland.nl/zorgverlener/basisarts-basisarts-nickolson-v-m-hoorn-120456';
			$address = array('First Avenue, 56', 'Green Street, 56', 'Apple Street, 153');
			$postcode = array('256874', '231145', '899635', '785469', '789965', '123569');
			$city = array('New York', 'Los Angeles', 'Chicago', 'Detroit', 'Washington');
			
			$this->db->where('users_id', $users_id);
			$this->db->delete('doctors');
			
			$doctors_num = 10;
			$doctors_ids = array('', '');
			for ($i = 0; $i < $doctors_num; $i++)
			{
				$data_array = array('users_id' => $users_id,
									'title' => $title[array_rand($title)],
									'firstname' => $name[array_rand($name)],
									'lastname' => $sname[array_rand($sname)],
									'zorgkaart' => $zorgkaart_doctor,
									'date' => time());
				$this->db->insert('doctors', $data_array);
				$doctors_ids[] = $this->db->insert_id();
			}
			
			$this->db->where('users_id', $users_id);
			$this->db->delete('locations');
			
			$locations_num = 10;
			$locations_ids = array('', '');
			for ($i = 0; $i < $locations_num; $i++)
			{
				$t = $city[array_rand($city)];
				$data_array = array('users_id' => $users_id,
									'title' => $t,
									'address' => $address[array_rand($address)],
									'postcode' => $postcode[array_rand($postcode)],
									'city' => $t,
									'zorgkaart' => $zorgkaart_location,
									'date' => time());
				$this->db->insert('locations', $data_array);
				$locations_ids[] = $this->db->insert_id();
			}
			
			$this->db->where('users_id', $users_id);
			$this->db->delete('sent');
			
			$this->db->where('users_id', $users_id);
			$this->db->delete('sent_dates');
			
			$this->db->where('users_id', $users_id);
			$this->db->delete('sent_questions');
			
			$limit = 5000;
			$count = 0;
			while ($count < $limit)
			{
				mt_srand();
				$batches_num = mt_rand(1, 10);
				$date = mt_rand(time() - 200 * 24 * 3600, time());
				$count += $batches_num;
				
				$data_array = array('users_id' => $users_id,
									'emails_amount' => $batches_num,
									'sent_date' => $date);
				$this->db->insert('sent_dates', $data_array);
				$batches_id = $this->db->insert_id();
				
				for ($i = 0; $i < $batches_num; $i++)
				{
					$q = $questions_ids[array_rand($questions_ids)];
					$n = $name[array_rand($name)];
					$s = $sname[array_rand($sname)];
					$star = mt_rand(0, 5);
					$f = ($star > 0 && $star <= 2) ? $feedback[array_rand($feedback)] : '';
					$r = '';
					$rt = 0;
					if ( ! empty($f))
					{
						$r = $reply[array_rand($reply)];
						$rt = $date + mt_rand(13, 24) * 3600;
					}
					
					$data_array = array('users_id' => $users_id,
										'questions_id' => $q,
										'batches_id' => $batches_id,
										'title' => $title[array_rand($title)],
										'name' => $n,
										'sname' => $s,
										'doctor' => $doctors_ids[array_rand($doctors_ids)],
										'location' => $locations_ids[array_rand($locations_ids)],
										'treatment' => $treatment[array_rand($treatment)],
										'age' => $age[array_rand($age)],
										'email' => $n.'_'.$s.'@gmail.com',
										'date' => $date,
										'last' => $star > 0 ? ($date + mt_rand(1, 12) * 3600) : 0,
										'stars' => $star,
										'status' => $star > 0 ? 2 : 1,
										'feedback' => $f,
										'reply' => $r,
										'reply_time' => $rt);
					$onlines_num = mt_rand(0, 8);
					$onlines_array = array();
					for ($k = 0; $k < $onlines_num; $k++)
					{
						$onlines_array[] = $onlines[array_rand($onlines)];
					}
					$onlines_array = array_unique($onlines_array);
					
					foreach ($onlines_array as $o)
					{
						$data_array[$o] = TRUE;
					}
					
					$this->db->insert('sent', $data_array);
					$sent_id = $this->db->insert_id();
					
					$questions_num = mt_rand(0, 3);
					if ( ! empty($questions_num))
					{
						for ($k = 1; $k <= $questions_num; $k++)
						{
							if ($questions_ids[$k] != $q)
							{
								$data_array = array('sent_id' => $sent_id,
													'users_id' => $users_id,
													'questions_id' => $questions_ids[$k],
													'stars' => mt_rand(1, 5),
													'date' => $date);
								$this->db->insert('sent_questions', $data_array);
							}
						}
					}
				}
			}
		}
		
		function set_defaults()
		{
			if ($this->logged_in())
			{
				$this->db->where('id', $this->session->userdata('id'));
				$this->db->limit(1);
				$row = $this->db->get('users')->row_array();
				
				if ( ! empty($row))
				{
					if ( ! empty($row['account_amount']) && $row['account_amount'] != '0.00')
					{
						$this->account_amount = $row['account_amount'];
					}
					else
					{
						$this->account_amount = $row['account_type'] == '0' ? $this->base_amount : ($row['account_type'] == '1' && $row['organization'] == '1' ? $this->ultimate_amount : $this->pro_amount);
					}

					if ( ! empty($row['doctors_amount']) &&  $row['doctors_amount'] != '0.00')
					{
						$this->doctor_amount = $row['doctors_amount'];
					}
					
					if ( ! empty($row['doctors_number']))
					{
						$this->free_doctors_number = $row['doctors_number'];
					}
				}
			}
		}

		function cron()
		{
			$result = $this->db->get('cron')->result_array();
			$time = time();

			$now_dates = array('n' => date('n', $time),
							   'N' => date("N", $time),
							   'j' => date('j', $time),
							   'G' => date('G', $time),
							   'i' => date('i', $time) * 1);
			$runs = array();
			foreach ($result as $row)
			{
				if ($row['cron_begin'])
				{
					$runs[$row['cron_level']][] = $row;
				}
				else
				{
					$dates = array();
					$month = array_diff(explode(",", $row['cron_month']), array(''));
					$month = (empty($month)) ? array("1-12") : $month;
					$dates['n'] = $this->parse_date($month, $now_dates['n']);

					if ( ! empty($dates['n']))
					{
						$week = array_diff(explode(",", $row['cron_week']), array(''));
						$week = (empty($week)) ? array("1-7") : $week;
						$dates['N'] = $this->parse_date($week, $now_dates['N']);

						if ( ! empty($dates['N']))
						{
							$day = array_diff(explode(",", $row['cron_day']), array(''));
							$day = (empty($day)) ? array("1-".cal_days_in_month(CAL_GREGORIAN, date('n', $time), date('Y', $time))) : $day;
							$dates['j'] = $this->parse_date($day, date("j", $now_dates['j']));

							if ( ! empty($dates['j']))
							{
								$hour = array_diff(explode(",", $row['cron_hour']), array(''));
								$hour = (empty($hour)) ? array("0-23") : $hour;
								$dates['G'] = $this->parse_date($hour, $now_dates['G']);

								if ( ! empty($dates['G']))
								{
									$minute = array_diff(explode(",", $row['cron_minute']), array(''));
									$minute = (empty($minute)) ? array("0-59") : $minute;
									$dates['i'] = $this->parse_date($minute, $now_dates['i']);

									if ( ! empty($dates['i']))
									{
										$check = TRUE;
										foreach ($dates as $key => $list)
										{
											if ( ! in_array($now_dates[$key], $list))
											{
												$check = FALSE;
											}
										}

										if ($check)
										{
											$runs[$row['cron_level']][] = $row;
										}
									}
								}
							}
						}
					}
				}
			}

			ksort($runs);

			foreach ($runs as $list)
			{
				$list = _sort($list, 'cron_begin');
				foreach ($list as $row)
				{
					if (method_exists($this, $row['cron_method']))
					{
						$this->db->where('cron_id', $row['cron_id']);
						$this->db->update('cron', array('cron_begin' => TRUE));

						$this->$row['cron_method']();

						$this->db->where('cron_id', $row['cron_id']);
						if ($row['cron_remove'])
						{
							$this->db->delete('cron');
						}
						else
						{
							$this->db->update('cron', array('cron_begin' => FALSE));
						}
					}
				}
			}
		}

		function parse_date($date, $now)
		{
			$result = array();
			foreach ($date as $row)
			{
				if (strpos($row, "-") !== FALSE)
				{
					list($start, $finish) = array_diff(explode("-", $row), array(''));

					for ($start; $start <= $finish; $start++)
					{
						$result[] = $start;
					}
				}
				else
				{
					if (strpos($row, "+") !== FALSE && ($now % str_replace("+", "", $row)) == 0)
					{
						$result[] = $now;
					}
					else
					{
						$result[] = $row;
					}
				}
			}

			return $result;
		}

		function reminders()
		{
			$time = mktime(date("H"), date("i"), 0, 2, 1, 1970);
			$this->db->where("reminder_checked", TRUE);
			$this->db->where("reminder_time >=", $time);
			$this->db->where("reminder_time < ", $time + 10 * 60);
			$this->db->where("reminder_last <>", date("j"));
			$this->db->where("reminder_period", 1);
			$this->db->or_where("reminder_period", 0);
			$this->db->where("reminder_checked", TRUE);
			$this->db->where("reminder_time >=", $time);
			$this->db->where("reminder_time < ", $time + 10 * 60);
			$this->db->where("reminder_last <>", date("j"));
			$this->db->where("reminder_day", date("N"));
			$result = $this->db->get("users")->result_array();

			if ( ! empty($result))
			{
				$now = time();

				foreach ($result as $row)
				{
					if ($now >= $row['activation'] && $now < $row['suspension'])
					{
						$this->db->where("id", $row['id']);
						$this->db->update("users", array('reminder_last' => date("j")));
				
						$this->db->order_by("date", "desc");
						$this->db->where("users_id", $row['id']);
						$this->db->where("status <>", 3);
						$this->db->limit(1);
						$val = $this->db->get("sent")->row_array();

						$post = array('email' => $row['email'],
									  'username' => $row['username'],
									  'color' => empty($row['color']) ? "#0f75bc" : $row['color'],
									  'last_date' => ! empty($val['date']) ? date("H:i d-m-Y", $val['date']) : FALSE);
						$this->send_reminders($post);
					}
				}
			}
		}

		function resend_letters()
		{
			$time = mktime(0, 0, 0, date("m"), date("j"), date("Y"));

			$this->db->where("stars", 0);
			$this->db->where("date <=", $time - 3 * 24 * 3600);
			$this->db->where("date >", $time - 4 * 24 * 3600);
			$this->db->group_by("email");
			$result = $this->db->get("sent")->result_array();
			$post['emails'] = array();
			foreach ($result as $row)
			{
				$this->db->where("date >", $row['date']);
				$this->db->where("email", $row['email']);
				$this->db->where("stars", 0);
				
				if ( ! $this->db->count_all_results("sent"))
				{
					$post['emails'][] = array("name" => $row['name'],
											  "sname" => $row['sname'],
											  "text" => $row['email'],
											  "id" => $row['id'],
											  "reminder_date" => date("H:i d-m-Y", $row['date']),
											  "users_id" => $row['users_id']);
				}
			}

			$this->send_letters($post, "Herinnering: Hoe was uw behandeling?", TRUE);
		}

		function send_mailing()
		{
			$start = mktime(date("H"), 0, 0, date("m"), date("j"), date("Y"));
			$finish = $start + 3600;

			$this->db->where("date >=", $start);
			$this->db->where("date <", $finish);
			$this->db->where("status <>", 3);
			if ($this->db->count_all_results("sent") < $this->per_hour)
			{
				$this->real_send(array("mailing", "reply"));
			}
		}

		function send_other()
		{
			$this->real_send(array("signup", "trial", "reminder", "reset", "feedback", "month", "notifications", "renew"));
		}

		function get_post()
		{
			$postdata = file_get_contents("php://input");
			$request = json_decode($postdata, TRUE);
			return $request;
		}

		function save_last()
		{
			if ($this->session->userdata("id") && ! $this->session->userdata("admin_id"))
			{
				$this->db->where("id", $this->session->userdata("id"));
				$this->db->update("users", array("last" => time()));
				$this->last_time = time();
			}
 		}
		
		function generate_invoices()
		{
			return TRUE;
			
			$time = time() - 24 * 3600;
			$today = mktime(0, 0, 0, date("m", $time), date("j", $time), date("Y", $time));
			
			$users_ids = array();
			$end = array();
			$users = array();
			$this->db->where("account", 1);
			$result = $this->db->get("users")->result_array();
			foreach ($result as $row)
			{
				if ( ! empty($row['organization']))
				{
					if ($today == $row['suspension'])
					{
						$end[] = $row['id'];
						$users_ids[] = $row['id'];
					}
					
					if (($row['suspension'] - $today) % $this->period == 0)
					{
						$this->db->where("users_id", $row['id']);
						$this->db->where("date >", $today - $this->period);
						if ( ! $this->db->count_all_results("invoices"))
						{
							$users_ids[] = $row['id'];
						}
					}
					
					$users[$row['id']] = $row;
				}
			}
			
			$users_ids = array_unique($users_ids);
			if ( ! empty($users_ids))
			{
				$this->db->where_in("users_id", $users_ids);
				$doctors_array = $this->db->get("doctors")->result_array();
				
				$this->db->where_in("users_id", $users_ids);
				$doctors_pay_array = $this->db->get("doctors_pay")->result_array();
				
				$time = time();
				foreach ($users_ids as $users_id)
				{
					$amount = 0;
					$base_amount = 0;
					$need_invoice = FALSE;
					if (in_array($users_id, $end))
					{
						$base_amount = $this->account_amount;
						$amount += $base_amount;
					}
					
					$doctors = array();
					foreach ($doctors_array as $doc)
					{
						if ($doc['users_id'] == $users_id)
						{
							$doctors[] = $doc;
							$amount += $this->doctor_amount;
						}
					}
					
					$doctors_pay = array();
					foreach ($doctors_pay_array as $doc)
					{
						if ($doc['users_id'] == $users_id)
						{
							$doctors_pay[] = $doc;
							$amount += $doc['amount'];
						}
					}
					$amount = round($amount, 2);
					
					if ($amount > 0)
					{
						$name = date("d-m-Y", $time);
						$year = date("Y", $time);
						$month = date("m", $time);
						
						$this->db->where("date >", mktime(0, 0, 0, $month, 1, $year));
						$count = $this->db->count_all_results("invoices") + 1;
						
						$code = $year.$month.str_pad($count, 3, '0', STR_PAD_LEFT);
						$data_array = array("users_id" => $users_id,
											"name" => $name,
											"code" => $code,
											"base_amount" => $base_amount,
											"amount" => $amount,
											"file" => "",
											"date" => $time);
						if ($this->db->insert("invoices", $data_array))
						{
							$invoices_id = $this->db->insert_id();
							foreach ($doctors as $doc)
							{
								$data_array = array('invoices_id' => $invoices_id,
													'doctors_id' => $doc['id'],
													'doctors_title' => $doc['title'],
													'doctors_firstname' => $doc['firstname'],
													'doctors_lastname' => $doc['lastname'],
													'free' => $doc['free'],
													'doctors_amount' => $this->doctor_amount,
													'doctors_pay' => FALSE);
								$this->db->insert("invoices_doctors", $data_array);
							}
							
							foreach ($doctors_pay as $doc)
							{
								$data_array = array('invoices_id' => $invoices_id,
													'doctors_id' => $doc['doctors_id'],
													'doctors_title' => $doc['title'],
													'doctors_firstname' => $doc['firstname'],
													'doctors_lastname' => $doc['lastname'],
													'free' => $doc['free'],
													'doctors_amount' => $doc['amount'],
													'doctors_pay' => TRUE);
								$this->db->insert("invoices_doctors", $data_array);
								
								$this->db->where("rows_id", $doc['rows_id']);
								$this->db->delete("doctors_pay");
							}
							
							$domain = (( ! empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://").$_SERVER['HTTP_HOST'].'/';
							$curlconnect = curl_init();
							curl_setopt($curlconnect, CURLOPT_URL, 'http://www.spurdoc.com/api/make?url='.urlencode($domain.'pub/invoice/'.md5($invoices_id.$time).'/'));
							curl_setopt($curlconnect, CURLOPT_RETURNTRANSFER, TRUE); 
							$pdf = curl_exec($curlconnect);
							$attach = FALSE;
							if ( ! empty($pdf))
							{
								if (file_put_contents("./invoices/".$code.".pdf", $pdf))
								{
									$attach = "./invoices/".$code.".pdf";
								}
							}
							
							$this->db->where("id", $users_id);
							$this->db->limit(1);
							$user = $this->db->get("users")->row_array();

							$response = file_get_contents("https://www.mollie.com/xml/ideal?a=createlink&partnerid=1959041&amount=".round($amount * 100)."&description=");
							$xml = simplexml_load_string($response);
							$data = array("email" => $user['email'],
										  "username" => $user['username'],
										  "color" => empty($user['color']) ? "#0f75bc" : $user['color'],
										  "current_date" => date("d-m-Y", $user['activation']),
										  "end_date" => date("d-m-Y", $user['suspension']),
										  "payment_link" => (string)$xml->link->URL,
										  "attach" => $attach);
							$this->send_payment($data);
						}
					}
				}
			}
		}
		
		function rating_history()
		{
			$this->db->order_by('id', 'asc');
			$this->db->where('status', 1);
			$this->db->where('activation >', 0);
			$result = $this->db->get('users')->result_array();
			if ( ! empty($result))
			{
				$now = mktime(0, 0, 0, date('n'), date('j'), date('Y'));
				foreach ($result as $row)
				{
					if ($row['history'] <= ($now - (7 * 24 * 3600)))
					{
						$from = 0;
						$to = 0;
						if ($row['history'] == 0)
						{
							$from = mktime(0, 0, 0, date('n', $row['activation']), date('j', $row['activation']), date('Y', $row['activation']));
							$to = $from;
							while (date('N', $to) != 7)
							{
								$to += (24 * 3600);
							}
						}
						else
						{
							$from = $row['history'] + (24 * 3600);
							$to = $row['history'] + (7 * 24 * 3600);
						}
						
						if ( ! empty($from) && ! empty($to))
						{
							while ($to <= $now)
							{
								$stars = 0;
								$count = 0;
								$data_array = array('users_id' => $row['id'],
													'date_from' => $from,
													'date_to' => $to,
													'stars_1' => 0,
													'stars_2' => 0,
													'stars_3' => 0,
													'stars_4' => 0,
													'stars_5' => 0,
													'stars_all' => 0,
													'average_week' => 0,
													'average_all' => 0);
								
								$this->db->where('users_id', $row['id']);
								$this->db->where('status', 2);
								$this->db->where('stars >', 0);
								$this->db->where('last >=', $from);
								$this->db->where('last <', $to + (24 * 3600));
								$res = $this->db->get('sent')->result_array();
								foreach ($res as $val)
								{
									$data_array['stars_'.$val['stars']] += 1;
									$data_array['stars_all'] += 1;
									$stars += $val['stars'];
									$count++;
								}
								
								if ($count > 0)
								{
									$data_array['average_week'] = round($stars / $count, 1);
								}
								
								$average_all = 0;
								$average_count = 0;
								$this->db->order_by('date_to', 'asc');
								$this->db->where('users_id', $row['id']);
								$this->db->where('average_week >', 0);
								$this->db->where('date_to <', $to);
								$res = $this->db->get('rating_history')->result_array();
								foreach ($res as $val)
								{
									$average_all += $val['average_week'];
									$average_count++;
								}
								
								if ($data_array['average_week'] > 0)
								{
									$average_all += $data_array['average_week'];
									$average_count++;
								}
								
								if ($average_count > 0)
								{
									$data_array['average_all'] = round($average_all / $average_count, 1);
								}
								
								$this->db->where('users_id', $row['id']);
								$this->db->where('date_from', $from);
								$this->db->where('date_to', $to);
								$this->db->delete('rating_history');
								
								if ($this->db->insert('rating_history', $data_array))
								{
									$this->db->where('id', $row['id']);
									$this->db->update('users', array('history' => $to));
								}
								
								$from = $to + (24 * 3600);
								$to = $to + (7 * 24 * 3600);
							}
						}
					}
				}
			}
		}

		function logged_in()
		{
			return $this->session->userdata("logged_in");
		}

		function user($id = FALSE)
		{
			$result = array();
			if ($this->logged_in() || $id)
			{
				$id = empty($id) ? $this->session->userdata("id") : $id;
				$this->db->where("id", $id);
				$this->db->limit(1);
				$result = $this->db->get("users")->row_array();
				$result['logged_in'] = $this->logged_in();
				$result['admin_id'] = $this->session->userdata("admin_id");
				$result['trial_end'] = ceil(($result['trial_end'] - time()) / (24 * 3600));
				/*if ($result['trial_end'] <= 0 && $result['account'] == 2)
				{
					$this->db->where("id", $id);
					$this->db->update("users", array("account" => 0));
					$result['account'] = 0;
				}*/
			}

			return $result;
		}
		
		function subscription_info()
		{
			$result = array();
			if ($this->logged_in())
			{
				$this->db->where("id", $this->session->userdata("id"));
				$this->db->limit(1);
				$result = $this->db->get("users")->row_array();
				
				$result['start'] = date("d-m-Y", empty($result['signup']) ? $result['activation'] : $result['signup']);
				$result['activation'] = date("d-m-Y", empty($result['activation']) ? $result['trial_end'] : $result['activation']);
				$result['suspension'] = date("d-m-Y", empty($result['suspension']) ? ($result['trial_end'] + $this->period * 24 * 3600) : $result['suspension']);
				$result['doctors'] = $this->get_doctors($this->session->userdata("id"));
				$result['doctors_count'] = count($result['doctors']);
				$result['amount'] = $this->account_amount;
				foreach ($result['doctors'] as $doc)
				{
					if ( ! $doc['free'])
					{
						$result['amount'] += $this->doctor_amount;
					}
				}
				
				/*$result['invoices'] = array();
				$result['last_invoice'] = "";
				$this->db->order_by("date", "desc");
				$this->db->where("users_id", $this->session->userdata("id"));
				$res = $this->db->get("invoices")->result_array();
				
				foreach($res as $key => $row)
				{
					$row['date'] = date("d-m-Y", $row['date']);
					$row['file'] = "/invoices/".$row['code'].".pdf";
					if ($key == 0)
					{
						$result['last_invoice'] = $row['date'];
					}

					$result['invoices'][] = $row;
				}*/
			}

			return $result;
		}
		
		function get_locations()
		{
			$this->db->where("users_id", $this->session->userdata("id"));
			return $this->db->get("locations")->result_array();
		}
		
		function location_info($id)
		{
			$this->db->where("id", $id);
			$this->db->limit(1);
			$row = $this->db->get("locations")->row_array();
			
			$row['name'] = '';
			if ( ! empty($row['id']))
			{
				$this->db->where('users_id', $this->session->userdata("id"));
				$this->db->where('locations_id', $id);
				$this->db->limit(1);
				$result = $this->db->get("locations_ids")->row_array();
				if ( ! empty($result))
				{
					$row['name'] = $result['locations_name'];
				}
			}
			
			return $row;
		}
		
		function get_doctors_amount($users_id)
		{
			$this->db->where("users_id", $users_id);
			return $this->db->count_all_results("doctors");
		}
		
		function get_doctors($users_id = FALSE)
		{
			if ( ! $users_id)
			{
				$users_id = $this->session->userdata("id");
			}
			
			if ($users_id != "all")
			{
				$this->db->where("users_id", $users_id);
			}
			return $this->db->get("doctors")->result_array();
		}
		
		function doctor_info($id)
		{
			$this->db->where("id", $id);
			$this->db->limit(1);
			$row = $this->db->get("doctors")->row_array();
			
			$row['name'] = '';
			if ( ! empty($row['id']))
			{
				$this->db->where('users_id', $this->session->userdata("id"));
				$this->db->where('doctors_id', $id);
				$this->db->limit(1);
				$result = $this->db->get("doctors_ids")->row_array();
				if ( ! empty($result))
				{
					$row['name'] = $result['doctors_name'];
				}
			}
			
			return $row;
		}
		
		function account_save($post)
		{
			if ($this->logged_in())
			{
				$this->db->where("id", $this->session->userdata("id"));
				$this->db->limit(1);
				$row = $this->db->get("users")->row_array();
				$row['suspension'] = date("d-m-Y", $row['suspension']);
				$row['today'] = date("d-m-Y");
				$this->send_notifications($row, "stop_sub");
				
				$this->db->where("id", $this->session->userdata("id"));
				$this->db->update("users", array("account_stop" => 1));
				
				return TRUE;
			}
			
			return FALSE;
		}
		
		function invoice_info($id, $type = FALSE)
		{
			$result = array();
			$result['base_amount'] = $this->base_amount;
			$result['pro_amount'] = $this->pro_amount;
			$result['ultimate_amount'] = $this->ultimate_amount;
			$result['account_amount'] = $this->account_amount;
			$result['doctors'] = $this->get_doctors($id);
			$result['doctors_amount'] = 0;
			foreach ($result['doctors'] as $doc)
			{
				if (($type > 0 && ! $doc['free']) || $type == 0)
				{
					$result['doctors_amount'] += $this->doctor_amount;
				}
			}
			
			$result['half'] = FALSE;
			$time = time();
			$time = mktime(0, 0, 0, date("n", $time), date("j", $time), date("Y", $time));
			$result['today'] = date("d-m-Y", $time);
			
			$this->db->where("id", $id);
			$this->db->limit(1);
			$row = $this->db->get("users")->row_array();
			if ( ! empty($row))
			{
				if ($row['account'] == 2)
				{
					$time = $row['trial_end'];
					$result['today'] = date("d-m-Y", $time);
				}
			
				$result['suspension'] = date("d-m-Y", empty($row['suspension']) ? ($row['trial_end'] + $this->period * 24 * 3600) : $row['suspension']);
				$end = $row['suspension'];
				$result['days'] = ceil((mktime(0, 0, 0, date("n", $end), date("j", $end), date("Y", $end)) - $time) / (24 * 3600));
				$result['half_ultimate'] = round(($this->ultimate_amount / $this->period) * $result['days'], 2);
				$result['half_pro'] = round(($this->pro_amount / $this->period) * $result['days'], 2);
				$result['half_basic'] = round(($this->base_amount / $this->period) * $result['days'], 2);

				$result['amount'] = 0;
				if ($row['account'] == 1 && $row['account_type'] == 0)
				{
					$result['amount'] = ($type == 1 ? $result['half_pro'] : $result['half_ultimate']) - $result['half_basic'];
					$result['half'] = TRUE;
				}
				else
				{
					if ($type !== FALSE)
					{
						$result['amount'] = $result['doctors_amount'] + ($type == 0 ? $result['base_amount'] : $type == 1 ? $result['pro_amount'] : $result['ultimate_amount']);
					}
				}
			}
			
			return $result;
		}
		
		function get_invoice($id, $is_hash = FALSE)
		{
			if ($is_hash)
			{
				$this->db->where("MD5(CONCAT(id, date)) = ", $id);
			}
			else
			{
				$this->db->where("id", $id);
			}
			$this->db->limit(1);
			$result = $this->db->get("invoices")->row_array();
			$result['print'] = "/pub/invoice/".md5($result['id'].$result['date'])."/";

			$this->db->where("invoices_id", $result['id']);
			$result['doctors'] = $this->db->get("invoices_doctors")->result_array();
			
			$result['info'] = json_decode($result['info'], TRUE);

			return $result;
		}
		
		function activate_account($post)
		{
			if ($this->logged_in())
			{
				$name = date("d-m-Y");
				
				$this->db->where("id", $this->session->userdata("id"));
				$this->db->limit(1);
				$row = $this->db->get("users")->row_array();
				if ( ! empty($row))
				{
					$time = $row['account'] == 2 ? $row['trial_end'] : time();
					$row['today'] = date("d-m-Y", $time);
					$this->send_notifications($row, "start_sub");

					/*$this->db->where("users_id", $this->session->userdata("id"));
					$this->db->where("name", $name);
					$this->db->limit(1);
					$in = $this->db->get("invoices")->row_array();
					if ( ! empty($in))
					{
						$this->db->where("id", $in['id']);
						$this->db->delete("invoices");
						
						if (file_exists("./invoices/".$in['code'].".pdf"))
						{
							unlink("./invoices/".$in['code'].".pdf");
						}
					}*/
					
					$amount = $this->invoice_info($this->session->userdata("id"), $post['type']);
					
					/*$year = date("Y", $time);
					$month = date("m", $time);
					
					$this->db->where("date >", mktime(0, 0, 0, $month, 1, $year));
					$count = $this->db->count_all_results("invoices") + 1;
					
					$code = $year.$month.str_pad($count, 3, '0', STR_PAD_LEFT);
					$data_array = array("users_id" => $this->session->userdata("id"),
										"name" => $name,
										"code" => $code,
										"base_amount" => $post['type'] == 0 ? $this->base_amount : $this->pro_amount,
										"amount" => $amount['amount'],
										"info" => json_encode($amount),
										"half" => $amount['half'],
										"date" => $time);
					if ($this->db->insert("invoices", $data_array))
					{
						$invoices_id = $this->db->insert_id();
						$doctors = $this->get_doctors($this->session->userdata("id"));
						foreach ($doctors as $doc)
						{
							$data_array = array('invoices_id' => $invoices_id,
												'doctors_id' => $doc['id'],
												'doctors_title' => $doc['title'],
												'doctors_firstname' => $doc['firstname'],
												'doctors_lastname' => $doc['lastname'],
												'doctors_amount' => $this->doctor_amount,
												'free' => $doc['free']);
							$this->db->insert("invoices_doctors", $data_array);
						}*/
						
						$this->db->where("id", $row['id']);
						$this->db->update("users", array("account_type" => $post['type'], "account" => 1, "account_stop" => 0, "activation" => $time, "suspension" => ($time + $this->period * 24 * 3600)));
						
						/*$domain = (( ! empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://").$_SERVER['HTTP_HOST'].'/';
						$curlconnect = curl_init();
						curl_setopt($curlconnect, CURLOPT_URL, 'http://www.spurdoc.com/api/make?url='.urlencode($domain.'pub/invoice/'.md5($invoices_id.$time).'/'));
						curl_setopt($curlconnect, CURLOPT_RETURNTRANSFER, TRUE); 
						$pdf = curl_exec($curlconnect);
						$attach = FALSE;
						if ( ! empty($pdf))
						{
							if (file_put_contents("./invoices/".$code.".pdf", $pdf))
							{
								$attach = "./invoices/".$code.".pdf";
							}
						}*/

						$response = file_get_contents("https://www.mollie.com/xml/ideal?a=createlink&partnerid=1959041&amount=".round($amount['amount'] * 100)."&description=");
						$xml = simplexml_load_string($response);
						$data = array("email" => $row['email'],
									  "username" => $row['username'],
									  "color" => empty($user['color']) ? "#0f75bc" : $user['color'],
									  "current_date" => date("d-m-Y", $row['activation']),
									  "end_date" => date("d-m-Y", $row['suspension']),
									  "payment_link" => (string)$xml->link->URL,
									  "attach" => ''/*$attach*/);
						$this->send_payment($data);
					//}
				}
				
				$this->errors[] = array("Success" => "Uw abonnement is geactiveerd.");
				return TRUE;
			}
			
			return FALSE;
		}
		
		function save_location($post)
		{
			if ($this->logged_in())
			{
				$data_array = array("users_id" => $this->session->userdata("id"),
									"title" => $post['title'],
									"address" => $post['address'],
									"postcode" => $post['postcode'],
									"city" => $post['city'],
									"zorgkaart" => $post['zorgkaart']);

				$locations_id = 0;
				if ( ! empty($post['id']))
				{
					$this->errors[] = array("Success" => "Wijzigingen bewaard.");
					$this->db->where("id", $post['id']);
					$this->db->update("locations", $data_array);
					
					$locations_id = $post['id'];
				}
				else
				{
					$this->errors[] = array("Success" => "Wijzigingen bewaard.");
					$data_array['date'] = time();
					$this->db->insert("locations", $data_array);
					
					$locations_id = $this->db->insert_id();
				}
				
				$this->db->where('users_id', $this->session->userdata("id"));
				$this->db->where('locations_id', $locations_id);
				$this->db->delete('locations_ids');
				
				$data_array = array('users_id' => $this->session->userdata("id"),
									'locations_id' => $locations_id,
									'locations_name' => strtolower( ! empty($post['name']) ? $post['name'] : ''));
				$this->db->insert('locations_ids', $data_array);
				
				return $locations_id;
			}
			
			return FALSE;
		}
		
		function remove_location($id)
		{
			if ($this->logged_in())
			{
				$this->db->where("id", $id);
				$this->db->where("users_id", $this->session->userdata("id"));
				if ($this->db->delete("locations"))
				{
					$this->db->where("locations_id", $id);
					$this->db->delete("locations_ids");
					
					return TRUE;
				}
			}
			
			return FALSE;
		}
		
		function access_location()
		{
			if ($this->logged_in())
			{
				$this->db->where("id", $this->session->userdata("id"));
				$this->db->limit(1);
				$row = $this->db->get("users")->row_array();
				if ( ! empty($row))
				{
					$email_data['domain'] = (( ! empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://").$_SERVER['HTTP_HOST'].'/';
					$email_data['email'] = $row['email'];
					$email_data['phone'] = $row['phone'];
					$message = $this->load->view('views/mail/tpl_access_location.html', $email_data, TRUE);
					$this->send("access_location", 'admin@patientenreview.nl', 'Locatie-functionaliteit aangevraagd', $message, 'Patiëntenreview', 'no-reply@patientenreview.nl');
					
					return TRUE;
				}
			}
			
			return FALSE;
		}
		
		function get_amount()
		{
			$result = array();
			$result['base_amount'] = $this->base_amount;
			$result['pro_amount'] = $this->pro_amount;
			$result['ultimate_amount'] = $this->ultimate_amount;
			$result['account_amount'] = $this->account_amount;
			$result['doctor_amount'] = $this->doctor_amount;
			$result['doctor_number'] = $this->free_doctors_number;
			$result['date'] = date("d-m-Y");
			
			$this->db->where("users_id", $this->session->userdata("id"));
			$result['doctors'] = $this->db->get("doctors")->result_array();
			$result['doctors_pay'] = array();
			foreach ($result['doctors'] as $doc)
			{
				if (empty($doc['free']))
				{
					$result['doctors_pay'][] = $doc;
				}
			}
			
			return $result;
		}
		
		function get_doctors_price($id = FALSE)
		{
			$id = $id ? $id : $this->session->userdata("id");
			$price = $this->doctor_amount;
			$days = 0;
			
			$this->db->where("id", $id);
			//$this->db->where("account_type", 1);
			$this->db->limit(1);
			$row = $this->db->get("users")->row_array();
			if ( ! empty($row))
			{
				$this->db->where("users_id", $id);
				$this->db->where("free", 1);
				if ($this->db->count_all_results("doctors") < $this->free_doctors_number)
				{
					$price = 0;
				}
				else
				{
					$time = time();
					$days = ($row['suspension'] - mktime(0, 0, 0, date("m", $time), date("j", $time), date("Y", $time))) / (3600 * 24) % $this->period + 1;
					$day_amount = $price / $this->period;
					$price = round($days * $day_amount, 2);
				}
			}
			
			return array("price" => $price, "days" => $days, "end" => date('d-m-Y', $row['suspension']));
		}
		
		function save_doctor($post)
		{
			if ($this->logged_in())
			{
				$time = time();
				$free = 0;
				$amount = 0;
				$this->db->where("id", $this->session->userdata("id"));
				$this->db->limit(1);
				$row = $this->db->get("users")->row_array();
				if ( ! empty($row))
				{
					if ($row['account'] == '2' || $row['account_type'] == '1')
					{
						$this->db->where("users_id", $row['id']);
						$this->db->where("free", 1);
						if ($this->db->count_all_results("doctors") < $this->free_doctors_number)
						{
							$free = 1;
						}
					}
					
					if ( ! $free)
					{
						$days = ($row['suspension'] - mktime(0, 0, 0, date("m", $time), date("j", $time), date("Y", $time))) / (3600 * 24) % $this->period + 1;
						$day_amount = $this->doctor_amount / $this->period;
						$amount = round($days * $day_amount, 2);
					}
				}
				
				$check = TRUE;
				if ( ! empty($post['short_checked']) && ! empty($post['short']))
				{
					$this->db->where("short", $post['short']);
					$this->db->limit(1);
					if ($this->db->count_all_results("users"))
					{
						$check = FALSE;
					}
					else
					{
						$this->db->where("short", $post['short']);
						$this->db->where("id <>", $post['id']);
						$this->db->limit(1);
						if ($this->db->count_all_results("doctors"))
						{
							$check = FALSE;
						}
						else
						{
							if (in_array($post['short'], $this->reserved))
							{
								$check = FALSE;
							}
						}
					}
				}
				
				if ($check)
				{
					$data_array = array("users_id" => $this->session->userdata("id"),
										"firstname" => $post['firstname'],
										"lastname" => $post['lastname'],
										"title" => ! empty($post['title']) ? $post['title'] : '',
										"zorgkaart" => ! empty($post['zorgkaart']) ? strpos($post['zorgkaart'], '/waardeer') !== FALSE ? $post['zorgkaart'] : rtrim($post['zorgkaart'], '/').'/waardeer' : '',
										"short" => ! empty($post['short']) ? $post['short'] : "",
										"short_checked" => ! empty($post['short_checked']) ? $post['short_checked'] : 0);
										
					if ( ! empty($post['new_avatar']) || ! empty($post['remove_avatar']))
					{
						if ( ! empty($post['id']))
						{
							$this->db->where("id", $post['id']);
							$this->db->limit(1);
							$row = $this->db->get("doctors")->row_array();

							if ( ! empty($row['avatar']))
							{
								unlink($row['avatar']);
								$data_array['avatar'] = '';
							}
						}

						if ( ! empty($post['new_avatar']))
						{
							$source = './avatars/tmp/'.$post['new_avatar'];
							$dest = './avatars/'.$post['new_avatar'];
							if (rename($source, $dest))
							{
								$data_array['avatar'] = $dest;
								delete_files('./avatars/tmp/');
							}
						}
					}

					$doctors_id = 0;
					if ( ! empty($post['id']))
					{
						$this->errors[] = array("Success" => "Wijzigingen bewaard.");
						$this->db->where("id", $post['id']);
						$this->db->update("doctors", $data_array);
						
						$doctors_id = $post['id'];
					}
					else
					{
						$this->errors[] = array("Success" => "Abonnement gewijzigd.");
						$data_array['date'] = $time;
						$data_array['free'] = $free;
						$this->db->insert("doctors", $data_array);
						
						$doctors_id = $this->db->insert_id();
						
						$row['firstname'] = $post['firstname'];
						$row['lastname'] = $post['lastname'];
						$row['today'] = date("d-m-Y");
						
						$this->send_notifications($row, "add_doctor");
					}
					
					if ( ! empty($doctors_id))
					{
						$this->db->where('users_id', $this->session->userdata("id"));
						$this->db->where('doctors_id', $doctors_id);
						$this->db->delete('doctors_ids');
						
						$data_array = array('users_id' => $this->session->userdata("id"),
											'doctors_id' => $doctors_id,
											'doctors_name' => strtolower( ! empty($post['name']) ? $post['name'] : ''));
						$this->db->insert('doctors_ids', $data_array);
						
						if ( ! empty($amount))
						{
							$data_array = array("doctors_id" => $doctors_id,
												"users_id" => $this->session->userdata("id"),
												"firstname" => $post['firstname'],
												"lastname" => $post['lastname'],
												"title" => $post['title'],
												"amount" => $amount);
							$this->db->insert("doctors_pay", $data_array);
						}
						
						if (empty($row['organization']))
						{
							$this->doctors_invoice($doctors_id, $amount);
						}
					}
					
					return $doctors_id;
				}
				else
				{
					$this->errors[] = array("URL already exists");
				}
			}
			
			return FALSE;
		}
		
		function doctors_invoice($doctors_id, $amount)
		{
			if ($this->logged_in())
			{
				$name = date("d-m-Y").'-'.$doctors_id;
				
				$this->db->where("id", $this->session->userdata("id"));
				$this->db->limit(1);
				$row = $this->db->get("users")->row_array();
				if ( ! empty($row))
				{
					/*$this->db->where("users_id", $this->session->userdata("id"));
					$this->db->where("name", $name);
					$this->db->limit(1);
					$in = $this->db->get("invoices")->row_array();
					if ( ! empty($in))
					{
						$this->db->where("id", $in['id']);
						$this->db->delete("invoices");
						
						if (file_exists("./invoices/".$in['code'].".pdf"))
						{
							unlink("./invoices/".$in['code'].".pdf");
						}
					}
					
					$doc = $this->doctor_info($doctors_id);
					
					$time = time();
					$year = date("Y", $time);
					$month = date("m", $time);
					
					$this->db->where("date >", mktime(0, 0, 0, $month, 1, $year));
					$count = $this->db->count_all_results("invoices") + 1;
					
					$code = $year.$month.str_pad($count, 3, '0', STR_PAD_LEFT);
					$data_array = array("users_id" => $this->session->userdata("id"),
										"name" => $name,
										"code" => $code,
										"base_amount" => 0,
										"amount" => $amount,
										"info" => json_encode(array("doctors" => $doc, "doctors_amount" => $this->doctor_amount, "amount" => $amount)),
										"half" => 0,
										"date" => $time);
					if ($this->db->insert("invoices", $data_array))
					{
						$invoices_id = $this->db->insert_id();
						$data_array = array('invoices_id' => $invoices_id,
											'doctors_id' => $doc['id'],
											'doctors_title' => $doc['title'],
											'doctors_firstname' => $doc['firstname'],
											'doctors_lastname' => $doc['lastname'],
											'doctors_amount' => $amount,
											'doctors_pay' => TRUE,
											'free' => FALSE);
						$this->db->insert("invoices_doctors", $data_array);
						
						$this->db->where("doctors_id", $doc['id']);
						$this->db->where("users_id", $this->session->userdata("id"));
						$this->db->delete("doctors_pay");

						$domain = (( ! empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://").$_SERVER['HTTP_HOST'].'/';
						$curlconnect = curl_init();
						curl_setopt($curlconnect, CURLOPT_URL, 'http://www.spurdoc.com/api/make?url='.urlencode($domain.'pub/invoice/'.md5($invoices_id.$time).'/'));
						curl_setopt($curlconnect, CURLOPT_RETURNTRANSFER, TRUE); 
						$pdf = curl_exec($curlconnect);
						$attach = FALSE;
						if ( ! empty($pdf))
						{
							if (file_put_contents("./invoices/".$code.".pdf", $pdf))
							{
								$attach = "./invoices/".$code.".pdf";
							}
						}*/

						$response = file_get_contents("https://www.mollie.com/xml/ideal?a=createlink&partnerid=1959041&amount=".round($amount * 100)."&description=");
						$xml = simplexml_load_string($response);
						$data = array("email" => $row['email'],
									  "username" => $row['username'],
									  "color" => empty($user['color']) ? "#0f75bc" : $user['color'],
									  "current_date" => date("d-m-Y", $row['activation']),
									  "end_date" => date("d-m-Y", $row['suspension']),
									  "payment_link" => (string)$xml->link->URL,
									  "attach" => ''/*$attach*/);

						if ( ! empty($amount))
						{
							$this->send_payment($data);
						}
					//}
				}
				
				$this->errors[] = array("Success" => "Uw abonnement is geactiveerd.");
				return TRUE;
			}
			
			return FALSE;
		}
		
		function remove_doctor($id)
		{
			if ($this->logged_in())
			{
				$this->db->where("id", $this->session->userdata("id"));
				$this->db->limit(1);
				$row = $this->db->get("users")->row_array();
				if ( ! empty($row))
				{
					$this->db->where("id", $id);
					$this->db->limit(1);
					$val = $this->db->get("doctors")->row_array();
					
					if ( ! empty($val))
					{
						$row['firstname'] = $val['firstname'];
						$row['lastname'] = $val['lastname'];
						$row['today'] = date("d-m-Y");
						
						$this->send_notifications($row, "remove_doctor");
					}
				}

				$this->db->where("id", $id);
				$this->db->where("users_id", $this->session->userdata("id"));
				if ($this->db->delete("doctors"))
				{
					$this->db->where("doctors_id", $id);
					$this->db->delete("doctors_ids");
					
					$this->db->where("doctors_id", $id);
					$this->db->delete("doctors_pay");
					
					$this->db->where("doctors_id", $id);
					$this->db->delete("invoices_doctors");
					
					$this->db->where("doctor", $id);
					$this->db->delete("sent");
					
					return TRUE;
				}
			}
			
			return FALSE;
		}
		
		function save_online($post)
		{
			if ($this->logged_in())
			{
				$data_array = array("facebook_pos" => $post['facebook_pos'],
									"facebook_checked" => $post['facebook_checked'],
									"facebook" => $post['facebook'],
									"zorgkaart_pos" => $post['zorgkaart_pos'],
									"zorgkaart_checked" => $post['zorgkaart_checked'],
									"zorgkaart" => $post['zorgkaart'],
									"telefoonboek_pos" => $post['telefoonboek_pos'],
									"telefoonboek_checked" => $post['telefoonboek_checked'],
									"telefoonboek" => $post['telefoonboek'],
									"vergelijkmondzorg_pos" => $post['vergelijkmondzorg_pos'],
									"vergelijkmondzorg_checked" => $post['vergelijkmondzorg_checked'],
									"vergelijkmondzorg" => $post['vergelijkmondzorg'],
									"independer_pos" => $post['independer_pos'],
									"independer_checked" => $post['independer_checked'],
									"independer" => $post['independer'],
									"independer_scrap" => $post['independer_scrap'],
									"kliniekoverzicht_pos" => $post['kliniekoverzicht_pos'],
									"kliniekoverzicht_checked" => $post['kliniekoverzicht_checked'],
									"kliniekoverzicht" => $post['kliniekoverzicht'],
									"own_pos" => $post['own_pos'],
									"own_checked" => $post['own_checked'],
									"own" => $post['own'],
									"own_name" => $post['own_name'],
									"google_pos" => $post['google_pos'],
									"google_checked" => $post['google_checked'],
									"google" => $post['google']);

				$this->db->where("id", $this->session->userdata("id"));
				return $this->db->update("users", $data_array);
			}
			
			return FALSE;
		}

		function user_info($id = FALSE)
		{
			$id = $id ? $id : $this->session->userdata("id");
			$this->db->where("id", $id);
			$this->db->limit(1);
			$row = $this->db->get("users")->row_array();
			if ( ! empty($row))
			{
				$row['activation_date'] = date("d-m-Y", $row['activation']);
				$row['suspension_date'] = date("d-m-Y", $row['suspension']);
				
				if ( ! empty($row['zorgkaart']) && strpos($row['zorgkaart'], '/waardeer') === FALSE)
				{
					$row['zorgkaart'] = rtrim($row['zorgkaart'], '/').'/waardeer';
				}
			}
			$row['admin_id'] = $this->session->userdata("admin_id");
			$row['intro'] = $this->session->userdata("intro");
			$row['intro_step'] = $this->session->userdata("intro_step");
			$row['intro_online_step'] = $this->session->userdata("intro_online_step");
			$row['rating'] = $this->get_rating($id);
			
			$this->db->where("users_id", $id);
			$row['login_count'] = $this->db->count_all_results("sessions");
			
			$row['account_amount'] = $row['account_amount'] != '0.00' ? $row['account_amount'] : ($row['account_type'] == 0 ? $this->base_amount : ($row['account_type'] == 1 && $row['organization'] == 1 ? $this->ultimate_amount : $this->pro_amount));
			$row['doctors_amount'] = $row['doctors_amount'] != '0.00' ? $row['doctors_amount'] : $this->doctor_amount;
			$row['doctors_number'] = ! empty($row['doctors_number']) ? $row['doctors_number'] : $this->free_doctors_number;

			$row['first_upload'] = FALSE;
			if (empty($row['admin_id']))
			{
				$this->db->where('users_id', $row['id']);
				$this->db->where('status <>', 3);
				$row['first_upload'] = ! $this->db->count_all_results('sent');
			}
			
			$row['fb_logged_in'] = FALSE;
			if ( ! empty($row['facebook_checked']) && ! empty($row['facebook']))
			{
				$this->load->library('Facebook');
				$row['fb_logged_in'] = $this->facebook->is_token();
				if (empty($row['fb_logged_in']))
				{
					$row['fb_link'] = $this->facebook->get_link();
				}
			}
			
			return $row;
		}
		
		function get_rating($id = FALSE)
		{
			$average = 0;
			$all = 0;
			$id = $id ? $id : $this->session->userdata("id");
			
			$this->db->where("users_id", $id);
			$this->db->where("status <>", 3);
			$result = $this->db->get("sent")->result_array();

			if ( ! empty($result))
			{
				foreach ($result as $row)
				{
					if ($row['stars'] > 0)
					{
						$average += $row['stars'];
						$all++;
					}
				}
				
				if ( ! empty($all))
				{
					//$average = floor(round($average / $all, 2) * 2) / 2;
					$average = round($average / $all, 1);
				}
			}
			
			return $average;
		}
		
		function user_emails($id = FALSE)
		{
			$id = $id ? $id : $this->session->userdata("id");
			$this->db->where("users_id", $id);
			$this->db->limit(1);
			$result = $this->db->get("emails")->row_array();

			$result['subject'] = empty($result['subject']) ? $this->defaults['subject'] : $result['subject'];
			$result['header'] = empty($result['header']) ? $this->defaults['header'] : $result['header'];
			$result['header_mq'] = empty($result['header_mq']) ? $this->defaults['header_mq'] : $result['header_mq'];
			$result['text1'] = empty($result['text1']) ? $this->defaults['text1'] : $result['text1'];
			$result['text1_mq'] = empty($result['text1_mq']) ? $this->defaults['text1_mq'] : $result['text1_mq'];
			$result['text2'] = empty($result['text2']) ? $this->defaults['text2'] : $result['text2'];
			$result['promo'] = empty($result['promo']) ? $this->defaults['promo'] : $result['promo'];
			$result['footer'] = empty($result['footer']) ? $this->defaults['footer'] : $result['footer'];
			
			$this->db->where("id", $id);
			$this->db->limit(1);
			$row = $this->db->get("users")->row_array();
			if ($row['account'] == 1 && $row['account_type'] == 0)
			{
				$check = FALSE;
				foreach ($this->tags as $tag)
				{
					if (strpos($result['subject'], $tag) !== FALSE)
					{
						$result['subject'] = "Hoe was uw behandeling?";
					}
					
					if (strpos($result['header'], $tag) !== FALSE)
					{
						$result['header'] = "Hoe was uw behandeling";
					}
					
					if (strpos($result['text1'], $tag) !== FALSE)
					{
						$result['text1'] = "Geachte heer/mevrouw,\n\nU bent onlangs behandeld in onze praktijk. We sturen u deze e-mail omdat we benieuwd zijn hoe u uw behandeling heeft ervaren. Uw mening is van onmisbaar belang voor de zorgverlener. Bovendien kunt u bijdragen aan het bevorderen van transparantie in de gezondheidszorg door uw beoordeling te plaatsen op online kanalen.\n\nOp een schaal van 1 tot 5 sterren, hoe waarschijnlijk is het dat u onze praktijk zou aanbevelen bij familie of vrienden?";
					}
				}
			}
			
			if ( ! empty($row['rating_questions']))
			{
				unset($result['header'], $result['text1']);
			}
			else
			{
				unset($result['header_mq'], $result['text1_mq']);
			}
			
			foreach ($result as $key => $value)
			{
				$result[$key] = str_replace("\n", "<br />", $value);
			}
			
			return $result;
		}
		
		function user_widget($id = FALSE)
		{
			$id = $id ? $id : $this->session->userdata("id");
			$this->db->where("users_id", $id);
			$this->db->limit(1);
			$row = $this->db->get("widgets")->row_array();
			
			if (empty($row))
			{
				$this->db->where("id", $id);
				$this->db->limit(1);
				$val = $this->db->get("users")->row_array();
				
				$row['widgets_type'] = '0';
				$row['widgets_bg'] = '1';
				$row['widgets_color'] = $val['color'];
				$row['widgets_button'] = '#e47645';
				$row['widgets_text1'] = 'Dit is hoe patiënten ons beoordelen';
				$row['widgets_text2'] = 'Wilt u ons ook beoordelen?';
				$row['widgets_textb'] = 'Beoordeel ons';
			}
			
			return $row;
		}
		
		function user_questions($questions)
		{
			$id = $this->session->userdata("id");
			$this->db->where("users_id", $id);
			$result = $this->db->get("users_questions")->result_array();
			
			$items = array();
			foreach ($result as $row)
			{
				foreach ($questions as $q)
				{
					if ($q['id'] == $row['questions_id'])
					{
						$items[] = $q;
					}
				}
			}

			return $items;
		}
		
		function free_questions($list, $users_list)
		{
			$items = array();
			foreach ($list as $row)
			{
				$check = TRUE;
				foreach ($users_list as $val)
				{
					if ($val['id'] == $row['id'])
					{
						$check = FALSE;
					}
				}
				
				if ($check)
				{
					$items[] = $row;
				}
			}
			
			foreach ($items as $key => $row)
			{
				$row['count'] = 0;
				
				$this->db->where('questions_id', $row['id']);
				$row['count'] += $this->db->count_all_results('sent');
				
				$this->db->where('questions_id', $row['id']);
				$row['count'] += $this->db->count_all_results('sent_questions');
				
				$items[$key] = $row;
			}

			return $items;
		}
		
		function get_questions()
		{
			return $this->db->get('rating_questions')->result_array();
		}
		
		function questions_save($question)
		{
			if ($this->logged_in())
			{
				$questions_id = 0;
				$this->db->where('LOWER(question_name)', strtolower($question['name']));
				$this->db->where('LOWER(question_description)', strtolower($question['desc']));
				$this->db->limit(1);
				$row = $this->db->get('rating_questions')->row_array();
				if ( ! empty($row))
				{
					$questions_id = $row['id'];
				}
				else
				{
					$data_array = array('question_name' => $question['name'],
										'question_description' => $question['desc']);
					$this->db->insert('rating_questions', $data_array);
					$questions_id = $this->db->insert_id();
				}
				
				$this->db->where('questions_id', $questions_id);
				$this->db->where('users_id', $this->session->userdata("id"));
				if ( ! $this->db->count_all_results('users_questions'))
				{
					$data_array = array('questions_id' => $questions_id,
										'users_id' => $this->session->userdata("id"));
					$this->db->insert('users_questions', $data_array);
				}
			}
		}
		
		function questions_ids_save($questions_ids)
		{
			if ($this->logged_in())
			{
				foreach ($questions_ids as $questions_id)
				{
					$this->db->where('questions_id', $questions_id);
					$this->db->where('users_id', $this->session->userdata("id"));
					if ( ! $this->db->count_all_results('users_questions'))
					{
						$data_array = array('questions_id' => $questions_id,
											'users_id' => $this->session->userdata("id"));
						$this->db->insert('users_questions', $data_array);
					}
				}
			}
		}
		
		function questions_remove($questions_id)
		{
			if ($this->logged_in())
			{
				$this->db->where('questions_id', $questions_id);
				$this->db->where('users_id', $this->session->userdata("id"));
				$this->db->delete('users_questions');
			}
		}
		
		function questions_edit($questions_id, $question)
		{
			if ($this->logged_in())
			{
				$this->questions_remove($questions_id);
				$this->questions_save($question);
			}
		}

		function get_users()
		{
			$this->db->order_by("username");
			$this->db->where("status", 1);
			$result = $this->db->get("users")->result_array();
			foreach ($result as $key => $row)
			{
				$time = time();
				$result[$key]['type'] = $time >= $row['activation'] && $time < $row['suspension'] ? 1 : ($time >= $row['suspension'] ? 2 : 0);
				$result[$key]['signup_str'] = ! empty($row['signup']) ? date("d-m-Y", $row['signup']) : "";
				$result[$key]['last_str'] = ! empty($row['last']) ? date("d-m-Y", $row['last']) : "Nog niet ingelogd";
				$result[$key]['activation_str'] = ! empty($row['activation']) ? date("d-m-Y", $row['activation']) : "";
				$result[$key]['suspension_str'] = ! empty($row['suspension']) ? date("d-m-Y", $row['suspension']) : "";
				
				$result[$key]['account_amount'] = $result[$key]['account_amount'] != '0.00' ? $result[$key]['account_amount'] : ($result[$key]['account_type'] == 0 ? $this->base_amount : $this->pro_amount);
				$result[$key]['doctors_amount'] = $result[$key]['doctors_amount'] != '0.00' ? $result[$key]['doctors_amount'] : $this->doctor_amount;
				$result[$key]['doctors_number'] = ! empty($result[$key]['doctors_number']) ? $result[$key]['doctors_number'] : $this->free_doctors_number;
				
				$info = $this->user_stat($row['id']);
				$result[$key]['last_login'] = $info['last_login'];
				$result[$key]['login_number'] = $info['login_number'];
				$result[$key]['sent_number'] = $info['sent_number'];
				$result[$key]['batche_number'] = $info['batche_number'];
			}
			return $result;
		}
		
		function user_stat($users_id)
		{
			if (empty($this->sessions))
			{
				$this->sessions = array();
				$result = $this->db->get("sessions")->result_array();
				foreach ($result as $row)
				{
					$this->sessions[$row['users_id']][] = $row['users_login'];
				}
			}
			
			if (empty($this->sents))
			{
				$this->sents = array();
				$this->db->where('status <>', 3);
				$result = $this->db->get("sent")->result_array();
				foreach ($result as $row)
				{
					$this->sents[$row['users_id']][] = $row;
				}
			}
			
			if (empty($this->batches))
			{
				$this->batches = array();
				$result = $this->db->get("sent_dates")->result_array();
				foreach ($result as $row)
				{
					$this->batches[$row['users_id']][] = $row;
				}
			}
			
			$items = array('last_login' => '----',
						   'login_number' => 0,
						   'sent_number' => 0,
						   'batche_number' => 0);
			if ( ! empty($this->sessions[$users_id]))
			{
				$items['last_login'] = date('d-m-Y', max($this->sessions[$users_id]));
				$items['login_number'] = count($this->sessions[$users_id]);
			}
			
			if ( ! empty($this->sents[$users_id]))
			{
				$items['sent_number'] = count($this->sents[$users_id]);
			}
			
			if ( ! empty($this->batches[$users_id]))
			{
				$items['batche_number'] = count($this->batches[$users_id]);
			}
			
			return $items;
		}

		function check_login_times()
		{
			if ($this->logged_in())
			{
				$this->db->where("id", $this->session->userdata("id"));
				//$this->db->where("login", 0);
				$this->db->limit(1);
				$row = $this->db->get("users")->row_array();
				
				$this->db->where("users_id", $this->session->userdata("id"));
				$check = $this->db->count_all_results("sent");
				return array("email" => ! $check ? $row['email'] : FALSE);
			}
			else
			{
				$this->errors[] = array("Error. Refresh this page and try again");
			}
		}
		
		function get_last_sent()
		{
			if ($this->logged_in())
			{
				$this->db->order_by("last", "desc");
				$this->db->where("users_id", $this->session->userdata("id"));
				$this->db->where("status <>", 3);
				$this->db->limit(1);
				$row = $this->db->get("sent")->row_array();
				return ! empty($row['date']) ? date("d-m-Y", $row['last']) : "";
			}
			else
			{
				$this->errors[] = array("Error. Refresh this page and try again");
			}
		}

		function login($post)
		{
			if (empty($post['email']))
			{
				$this->errors[] = array("U heeft geen e-mailadres ingevuld");
			}
			elseif (empty($post['password']))
			{
				$this->errors[] = array("U heeft geen wachtwoord ingevuld");
			}
			else
			{
				$password = crypt($post['password'], substr(md5($post['password']), 0, 8));
				$this->db->where("email", strtolower($post['email']));
				$this->db->where("password", $password);
				$this->db->limit(1);
				$row = $this->db->get("users")->row_array();

				if (empty($row))
				{
					$this->errors[] = array("Gebruikersnaam of wachtwoord onjuist");
				}
				else
				{
					if ($row['status'] != 2 && ! empty($row['mobile']) && ! empty($row['organization']) && ! empty($row['account_type']))
					{
						if ( ! empty($row['sms_blocked']))
						{
							$this->errors[] = array("Uw account is geblokkeerd. Neem contact op met de Patiëntenreview klantenservice.");
							return FALSE;
						}
						else
						{
							return $this->send_code($row['id'], $row['mobile']);
						}
					}
					else
					{
						return $this->set_login_session($row['id']);
					}
				}
			}
		}
		
		function code_resend()
		{
			if ($this->session->userdata('tfa_id'))
			{
				$this->db->where('id', $this->session->userdata('tfa_id'));
				$this->db->limit(1);
				$row = $this->db->get('users')->row_array();
				if ( ! empty($row['mobile']))
				{
					if ( ! empty($row['sms_blocked']))
					{
						$this->errors[] = array("Uw account is geblokkeerd. Neem contact op met de Patiëntenreview klantenservice.");
						return FALSE;
					}
					else
					{
						return $this->send_code($row['id'], $row['mobile']);
					}
				}
			}
			
			return FALSE;
		}
		
		function blocked_support()
		{
			if ($this->session->userdata('tfa_id'))
			{
				$this->db->where('id', $this->session->userdata('tfa_id'));
				$this->db->limit(1);
				$row = $this->db->get('users')->row_array();
				if ( ! empty($row['mobile']))
				{
					$row['domain'] = (( ! empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://").$_SERVER['HTTP_HOST'].'/';
					$message = $this->load->view('views/mail/tpl_blocked.html', $row, TRUE);

					$to = 'support@patientenreview.nl';
					$this->send("blocked", $to, 'Account van '.$row['username'].' is geblokkeerd', $message, 'Patiëntenreview', 'info@patientenreview.nl');
					return $this->real_send(array('blocked'), $this->db->insert_id());
				}
			}
			
			return FALSE;
		}
		
		function send_code($id = FALSE, $mobile = '')
		{
			if ( ! empty($mobile))
			{
				$mobile = str_replace(' ', '', $mobile);
				if (strpos($mobile, '06') === 0)
				{
					$mobile = substr_replace($mobile, '+316', 0, 2);
				}
			}
			
			mt_srand();
			$code = mt_rand(10000, 99999);
			$expire = time() + (15 * 60);
			
			$this->load->library('sms');
			if ($this->sms->message($mobile, $code, date('d-m-Y H:m', $expire)))
			{
				$this->session->set_userdata(array('tfa_id' => $id));
				
				$data_array = array('sms_code' => $code,
									'sms_expire' => $expire);
				$this->db->where('id', $id);
				if ($this->db->update('users', $data_array))
				{
					return TRUE;
				}
			}
			
			return FALSE;
		}
		
		function code_check($post)
		{
			$this->db->where('id', $this->session->userdata('tfa_id'));
			$this->db->limit(1);
			$row = $this->db->get('users')->row_array();
			if ( ! empty($row))
			{
				if ( ! empty($row['sms_blocked']))
				{
					$this->errors[] = array("Uw account is geblokkeerd. Neem contact op met de Patiëntenreview klantenservice.");
					return FALSE;
				}
				else
				{
					if ($post['code'] == $row['sms_code'])
					{
						if (time() <= $row['sms_expire'])
						{
							return $this->set_login_session();
						}
						else
						{
							$this->errors[] = array("SMS Code has expired");
						}
					}
					else
					{
						$data_array = array();
						$count = $row['sms_error_count'] + 1;
						if ($row['sms_error_date'] == 0 || $row['sms_error_date'] <= (time() - 24 * 3600))
						{
							$data_array = array('sms_error_date' => time(),
												'sms_error_count' => $count);
							$this->db->where('id', $this->session->userdata('tfa_id'));
							$this->db->update('users', $data_array);
							return array('count' => $count);
						}
						else
						{
							if ($count >= 3)
							{
								$data_array = array('sms_blocked' => TRUE,
													'sms_error_date' => 0,
													'sms_error_count' => 0);
								$this->db->where('id', $this->session->userdata('tfa_id'));
								$this->db->update('users', $data_array);
							}
							else
							{
								$data_array = array('sms_error_count' => $count);
								$this->db->where('id', $this->session->userdata('tfa_id'));
								$this->db->update('users', $data_array);
								return array('count' => $count);
							}
						}
					}
				}
			}
			
			return FALSE;
		}
		
		function set_login_session($id = FALSE)
		{
			$this->db->where("id", $id ? $id : $this->session->userdata('tfa_id'));
			$this->db->limit(1);
			$row = $this->db->get("users")->row_array();

			if ( ! empty($row))
			{
				$this->session->unset_userdata(array('tfa_id'));
				
				$now = time();
				if ($row['status'] != 2 && $now >= $row['suspension'] && $row['account'] != 2)
				{
					$this->db->where("id", $row['id']);
					$this->db->update("users", array("account" => 0, "account_stop" => 1));
				}
				
				if ($row['status'] != 2 && $now <= $row['suspension'] && $row['account'] == 0)
				{
					$this->db->where("id", $row['id']);
					$this->db->update("users", array("account" => 1, "account_stop" => 0));
				}

				$this->session->set_userdata(array("logged_in" => TRUE,
												   "id" => $row['id'],
												   "username" => $row['username'],
												   "email" => $row['email'],
												   "status" => $row['status'],
												   "login" => $row['now'],
												   "first" => (empty($row['login']) ? TRUE : FALSE)));
				

				if ($row['status'] == 2)
				{
					$this->session->set_userdata("admin_id", $row['id']);
				}

				if ($row['status'] != 2)
				{
					if ($row['admin_stop'])
					{
						$this->errors[] = array("Dit account is inactief. Neem contact met ons op om de toegang tot uw account te herstellen.");
					}
					else
					{
						$sessions_id = $now.'-'.$row['id'];
						$this->session->set_userdata(array("sessions_id" => $sessions_id));
						$this->db->insert("sessions", array("sessions_id" => $sessions_id, "users_id" => $row['id'], "users_login" => $now, "users_logout" => $now + 60));
						
						$row['first_time'] = empty($row['now']) ? TRUE : FALSE;
						
						$data_array = array("login" => $row['now'],
											"now" => $now,
											"average_last" => $row['average_now'],
											"average_online_last" => $row['average_online_now']);
											
						if ($row['first_time'])
						{
							$data_array['trial_end'] = $now + 30 * 24 * 3600;
						}

						$this->db->where("id", $row['id']);
						$this->db->update("users", $data_array);
						
						$data_array = array('users_id' => $row['id'],
											'ip_address' => $_SERVER['REMOTE_ADDR'],
											'user_agent' => $_SERVER['HTTP_USER_AGENT'],
											'date' => date('d-m-Y'),
											'time' => date('H:i:s'),
											'timestamp' => time());
						$this->db->insert('login_attempts', $data_array);
						
						if ($row['first_time'])
						{
							$this->db->where_in("type", array(0, 1));
							$result = $this->db->get("updates")->result_array();
							foreach ($result as $val)
							{
								$data_array = array("users_id" => $row['id'],
													"updates_id" => $val['id']);
								$this->db->insert("updates_users", $data_array);
							}
							
							$this->session->set_userdata(array("intro" => TRUE, "intro_step" => 1, "intro_online_step" => 0));
						}
					}
				}
				
				return $row;
			}
			
			return FALSE;
		}
		
		function login_as_user($post)
		{
			$this->session->set_userdata("id", $post['id']);
			return TRUE;
		}
		
		function logout_as_user()
		{
			$this->session->set_userdata("id", $this->session->userdata("admin_id"));
			return TRUE;
		}

		function logout()
		{
			if ($this->session->userdata("sessions_id"))
			{
				$this->db->where("sessions_id", $this->session->userdata("sessions_id"));
				$this->db->update("sessions", array("users_logout" => time()));
			}
			
			$this->session->unset_userdata(array("logged_in" => "",
												 "id" => "",
												 "sessions_id" => "",
												 "admin_id" => "",
												 "username" => "",
												 "email" => "",
												 "status" => "",
												 "login" => "",
												 "first" => ""));
			
			
			return TRUE;
		}
		
		function renew_logout()
		{
			if ($this->session->userdata("sessions_id"))
			{
				$this->db->where("sessions_id", $this->session->userdata("sessions_id"));
				$this->db->update("sessions", array("users_logout" => time() + 60));
			}
		}
		
		function intro_step($post)
		{
			$this->session->set_userdata("intro_step", $post['step']);
			$this->session->set_userdata("intro_online_step", $post['online_step']);
			
			if ( ! empty($post['user']))
			{
				$data_array = array("reminder_checked" => $post['user']['reminder_checked'],
									"reminder_period" => $post['user']['reminder_period'],
									"reminder_time" => $post['user']['reminder_time'],
									"reminder_day" => $post['user']['reminder_day'],
									"google_checked" => $post['user']['google_checked'],
									"google" => $post['user']['google'],
									"facebook_checked" => $post['user']['facebook_checked'],
									"facebook" => $post['user']['facebook'],
									"zorgkaart_checked" => $post['user']['zorgkaart_checked'],
									"zorgkaart" => $post['user']['zorgkaart'],
									"independer_checked" => $post['user']['independer_checked'],
									"independer" => $post['user']['independer'],
									"telefoonboek_checked" => $post['user']['telefoonboek_checked'],
									"telefoonboek" => $post['user']['telefoonboek'],
									"vergelijkmondzorg_checked" => $post['user']['vergelijkmondzorg_checked'],
									"vergelijkmondzorg" => $post['user']['vergelijkmondzorg'],
									"kliniekoverzicht_checked" => $post['user']['kliniekoverzicht_checked'],
									"kliniekoverzicht" => $post['user']['kliniekoverzicht'],
									"own_checked" => $post['user']['own_checked'],
									"own" => $post['user']['own'],
									"own_name" => $post['user']['own_name']);
									
				$this->db->where("id", $this->session->userdata("id"));
				$this->db->update("users", $data_array);
			}
		}
		
		function intro_close()
		{
			$this->session->unset_userdata(array("intro" => "", "intro_step" => "", "intro_online_step" => ""));
			
			if ( ! empty($post['user']))
			{
				$data_array = array("reminder_checked" => $post['user']['reminder_checked'],
									"reminder_period" => $post['user']['reminder_period'],
									"reminder_time" => $post['user']['reminder_time'],
									"reminder_day" => $post['user']['reminder_day'],
									"google_checked" => $post['user']['google_checked'],
									"google" => $post['user']['google'],
									"facebook_checked" => $post['user']['facebook_checked'],
									"facebook" => $post['user']['facebook'],
									"zorgkaart_checked" => $post['user']['zorgkaart_checked'],
									"zorgkaart" => $post['user']['zorgkaart'],
									"independer_checked" => $post['user']['independer_checked'],
									"independer" => $post['user']['independer'],
									"telefoonboek_checked" => $post['user']['telefoonboek_checked'],
									"telefoonboek" => $post['user']['telefoonboek'],
									"vergelijkmondzorg_checked" => $post['user']['vergelijkmondzorg_checked'],
									"vergelijkmondzorg" => $post['user']['vergelijkmondzorg'],
									"kliniekoverzicht_checked" => $post['user']['kliniekoverzicht_checked'],
									"kliniekoverzicht" => $post['user']['kliniekoverzicht'],
									"own_checked" => $post['user']['own_checked'],
									"own" => $post['user']['own'],
									"own_name" => $post['user']['own_name']);
									
				$this->db->where("id", $this->session->userdata("id"));
				$this->db->update("users", $data_array);
			}
		}
		
		function intro_open()
		{
			$this->session->set_userdata(array("intro" => TRUE, "intro_step" => 1, "intro_online_step" => 0));
		}

		function lock_screen()
		{
			$this->session->set_userdata("lock", TRUE);
		}

		function is_lock()
		{
			return $this->session->userdata("lock");
		}

		function unlock_screen($post)
		{
			if ($this->logged_in())
			{
				if (empty($post['password']))
				{
					$this->errors[] = array("U heeft geen wachtwoord ingevuld");
				}
				else
				{
					$password = crypt($post['password'], substr(md5($post['password']), 0, 8));
					$this->db->where("id", $this->session->userdata("id"));
					$this->db->where("password", $password);
					$this->db->limit(1);
					$row = $this->db->get("users")->row_array();

					if (empty($row))
					{
						$this->errors[] = array("Uw wachtwoord is onjuist");
					}
					else
					{
						$this->session->unset_userdata(array("lock" => ""));
						return TRUE;
					}
				}
			}
		}

		function reset_password($post)
		{
			if (empty($post['email']))
			{
				$this->errors[] = array("U heeft geen e-mailadres ingevuld");
			}
			else
			{
				$this->db->where("email", strtolower($post['email']));
				$this->db->limit(1);
				$row = $this->db->get("users")->row_array();

				if ( ! empty($row))
				{
					$time = time();
					$this->db->where("id", $row['id']);
					if ($this->db->update("users", array("reset" => $time)))
					{
						$post['hash'] = md5($row['id'].$time);
						$post['username'] = $row['username'];
						$post['color'] = empty($row['color']) ? "#0f75bc" : $row['color'];
						if ($this->send_reset($post))
						{
							$this->errors[] = array("Success" => "E-mail voor het herstellen van uw wachtwoord is verstuurd");
							return TRUE;
						}
						else
						{
							$this->errors[] = array("Warning" => "Password changed but letter wasn't send");
						}
					}
					else
					{
						$this->errors[] = array("Er is een verbindingsfout opgetreden");
					}
				}
				else
				{
					$this->errors[] = array("Dit e-mailadres is niet bij ons bekend");
				}
			}

			return FALSE;
		}
		
		function save_password($post)
		{
			if (empty($post['hash']))
			{
				$this->errors[] = array("De link voor het herstellen van uw wachtwoord is verlopen");
			}
			else
			{
				$this->db->where("MD5(CONCAT(id, reset)) =", $post['hash']);
				$this->db->limit(1);
				$row = $this->db->get("users")->row_array();

				if ( ! empty($row))
				{
					$password = crypt($post['password'], substr(md5($post['password']), 0, 8));
					$this->db->where("id", $row['id']);
					if ($this->db->update("users", array("password" => $password, "reset" => 0)))
					{
						$email_data['domain'] = (( ! empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://").$_SERVER['HTTP_HOST'].'/';
						$email_data['username'] = $row['username'];
						$message = $this->load->view('views/mail/tpl_password.html', $email_data, TRUE);
						$this->send("password", $row['email'], 'Uw wachtwoord is gewijzigd', $message, 'Patiëntenreview', 'no-reply@patientenreview.nl');

						return $this->login(array("email" => $row['email'], "password" => $post['password']));
					}
					else
					{
						$this->errors[] = array("Er is een verbindingsfout opgetreden");
					}
				}
				else
				{
					$this->errors[] = array("De link voor het herstellen van uw wachtwoord is verlopen");
				}
			}

			return FALSE;
		}
		
		function save_new_password($post)
		{
			if ($this->logged_in())
			{
				$this->db->where("id", $this->session->userdata('id'));
				$this->db->where("password", crypt($post['old'], substr(md5($post['old']), 0, 8)));
				$this->db->limit(1);
				$row = $this->db->get("users")->row_array();

				if ( ! empty($row))
				{
					$password = crypt($post['new'], substr(md5($post['new']), 0, 8));
					$this->db->where("id", $row['id']);
					if ($this->db->update("users", array("password" => $password)))
					{
						$email_data['domain'] = (( ! empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://").$_SERVER['HTTP_HOST'].'/';
						$email_data['username'] = $row['username'];
						$message = $this->load->view('views/mail/tpl_password.html', $email_data, TRUE);
						$this->send("password", $row['email'], 'Uw wachtwoord is gewijzigd', $message, 'Patiëntenreview', 'no-reply@patientenreview.nl');
			
						$this->errors[] = array("Success" => "Password was changed");
						return TRUE;
					}
					else
					{
						$this->errors[] = array("Er is een verbindingsfout opgetreden");
					}
				}
				else
				{
					$this->errors[] = array("The old password is wrong");
				}
			}

			return FALSE;
		}

		function first_login_save($post)
		{
			if ($this->logged_in())
			{
				$data_array = array("username" => $post['username'],
									"phone" => $post['phone'],
									"facebook_checked" => ( ! empty($post['facebook'])),
									"facebook" => $post['facebook'],
									"zorgkaart_checked" => ( ! empty($post['zorgkaart'])),
									"zorgkaart" => $post['zorgkaart'],
									"google_checked" => ( ! empty($post['google'])),
									"google" => $post['google'],
									"account" => 2,
									"account_stop" => 0,
									"trial_end" => time() + (30 * 24 * 3600));

				$this->db->where("id", $this->session->userdata("id"));
				if ($this->db->update("users", $data_array))
				{
					return TRUE;
				}
				else
				{
					$this->errors[] = array("Er is een verbindingsfout opgetreden");
				}
			}
			else
			{
				$this->errors[] = array("Error. Refresh this page and try again");
			}
		}
		
		function check_updates()
		{
			$updates = array();
			if ($this->logged_in() && ! $this->session->userdata("admin_id"))
			{
				$this->db->where("users_id", $this->session->userdata("id"));
				$result = $this->db->get("updates_users")->result_array();
				$saw = array();
				foreach ($result as $row)
				{
					$saw[] = $row['updates_id'];
				}

				$this->db->order_by("id asc");
				$this->db->where_in("type", array(0, 1));
				$result = $this->db->get("updates")->result_array();
				foreach ($result as $row)
				{
					if ( ! in_array($row['id'], $saw))
					{
						$data_array = array("users_id" => $this->session->userdata("id"),
											"updates_id" => $row['id']);
						$this->db->insert("updates_users", $data_array);
						
						$updates[$row['type']][] = $row;
					}
				}
			}
			
			return $updates;
		}

		function profile_save($post)
		{
			if ($this->logged_in())
			{
				if (empty($post['username']))
				{
					$this->errors[] = array("Geen bedrijfsnaam ingevuld");
				}
				elseif (empty($post['email']))
				{
					$this->errors[] = array("Geen e-mailadres ingevuld");
				}
				else
				{
					$this->db->where("id <>", $this->session->userdata("id"));
					$this->db->where("email", strtolower($post['email']));
					$this->db->limit(1);
					if ($this->db->count_all_results("users"))
					{
						$this->errors[] = array("Dit e-mailadres is al in gebruik");
					}
					else
					{
						$check = TRUE;
						if ($post['short_checked'] && ! empty($post['short']))
						{
							$this->db->where("short", $post['short']);
							$this->db->where("id <>", $this->session->userdata("id"));
							$this->db->limit(1);
							if ($this->db->count_all_results("users"))
							{
								$check = FALSE;
							}
							else
							{
								$this->db->where("short", $post['short']);
								$this->db->limit(1);
								if ($this->db->count_all_results("doctors"))
								{
									$check = FALSE;
								}
								else
								{
									if (in_array($post['short'], $this->reserved))
									{
										$check = FALSE;
									}
								}
							}
						}
						
						if ($check)
						{
							$data_array = array("username" => $post['username'],
												"email" => $post['email'],
												"email_reply" => $post['email_reply'],
												"phone" => $post['phone'],
												"mobile" => $post['mobile'],
												"address" => $post['address'],
												"postcode" => $post['postcode'],
												"city" => $post['city'],
												"emails_skip" => $post['emails_skip'],
												"patients_reminder" => $post['patients_reminder'],
												"reminder_checked" => $post['reminder_checked'],
												"reminder_period" => $post['reminder_period'],
												"reminder_time" => $post['reminder_time'] / 1000,
												"reminder_day" => $post['reminder_day'],
												"facebook_checked" => $post['facebook_checked'],
												"facebook" => $post['facebook'],
												"zorgkaart_checked" => $post['zorgkaart_checked'],
												"zorgkaart" => $post['zorgkaart'],
												"google_checked" => $post['google_checked'],
												"google" => $post['google'],
												"color" => $post['color'],
												"promo_checked" => $post['promo_checked'],
												"short_checked" => $post['short_checked'],
												"short" => strtolower($post['short']),
												"stars_type" => $post['stars_type'],
												"stars_text" => $post['stars_text'],
												"rating_questions" => $post['rating_questions']);

							if ( ! empty($post['color']))
							{
								if ( ! file_exists($path = "./colors/".$this->session->userdata("id")."/"))
								{
									mkdir($path, 0775, TRUE);
								}
								
								$css = $this->load->view("color-tpl.css", array("color" => $post['color'], "color_d" => $this->darken_color($post['color'])), TRUE);
								file_put_contents($path."color.css", $css);
							}
							else
							{
								if (file_exists($path = "./colors/".$this->session->userdata("id")."/color.css"))
								{
									unlink($path);
								}
							}

							if ( ! empty($post['new_logo']) || ! empty($post['remove_logo']))
							{
								$this->db->where("id", $this->session->userdata("id"));
								$this->db->limit(1);
								$row = $this->db->get("users")->row_array();

								if ( ! empty($row['logo']))
								{
									unlink($row['logo']);
									$data_array['logo'] = '';
								}

								if ( ! empty($post['new_logo']))
								{
									$source = './logos/tmp/'.$post['new_logo'];
									$dest = './logos/'.$post['new_logo'];
									if (rename($source, $dest))
									{
										$data_array['logo'] = $dest;
										delete_files('./logos/tmp/');
									}
								}
							}

							$this->db->where("id", $this->session->userdata("id"));
							if ($this->db->update("users", $data_array))
							{
								$post['emails']['users_id'] = $this->session->userdata("id");
								$this->db->where("users_id", $this->session->userdata("id"));
								if ($this->db->count_all_results("emails"))
								{
									$this->db->where("users_id", $this->session->userdata("id"));
									$this->db->update("emails", $post['emails']);
								}
								else
								{
									$this->db->insert("emails", $post['emails']);
								}
								
								if ( ! empty($post['widget']))
								{
									$this->widget_save($post['widget']);
								}
								
								$this->errors[] = array("Success" => "Uw instellingen zijn bijgewerkt.");
								return TRUE;
							}
							else
							{
								$this->errors[] = array("Database error");
							}
						}
						else
						{
							$this->errors[] = array("URL already exists");
						}
					}
				}
			}
			else
			{
				$this->errors[] = array("Error. Refresh this page and try again");
			}
		}
		
		function widget_save($post)
		{
			$post['users_id'] = $this->session->userdata("id");
			$id = FALSE;
			if (empty($post['widgets_id']))
			{
				$this->db->insert("widgets", $post);
				$id = $this->db->insert_id();
			}
			else
			{
				$this->db->where("widgets_id", $post['widgets_id']);
				$this->db->update("widgets", $post);
				$id = $post['widgets_id'];
			}
			
			return md5($post['users_id'].$id);
		}
		
		function widget($hash)
		{
			$this->db->where('MD5(CONCAT(users_id,widgets_id)) =', $hash);
			$this->db->limit(1);
			$row = $this->db->get("widgets")->row_array();
			
			$row['pro'] = FALSE;
			$row['short'] = FALSE;
			if ( ! empty($row['users_id']))
			{
				$this->db->where('id', $row['users_id']);
				$this->db->limit(1);
				$val = $this->db->get("users")->row_array();
				
				if ( ! empty($val))
				{
					$row['pro'] = $val['account'] == 2 || $val['account'] == 1 && $val['account_type'] == 1;
					$row['short'] = $val['short_checked'] && ! empty($val['short']) ? $val['short'] : $row['short'];
					$row['widgets_color'] = $val['color'];
				}
			}
			
			return $row;
		}
		
		function darken_color($rgb, $darker = 1.3)
		{
			$hash = (strpos($rgb, '#') !== false) ? '#' : '';
			$rgb = (strlen($rgb) == 7) ? str_replace('#', '', $rgb) : ((strlen($rgb) == 6) ? $rgb : false);
			if (strlen($rgb) != 6) return $hash.'000000';
			$darker = ($darker > 1) ? $darker : 1;

			list($R16,$G16,$B16) = str_split($rgb,2);

			$R = sprintf("%02X", floor(hexdec($R16)/$darker));
			$G = sprintf("%02X", floor(hexdec($G16)/$darker));
			$B = sprintf("%02X", floor(hexdec($B16)/$darker));

			return $hash.$R.$G.$B;
		}

		function change_times($post)
		{
			$this->db->where("id", $post['id']);
			if ($this->db->update("users", array('activation' => $post['activation'], 'suspension' => $post['suspension'])))
			{
				$this->errors[] = array("Success" => "Abonnement gewijzigd.");
				return TRUE;
			}
			else
			{
				$this->errors[] = array("Database error");
			}
		}
		
		function change_user($user)
		{
			$data_array = array('account_type' => $user['account_type'],
								'organization' => $user['organization'],
								'activation' => $user['activation'],
								'suspension' => $user['suspension'],
								'account_amount' => $user['account_amount'],
								'doctors_amount' => $user['doctors_amount'],
								'doctors_number' => $user['doctors_number']);
								
			$this->db->where("id", $user['id']);
			if ($this->db->update("users", $data_array))
			{
				$now = time();
				$data_array = array();
				if ($now >= $user['suspension'])
				{
					$data_array = array("account" => 0,
										"account_stop" => 1);
				}
				else
				{
					if ($now <= $user['suspension'])
					{
						$data_array = array("account" => 1,
											"account_stop" => 0);
					}
				}
				
				if ( ! empty($data_array))
				{
					$this->db->where("id", $user['id']);
					$this->db->update("users", $data_array);
				}
					
				$this->errors[] = array("Success" => "Abonnement gewijzigd.");
				return TRUE;
			}
			else
			{
				$this->errors[] = array("Database error");
			}
		}

		function remove_user($post)
		{
			$this->db->where("id", $post['id']);
			if ($this->db->update("users", array('admin_stop' => $post['action'])))
			{
				$this->errors[] = array("Success" => "Abonnement stopgezet");
				return TRUE;
			}
			else
			{
				$this->errors[] = array("Database error");
			}
		}

		function delete_user($post)
		{
			$this->db->where("id", $post['id']);
			if ($this->db->delete("users"))
			{
				$this->db->where("users_id", $post['id']);
				if ($this->db->delete("sent"))
				{
					$this->errors[] = array("Success" => "Gebruiker verwijderd");
					return TRUE;
				}
				else
				{
					$this->errors[] = array("Database error");
				}
			}
			else
			{
				$this->errors[] = array("Database error");
			}
		}
		
		function change_trial($post)
		{
			$this->db->where("id", $post['id']);
			$this->db->update("users", array("trial_end" => time() + 30 * 24 * 3600));
			$this->errors[] = array("Success" => "Proefperiode verlengd met 30 dagen");
		}
		
		function suspend_account()
		{
			if ($this->logged_in())
			{
				$users_id = $this->session->userdata("id");

				$this->db->where("users_id", $users_id);
				$this->db->delete("doctors");
				
				$this->db->where("users_id", $users_id);
				$this->db->delete("doctors_pay");
				
				$this->db->where("users_id", $users_id);
				$this->db->delete("emails");
				
				$this->db->where("users_id", $users_id);
				$this->db->delete("invoices");

				$this->db->where("users_id", $users_id);
				$this->db->delete("sent");
				
				$this->db->where("users_id", $users_id);
				$this->db->delete("updates_users");
				
				$this->db->where("id", $users_id);
				$this->db->delete("users");
				
				$this->logout();
				
				$this->session->set_userdata("show_suspend_popup", TRUE);
				$this->errors[] = array("Success" => "Gebruiker verwijderd");
				return TRUE;
			}
			
			return FALSE;
		}

		function sites($post)
		{
			$this->db->where("id", $post['id']);
			if ($this->db->update("users", array('sites' => $post['checked'])))
			{
				return TRUE;
			}
			else
			{
				$this->errors[] = array("Database error");
			}
		}

		function signup($post)
		{
			if (empty($post['username']))
			{
				$this->errors[] = array("Empty username");
			}
			elseif (empty($post['email']))
			{
				$this->errors[] = array("Empty email");
			}
			else
			{
				$this->db->where("email", strtolower($post['email']));
				$this->db->limit(1);
				if ($this->db->count_all_results("users"))
				{
					$this->errors[] = array("Email already use by another user");
				}
				else
				{
					$post['password'] = substr(md5($post['email'].time()), 0, 10);
					$data_array = $post;
					$data_array['password'] = crypt($post['password'], substr(md5($post['password']), 0, 8));
					$data_array['status'] = 1;
					$data_array['signup'] = time();
					$data_array['suspension'] = $data_array['activation'] + $this->period * 24 * 3600;
					$data_array['trial_end'] = $data_array['suspension'];
					$data_array['account'] = 2;
					$data_array['stars_type'] = 0;
					unset($data_array['suspension_str']);

					$post['end_date'] = date("d-m-Y", ! empty($data_array['trial_end']) ? $data_array['trial_end'] : $data_array['suspension']);

					if ($this->db->insert("users", $data_array))
					{
						$post['color'] = "#0f75bc";
						
						$this->errors[] = array("Success" => "Nieuw abonnement toegevoegd.");
						return $this->send_signup($post);
					}
					else
					{
						$this->errors[] = array("Database error");
					}
				}
			}
		}

		function trial($post)
		{
			if (empty($post['UserCompanyName']))
			{
				$this->errors[] = array("We hebben een praktijknaam nodig voordat u aan de slag kunt gaan!");
			}
			elseif (empty($post['UserEmailadress']))
			{
				$this->errors[] = array("Vul alstublieft een e-mailadres in");
			}
			elseif (empty($post['UserPassword']))
			{
				$this->errors[] = array("Kies alstublieft een wachtwoord!");
			}
			else
			{
				$this->db->where("email", strtolower($post['UserEmailadress']));
				$this->db->limit(1);
				if ($this->db->count_all_results("users"))
				{
					$this->errors[] = array("Er is al een account geregistreerd met dit e-mailadres.");
				}
				else
				{
					$data_array = array("username" => $post['UserCompanyName'],
										"email" => $post['UserEmailadress'],
										"address" => $post['UserStreet'].' '.$post['UserStreetNo'],
										"postcode" => $post['UserPostalCode'],
										"city" => $post['UserCity']);
					$data_array['password'] = crypt($post['UserPassword'], substr(md5($post['UserPassword']), 0, 8));
					$data_array['status'] = 1;
					$data_array['signup'] = time();
					$data_array['activation'] = mktime(0, 0, 0, date('m'), date('j'), date('Y'));
					$data_array['suspension'] = $data_array['activation'] + $this->period * 24 * 3600;
					$data_array['trial_end'] = $data_array['suspension'];
					$data_array['reminder_checked'] = TRUE;
					$data_array['reminder_period'] = 0;
					$data_array['reminder_time'] = 2703600;
					$data_array['reminder_day'] = 2;
					$data_array['stars_type'] = 0;

					$send = array();
					$send['username'] = $post['UserCompanyName'];
					$send['email'] = $post['UserEmailadress'];
					$send['password'] = $post['UserPassword'];
					$send['end_date'] = date("d-m-Y", ! empty($data_array['trial_end']) ? $data_array['trial_end'] : $data_array['suspension']);

					if ($this->db->insert("users", $data_array))
					{
						$this->errors[] = array("Success" => "You was successfully signed up");
						return $this->send_trial($send);
					}
					else
					{
						$this->errors[] = array("Database error");
					}
				}
			}
		}

		function vote($post)
		{
			$this->db->where("id", $post['id']);
			$this->db->where("start >=", time() - 7200);
			if ($this->db->count_all_results('sent') || $post['id'] == 0)
			{
				if (empty($post['id']))
				{
					$data_array = array('users_id' => $post['users_id'],
										'doctor' => $post['doctors_id'],
										'stars' => $post['stars'],
										'status' => 2,
										'start' => time(),
										'date' => time(),
										'last' => time(),
										'ip' => $_SERVER['REMOTE_ADDR']);
					if ($this->db->insert("sent", $data_array))
					{
						$post['id'] = $this->db->insert_id();
						$post['last'] = $data_array['last'];
						$post['last_date'] = date("d-m-Y", $post['last'] + 48 * 3600);
						$post['last_time'] = date("H:i", $post['last'] + 48 * 3600);
				
						$this->errors[] = array("Success" => "Uw beoordeling is gewijzigd");
						return $post;
					}
					else
					{
						$this->errors[] = array("Database error");
					}
				}
				else
				{
					$this->db->where("id", $post['id']);
					if ($this->db->update("sent", array('stars' => $post['stars'], 'status' => 2, 'last' => time())))
					{
						$this->errors[] = array("Success" => "Uw beoordeling is gewijzigd");
						$post['last'] = time();
						$post['last_date'] = date("d-m-Y", $post['last'] + 48 * 3600);
						$post['last_time'] = date("H:i", $post['last'] + 48 * 3600);
						return $post;
					}
					else
					{
						$this->errors[] = array("Database error");
					}
				}
			}
			else
			{
				$this->errors[] = array("U kunt uw beoordeling niet meer wijzigen.");
			}

			return FALSE;
		}
		
		function vote_questions($post)
		{
			$this->db->where("id", $post['id']);
			$this->db->where("start >=", time() - 7200);
			$this->db->limit(1);
			$row = $this->db->get('sent')->row_array();
			if ( ! empty($row) || $post['id'] == 0)
			{
				if (empty($post['id']))
				{
					$data_array = array('users_id' => $post['users_id'],
										'doctor' => $post['doctors_id'],
										'stars' => $row['questions_id'] == $post['questions_id'] ? $post['stars'] : $row['stars'],
										'status' => 2,
										'start' => time(),
										'date' => time(),
										'last' => time(),
										'ip' => $_SERVER['REMOTE_ADDR']);
					if ($this->db->insert("sent", $data_array))
					{
						$post['id'] = $this->db->insert_id();
						$post['last'] = $data_array['last'];
						$post['last_date'] = date("d-m-Y", $post['last'] + 48 * 3600);
						$post['last_time'] = date("H:i", $post['last'] + 48 * 3600);
						
						$data_array = array('sent_id' => $post['id'],
											'users_id' => $post['users_id'],
											'questions_id' => $post['questions_id'],
											'stars' => $post['stars'],
											'date' => time());
						$this->db->insert('sent_questions', $data_array);
				
						$this->errors[] = array("Success" => "Uw beoordeling is gewijzigd");
						return $post;
					}
					else
					{
						$this->errors[] = array("Database error");
					}
				}
				else
				{
					$this->db->where("id", $post['id']);
					if ($this->db->update("sent", array('stars' => $row['questions_id'] == $post['questions_id'] ? $post['stars'] : $row['stars'], 'status' => 2, 'last' => time())))
					{
						$this->errors[] = array("Success" => "Uw beoordeling is gewijzigd");
						$post['last'] = time();
						$post['last_date'] = date("d-m-Y", $post['last'] + 48 * 3600);
						$post['last_time'] = date("H:i", $post['last'] + 48 * 3600);
						
						$data_array = array('sent_id' => $post['id'],
											'users_id' => $post['users_id'],
											'questions_id' => $post['questions_id'],
											'stars' => $post['stars'],
											'date' => time());

						$this->db->where('sent_id', $post['id']);
						$this->db->where('questions_id', $post['questions_id']);
						if ($this->db->count_all_results('sent_questions'))
						{
							$this->db->where('sent_id', $post['id']);
							$this->db->where('questions_id', $post['questions_id']);
							$this->db->update('sent_questions', $data_array);
						}
						else
						{
							$this->db->insert('sent_questions', $data_array);
						}
						
						return $post;
					}
					else
					{
						$this->errors[] = array("Database error");
					}
				}
			}
			else
			{
				$this->errors[] = array("U kunt uw beoordeling niet meer wijzigen.");
			}

			return FALSE;
		}
		
		function vote_doc($post)
		{
			$this->db->where("id", $post['id']);
			$this->db->where("start >=", time() - 7200);
			if ($this->db->count_all_results('sent') || $post['id'] == 0)
			{
				if (empty($post['id']))
				{
					$data_array = array('users_id' => $post['users_id'],
										'doctor' => $post['doctors_id'],
										'start' => time(),
										'date' => time(),
										'last' => time(),
										'ip' => $_SERVER['REMOTE_ADDR']);
					if ($this->db->insert("sent", $data_array))
					{
						$post['id'] = $this->db->insert_id();
						$post['last'] = $data_array['last'];
						$post['last_date'] = date("d-m-Y", $post['last'] + 48 * 3600);
						$post['last_time'] = date("H:i", $post['last'] + 48 * 3600);
						$post['doctor'] = $this->doctor_info($post['doctors_id']);
						return $post;
					}
				}
				else
				{
					$this->db->where("id", $post['id']);
					if ($this->db->update("sent", array('doctor' => $post['doctors_id'], 'last' => time())))
					{
						$post['last'] = time();
						$post['last_date'] = date("d-m-Y", $post['last'] + 48 * 3600);
						$post['last_time'] = date("H:i", $post['last'] + 48 * 3600);
						$post['doctor'] = $this->doctor_info($post['doctors_id']);
						return $post;
					}
				}
			}

			return FALSE;
		}
		
		function vote_loc($post)
		{
			$this->db->where("id", $post['id']);
			$this->db->where("start >=", time() - 7200);
			if ($this->db->count_all_results('sent') || $post['id'] == 0)
			{
				if (empty($post['id']))
				{
					$data_array = array('users_id' => $post['users_id'],
										'location' => $post['locations_id'],
										'start' => time(),
										'date' => time(),
										'last' => time(),
										'ip' => $_SERVER['REMOTE_ADDR']);
					if ($this->db->insert("sent", $data_array))
					{
						$post['id'] = $this->db->insert_id();
						$post['last'] = $data_array['last'];
						$post['last_date'] = date("d-m-Y", $post['last'] + 48 * 3600);
						$post['last_time'] = date("H:i", $post['last'] + 48 * 3600);
						$post['location'] = $this->location_info($post['locations_id']);
						return $post;
					}
				}
				else
				{
					$this->db->where("id", $post['id']);
					if ($this->db->update("sent", array('location' => $post['locations_id'], 'last' => time())))
					{
						$post['last'] = time();
						$post['last_date'] = date("d-m-Y", $post['last'] + 48 * 3600);
						$post['last_time'] = date("H:i", $post['last'] + 48 * 3600);
						$post['location'] = $this->location_info($post['locations_id']);
						return $post;
					}
				}
			}

			return FALSE;
		}

		function feedback($post)
		{
			if (empty($post['id']))
			{
				$data_array = array('users_id' => $post['users_id'],
									'doctor' => $post['doctors_id'],
									'feedback' => $post['feedback'],
									'start' => time(),
									'date' => time(),
									'last' => time(),
									'ip' => $_SERVER['REMOTE_ADDR']);
				if ($this->db->insert("sent", $data_array))
				{
					$post['id'] = $this->db->insert_id();
					$post['last'] = $data_array['last'];
					$post['last_date'] = date("d-m-Y", $post['last'] + 48 * 3600);
					$post['last_time'] = date("H:i", $post['last'] + 48 * 3600);
						
					$this->errors[] = array("Success" => "Feedback verstuurd.");
					return $post;
				}
				else
				{
					$this->errors[] = array("Database error");
				}
			}
			else
			{
				$data_array = array('feedback' => $post['feedback'],
									'status' => 2,
									'last' => time());
									
				if ( ! empty($post['anonymus']))
				{
					$data_array['title'] = '';
					$data_array['name'] = '';
					$data_array['sname'] = '';
					$data_array['email'] = '';
				}
				
				$this->db->where("id", $post['id']);
				if ($this->db->update("sent", $data_array))
				{
					$post['last'] = $data_array['last'];
					$post['last_date'] = date("d-m-Y", $post['last'] + 48 * 3600);
					$post['last_time'] = date("H:i", $post['last'] + 48 * 3600);
					$this->errors[] = array("Success" => "Feedback verstuurd.");
					return $post;
				}
				else
				{
					$this->errors[] = array("Database error");
				}
			}
		}

		function parse_xls($file, $first = FALSE, $name = FALSE)
		{
			if ( ! file_exists($path = "./tmp/".$this->session->userdata("id")."/"))
			{
				mkdir($path, 0755, TRUE);
			}
			
			if ($first)
			{
				$this->load->helper("file");
				delete_files($path);
			}
			
			$result = array();
			mt_srand();
			$ext = pathinfo($name, PATHINFO_EXTENSION);
			$dest = $path.time().mt_rand(100, 999).".".$ext;
			if (copy($file, $dest))
			{
				$rows = array();
				if ($ext == 'tab')
				{
					$fp = fopen($dest, 'r');
					while ( ! feof($fp))
					{
						$line = fgets($fp);
						$data = str_getcsv($line, "\t");
						$rows[] = $data;
					}                              
					fclose($fp);
				}
				elseif ($ext == 'csv')
				{
					$this->load->library('csv');
					$obj = $this->csv->load($dest);
					$rows = $this->csv->rows($obj);
				}
				else
				{	
					$this->load->library('excel');
					$obj = $this->excel->load($dest);
					$rows = $this->excel->rows($obj);
				}
				
				if ( ! empty($rows))
				{
					/*$this->db->where('id', $this->session->userdata('id'));
					$this->db->limit(1);
					$user = $this->db->get('users')->row_array();
					if ( ! empty($user) && $user['account'] == 2)
					{
						if (count($rows) > 101)
						{
							$this->errors[] = array("Met een trial account kunt u maximaal 100 uitnodigingen per dag versturen.");
							$result['error'] = TRUE;
							return $result;
						}
						else
						{
							$today = mktime(0, 0, 0, date('n'), date('j'), date('Y'));
							$this->db->where('date >=', $today);
							$this->db->where('status <>', 3);
							if (($this->db->count_all_results('sent') + count($rows)) > 101)
							{
								$this->errors[] = array("Met een trial account kunt u maximaal 100 uitnodigingen per dag versturen.");
								$result['error'] = TRUE;
								return $result;
							}
						}
					}*/

					$result = $this->parse($rows, $dest);
				}
				else
				{
					$result['error'] = TRUE;
				}
			}

			return $result;
		}
		
		function parse_paste($post)
		{
			if ( ! file_exists($path = "./tmp/".$this->session->userdata("id")."/"))
			{
				mkdir($path, 0755, TRUE);
			}

			$result = array();
			mt_srand();
			$dest = $path.time().mt_rand(100, 999).".tmp";
			if (file_put_contents($dest, $post['text']))
			{
				$rows = array();
				$list = explode("\n", $post['text']);
				foreach ($list as $key => $row)
				{
					if ($key == 0)
					{
						$count = count(explode("\t", $row));
						if ( ! empty($count))
						{
							$row_0 = array();
							for ($i = 1; $i <= $count; $i++)
							{
								$row_0[] = '#'.$i;
							}
							$rows[] = $row_0;
						}
					}

					$rows[] = explode("\t", $row);
				}
				
				if ( ! empty($rows))
				{
					$result = $this->parse($rows, $dest);
				}
				else
				{
					$result['error'] = TRUE;
				}
			}
			
			return $result;
		}
		
		function parse($rows, $file = '')
		{
			$tags_required = $this->get_emails_tags();
			$tags = array('title', 'name', 'sname', 'email', 'birth', 'doctor', 'treatment');
			$fields = array('title' => 'Aanhef Patiënt',
							'name' => 'Voornaam Patiënt',
							'sname' => 'Achternaam Patiënt',
							'email' => 'E-mailadres',
							'birth' => 'Leeftijd',
							'doctor' => 'Zorgverlenernummer',
							'treatment' => 'Behandeling');
			$users_fields = $this->get_users_fields();
			
			$this->db->where("id", $this->session->userdata('id'));
			$this->db->limit(1);
			$users = $this->db->get("users")->row_array();
			if ( ! empty($users))
			{
				if ( ! empty($users['organization']) || $users['account'] == 2)
				{
					$tags[] = 'location';
					$fields['location'] = 'Locatie';
				}
			}
			
			$cols = array();
			$result = array('dont_use' => array(), 'file' => $file, 'headers' => array(), 'data' => array(), 'cols' => array(), 'cols_check' => array(), 'empty' => FALSE, 'check' => TRUE);
			
			$first = 0;
			$result['cols'] = $rows[0];
			foreach ($tags as $tag)
			{
				$col = FALSE;
				foreach ($rows[0] as $key => $row)
				{
					if ((isset($users_fields[$tag]) && strtolower(trim($row)) == $users_fields[$tag]) || (strtolower(trim($row)) == strtolower($fields[$tag]) && ! isset($users_fields[$tag])))
					{
						$col = $key;
					}
					
					if (strpos($row, '@') === FALSE)
					{
						$first = 1;
					}
				}

				$cols[$tag] = ($col !== FALSE) ? $col : FALSE;
				if ($cols[$tag] === FALSE)
				{
					$result['empty'] = TRUE;
					$result['cols_check'][$tag] = 0;
				}
				else
				{
					$result['cols_check'][$tag] = $result['cols'][$col];
				}
				$result['headers'][$tag] = $fields[$tag];
			}
			
			$result['cols'] = array_values($result['cols']);
			$unique = array();
			foreach ($result['cols'] as $val)
			{
				if ( ! empty($val))
				{
					if (in_array($val, $unique))
					{
						$val = $val.'[2]';
					}

					$unique[] = $val;
				}
			}
			$result['cols'] = $unique;
			if ( ! empty($cols))
			{
				setLocale(LC_CTYPE, 'nl_NL.UTF-8');
				$emails = array();
				$init_count = count($rows[0]);
				
				for ($i = $first, $count = count($rows); $i < $count; $i++)
				{
					if ($init_count == count($rows[$i]))
					{
						$line = array('error' => 0);
						
						foreach ($tags as $tag)
						{
							if ($tag != 'email' && ! in_array($tag, $tags_required))
							{
								$result['dont_use'][$tag] = TRUE;
							}
							
							if ($cols[$tag] !== FALSE)
							{
								$line[$tag] = empty($rows[$i][$cols[$tag]]) ? '' : $rows[$i][$cols[$tag]];
								if ($tag == 'doctor')
								{
									$line['doctor_id'] = $this->get_doctors_id(strtolower($line[$tag]));
								}
								
								if ($tag == 'location')
								{
									$line['location_id'] = $this->get_locations_id(strtolower($line[$tag]));
								}
								
								if ($tag == 'email')
								{
									$email = strtolower($line[$tag]);
									if (filter_var($email, FILTER_VALIDATE_EMAIL))
									{
										if (in_array($email, $emails) && $line['error'] < 2)
										{
											$line['error'] = 1;
											$result['check'] = FALSE;
										}
										
										if ( ! empty($users['emails_skip']))
										{
											$from = time() - ($users['emails_skip'] == 1 ? 7 : ($users['emails_skip'] == 2 ? 30 : 90)) * 24 * 3600;
											$this->db->where('email', $email);
											$this->db->where('date >=', $from);
											$this->db->limit(1);
											if ($this->db->count_all_results('sent') > 0)
											{
												$line['error'] = 3;
												$result['check'] = FALSE;
											}
										}
										
										$emails[] = $email;
									}
									else
									{
										$line[$tag] = '<b>!</b>';
										$line['error'] = 2;
										$result['check'] = FALSE;
									}
								}
								
								if ($tag == 'name' || $tag == 'sname')
								{
									if ( ! empty($line[$tag]) && ! ctype_alpha(str_replace(array(' ', '.', '-'), '', $line[$tag])))
									{
										$line[$tag] = '<b>!</b>';
										$line['error'] = 2;
										$result['check'] = FALSE;
									}
								}
								
								if ($tag == 'birth')
								{
									if ( ! empty($line[$tag]))
									{
										if (strpos($line[$tag], '/') !== FALSE || strpos($line[$tag], '-') !== FALSE)
										{
											$sep = (strpos($line[$tag], '/') ? '/' : '-');
											$temp = explode($sep, $line[$tag]);
											if (isset($temp[2]))
											{
												if ($temp[2] < 16)
												{
													$temp[2] += 2000;
												}
												elseif ($temp[2] > 16 && $temp[2] < 100)
												{
													$temp[2] += 1900;
												}
											}
											
											if (count($temp) != 3 || (count($temp) == 3 && ! checkdate($temp[1], $temp[0], $temp[2])))
											{
												$line[$tag] = '<b>!</b>';
											}
											else
											{
												$birth = mktime(0, 0, 0, $temp[1], $temp[0], $temp[2]);
												$age = date('Y') - date('Y', $birth);
												if (mktime(0, 0, 0, date('n'), date('j'), 2000) < mktime(0, 0, 0, date('n', $birth), date('j', $birth), 2000))
												{
													$age -= 1;
												}

												$line[$tag] = $age;
											}
										}
										else
										{
											if ( ! is_numeric($line[$tag]))
											{
												$line[$tag] = '<b>!</b>';
											}
										}
									}
									else
									{
										$line[$tag] = '<b>!</b>';
									}
								}
								
								if (empty($line[$tag]))
								{
									if (in_array($tag, $tags_required) || $tag == 'email')
									{
										$line['error'] = 2;
										$result['check'] = FALSE;
									}
									else
									{
										if ($tag == 'name' || $tag == 'sname')
										{
											$line[$tag] = '<b>!</b>';
										}
									}
								}
							}
							else
							{
								$line[$tag] = "";
								if (in_array($tag, $tags_required))
								{
									$line['error'] = 2;
								}
								
								if ($tag != 'treatment')
								{
									$result['check'] = FALSE;
								}
							}							
						}

						$result['data'][] = $line;
					}
				}
			}
			
			return $result;
		}
		
		function get_doctors_id($name)
		{
			$this->db->where('users_id', $this->session->userdata("id"));
			$this->db->where('doctors_name', $name);
			$this->db->limit(1);
			$row = $this->db->get('doctors_ids')->row_array();
			if ( ! empty($row))
			{
				return $row['doctors_id'];
			}
			
			return 0;
		}

		function save_doctors_ids($ids)
		{
			foreach ($ids as $name => $doc)
			{
				if ( ! empty($doc))
				{
					$data_array = array('users_id' => $this->session->userdata('id'),
										'doctors_id' => $doc['id'],
										'doctors_name' => strtolower($name));
					$this->db->insert('doctors_ids', $data_array);
				}
			}
		}
		
		function get_locations_id($name)
		{
			$this->db->where('users_id', $this->session->userdata("id"));
			$this->db->where('locations_name', $name);
			$this->db->limit(1);
			$row = $this->db->get('locations_ids')->row_array();
			if ( ! empty($row))
			{
				return $row['locations_id'];
			}
			
			return 0;
		}
		
		function save_locations_ids($ids)
		{
			foreach ($ids as $name => $location)
			{
				if ( ! empty($location))
				{
					$data_array = array('users_id' => $this->session->userdata('id'),
										'locations_id' => $location['id'],
										'locations_name' => strtolower($name));
					$this->db->insert('locations_ids', $data_array);
				}
			}
		}
		
		function save_field($post)
		{
			if ($this->logged_in())
			{
				$post['value'] = str_replace('[2]', '', $post['value']);
				$this->db->where("users_id", $this->session->userdata("id"));
				$this->db->where("field", $post['field']);
				$this->db->delete("sheet_variables");
				
				$data_array = array("users_id" => $this->session->userdata("id"),
									"field" => $post['field'],
									"users_field" => strtolower($post['value']));
				$this->db->insert("sheet_variables", $data_array);
			}
		}
		
		function upload_help($file)
		{
			$help_email = 'support@patientenreview.nl';
			//$help_email = 'id@div-art.com';
			
			$this->db->where("id", $this->session->userdata("id"));
			$this->db->limit(1);
			$row = $this->db->get("users")->row_array();
			
			$post['domain'] = (( ! empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://").$_SERVER['HTTP_HOST'].'/';
			$message = $this->load->view('views/mail/tpl_help.html', $post, TRUE);
			$attach = $file."&&".(($row['account'] == 1 && $row['account_type'] == 0) ? './excel-basis-tpl.xls' : './excel-tpl.xls');
			$this->send("help", $help_email, 'Hulpverzoek upload patiëntenbestand '.$row['username'], $message, 'Patiëntenreview', 'info@patientenreview.nl', $attach);
			$this->errors[] = array("Success" => "Support-verzoek verstuurd");
			return $this->real_send(array('help'), $this->db->insert_id());
		}
		
		function get_emails_tags()
		{
			if ($this->logged_in())
			{
				$requred = array();
				$texts = $this->user_emails();
				foreach ($texts as $text)
				{
					foreach ($this->tags as $key => $tag)
					{
						if (strpos($text, $tag) !== FALSE)
						{
							$requred[] = (strpos($key, 'doctor') !== FALSE) ? 'doctor' : $key;
						}
					}
				}

				$requred = array_unique($requred);
				return $requred;
			}
			
			return FALSE;
		}
		
		function get_users_fields()
		{
			$result = array();

			$this->db->where("users_id", $this->session->userdata("id"));
			$result = $this->db->get("sheet_variables")->result_array();
			if ( ! empty($result))
			{
				foreach ($result as $row)
				{
					$result[$row['field']] = $row['users_field'];
				}
			}
			
			return $result;
		}

		function today_emails($emails)
		{
			$e = array();
			foreach ($emails as $row)
			{
				$e[] = $row['email'];
			}

			$today = mktime(0, 0, 0, date("n"), date("j"), date("Y"));
			$this->db->where_in("email", $e);
			$this->db->where("users_id", $this->session->userdata("id"));
			$this->db->where("status >", 0);
			$this->db->where("status <>", 3);
			$this->db->where("date >=", $today);
			$this->db->where("date <", $today + 86400);
			$result = $this->db->get("sent")->result_array();

			$today_emails = array();
			foreach ($result as $row)
			{
				$today_emails[] = strtolower($row['email']);
			}

			$check = FALSE;
			foreach ($emails as $key => $row)
			{
				$today = in_array($row['email'], $today_emails);
				$emails[$key]['today'] = $today;

				if ($today)
				{
					$check = TRUE;
				}
			}

			if ($check)
			{
				$this->errors[] = array("modal" => "isToday.html");
			}

			return $emails;
		}

		function send_letters($post, $subject = "", $sent = FALSE)
		{
			if ( ! empty($post['emails']))
			{
				$batches_id = 0;
				if ( ! $sent)
				{
					$data_array = array("users_id" => $this->session->userdata("id"),
										"emails_amount" => count($post['emails']),
										"sent_date" => time());
					$this->db->insert("sent_dates", $data_array);
					$batches_id = $this->db->insert_id();
				}
				
				$users_id = $this->session->userdata("id");
				$this->db->where("id", $users_id);
				$this->db->limit(1);
				$row = $this->db->get("users")->row_array();
				
				$questions = array();
				$q_counter = 0;
				if ( ! empty($row['rating_questions']))
				{
					$questions_list = $this->pub->get_questions();
					$questions = $this->pub->user_questions($questions_list);
				}
				
				$error = TRUE;
				foreach ($post['emails'] as $list)
				{
					if ( ! empty($list['text']))
					{
						if ($sent)
						{
							$users_id = $list['users_id'];
							$this->db->where("id", $users_id);
							$this->db->where("patients_reminder", TRUE);
							$this->db->limit(1);
							$row = $this->db->get("users")->row_array();

							$email = strtolower($list['text']);
							$this->db->where("email", $email);
							if ( ! $this->db->count_all_results("unsubscribes"))
							{							$email_data['domain'] = (( ! empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://").$_SERVER['HTTP_HOST'].'/';
								$email_data['logo'] = ( ! empty($row['logo']) ? str_replace('./', '', $row['logo']) : 'application/views/images/logo_full.png');
								$email_data['username'] = $row['username'];
								$email_data['id'] = md5($row['id']);
								$email_data['color'] = empty($row['color']) ? "#0f75bc" : $row['color'];
								$email_data['account_type'] = $row['account_type'];
								$email_data['account'] = $row['account'];
								$email_data['promo_checked'] = $row['promo_checked'];
								$email_data['sent_id'] = $list['id'];
								$email_data['reminder_date'] = $list['reminder_date'];
								$email_data['stars_type'] = $row['stars_type'];
								$email_data['stars_text'] = $row['stars_text'];
								$email_data['texts'] = $this->get_emails_texts($row, $list);
								
								$message = $this->load->view('views/mail/tpl_feedback.html', $email_data, TRUE);

								$subject = (empty($subject) ? $email_data['texts']['subject'] : $subject);
								if ( ! $this->send("mailing", $list['text'], $subject, $message, $row['username'], 'no-reply@patientenreview.nl'))
								{
									$error = FALSE;
									$this->errors[] = array("Warning" => "Wasn't send to ".$list['text']);
								}
							}
						}
						else
						{
							if ( ! empty($row))
							{
								$email = strtolower($list['text']);
								$this->db->where("email", $email);
								if ( ! $this->db->count_all_results("unsubscribes"))
								{
									$questions_info = array();
									if (count($questions))
									{
										$questions_info = $questions[$q_counter];
										$q_counter = ($q_counter + 1) >= count($questions) ? 0 : ($q_counter + 1);
									}

									$email_data = array('domain' => (( ! empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://").$_SERVER['HTTP_HOST'].'/',
														'logo' => ( ! empty($row['logo']) ? str_replace('./', '', $row['logo']) : 'application/views/images/logo_full.png'),
														'username' => $row['username'],
														'id' => md5($row['id']),
														'color' => empty($row['color']) ? "#0f75bc" : $row['color'],
														'account_type' => $row['account_type'],
														'account' => $row['account'],
														'questions_info' => $questions_info);

									$data_array = array("users_id" => $this->session->userdata("id"),
														"questions_id" => empty($questions_info) ? 0 : $questions_info['id'],
														"batches_id" => $batches_id,
														"title" => ( ! empty($list['title']) && ! empty($post['column']['title'])) ? $list['title'] : "",
														"name" => ( ! empty($list['name']) && ! empty($post['column']['name'])) ? $list['name'] : "",
														"sname" => ( ! empty($list['sname']) && ! empty($post['column']['sname'])) ? $list['sname'] : "",
														"doctor" => ( ! empty($list['doctor_id']) && ! empty($post['column']['doctor'])) ? $list['doctor_id'] : 0,
														"location" => ( ! empty($list['location_id']) && ! empty($post['column']['location'])) ? $list['location_id'] : 0,
														"treatment" => ( ! empty($list['treatment']) && ! empty($post['column']['treatment'])) ? $list['treatment'] : "",
														//"birth" => ( ! empty($list['birth']) && $list['birth'] != '<b>!</b>' && ! empty($post['column']['birth'])) ? $list['birth'] : "",
														"age" => ( ! empty($list['birth']) && $list['birth'] != '<b>!</b>' && ! empty($post['column']['birth'])) ? $list['birth'] : "",
														"email" => strtolower($list['text']),
														"date" => time(),
														"status" => 1,
														"stars" => 0,
														"feedback" => "");
									if ($this->db->insert("sent", $data_array))
									{
										$row['q_name'] = empty($questions_info) ? '' : '<strong>'.strtolower($questions_info['question_name']).'</strong>';
										$row['q_desc'] = empty($questions_info) ? '' : $questions_info['question_description'];
										
										$email_data['sent_id'] = $this->db->insert_id();
										$email_data['promo_checked'] = $row['promo_checked'];
										$email_data['stars_type'] = $row['stars_type'];
										$email_data['stars_text'] = $row['stars_text'];
										$email_data['texts'] = $this->get_emails_texts($row, $list);
										
										$message = $this->load->view('views/mail/tpl_feedback.html', $email_data, TRUE);

										if ( ! $this->send("mailing", $list['text'], (empty($subject) ? $email_data['texts']['subject'] : $subject), $message, $row['username'], 'no-reply@patientenreview.nl'))
										{
											$error = FALSE;
											$this->errors[] = array("Warning" => "Wasn't send to ".$list['text']);
										}
									}
								}
							}
						}
					}
				}
				
				if ( ! empty($post['file']) && file_exists($post['file']))
				{
					unlink($post['file']);
				}

				if ($error)
				{
					$this->errors[] = array("Success" => "Uitnodigingen verstuurd.");
					return array("first" => $this->session->userdata("first"));
				}
			}
			else
			{
				$this->errors[] = array("U heeft geen e-mailadres ingevuld.");
			}
		}
		
		function get_emails_texts($user, $list, $text = "")
		{
			$doc = array();
			if ( ! empty($list['doctor']))
			{
				$this->db->where("id", $list['doctor']);
				$this->db->limit(1);
				$doc = $this->db->get("doctors")->row_array();
			}
			
			$tags = array();
			foreach ($this->tags as $tag)
			{
				$tags[] = $tag;
			}
			$tags[] = '\n';

			$values = array('',
							empty($list['title']) ? '{{EMPTY}}' : $list['title'],
							empty($list['name']) ? '{{EMPTY}}' : $list['name'],
							empty($list['sname']) ? '{{EMPTY}}' : $list['sname'],
							empty($doc['title']) ? '{{EMPTY}}' : $doc['title'],
							empty($doc['firstname']) ? '{{EMPTY}}' : $doc['firstname'],
							empty($doc['lastname']) ? '{{EMPTY}}' : $doc['lastname'],
							empty($doc['avatar']) ? '{{EMPTY}}' : '<img src="'.str_replace('./avatars/', base_url().'avatars/', $doc['avatar']).'" style="vertical-align: baseline;" alt="" />',
							empty($user['username']) ? '{{EMPTY}}' : $user['username'],
							empty($user['q_name']) ? '{{EMPTY}}' : $user['q_name'],
							empty($user['q_desc']) ? '{{EMPTY}}' : $user['q_desc'],
							'<br />');
			
			$texts = $this->user_emails($user['id']);
			if ($text == "")
			{
				if ($user['account'] == 1 && $user['account_type'] == 0)
				{
					$tags = array('{{Onderwerp van E-mail}}', '{{Naam Praktijk}}', '\n');
					$values = array('', empty($user['username']) ? '{{EMPTY}}' : $user['username'], '<br />');
				}
				
				$texts['subject'] = str_replace($tags, $values, $texts['subject']);
				$values[0] = $texts['subject'];
			
				foreach ($texts as $key => $text)
				{
					$texts[$key] = str_replace($tags, $values, $text);
				}
				
				foreach ($texts as $key => $text)
				{
					if (strpos($texts[$key], "{{EMPTY}}") !== FALSE)
					{
						$texts[$key] = str_replace($tags, $values, $this->defaults[$key]);
					}
				}
			}
			else
			{
				$texts = str_replace($tags, $values, $text);
				$texts = str_replace("{{EMPTY}}", "", $texts);
			}

			return $texts;
		}

		function send_test_email($post)
		{
			$tags = array();
			foreach ($this->tags as $tag)
			{
				$tags[] = $tag;
			}
			$tags[] = '\n';

			$texts = $post['emails'];
			$values = array('',
							empty($post['values']['title']) ? '' : $post['values']['title'],
							empty($post['values']['name']) ? '' : $post['values']['name'],
							empty($post['values']['sname']) ? '' : $post['values']['sname'],
							empty($post['values']['doctors_title']) ? '' : $post['values']['doctors_title'],
							empty($post['values']['doctors_name']) ? '' : $post['values']['doctors_name'],
							empty($post['values']['doctors_sname']) ? '' : $post['values']['doctors_sname'],
							empty($post['values']['doctors_avatar']) ? '' : '<img src="'.$post['values']['doctors_avatar'].'" style="vertical-align: baseline;" alt="" />',
							empty($post['user']['username']) ? '' : $post['user']['username'],
							'',
							'',
							'<br />');
			
			$texts['subject'] = str_replace($tags, $values, $texts['subject']);
			$values[0] = $texts['subject'];
			
			if ( ! empty($post['user']['rating_questions']))
			{
				$questions_list = $this->pub->get_questions();
				$questions_list = $this->pub->user_questions($questions_list);
				$q = $questions_list[array_rand($questions_list)];
				$values[9] = $q['question_name'];
				$values[10] = $q['question_description'];
			}
			
			foreach ($texts as $key => $text)
			{
				$texts[$key] = str_replace($tags, $values, $text);
			}

			$data_array = array("users_id" => $this->session->userdata("id"),
								"title" => "",
								"name" => "",
								"sname" => "",
								"doctor" => 0,
								"email" => strtolower($post['values']['email']),
								"date" => time(),
								"status" => 3,
								"stars" => 0,
								"feedback" => "");
									
			if ($this->db->insert("sent", $data_array))
			{
				$email_data = array('domain' => (( ! empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://").$_SERVER['HTTP_HOST'].'/',
									'logo' => ( ! empty($post['user']['logo']) ? str_replace('./', '', $post['user']['logo']) : 'application/views/images/logo_full.png'),
									'username' => empty($post['user']['username']) ? '' : $post['user']['username'],
									'color' => empty($post['user']['color']) ? "#0f75bc" : $post['user']['color'],
									'account_type' => $post['user']['account_type'],
									'account' => $post['user']['account'],
									'promo_checked' => $post['user']['promo_checked'],
									'sent_id' => $this->db->insert_id(),
									'stars_type' => $post['user']['stars_type'],
									'stars_text' => $post['user']['stars_text'],
									'questions_info' => $post['user']['rating_questions'],
									'texts' => $texts);

				$message = $this->load->view('views/mail/tpl_feedback.html', $email_data, TRUE);
				$this->send("mailing", $post['values']['email'], $texts['subject'], $message, empty($post['user']['username']) ? '' : $post['user']['username'], $post['user']['email']);
				$this->errors[] = array("Success" => "Voorbeeldbericht verstuurd");
				return $this->real_send(array('mailing'), $this->db->insert_id());
			}
		}
		
		function send_example()
		{
			$users_id = $this->session->userdata("id");
			$this->db->where("id", $users_id);
			$this->db->limit(1);
			$row = $this->db->get("users")->row_array();

			if ( ! empty($row))
			{
				$email_data = array('domain' => (( ! empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://").$_SERVER['HTTP_HOST'].'/',
									'username' => $row['username'],
									'id' => md5($row['id']),
									'color' => empty($row['color']) ? "#0f75bc" : $row['color'],
									'logo' => ( ! empty($row['logo']) ? str_replace('./', '', $row['logo']) : 'application/views/images/logo_full.png'),
									'account_type' => $row['account_type'],
									'account' => $row['account']);

				$data_array = array("users_id" => $this->session->userdata("id"),
									"title" => "",
									"name" => "",
									"sname" => "",
									"doctor" => 0,
									"email" => strtolower($row['email']),
									"date" => time(),
									"status" => 3,
									"stars" => 0,
									"feedback" => "");
				if ($this->db->insert("sent", $data_array))
				{
					$email_data['sent_id'] = $this->db->insert_id();
					$email_data['email'] = $row['email'];
					$email_data['name'] = "Jan";
					$email_data['sname'] = "Klaas";
					$email_data['stars_type'] = $row['stars_type'];
					$email_data['stars_text'] = $row['stars_text'];
					//$email_data['username'] = "Geachte dhr. Klaas";
					$email_data['texts'] = $this->get_emails_texts($row, array("name" => "Jan", "sname" => "Klaas", "username" => "Geachte dhr. Klaas"));
					$message = $this->load->view('views/mail/tpl_example.html', $email_data, TRUE);

					$subject = 'Voorbeeldbericht: Hoe was uw behandeling?';
					if ($this->send("mailing", $row['email'], $subject, $message, $row['username'], $row['email']))
					{
						$this->real_send(array(), $this->db->insert_id());
						
						//$this->db->where("id", $email_data['sent_id']);
						//$this->db->delete("sent");
						
						$this->errors[] = array("Success" => "Voorbeeldbericht verstuurd.");
						return array("first" => $this->session->userdata("first"));
					}
				}
			}

			$this->errors[] = array("Warning" => "Wasn't send to ".$row['email']);
		}

		function send_reply($post)
		{
			$this->db->where("id", $this->session->userdata("id"));
			$this->db->limit(1);
			$row = $this->db->get("users")->row_array();

			if ( ! empty($row))
			{
				$email_data = array('domain' => (( ! empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://").$_SERVER['HTTP_HOST'].'/',
									'username' => $row['username'],
									'id' => $row['id'],
									'reply' => str_replace("\n", "<br />", $post['reply']),
									'subject' => 'Reactie op uw feedback',
									'logo' => ( ! empty($row['logo']) ? str_replace('./', '', $row['logo']) : 'application/views/images/logo_full.png'));

				$this->db->where("id", $post['id']);
				$this->db->where("status <>", 3);
				$this->db->limit(1);
				$val = $this->db->get("sent")->row_array();
				if ( ! empty($val))
				{
					$email_data['doctor'] = "";
					if ( ! empty($val['doctor']))
					{
						$this->db->where("id", $val['doctor']);
						$this->db->limit(1);
						$doc = $this->db->get("doctors")->row_array();
						$email_data['doctor'] = $doc['title']." ".$doc['firstname']." ".$doc['lastname']."<br />";
					}
					
					$email_data['email'] = $val['email'];
					$message = $this->load->view('views/mail/tpl_reply.html', $email_data, TRUE);
					if ( ! $this->send("reply", $val['email'], $email_data['subject'], $message, $row['username'], empty($row['email_reply']) ? $row['email'] : $row['email_reply']))
					{
						$error = FALSE;
						$this->errors[] = array("Email error");
					}
					else
					{
						$this->db->where("id", $row['id']);
						$this->db->update("users", array("last_reply" => $post['reply']));
						
						$this->db->where("id", $post['id']);
						$this->db->update("sent", array("reply" => $post['reply'], "reply_time" => time()));
						
						$this->errors[] = array("Success" => "Reactie op feedback verstuurd.");
					}
				}
			}
			else
			{
				$this->errors[] = array("Database error");
			}
		}
		
		function send_bulk_reply($post)
		{
			$this->db->where("id", $this->session->userdata("id"));
			$this->db->limit(1);
			$row = $this->db->get("users")->row_array();

			if ( ! empty($row))
			{
				$email_data = array('domain' => (( ! empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://").$_SERVER['HTTP_HOST'].'/',
									'username' => $row['username'],
									'id' => $row['id'],
									'logo' => ( ! empty($row['logo']) ? str_replace('./', '', $row['logo']) : 'application/views/images/logo_full.png'),
									'subject' => empty($post['subject']) ? 'Reactie op uw feedback' : $post['subject']);

				foreach ($post['letters'] as $id => $value)
				{
					if ($value)
					{
						$send_data = $email_data;

						$this->db->where("id", $id);
						$this->db->where("status <>", 3);
						$this->db->limit(1);
						$val = $this->db->get("sent")->row_array();
						if ( ! empty($val))
						{
							$list = array("name" => $val['name'],
										  "sname" => $val['sname'],
										  "text" => $val['email'],
										  "id" => $val['id'],
										  "reminder_date" => date("H:i d-m-Y", $val['date']),
										  "users_id" => $val['users_id']);

							$send_data['reply'] = str_replace("\n", "<br />", $this->get_emails_texts($row, $list, $post['letter']));
							$send_data['reply'] = str_replace('[FACEBOOK PROFIEL]', '<a href="'.$row['facebook'].'" target="_blank">Facebook</a>', $send_data['reply']);
							$send_data['reply'] = str_replace('[ZORGKAART PROFIEL]', '<a href="'.$row['zorgkaart'].'" target="_blank">Zorgkaart</a>', $send_data['reply']);
							$send_data['reply'] = str_replace('[TELEFOONBOEK PROFIEL]', '<a href="'.$row['telefoonboek'].'" target="_blank">Telefoonboek</a>', $send_data['reply']);
							$send_data['reply'] = str_replace('[VERGELIJKMONDZORG PROFIEL]', '<a href="'.$row['vergelijkmondzorg'].'" target="_blank">Vergelijk Mondzorg</a>', $send_data['reply']);
							$send_data['reply'] = str_replace('[INDEPENDER PROFIEL]', '<a href="'.$row['independer'].'" target="_blank">Independer</a>', $send_data['reply']);
							$send_data['reply'] = str_replace('[KLINIEKOVERZICHT PROFIEL]', '<a href="'.$row['kliniekoverzicht'].'" target="_blank">Kliniekoverzicht</a>', $send_data['reply']);
							$send_data['reply'] = str_replace('[AANGEPASTE DOORVERWIJZING PROFIEL]', '<a href="'.$row['own'].'" target="_blank">'.(empty($row['own_name']) ? 'Aangepaste doorverwijzing' : $row['own_name']).'</a>', $send_data['reply']);
							$send_data['reply'] = str_replace('[GOOGLE PROFIEL]', '<a href="'.$row['google'].'" target="_blank">Google</a>', $send_data['reply']);
							
							if (empty($val['name']) || empty($val['sname']))
							{
								$temp = explode(",", $send_data['reply']);
								$send_data['reply'] = str_replace($temp[0].",", $post['first'], $send_data['reply']);
							}

							$send_data['email'] = $val['email'];
							$message = $this->load->view('views/mail/tpl_reply.html', $send_data, TRUE);
							if ( ! $this->send("reply", $val['email'], $send_data['subject'], $message, $row['username'], empty($row['email_reply']) ? $row['email'] : $row['email_reply']))
							{
								$error = FALSE;
								$this->errors[] = array("Email error");
							}
							else
							{
								$this->db->where("id", $row['id']);
								$this->db->update("users", array("last_reply" => $send_data['reply']));
								
								$this->db->where("id", $id);
								$this->db->update("sent", array("reply" => $send_data['reply']));
							}
						}
					}
				}
				
				$this->errors[] = array("Success" => "Bericht(en) verstuurd.");
			}
			else
			{
				$this->errors[] = array("Database error");
			}
		}

		function send_notifications($post, $tpl)
		{
			$subject = "";
			switch ($tpl)
			{
				case "stop_sub": $subject = "Uw abonnement is beëindigd"; break;
				case "start_sub": $subject = "Uw abonnement is geactiveerd"; break;
				case "add_doctor": $subject = "Er is een zorgverlener aan uw abonnement toegevoegd"; break;
				case "remove_doctor": $subject = "Er is een zorgverlener van uw abonnement verwijderd"; break;
			}
			$post['domain'] = (( ! empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://").$_SERVER['HTTP_HOST'].'/';
			$message = $this->load->view('views/mail/tpl_'.$tpl.'.html', $post, TRUE);
			return $this->send("notifications", $post['email'], $subject, $message);
		}
		
		function send_signup($post)
		{
			$post['domain'] = (( ! empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://").$_SERVER['HTTP_HOST'].'/';
			$post['signup'] = TRUE;
			$message = $this->load->view('views/mail/tpl_trial.html', $post, TRUE);
			$this->send("trial", $post['email'], 'Uw abonnement van Patiëntenreview', $message);
			return $this->real_send(array('trial'), $this->db->insert_id());
		}

		function send_trial($post)
		{
			$post['domain'] = (( ! empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://").$_SERVER['HTTP_HOST'].'/';
			$message = $this->load->view('views/mail/tpl_trial.html', $post, TRUE);
			$this->send("trial", $post['email'], 'Uw abonnement van Patiëntenreview', $message);
			return $this->real_send(array('trial'), $this->db->insert_id());
		}

		function send_reset($post)
		{
			$post['domain'] = (( ! empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://").$_SERVER['HTTP_HOST'].'/';
			$message = $this->load->view('views/mail/tpl_reset.html', $post, TRUE);
			$this->send("reset", $post['email'], 'Uw wachtwoord herstellen', $message);
			return $this->real_send(array('reset'), $this->db->insert_id());
		}

		function send_reminders($post)
		{
			$post['domain'] = (( ! empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://").$_SERVER['HTTP_HOST'].'/';
			$message = $this->load->view('views/mail/tpl_reminder.html', $post, TRUE);
			return $this->send("reminder", $post['email'], 'Herinnering uploaden patiëntenbestand', $message);
		}

		function send_feedback($post)
		{
			if ($this->logged_in())
			{
				$this->db->where("id", $this->session->userdata("id"));
				$this->db->limit(1);
				$row = $this->db->get("users")->row_array();

				$email = "support@cloudrocket.co";
				$data_array = array('domain' => (( ! empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://").$_SERVER['HTTP_HOST'].'/',
									'feedback' => $post['text'],
									'first' => $post['first'],
									'second' => $post['second'],
									'third' => $post['third'],
									'feedback' => $post['text'],
									'date' => date("H:i d.m.Y"),
									'email' => $row['email'],
									'username' => $row['username']);
				$message = $this->load->view('views/mail/tpl_feed.html', $data_array, TRUE);
				if ($this->send("feedback", $email, 'Feedback', $message))
				{
					$this->errors[] = array("Success" => "Uw feedback is verstuurd. Hartelijk bedankt!");
					return TRUE;
				}
			}
			return FALSE;
		}
		
		function send_payment($post)
		{
			/*$post['domain'] = (( ! empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://").$_SERVER['HTTP_HOST'].'/';
			$message = $this->load->view('views/mail/tpl_payment.html', $post, TRUE);
			return $this->send("renew", $post['email'], 'Uw factuur van Patiëntenreview', $message, 'Patiëntenreview', 'info@patientenreview.nl', $post['attach']);*/
		}

		function send($type, $to, $subject = 'Patientenreview.nl', $message = '', $from = 'Patiëntenreview', $from_email = 'info@patientenreview.nl', $attach = FALSE)
		{
			$data_array = array("letters_to" => $to,
								"letters_subject" => $subject,
								"letters_message" => $message,
								"letters_from" => $from,
								"letters_from_email" => $from_email,
								"letters_type" => $type,
								"letters_attach" => $attach);
			return $this->db->insert("letters", $data_array);
		}

		function real_send($types = array(), $id = FALSE)
		{
			return $this->mailgun_send($types, $id);
			/*if ($id)
			{
				$this->db->where("letters_id", $id);
			}
			else
			{
				if ( ! empty($types))
				{
					$this->db->where_in("letters_type", $types);
				}
			}
			$this->db->order_by("letters_id", "asc");
			$result = $this->db->get("letters")->result_array();

			if ( ! empty($result))
			{
				$config = array();

				require('./application/config/email.php');

				$this->load->library('email', $config);

				foreach ($result as $row)
				{
					$this->email->clear(TRUE);
					
					$this->email->from("info@patientenreview.nl", $row['letters_from']);
					$this->email->to($row['letters_to']);
					$this->email->reply_to($row['letters_from_email'], $row['letters_from']);
					$this->email->subject($row['letters_subject']);
					$this->email->message($row['letters_message']);

					if ($row['letters_type'] == "reminder")
					{
						$this->db->where("email", $row['letters_to']);
						$this->db->limit(1);
						$val = $this->db->get("users")->row_array();
						if ($val['account'] == 1 && $val['account_type'] == 0)
						{
							$this->email->attach('./excel-basis-tpl.xls');
						}
						else
						{
							$this->email->attach('./excel-tpl.xls');
						}
					}
					
					if ( ! empty($row['letters_attach']))
					{
						$attach = explode('&&', $row['letters_attach']);
						foreach ($attach as $file)
						{
							$this->email->attach($file);
						}
					}

					if ($this->email->send())
					{
						$this->db->where("letters_id", $row['letters_id']);
						$this->db->delete("letters");
					}
					else
					{
						file_put_contents("log.txt", $this->email->print_debugger());
					}
				}
			}
			
			return TRUE;*/
		}
		
		function rating_page_get($segments)
		{
			$return = array('short' => FALSE);
			$segments = array_values(array_diff($segments, array('')));
			if (count($segments) == 1)
			{
				$return['short'] = TRUE;
				$check = $this->check_url(strtolower($segments[0]));
				if ( ! empty($check))
				{
					$return['info'] = $this->check_short_results($check['users_id'], $check['doctors_id']);
					$return['questions'] = array();
					$return['user'] = $this->user_info($check['users_id']);
					if ( ! empty($return['user']['promo_checked']))
					{
						$return['promo'] = $this->get_promo($check['users_id']);
					}

					if ( ! empty($check['doctors_id']))
					{
						$return['doctor'] = $this->doctor_info($check['doctors_id']);
					}
					else
					{
						$return['doctors'] = $this->get_doctors($check['users_id']);
					}
				}
			}
			else
			{
				if ($segments[0] == 'invitation')
				{
					$return['info'] = $this->invitation($segments[1]);
					$return['questions'] = $this->rating_questions($return['info']);
					$return['user'] = $this->user_info($return['info']['users_id']);
					if ( ! empty($return['user']['promo_checked']))
					{
						$return['promo'] = $this->get_promo($return['info']['users_id']);
					}
					
					if ( ! empty($return['info']['doctor']))
					{
						$return['doctor'] = $this->doctor_info($return['info']['doctor']);
					}
					else
					{
						$return['doctors'] = $this->get_doctors($return['info']['users_id']);
					}
					
					if ( ! empty($return['info']['location']))
					{
						$return['location'] = $this->location_info($return['info']['location']);
					}
					else
					{
						$return['locations'] = $this->get_locations($return['info']['users_id']);
					}
				}
			}
			
			return $return;
		}
		
		function unsubscribe($hash)
		{
			$this->db->where("MD5(id)", $hash);
			$this->db->limit(1);
			$row = $this->db->get("sent")->row_array();

			if ( ! empty($row))
			{
				$email = strtolower($row['email']);
				$this->db->where("email", $email);
				if ( ! $this->db->count_all_results("unsubscribes"))
				{
					$data_array = array("email" => strtolower($row['email']),
										"time" => time());

					$this->db->insert("unsubscribes", $data_array);
				}
			}

			return TRUE;
		}
		
		function undo($hash)
		{
			$this->db->where("MD5(id)", $hash);
			$this->db->limit(1);
			$row = $this->db->get("sent")->row_array();

			if ( ! empty($row))
			{
				$email = strtolower($row['email']);
				$this->db->where("email", $email);
				$this->db->delete("unsubscribes");
			}

			return TRUE;
		}

		function invitation($hash)
		{
			$ex = FALSE;
			$temp = explode("-", $hash);
			if ($temp[0] == 'ex')
			{
				$hash = $temp[1];
				$ex = TRUE;
			}

			$id_hash = substr($hash, 1);
			$stars = substr($hash, 0, 1);

			$this->db->where("MD5(id)", $id_hash);
			$this->db->limit(1);
			$row = $this->db->get("sent")->row_array();

			if ( ! empty($row))
			{
				if (empty($row['stars']) || ! empty($row['stars']) && ($row['date'] + 48 * 3600) >= time())
				{
					if ( ! $ex)
					{
						$this->db->where("id", $row['id']);
						$data_array = array('last' => time(), 'start' => time());
						if ($row['status'] != 3)
						{
							$data_array['status'] = 2; 
						}

						$data_array['stars'] = $stars;
						$row['stars'] = $stars;

						$this->db->update("sent", $data_array);

						if ( ! empty($row['questions_id']))
						{
							$data_array = array('sent_id' => $row['id'],
												'users_id' => $row['users_id'],
												'questions_id' => $row['questions_id'],
												'stars' => $stars,
												'date' => time());
							
							$this->db->where('sent_id', $row['id']);
							$this->db->where('questions_id', $row['questions_id']);
							if ($this->db->count_all_results('sent_questions'))
							{
								$this->db->where('sent_id', $row['id']);
								$this->db->where('questions_id', $row['questions_id']);
								$this->db->update('sent_questions', $data_array);
							}
							else
							{
								$this->db->insert('sent_questions', $data_array);
							}
						}

						$row['last_date'] = date("d-m-Y", $row['last'] + 48 * 3600);
						$row['last_time'] = date("H:i", $row['last'] + 48 * 3600);
					}

					$row['ex'] = $ex;
				}
				else
				{
					if ( ! empty($row['stars']) && ($row['date'] + 48 * 3600) < time())
					{
						$row['stars'] = 5;
						$row['errors'] = TRUE;
					}
				}
				
				return $row;
			}

			return FALSE;
		}
		
		function rating_questions($info)
		{
			$items = array();
			if ($info['questions_id'])
			{
				$ids = array();
				$this->db->where('users_id', $info['users_id']);
				$result = $this->db->get('users_questions')->result_array();
				foreach ($result as $row)
				{
					$ids[] = $row['questions_id'];
				}
				
				if (in_array($info['questions_id'], $ids))
				{
					$this->db->where_in('id', $ids);
					$result = $this->db->get('rating_questions')->result_array();
					foreach ($result as $row)
					{
						$row['stars'] = 0;

						$this->db->where('sent_id', $info['id']);
						$this->db->where('questions_id', $row['id']);
						$this->db->limit(1);
						$val = $this->db->get('sent_questions')->row_array();
						if ( ! empty($val))
						{
							$row['stars'] = $val['stars'];
						}
						
						if ($row['id'] == $info['questions_id'])
						{
							$items['main'] = $row;
						}
						else
						{
							$items['others'][] = $row;
						}
					}
				}
			}
			
			return $items;
		}
		
		function check_url($short)
		{
			$result = array("users_id" => 0, "doctors_id" => 0);
			$this->db->where("short", $short);
			$this->db->where("short_checked", TRUE);
			$this->db->or_where("MD5(id) =", $short);
			$this->db->limit(1);
			$row = $this->db->get("users")->row_array();
			if ( ! empty($row))
			{
				$result['users_id'] = $row['id'];
			}
			else
			{
				$this->db->where("short", $short);
				$this->db->where("short_checked", TRUE);
				$this->db->or_where("MD5(id) =", $short);
				$this->db->limit(1);
				$row = $this->db->get("doctors")->row_array();
				if ( ! empty($row))
				{
					$result['users_id'] = $row['users_id'];
					$result['doctors_id'] = $row['id'];
				}
			}
			
			return $result;
		}
		
		function check_short_results($users_id, $doctors_id)
		{
			$ip = $_SERVER['REMOTE_ADDR'];
			$this->db->order_by("id", "desc");
			$this->db->where("users_id", $users_id);
			if ( ! empty($doctors_id))
			{
				$this->db->where("doctor", $doctors_id);
			}
			$this->db->where("ip", $ip);
			$this->db->where("status <>", 3);
			$this->db->limit(1);
			$row = $this->db->get("sent")->row_array();

			if ( ! empty($row))
			{
				if ( ! empty($row['stars']))
				{
					$row['ex'] = FALSE;
					if ($row['last'] >= (time() - 48 * 3600))
					{
						$row['limit'] = TRUE;
					}
					else
					{
						$finish = $row['last'] + 48 * 3600;
						if ($finish < time())
						{
							$row = array('stars' => 0,
										 'feedback' => '',
										 'id' => 0,
										 'last_date' => '',
										 'last_time' => '',
										 'ex' => FALSE);
						}
						else
						{
							$row['last_date'] = date("d-m-Y", $finish);
							$row['last_time'] = date("H:i", $finish);
						}
					}
				}
				else
				{
					$row = array('stars' => 0,
								 'feedback' => '',
								 'id' => 0,
								 'last_date' => '',
								 'last_time' => '',
								 'ex' => FALSE);
				}
			}

			return $row;
		}
		
		function get_promo($users_id)
		{
			$this->db->where("users_id", $users_id);
			$this->db->limit(1);
			$row = $this->db->get("emails")->row_array();
			return empty($row['promo']) ? FALSE : $row['promo'];
		}
		
		function read_letters($post)
		{
			if ($this->logged_in())
			{
				/*$users_id = $this->session->userdata("id");
				$this->db->where("users_id", $users_id);
				$this->db->where("(`stars` IN (1, 2) OR `feedback` <> '')");
				$this->db->where("reply", "");
				$this->db->where("email <>", "");
				$this->db->where("marked_as_read", 0);
				$this->db->update("sent", array('marked_as_read' => TRUE));*/
				foreach ($post['letters'] as $id => $value)
				{
					if ($value)
					{
						$this->db->where("id", $id);
						$this->db->update("sent", array('marked_as_read' => TRUE));
					}
				}
				
			}
		}

		function inbox($post)
		{
			$items = array();
			if ($this->logged_in())
			{
				$users_id = $this->session->userdata("id");
				$this->db->where("id", $users_id);
				$this->db->limit(1);
				$user = $this->db->get("users")->row_array();
				if ( ! empty($user))
				{
					$this->db->order_by("last desc, date desc");
					if ($post['filter']['stars'] != "no_rating" && $post['filter']['stars'] != "no_reply" && $post['filter']['stars'] != "positive" && $post['filter']['stars'] != "negative")
					{
						$this->db->where("stars >", 0);
					}
					$this->db->where("users_id", $users_id);
					if ($post['filter']['stars'] !== "none")
					{
						if ($post['filter']['stars'] == "no_rating")
						{
							$this->db->where("stars", "0");
						}
						else
						{
							if ($post['filter']['stars'] == "no_reply")
							{
								$this->db->where("feedback <>", "");
								$this->db->where("reply", "");
							}
							else
							{
								if ($post['filter']['stars'] == "with_feedback")
								{
									$this->db->where("(`stars` IN (1, 2) OR `feedback` <> '')");
									$this->db->where("reply", "");
									$this->db->where("email <>", "");
									$this->db->where("marked_as_read", 0);
								}
								else
								{
									if ($post['filter']['stars'] == "with_reply")
									{
										$this->db->where("reply <>", "");
									}
									else
									{
										if ($post['filter']['stars'] == "positive")
										{
											$this->db->where_in("stars", array(3, 4, 5));
										}
										else
										{
											if ($post['filter']['stars'] == "negative")
											{
												$this->db->where_in("stars", array(1, 2));
											}
											else
											{
												$this->db->where("stars", $post['filter']['stars']);
											}
										}
									}
								}
							}
						}
					}

					if ( ! empty($post['filter']['from']))
					{
						$this->db->where("last >=", $post['filter']['from']);
					}

					if ( ! empty($post['filter']['to']))
					{
						$this->db->where("last <", $post['filter']['to']);
					}
					
					if ( ! empty($post['filter']['doctor']))
					{
						$this->db->where("doctor", $post['filter']['doctor']);
					}

					if ( ! empty($post['limit']))
					{
						$this->db->limit($post['limit']);
					}
					$this->db->where("status <>", 3);
					$result = $this->db->get("sent")->result_array();

					$doctors = array();
					$doctors_ids = array();
					foreach ($result as $row)
					{
						$doctors_ids[] = $row['doctor'];
					}
					$doctors_ids = array_diff(array_unique($doctors_ids), array('0'));
					
					if ( ! empty($doctors_ids))
					{
						$this->db->where_in("id", $doctors_ids);
						$docs = $this->db->get("doctors")->result_array();
						foreach ($docs as $row)
						{
							$doctors[$row['id']] = $row;
						}
					}
					
					$locations = array();
					$locations_ids = array();
					foreach ($result as $row)
					{
						$locations_ids[] = $row['location'];
					}
					$locations_ids = array_diff(array_unique($locations_ids), array('0'));
					
					if ( ! empty($locations_ids))
					{
						$this->db->where_in("id", $locations_ids);
						$locs = $this->db->get("locations")->result_array();
						foreach ($locs as $row)
						{
							$locations[$row['id']] = $row;
						}
					}

					foreach ($result as $row)
					{
						$row['new_letter'] = ($row['last'] >= $user['last']) ? 1 : 0;
						$row['date_time'] = date("d-m-y H:i", ($row['last'] > 0 ? $row['last'] : $row['date']));
						$row['date'] = $row['last'] > 0 ? $row['last'] : $row['date'];
						$row['doctor_name'] = "";
						if ( ! empty($doctors[$row['doctor']]))
						{
							$row['doctor_name'] = $doctors[$row['doctor']]['title'].' '.$doctors[$row['doctor']]['firstname'].' '.$doctors[$row['doctor']]['lastname'];
						}
						$row['location_name'] = "";
						if ( ! empty($locations[$row['location']]))
						{
							$row['location_name'] = $locations[$row['location']]['title'];
						}
						$items[] = $row;
					}
				}
			}

			return $items;
		}
		
		function export_inbox($list)
		{
			if ( ! empty($list) && $this->logged_in())
			{
				$this->db->where('id', $this->session->userdata('id'));
				$this->db->limit(1);
				$row = $this->db->get('users')->row_array();
				if ( ! empty($row))
				{
					$folder = md5($row['id'].$row['signup']);
					$path = './export/'.$folder.'/';
					
					if ( ! file_exists($path))
					{
						mkdir($path, 0755, TRUE);
					}
					
					delete_files($path, TRUE);
					
					$filename = date('d-m-Y').'.csv';
					if ($fp = fopen($path.$filename, 'w'))
					{
						fputcsv($fp, array('Datum', 'Aanhef', 'Voornaam', 'Achternaam', 'Leeftijd', 'E-mailadres', 'Facebook', 'Google', 'Zorgkaart', 'Independer', 'Vergelijk Mondzorg', 'Aangepaste doorverwijzing', 'Kliniekoverzicht', 'Telefoonboek', 'Uitgenodigd op', 'Beoordeeld op'), ';');
						foreach ($list as $line)
						{
							fputcsv($fp, array(date('d-m-Y'),
										   $line['title'],
										   $line['name'],
										   $line['sname'],
										   $line['age'],
										   $line['email'],
										   $line['facebook'],
										   $line['google'],
										   $line['zorgkaart'],
										   $line['independer'],
										   $line['vergelijkmondzorg'],
										   $line['own'],
										   $line['kliniekoverzicht'],
										   $line['telefoonboek'],
										   date('d-m-Y H:i', $line['date']),
										   date('d-m-Y H:i', $line['last'])), ';');
						}
						fclose($fp);
					}

					return base_url().'pub/export_download/'.$folder.'/';
				}
			}

			return FALSE;
		}

		function feedback_info($id)
		{
			$this->db->where("id", $id);
			$this->db->limit(1);
			$row = $this->db->get("sent")->row_array();
			if ( ! empty($row))
			{
				$row['date_time'] = date("d-m-y H:i", ($row['last'] > 0 ? $row['last'] : $row['date']));
				$row['reply_time'] = $row['reply_time'] > 0 ? date("d-m-y H:i", $row['reply_time']) : "";

				$row['feedback'] = str_replace("\n", '<br />', $row['feedback']);
				$row['reply'] = str_replace("\n", '<br />', $row['reply']);

				$row['questions'] = array();
				if ( ! empty($row['questions_id']))
				{
					$row['questions'] = $this->sent_questions($row['id']);
				}
				
				$row['doctors_info'] = array();
				if ( ! empty($row['doctor']))
				{
					$row['doctors_info'] = $this->doctor_info($row['doctor']);
				}
				
				$row['locations_info'] = array();
				if ( ! empty($row['location']))
				{
					$row['locations_info'] = $this->location_info($row['location']);
				}
			}
			
			return $row;
		}
		
		function sent_questions($sent_id)
		{
			$items = array();
			$this->db->where('sent_id', $sent_id);
			$result = $this->db->get('sent_questions')->result_array();
			if ( ! empty($result))
			{
				$list = $this->get_questions();
				foreach ($result as $row)
				{
					foreach ($list as $val)
					{
						if ($val['id'] == $row['questions_id'])
						{
							$val['stars'] = $row['stars'];
							$items[] = $val;
						}
					}
				}
			}
			
			return $items;
		}

		function stat_dashboard()
		{
			if ($this->logged_in())
			{
				$this->db->where("users_id", $this->session->userdata("id"));
				$this->db->where("status <>", 3);
				$result = $this->db->get("sent")->result_array();

				if ( ! empty($result))
				{
					$stat = array('average' => 0,
								  'average_before' => 0,
								  'stars' => 0,
								  'feedbacks' => 0,
								  'all' => 0,
								  'all_before' => 0,
								  'delta' => 0,
								  'diagram' => array(0, 0, 0, 0, 0, 0));

					foreach ($result as $row)
					{
						if ($row['stars'] > 0)
						{
							$stat['average'] += $row['stars'];
							$stat['all']++;
						}

						$stat['diagram'][$row['stars']]++;
						if ($row['last'] >= $this->last_time)
						{
							if ($row['stars'] > 0)
							{
								$stat['stars']++;
							}

							if ($row['feedback'] != "")
							{
								$stat['feedbacks']++;
							}
						}
						else
						{
							if ($row['stars'] > 0)
							{
								$stat['average_before'] += $row['stars'];
								$stat['all_before']++;
							}
						}
					}

					if ($stat['all'] > 0)
					{
						$stat['average'] = round($stat['average'] / $stat['all'], 1);
						if ($stat['all_before'] > 0)
						{
							$stat['average_before'] = round($stat['average_before'] / $stat['all_before'], 1);
						}
					}

					foreach ($stat['diagram'] as $key => $val)
					{
						$stat['diagram'][$key] = $stat['all'] > 0 ? round($val * 100 / $stat['all'], 1) : 0;
					}

					$percent = $stat['average'] / 100;
					if ($percent > 0)
					{
						$stat['delta'] = round(($stat['average'] - $stat['average_before']) / $percent, 1);
					}

					$stat['fb_token'] = TRUE;
					$this->db->where('id', $this->session->userdata("id"));
					$this->db->where('facebook_checked', TRUE);
					$this->db->limit(1);
					if ($this->db->count_all_results('users'))
					{
						$this->load->library('Facebook');
						$stat['fb_token'] = $this->facebook->is_token();
					}

					$empty = array("rating" => 0, "reviews" => array());
					$ratings = $this->ratings($this->session->userdata("id"));
					$stat['facebook'] = isset($ratings['facebook']) ? $ratings['facebook'] : $empty;
					$stat['google'] = isset($ratings['google']) ? $ratings['google'] : $empty;
					$stat['zorgkaart'] = isset($ratings['zorgkaart']) ? $ratings['zorgkaart'] : $empty;
					$stat['independer'] = isset($ratings['independer']) ? $ratings['independer'] : $empty;
					$stat['telefoonboek'] = isset($ratings['telefoonboek']) ? $ratings['telefoonboek'] : $empty;
					
					$stat['average_online'] = 0;
					$count = 0;
					if ( ! empty($stat['fb_token']))
					{
						if ( ! empty($stat['facebook']['rating']))
						{
							$stat['average_online'] += $stat['facebook']['rating'];
							$count++;
						}
						
						if ( ! empty($stat['google']['rating']))
						{
							$stat['average_online'] += $stat['google']['rating'];
							$count++;
						}
						
						if ( ! empty($stat['zorgkaart']['rating']))
						{
							$stat['average_online'] += $stat['zorgkaart']['rating'];
							$count++;
						}
						
						if ( ! empty($stat['independer']['rating']))
						{
							$stat['average_online'] += $stat['independer']['rating'];
							$count++;
						}

						if ( ! empty($count))
						{
							$stat['average_online'] = round($stat['average_online'] / $count, 1);
						}
					}
					else
					{
						$stat['fb_link'] = $this->facebook->get_link();
					}

					return $stat;
				}
			}

			return FALSE;
		}

		function stat_chart($post)
		{
			if ($this->logged_in())
			{
				$this->db->order_by("last", "asc");
				$this->db->where("status <>", 3);
				$result = $this->db->get("sent")->result_array();

				if ( ! empty($result))
				{
					$now = time();
					$filter = array(0 => 0,
									1 => $now - (365 * 24 * 60 * 60),
									2 => $now - (30 * 24 * 60 * 60),
									3 => $now - (7 * 24 * 60 * 60));

					$stat = array('average' => 0,
								  'stars' => 0,
								  'feedbacks' => 0,
								  'all' => 0,
								  'diagram' => array(0, 0, 0, 0, 0, 0),
								  'online' => array('none' => 0, 'facebook' => 0, 'google' => 0, 'zorgkaart' => 0, 'telefoonboek' => 0, 'vergelijkmondzorg' => 0, 'independer' => 0, 'kliniekoverzicht' => 0, 'own' => 0),
								  'doctors' => array(),
								  'vs' => 0,
								  'days' => array(),
								  'nps' => array('bad' => 0, 'good' => 0, 'delta' => 0, 'bad_doc' => 0, 'good_doc' => 0, 'delta_doc' => 0, 'bad_all' => 0, 'good_all' => 0, 'delta_all' => 0));

					$average_all = 0;
					$diagram_all = 0;
					$online_all = 0;
					$doctors_all = 0;

					$days_all = 0;
					$days_count_all = 0;

					$vs_stars = 0;
					$vs_all = 0;

					$nps_5 = 0;
					$nps_1 = 0;
					$nps_all = 0;
					$nps_doc_5 = 0;
					$nps_doc_1 = 0;
					$nps_doc_all = 0;
					$nps_all_5 = 0;
					$nps_all_1 = 0;
					$nps_all_all = 0;

					foreach ($result as $row)
					{
						if ($row['users_id'] == $this->session->userdata("id"))
						{
							$stat['all']++;
							if ($row['last'] >= $filter[$post['average']] && $row['stars'] > 0)
							{
								$stat['average'] += $row['stars'];
								$average_all++;
							}

							if ($row['last'] >= $filter[$post['diagram']])
							{
								$stat['diagram'][$row['stars']]++;
								$diagram_all++;
							}
							
							if ($row['last'] >= $filter[$post['doctors']])
							{
								if ( ! isset($stat['doctors'][$row['doctor']]))
								{
									$stat['doctors'][$row['doctor']] = 0;
								}
								
								$stat['doctors'][$row['doctor']]++;
								$doctors_all++;
							}
							
							if ($row['last'] >= $filter[$post['online']])
							{
								$none = 0;
								foreach ($stat['online'] as $key => $val)
								{
									if (isset($row[$key]))
									{
										$stat['online'][$key] += $row[$key];
										$none += $row[$key];
									}
								}
								$online_all++;
								if (empty($none))
								{
									$stat['online']['none'] += 1;
								}
							}

							if ($row['last'] >= $filter[$post['stars']])
							{
								if ($row['stars'] > 0)
								{
									$stat['stars']++;
								}
							}

							if ($row['last'] >= $filter[$post['feedbacks']])
							{
								if ($row['feedback'] != "")
								{
									$stat['feedbacks']++;
								}
							}

							if ($row['last'] >= $filter[$post['vs']])
							{
								if ($row['stars'] == 0)
								{
									$vs_stars++;
								}
								$vs_all++;
							}

							if ($row['last'] > 0)
							{
								$days_all += $row['stars'];
								$days_count_all++;
								//$stat['days'][date('d.m.Y', $row['last'])] = floor(round($days_all / $days_count_all, 2) * 2) / 2;
								$stat['days'][date('d.m.Y', $row['last'])] = round($days_all / $days_count_all, 1);
							}

							if ($row['stars'] == 5)
							{
								$nps_5++;
								if ( ! empty($post['doctor']) && $post['doctor'] == $row['doctor'])
								{
									$nps_doc_5++;
								}
							}

							if ($row['stars'] == 1 || $row['stars'] == 2)
							{
								$nps_1++;
								if ( ! empty($post['doctor']) && $post['doctor'] == $row['doctor'])
								{
									$nps_doc_1++;
								}
							}

							if ($row['stars'] > 0)
							{
								$nps_all++;
								if ( ! empty($post['doctor']) && $post['doctor'] == $row['doctor'])
								{
									$nps_doc_all++;
								}
							}
						}
						else
						{
							if ($row['stars'] == 5)
							{
								$nps_all_5++;
							}

							if ($row['stars'] == 1 || $row['stars'] == 2)
							{
								$nps_all_1++;
							}

							if ($row['stars'] > 0)
							{
								$nps_all_all++;
							}
						}
					}

					$stat['nps']['bad'] = $nps_all > 0 ? round($nps_1 / $nps_all * 100) : 0;
					$stat['nps']['good'] = $nps_all > 0 ? round($nps_5 / $nps_all * 100) : 0;
					$stat['nps']['delta'] = $stat['nps']['good'] - $stat['nps']['bad'];
					$stat['nps']['bad_doc'] = $nps_doc_all > 0 ? round($nps_doc_1 / $nps_doc_all * 100) : 0;
					$stat['nps']['good_doc'] = $nps_doc_all > 0 ? round($nps_doc_5 / $nps_doc_all * 100) : 0;
					$stat['nps']['delta_doc'] = $stat['nps']['good_doc'] - $stat['nps']['bad_doc'];
					$stat['nps']['bad_all'] = $nps_all_all > 0 ? round($nps_all_1 / $nps_all_all * 100) : 0;
					$stat['nps']['good_all'] = $nps_all_all > 0 ? round($nps_all_5 / $nps_all_all * 100) : 0;
					$stat['nps']['delta_all'] = $stat['nps']['good_all'] - $stat['nps']['bad_all'];

					if ($average_all > 0)
					{
						//$stat['average'] = floor(round($stat['average'] / $average_all, 2) * 2) / 2;
						$stat['average'] = round($stat['average'] / $average_all, 1);
					}

					foreach ($stat['diagram'] as $key => $val)
					{
						//$stat['diagram'][$key] = floor(round($val * 100 / $diagram_all) * 2) / 2;
						$stat['diagram'][$key] = round($val * 100 / $diagram_all, 1);
					}
					
					$this->db->where("id", $this->session->userdata("id"));
					$this->db->limit(1);
					$user = $this->db->get("users")->row_array();
					
					$onlines = array('none' => 'Niet doorgeklikt',
									 'facebook' => 'Facebook',
									 'google' => 'Google',
									 'zorgkaart' => 'Zorgkaart');

					if ($user['account'] == 2 || $user['account_type'] == 1)
					{
						$onlines = array('none' => 'Niet doorgeklikt',
										 'facebook' => 'Facebook',
										 'google' => 'Google',
										 'zorgkaart' => 'Zorgkaart',
										 'telefoonboek' => 'Telefoonboek',
										 'vergelijkmondzorg' => 'Vergelijk Mondzorg',
										 'independer' => 'Independer',
										 'kliniekoverzicht' => 'Kliniekoverzicht',
										 'own' => empty($user['own_name']) ? 'Aangepaste doorverwijzing' : $user['own_name']);
					}
					
					$online_array = array();
					foreach ($onlines as $key => $val)
					{
						//$online_array[] = array('label' => $val,
						//						'data' => floor(round($stat['online'][$key] * 100 / $online_all) * 2) / 2);
						$online_array[] = array('label' => $val,
												'data' => round($stat['online'][$key] * 100 / $online_all, 1));
					}
					$stat['online'] = $online_array;
					
					if ( ! empty($stat['doctors']))
					{
						$doctors_ids = array();
						foreach ($stat['doctors'] as $key => $val)
						{
							if ($key != 0)
							{
								$doctors_ids[] = $key;
							}
						}
						
						$doctors_array = array();
						if ( ! empty($doctors_ids))
						{
							$this->db->where_in("id", $doctors_ids);
							$docs = $this->db->get("doctors")->result_array();
							foreach ($docs as $doc)
							{
								//$doctors_array[] = array('label' => $doc['firstname'].' '.$doc['lastname'],
								//						 'data' => floor(round($stat['doctors'][$key] * 100 / $doctors_all) * 2) / 2);
								$doctors_array[] = array('label' => $doc['firstname'].' '.$doc['lastname'],
														 'data' => round($stat['doctors'][$key] * 100 / $doctors_all, 1));
							}
							
							//$doctors_array[] = array('label' => 'Beoordeeld op praktijk',
							//						 'data' => floor(round($stat['doctors'][0] * 100 / $doctors_all) * 2) / 2);
							$doctors_array[] = array('label' => 'Beoordeeld op praktijk',
													 'data' => round($stat['doctors'][0] * 100 / $doctors_all, 1));
						}
						$stat['doctors'] = $doctors_array;
					}

					if ($vs_all > 0)
					{
						//$stat['vs'] = floor(round($vs_stars * 100 / $vs_all, 2) * 2) / 2;
						$stat['vs'] = round($vs_stars * 100 / $vs_all, 1);
					}

					$start = $now;
					if ($post['days'] == 0)
					{
						foreach ($result as $row)
						{
							if ($row['last'] > 0)
							{
								$start = min($start, $row['last']);
							}
						}
						$start = strtotime(date("d.m.Y", $start));
					}
					else
					{
						$start = $filter[$post['days']];
					}

					$days = array();
					$days_y = array();
					$days_prev = 0;
					foreach ($stat['days'] as $key => $val)
					{
						if (strtotime($key) <= $start)
						{
							$days_prev = $val;
						}
					}

					for ($i = $start; $i <= $now; $i += (24 * 60 * 60))
					{
						if (isset($stat['days'][date('d.m.Y', $i)]))
						{
							$days[] = $stat['days'][date('d.m.Y', $i)];
							$days_prev = $stat['days'][date('d.m.Y', $i)];
						}
						else
						{
							$days[] = $days_prev;
						}

						$days_y[] = date("d M", $i);
					}

					$stat['days'] = $days;
					$stat['days_y'] = $days_y;

					$empty = array("rating" => 0, "reviews" => array());
					$ratings = $this->ratings($this->session->userdata("id"));
					$stat['google'] = isset($ratings['google']) ? $ratings['google'] : $empty;
					$stat['zorgkaart'] = isset($ratings['zorgkaart']) ? $ratings['zorgkaart'] : $empty;
					$stat['independer'] = isset($ratings['independer']) ? $ratings['independer'] : $empty;
					$stat['telefoonboek'] = isset($ratings['telefoonboek']) ? $ratings['telefoonboek'] : $empty;

					return $stat;
				}
			}

			return FALSE;
		}
		
		function stat_filter($post = array())
		{
			$data = array();
			if ($this->logged_in())
			{
				$user = array();
				if (empty($post['admin']))
				{
					$users_id = $this->session->userdata("id");
					$this->db->where('id', $users_id);
					$this->db->limit(1);
					$user = $this->db->get("users")->row_array();
				}
				
				$is_onlines = array();
				$this->db->where("status <>", 3);
				if (empty($post['admin']))
				{
					$this->db->where("users_id", $users_id);
				}
				$result = $this->db->get("sent")->result_array();
				foreach ($result as $row)
				{
					if ( ! empty($row['treatment']))
					{
						$data['treatment'][] = $row['treatment'];
					}
					
					if ( ! empty($row['doctor']))
					{
						$data['doctor'][] = $row['doctor'];
					}
					
					if ( ! empty($row['location']))
					{
						$data['location'][] = $row['location'];
					}
					
					if ( ! empty($row['facebook']) && ! in_array('facebook', $is_onlines))
					{
						$is_onlines[] = 'facebook';
						$data['online'][] = array('id' => 'facebook', 'name' => 'Facebook');
					}
					
					if ( ! empty($row['google']) && ! in_array('google', $is_onlines))
					{
						$is_onlines[] = 'google';
						$data['online'][] = array('id' => 'google', 'name' => 'Google');
					}
					
					if ( ! empty($row['zorgkaart']) && ! in_array('zorgkaart', $is_onlines))
					{
						$is_onlines[] = 'zorgkaart';
						$data['online'][] = array('id' => 'zorgkaart', 'name' => 'Zorgkaart Nederland');
					}
					
					if ( ! empty($row['telefoonboek']) && ! in_array('telefoonboek', $is_onlines))
					{
						$is_onlines[] = 'telefoonboek';
						$data['online'][] = array('id' => 'telefoonboek', 'name' => 'Telefoonboek');
					}
					
					if ( ! empty($row['vergelijkmondzorg']) && ! in_array('vergelijkmondzorg', $is_onlines))
					{
						$is_onlines[] = 'vergelijkmondzorg';
						$data['online'][] = array('id' => 'vergelijkmondzorg', 'name' => 'Vergelijk Mondzorg');
					}
					
					if ( ! empty($row['independer']) && ! in_array('independer', $is_onlines))
					{
						$is_onlines[] = 'independer';
						$data['online'][] = array('id' => 'independer', 'name' => 'Independer');
					}
					
					if ( ! empty($row['kliniekoverzicht']) && ! in_array('kliniekoverzicht', $is_onlines))
					{
						$is_onlines[] = 'kliniekoverzicht';
						$data['online'][] = array('id' => 'kliniekoverzicht', 'name' => 'Kliniekoverzicht');
					}
					
					if ( ! empty($row['own']) && ! in_array('own', $is_onlines))
					{
						$is_onlines[] = 'own';
						$data['online'][] = array('id' => 'own', 'name' => empty($user['own_name']) ? 'Aangepaste doorverwijzing' : $user['own_name']);
					}
				}
				
				$data['treatment'] = ! empty($data['treatment']) ? array_values(array_unique($data['treatment'])) : array();
				$data['doctor'] = ! empty($data['doctor']) ? array_values(array_unique($data['doctor'])) : array();
				$data['location'] = ! empty($data['location']) ? array_values(array_unique($data['location'])) : array();
			}
			
			sort($data['treatment']);
			sort($data['online']);
			
			if ( ! empty($data['doctor']))
			{
				$items = array();
				$this->db->order_by('firstname asc, lastname asc');
				$this->db->where_in('id', $data['doctor']);
				$result = $this->db->get('doctors')->result_array();
				foreach ($result as $row)
				{
					$items[] = array('id' => $row['id'], 'name' => implode(' ', array($row['title'], $row['firstname'], $row['lastname'])));
				}
				$data['doctor'] = $items;
			}
			
			if ( ! empty($data['location']))
			{
				$items = array();
				$this->db->order_by('title asc');
				$this->db->where_in('id', $data['location']);
				$result = $this->db->get('locations')->result_array();
				foreach ($result as $row)
				{
					$items[] = array('id' => $row['id'], 'name' => $row['title']);
				}
				$data['location'] = $items;
			}
			
			$questions_ids = array();
			$this->db->group_by('questions_id');
			if (empty($post['admin']))
			{
				$this->db->where('users_id', $users_id);
			}
			$result = $this->db->get('sent_questions')->result_array();
			foreach ($result as $row)
			{
				$questions_ids[] = $row['questions_id'];
			}
			
			$data['question'] = array();
			if ( ! empty($questions_ids))
			{
				$items = array();
				$this->db->order_by('question_name asc');
				$this->db->where_in('id', $questions_ids);
				$result = $this->db->get('rating_questions')->result_array();
				foreach ($result as $row)
				{
					$items[] = array('id' => $row['id'], 'name' => $row['question_name']);
				}
				$data['question'] = $items;
			}

			return $data;
		}
		
		function stat_chart2($post)
		{
			if ($this->logged_in())
			{
				$users_id = $this->session->userdata("id");
				$this->db->where('id', $users_id);
				$this->db->limit(1);
				$user = $this->db->get("users")->row_array();
				
				if ( ! empty($post['filter']))
				{
					$filter = array();
					foreach ($post['filter'] as $row)
					{
						if ( ! empty($row['value']))
						{
							$filter[$row['filter']][] = $row['value'];
						}
					}
					
					$sent_ids = array();
					if ( ! empty($filter['question']))
					{
						$this->db->where_in('questions_id', $filter['question']);
						$this->db->where('users_id', $users_id);
						$result = $this->db->get('sent_questions')->result_array();
						foreach ($result as $row)
						{
							$sent_ids[] = $row['sent_id'];
						}
					}
					
					if ( ! empty($sent_ids))
					{
						$this->db->where_in('id', $sent_ids);
					}
					
					foreach ($filter as $key => $val)
					{
						if ( ! empty($val))
						{
							if (in_array($key, array('doctor', 'location', 'treatment')))
							{
								$this->db->where_in($key, $val);
							}
							
							if ($key == 'online')
							{
								foreach ($val as $online)
								{
									$this->db->where($online.' >', 0);
								}
							}
							
							if ($key == 'date')
							{
								$query = array();
								foreach ($val as $date)
								{
									$time = array();
									if ( ! empty($date['from']))
									{
										$time[] = "`last` >= ".strtotime($date['from']);
									}
									
									if ( ! empty($date['to']))
									{
										$time[] = "`last` < ".strtotime($date['to']);
									}
									
									if ( ! empty($time))
									{
										$query[] = '('.implode(' AND ', $time).')';
									}
								}

								if ( ! empty($query))
								{
									$this->db->where('('.implode(' OR ', $query).')');
								}
							}
						}
					}
				}
				
				$this->db->order_by("last", "asc");
				$this->db->where("status <>", 3);
				$result = $this->db->get("sent")->result_array();

				if ( ! empty($result))
				{
					$stat = array();
					$stat['average'] = 0;
					$stat['for_user'] = 0;
					$stat['stars_count'] = array(0, 0, 0, 0, 0, 0);
					$stat['average_month_x'] = array();
					$stat['average_month_key'] = array();
					$stat['average_month'] = array();
					$stat['average_my_month'] = array();
					$stat['average_all_month'] = array();
					$stat['average_nps'] = array('12' => 0, '3' => 0, '45' => 0, '12p' => 0, '3p' => 0, '45p' => 0, 'all' => 0, 'delta' => 0);
					$stat['history_nps'] = array();
					$stat['nps_my_month'] = array();
					$stat['nps_all_month'] = array();
					$stat['reply'] = array();
					$stat['reply_percent'] = 0;
					$stat['reply_click'] = 0;
					$stat['reply_percents'] = array();
					$stat['reply_clicks'] = array();
					$stat['reply_highest'] = 0;
					$stat['reply_lowest'] = 0;
					$stat['reply_chart'] = array('reply' => 0, 'click' => 0, 'none' => 0);
					$stat['hours'] = '';
					$stat['days'] = '';

					$count = array();
					$count['all'] = 0;
					$count['my'] = 0;
					$count['for_user'] = 0;
					$count['average_sum'] = 0;
					$count['reply_all'] = 0;
					$count['reply_only'] = 0;
					$count['reply_click'] = 0;
					$count['reply_count'] = array();
					$count['my_month_sum'] = array();
					$count['all_month_sum'] = array();
					$count['my_month_num'] = array();
					$count['all_month_num'] = array();
					$count['all_nps'] = array();
					$count['hours'] = array();
					$count['days'] = array();

					$start = time();
					foreach ($result as $row)
					{
						if ( ! empty($row['last']))
						{
							$start = min($start, $row['last']);
						}
					}

					$start_date = (time() - 365 * 24 * 3600) > $start ? (time() - 365 * 24 * 3600) : $start;
					$month_start = date('n', $start_date);
					$year_start = date('Y', $start_date);
					$month_finish = date('n');
					$year_finish = date('Y');
					while ( ! ($month_start >= $month_finish && $year_start >= $year_finish))
					{
						$stat['average_month_x'][] = date("M 'y", mktime(0, 0, 0, $month_start, 1, $year_start));
						$stat['average_month_key'][] = $year_start.'-'.str_pad($month_start, 2, '0', STR_PAD_LEFT);
						
						$month_start++;
						if ($month_start > 12)
						{
							$month_start = 1;
							$year_start++;
						}
					}

					for ($i = 1; $i <= 5; $i++)
					{
						foreach ($stat['average_month_key'] as $key)
						{
							$stat['average_month'][$i][$key] = 0;
						}
					}

					foreach ($stat['average_month_key'] as $key)
					{
						$stat['history_nps']['12'][$key] = 0;
						$stat['history_nps']['3'][$key] = 0;
						$stat['history_nps']['45'][$key] = 0;
						
						$count['my_month_sum'][$key] = 0;
						$count['my_month_num'][$key] = 0;
						$count['all_month_sum'][$key] = 0;
						$count['all_month_num'][$key] = 0;
						$count['all_nps']['12'][$key] = 0;
						$count['all_nps']['45'][$key] = 0;
					}
					
					$onlines = array('facebook', 'google', 'zorgkaart', 'telefoonboek', 'vergelijkmondzorg', 'independer', 'kliniekoverzicht', 'own');
					
					foreach ($result as $row)
					{
						$month = FALSE;
						if ( ! empty($row['last']))
						{
							$month = date('Y-m', $row['last']);
						}

						if ($row['users_id'] == $users_id)
						{
							if ( ! empty($row['last']))
							{
								$hours = date('G', $row['last']);
								if ( ! isset($count['hours'][$hours]))
								{
									$count['hours'][$hours] = 0;
								}
								$count['hours'][$hours]++;
								
								$day = date('w', $row['last']);
								$day = $day == 0 ? 7 : $day;
								if ( ! isset($count['days'][$day]))
								{
									$count['days'][$day] = 0;
								}
								$count['days'][$day]++;
							}
							
							if ($row['stars'] > 0)
							{
								$count['for_user']++;
								$count['average_sum'] += $row['stars'];

								if (isset($stat['average_month'][$row['stars']][$month]))
								{
									$stat['average_month'][$row['stars']][$month]++;
								}
								
								if ($row['stars'] <= 2)
								{
									$stat['average_nps']['12']++;
									if (isset($stat['history_nps']['12'][$month]))
									{
										$stat['history_nps']['12'][$month]++;
									}
								}
								elseif ($row['stars'] == 3)
								{
									$stat['average_nps']['3']++;
									if (isset($stat['history_nps']['3'][$month]))
									{
										$stat['history_nps']['3'][$month]++;
									}
								}
								else
								{
									$stat['average_nps']['45']++;
									if (isset($stat['history_nps']['45'][$month]))
									{
										$stat['history_nps']['45'][$month]++;
									}
								}
								$stat['average_nps']['all']++;
							}
							
							$count['reply_all']++;
							if ($row['status'] == 2)
							{
								$count['reply_only']++;
								$check = 0;
								foreach ($onlines as $key)
								{
									$check += $row[$key];
								}

								if ( ! empty($check))
								{
									$count['reply_click']++;
								}
							}
							
							if ( ! empty($row['batches_id']))
							{
								if ( ! isset($count['reply_count'][$row['batches_id']]))
								{
									$count['reply_count'][$row['batches_id']]['all'] = 0;
									$count['reply_count'][$row['batches_id']]['only'] = 0;
									$count['reply_count'][$row['batches_id']]['click'] = 0;
								}
								
								$count['reply_count'][$row['batches_id']]['all']++;
								if ($row['status'] == 2)
								{
									$count['reply_count'][$row['batches_id']]['only']++;
									$check = 0;
									foreach ($onlines as $key)
									{
										$check += $row[$key];
									}

									if ( ! empty($check))
									{
										$count['reply_count'][$row['batches_id']]['click']++;
									}
								}
							}
							
							$stat['stars_count'][$row['stars']]++;
							
							if ( ! empty($month) && isset($count['my_month_sum'][$month]))
							{
								$count['my_month_sum'][$month] += $row['stars'];
								$count['my_month_num'][$month]++;
							}
							
							if ( ! empty($month) && isset($count['all_nps']['12'][$month]))
							{
								if ($row['stars'] <= 2 && isset($count['all_nps']['12'][$month]))
								{
									$count['all_nps']['12'][$month]++;
								}
								elseif ($row['stars'] >= 4 && isset($count['all_nps']['45'][$month]))
								{
									$count['all_nps']['45'][$month]++;
								}
							}
						}

						if ( ! empty($month) && isset($count['all_month_sum'][$month]))
						{
							$count['all_month_sum'][$month] += $row['stars'];
							$count['all_month_num'][$month]++;
						}
						
						$count['all']++;
					}
					
					if ( ! empty($count['hours']))
					{
						arsort($count['hours']);
						reset($count['hours']);
						$stat['hours'] = key($count['hours']);
					}
					
					if ( ! empty($count['days']))
					{
						arsort($count['days']);
						reset($count['days']);
						$stat['days'] = key($count['days']);
					}
					
					if ( ! empty($count['for_user']))
					{
						$stat['average'] = number_format(round($count['average_sum'] / $count['for_user'], 1), 1);
						$stat['for_user'] = $count['for_user'];
					}
					
					if ( ! empty($stat['average_nps']['all']))
					{
						$stat['average_nps']['12p'] = round($stat['average_nps']['12'] / $stat['average_nps']['all'] * 100);
						$stat['average_nps']['3p'] = round($stat['average_nps']['3'] / $stat['average_nps']['all'] * 100);
						$stat['average_nps']['45p'] = round($stat['average_nps']['45'] / $stat['average_nps']['all'] * 100);
						$stat['average_nps']['delta'] = $stat['average_nps']['45'] - $stat['average_nps']['12'];
					}

					$sum_my_month = 0;
					$num_my_month = 0;
					$sum_all_month = 0;
					$num_all_month = 0;
					$nps_my_45 = 0;
					$nps_my_12 = 0;
					$nps_all_45 = 0;
					$nps_all_12 = 0;
					
					foreach ($count['my_month_num'] as $month => $val)
					{
						$my_sum = empty($count['my_month_sum'][$month]) ? 0 : $count['my_month_sum'][$month];
						$sum_my_month += $my_sum;
						$my_num = empty($count['my_month_num'][$month]) ? 0 : $count['my_month_num'][$month];
						$num_my_month += $my_num;
						$stat['average_my_month'][$month] = empty($num_my_month) ? 0 : round($sum_my_month / $num_my_month, 1);
						
						$all_sum = empty($count['all_month_sum'][$month]) ? 0 : $count['all_month_sum'][$month];
						$sum_all_month += $all_sum;
						$all_num = empty($count['all_month_num'][$month]) ? 0 : $count['all_month_num'][$month];
						$num_all_month += $all_num;
						$stat['average_all_month'][$month] = empty($num_all_month) ? 0 : round($sum_all_month / $num_all_month, 1);
						
						$nps_my_45 += $stat['history_nps']['45'][$month];
						$nps_my_12 += $stat['history_nps']['12'][$month];
						$stat['nps_my_month'][$month] = $nps_my_45 - $nps_my_12;
						
						$nps_all_45 += $count['all_nps']['45'][$month];
						$nps_all_12 += $count['all_nps']['12'][$month];
						$stat['nps_all_month'][$month] = $nps_all_45 - $nps_all_12;
					}

					$stat['questions'] = array();
					if (empty($user['account_type']))
					{
						$stat['questions'] = $this->pub->get_questions();
					}
					else
					{
						$list = $this->pub->get_questions();
						$stat['questions'] = $this->pub->user_questions($list);
					}
					
					if ( ! empty($stat['questions']))
					{
						$q_sum = array();
						$q_num = array();
						$this->db->where('users_id', $users_id);
						if ( ! empty($sent_ids))
						{
							$this->db->where_in('sent_id', $sent_ids);
						}
						$result = $this->db->get('sent_questions')->result_array();
						foreach ($result as $row)
						{
							if ( ! isset($q_sum[$row['questions_id']]))
							{
								$q_sum[$row['questions_id']] = 0;
							}
							$q_sum[$row['questions_id']] += $row['stars'];
							
							if ( ! isset($q_num[$row['questions_id']]))
							{
								$q_num[$row['questions_id']] = 0;
							}
							$q_num[$row['questions_id']]++;
						}
						
						foreach ($stat['questions'] as $key => $row)
						{
							$stat['questions'][$key]['average'] = 0;
							if ( ! empty($q_num[$row['id']]))
							{
								$stat['questions'][$key]['average'] = number_format(round($q_sum[$row['id']] / $q_num[$row['id']], 1), 1);
							}
						}
					}
					
					if ( ! empty($count['reply_all']))
					{
						$stat['reply_percent'] = round($count['reply_only'] / $count['reply_all'] * 100, 1);
						$stat['reply_click'] = round($count['reply_click'] / $count['reply_all'] * 100, 1);
						
						$stat['reply_chart']['click'] = $stat['reply_click'];
						$stat['reply_chart']['none'] = 100 - $stat['reply_percent'];
						$stat['reply_chart']['reply'] = $stat['reply_percent'] - $stat['reply_click'];
					}
					
					if ( ! empty($count['reply_count']))
					{
						foreach ($count['reply_count'] as $id => $row)
						{
							$value = round($row['only'] / $row['all'] * 100, 1);
							$stat['reply_percents'][$id] = $value;

							$value = round($row['click'] / $row['all'] * 100, 1);
							$stat['reply_clicks'][$id] = $value;
							
							$stat['reply_highest'] = max($stat['reply_highest'], $value);
							if ( ! isset($stat['reply_lowest']))
							{
								$stat['reply_lowest'] = $value;
							}
							else
							{
								$stat['reply_lowest'] = min($stat['reply_lowest'], $value);
							}
						}
					}
					
					$this->db->order_by('sent_date', 'desc');
					$this->db->where('users_id', $users_id);
					$this->db->limit(10);
					$result = $this->db->get('sent_dates')->result_array();
					foreach ($result as $row)
					{
						$stat['batches'][] = array('date' => date('d-m-Y', $row['sent_date']),
												   'amount' => $row['emails_amount'],
												   'reply' => ! empty($stat['reply_percents'][$row['batches_id']]) ? $stat['reply_percents'][$row['batches_id']] : 0,
												   'click' => ! empty($stat['reply_clicks'][$row['batches_id']]) ? $stat['reply_clicks'][$row['batches_id']] : 0);
					}

					return $stat;
				}
			}

			return FALSE;
		}
		
		function stat_chart2_new($post)
		{
			if ($this->logged_in())
			{
				$users_id = $this->session->userdata("id");
				$this->db->where('id', $users_id);
				$this->db->limit(1);
				$user = $this->db->get("users")->row_array();
				
				$this->db->order_by("date_to", "asc");
				$result = $this->db->get("rating_history")->result_array();

				if ( ! empty($result))
				{
					$stat = array();
					$stat['average'] = 0;
					$stat['for_user'] = 0;
					$stat['stars_count'] = array(0, 0, 0, 0, 0, 0);
					$stat['average_month_x'] = array();
					$stat['average_month'] = array();
					$stat['average_my_month'] = array();
					$stat['average_all_month'] = array();
					$stat['average_nps'] = array('12' => 0, '3' => 0, '45' => 0, '12p' => 0, '3p' => 0, '45p' => 0, 'all' => 0, 'delta' => 0);
					$stat['history_nps'] = array();
					$stat['nps_my_month'] = array();
					$stat['nps_all_month'] = array();
					$stat['reply_percent'] = 0;
					$stat['reply_click'] = 0;
					$stat['reply_percents'] = array();
					$stat['reply_clicks'] = array();
					$stat['reply_highest'] = 0;
					$stat['reply_lowest'] = 0;
					$stat['reply_chart'] = array('reply' => 0, 'click' => 0, 'none' => 0);

					$count = array();
					$count['reply_all'] = 0;
					$count['reply_only'] = 0;
					$count['reply_click'] = 0;
					$count['reply_count'] = array();
					$count['all_month_sum'] = array();
					$count['all_month_num'] = array();
					$count['all_nps'] = array();

					$onlines = array('facebook', 'google', 'zorgkaart', 'telefoonboek', 'vergelijkmondzorg', 'independer', 'kliniekoverzicht', 'own');
					
					foreach ($result as $row)
					{
						$month = 0;
						if ($row['users_id'] == $this->session->userdata("id"))
						{
							$month = date('Y-m-d', $row['date_to']);
							
							$stat['average'] = $row['average_all'];
							$stat['for_user'] += $row['stars_all'];
							$stat['average_month_x'][] = $month;
							for ($i = 1; $i <= 5; $i++)
							{
								$stat['stars_count'][$i] += $row['stars_'.$i];
								$stat['average_month'][$i][$month] = $row['stars_'.$i];
							}
							$stat['average_my_month'][$month] = $row['average_all'];
							$stat['average_nps']['12'] += ($row['stars_1'] + $row['stars_2']);
							$stat['average_nps']['3'] += $row['stars_3'];
							$stat['average_nps']['45'] += ($row['stars_4'] + $row['stars_5']);
							$stat['average_nps']['all'] += $row['stars_all'];
							
							$stat['history_nps']['12'][$month] = ($row['stars_1'] + $row['stars_2']);
							$stat['history_nps']['3'][$month] = $row['stars_3'];
							$stat['history_nps']['45'][$month] = ($row['stars_4'] + $row['stars_5']);
						}
						
						if ( ! empty($month))
						{
							if ( ! isset($count['all_nps']['12'][$month]))
							{
								$count['all_nps']['12'][$month] = 0;
							}
							$count['all_nps']['12'][$month] += ($row['stars_1'] + $row['stars_2']);
							
							if ( ! isset($count['all_nps']['45'][$month]))
							{
								$count['all_nps']['45'][$month] = 0;
							}
							$count['all_nps']['45'][$month] += ($row['stars_4'] + $row['stars_5']);
						}

						if ( ! isset($count['all_month_sum'][$month]))
						{
							$count['all_month_sum'][$month] = 0;
							$count['all_month_num'][$month] = 0;
						}
						
						$count['all_month_sum'][$month] += $row['average_week'];
						$count['all_month_num'][$month]++;
					}

					if ( ! empty($stat['average_nps']['all']))
					{
						$stat['average_nps']['12p'] = round($stat['average_nps']['12'] / $stat['average_nps']['all'] * 100);
						$stat['average_nps']['3p'] = round($stat['average_nps']['3'] / $stat['average_nps']['all'] * 100);
						$stat['average_nps']['45p'] = round($stat['average_nps']['45'] / $stat['average_nps']['all'] * 100);
						$stat['average_nps']['delta'] = $stat['average_nps']['45'] - $stat['average_nps']['12'];
					}

					$sum_all_month = 0;
					$num_all_month = 0;
					$nps_my_45 = 0;
					$nps_my_12 = 0;
					$nps_all_45 = 0;
					$nps_all_12 = 0;

					foreach ($stat['average_my_month'] as $month => $val)
					{
						$all_sum = empty($count['all_month_sum'][$month]) ? 0 : $count['all_month_sum'][$month];
						$sum_all_month += $all_sum;
						$all_num = empty($count['all_month_num'][$month]) ? 0 : $count['all_month_num'][$month];
						$num_all_month += $all_num;
						$stat['average_all_month'][$month] = empty($num_all_month) ? 0 : round($sum_all_month / $num_all_month, 1);
						
						$nps_my_45 += $stat['history_nps']['45'][$month];
						$nps_my_12 += $stat['history_nps']['12'][$month];
						$stat['nps_my_month'][$month] = $nps_my_45 - $nps_my_12;
						
						$nps_all_45 += $count['all_nps']['45'][$month];
						$nps_all_12 += $count['all_nps']['12'][$month];
						$stat['nps_all_month'][$month] = $nps_all_45 - $nps_all_12;
					}

					$list = $this->pub->get_questions();
					$stat['questions'] = $this->pub->user_questions($list);
					if ( ! empty($stat['questions']))
					{
						$q_sum = array();
						$q_num = array();
						$this->db->where('users_id', $users_id);
						$result = $this->db->get('sent_questions')->result_array();
						foreach ($result as $row)
						{
							if ( ! isset($q_sum[$row['questions_id']]))
							{
								$q_sum[$row['questions_id']] = 0;
							}
							$q_sum[$row['questions_id']] += $row['stars'];
							
							if ( ! isset($q_num[$row['questions_id']]))
							{
								$q_num[$row['questions_id']] = 0;
							}
							$q_num[$row['questions_id']]++;
						}
						
						foreach ($stat['questions'] as $key => $row)
						{
							$stat['questions'][$key]['average'] = 0;
							if ( ! empty($q_num[$row['id']]))
							{
								$stat['questions'][$key]['average'] = number_format(round($q_sum[$row['id']] / $q_num[$row['id']], 1), 1);
							}
						}
					}
					
					$this->db->where('users_id', $users_id);
					$this->db->where('batches_id >', 0);
					$this->db->where('status <>', 3);
					$result = $this->db->get('sent')->result_array();
					foreach ($result as $row)
					{
						$count['reply_all']++;
						if ($row['status'] == 2)
						{
							$count['reply_only']++;
							$check = 0;
							foreach ($onlines as $key)
							{
								$check += $row[$key];
							}

							if ( ! empty($check))
							{
								$count['reply_click']++;
							}
						}
							
						if ( ! isset($count['reply_count'][$row['batches_id']]))
						{
							$count['reply_count'][$row['batches_id']]['all'] = 0;
							$count['reply_count'][$row['batches_id']]['only'] = 0;
							$count['reply_count'][$row['batches_id']]['click'] = 0;
						}
						
						$count['reply_count'][$row['batches_id']]['all']++;
						if ($row['status'] == 2)
						{
							$count['reply_count'][$row['batches_id']]['only']++;
							$check = 0;
							foreach ($onlines as $key)
							{
								$check += $row[$key];
							}

							if ( ! empty($check))
							{
								$count['reply_count'][$row['batches_id']]['click']++;
							}
						}
					}
					
					if ( ! empty($count['reply_all']))
					{
						$stat['reply_percent'] = round($count['reply_only'] / $count['reply_all'] * 100, 1);
						$stat['reply_click'] = round($count['reply_click'] / $count['reply_all'] * 100, 1);
						
						$stat['reply_chart']['click'] = $stat['reply_click'];
						$stat['reply_chart']['none'] = 100 - $stat['reply_percent'];
						$stat['reply_chart']['reply'] = $stat['reply_percent'] - $stat['reply_click'];
					}
					
					if ( ! empty($count['reply_count']))
					{
						foreach ($count['reply_count'] as $id => $row)
						{
							$value = round($row['only'] / $row['all'] * 100, 1);
							$stat['reply_percents'][$id] = $value;
							$stat['reply_highest'] = max($stat['reply_highest'], $value);
							if (empty($stat['reply_lowest']))
							{
								$stat['reply_lowest'] = $value;
							}
							else
							{
								$stat['reply_lowest'] = min($stat['reply_lowest'], $value);
							}
							
							$value = round($row['click'] / $row['all'] * 100, 1);
							$stat['reply_clicks'][$id] = $value;
						}
					}
					
					$this->db->order_by('sent_date', 'desc');
					$this->db->where('users_id', $users_id);
					$this->db->limit(10);
					$result = $this->db->get('sent_dates')->result_array();
					foreach ($result as $row)
					{
						$stat['batches'][] = array('date' => date('d-m-Y', $row['sent_date']),
												   'amount' => $row['emails_amount'],
												   'reply' => ! empty($stat['reply_percents'][$row['batches_id']]) ? $stat['reply_percents'][$row['batches_id']] : 0,
												   'click' => ! empty($stat['reply_clicks'][$row['batches_id']]) ? $stat['reply_clicks'][$row['batches_id']] : 0);
					}

					return $stat;
				}
			}

			return FALSE;
		}
		
		function stat_online()
		{
			if ($this->logged_in())
			{
				$users_id = $this->session->userdata("id");
				$onlines = array('zorgkaart', 'facebook', 'independer', 'google');
				$stat = array();

				$this->db->order_by('date', 'asc');
				$this->db->where('users_id', $users_id);
				$result = $this->db->get('reviews_history')->result_array();
				foreach ($result as $row)
				{
					$month = date('Y-m', $row['date']);
					$stat['months'][] = date("M 'y", $row['date']);
					foreach ($onlines as $o)
					{
						$stat['average'][$o] = $row[$o] * 1;

						if ( ! isset($stat['history'][$month][$o]))
						{
							$stat['history'][$month][$o]['sum'] = 0;
							$stat['history'][$month][$o]['num'] = 0;
						}
						$stat['history'][$month][$o]['sum'] += $row[$o];
						$stat['history'][$month][$o]['num']++;
					}
				}
				
				$stat['months'] = array_values(array_unique($stat['months']));
				
				if ( ! empty($stat['history']))
				{
					foreach ($stat['history'] as $month => $list)
					{
						foreach ($list as $o => $row)
						{
							$stat['history'][$month][$o] = $row['num'] > 0 ? round($row['sum'] / $row['num'], 1) : 0;
						}
					}
				}
				
				if ( ! empty($stat['average']))
				{
					$sum = 0;
					foreach ($onlines as $o)
					{
						$sum += isset($stat['average'][$o]) ? $stat['average'][$o] : 0;
					}
					
					$left = 0;
					foreach ($onlines as $k => $o)
					{
						if ($k < (count($onlines) - 1))
						{
							$stat['pie'][$o] = isset($stat['average'][$o]) ? round($stat['average'][$o] * 100 / $sum, 1) : 0;
							$left += $stat['pie'][$o];
						}
						else
						{
							$stat['pie'][$o] = 100 - $left;
						}
					}
				}
				
				$this->db->order_by('time', 'desc');
				$this->db->where('users_id', $users_id);
				$result = $this->db->get('reviews')->result_array();
				foreach ($result as $row)
				{
					$stat['reviews'][$row['profile']][] = $row;
					if ( ! isset($stat['stars'][$row['profile']][$row['score'] * 1]))
					{
						$stat['stars'][$row['profile']][$row['score'] * 1] = 0;
					}
					$stat['stars'][$row['profile']][$row['score'] * 1]++;
				}

				$this->db->where('users_id', $users_id);
				$this->db->update('reviews', array('marked_as_read' => TRUE));

				return $stat;
			}
			return FALSE;
		}
		
		function astat_online()
		{
			if ($this->logged_in())
			{
				$onlines = array('zorgkaart', 'facebook', 'independer', 'google');
				$stat = array();
				$this->db->order_by('date', 'asc');
				$result = $this->db->get('reviews_history')->result_array();
				foreach ($result as $row)
				{
					$month = date('Y-m', $row['date']);
					$stat['months'][] = date("M 'y", $row['date']);
					foreach ($onlines as $o)
					{
						$stat['average'][$o][$row['users_id']] = $row[$o] * 1;

						if ( ! isset($stat['history'][$month][$o]))
						{
							$stat['history'][$month][$o]['sum'] = 0;
							$stat['history'][$month][$o]['num'] = 0;
						}
						$stat['history'][$month][$o]['sum'] += $row[$o];
						$stat['history'][$month][$o]['num']++;
					}
				}
				
				$stat['months'] = array_values(array_unique($stat['months']));
				
				if ( ! empty($stat['history']))
				{
					foreach ($stat['history'] as $month => $list)
					{
						foreach ($list as $o => $row)
						{
							$stat['history'][$month][$o] = $row['num'] > 0 ? round($row['sum'] / $row['num'], 1) : 0;
						}
					}
				}
				
				if ( ! empty($stat['average']))
				{
					$average_sum = 0;
					$averages = array();
					foreach ($onlines as $o)
					{
						$num = 0;
						$sum = 0;
						foreach ($stat['average'][$o] as $val)
						{
							$sum += $val;
							$num++;
						}
						
						if ($num > 0)
						{
							$averages[$o] = round($sum / $num, 1);
							$average_sum += $averages[$o];
						}
						else
						{
							$averages[$o] = 0;
						}
					}
					$stat['average'] = $averages;
					
					$left = 0;
					foreach ($onlines as $k => $o)
					{
						if ($k < (count($onlines) - 1))
						{
							$stat['pie'][$o] = isset($stat['average'][$o]) ? round($stat['average'][$o] * 100 / $average_sum, 1) : 0;
							$left += $stat['pie'][$o];
						}
						else
						{
							$stat['pie'][$o] = 100 - $left;
						}
					}
				}
				
				$this->db->order_by('time', 'desc');
				$result = $this->db->get('reviews')->result_array();
				foreach ($result as $row)
				{
					$stat['reviews'][$row['profile']][] = $row;
					if ( ! isset($stat['stars'][$row['profile']][$row['score'] * 1]))
					{
						$stat['stars'][$row['profile']][$row['score'] * 1] = 0;
					}
					$stat['stars'][$row['profile']][$row['score'] * 1]++;
				}

				return $stat;
			}
			return FALSE;
		}

		function stat_achart($post)
		{
			if ($this->logged_in())
			{
				$now = time();
				$filter = array(0 => 0,
								1 => $now - (365 * 24 * 60 * 60),
								2 => $now - (30 * 24 * 60 * 60),
								3 => $now - (7 * 24 * 60 * 60));

				$stat = array('max' => array(),
							  'min' => array(),
							  'average' => 0,
							  'average_online' => 0,
							  'id' => $post['id'],
							  'stars' => 0,
							  'feedbacks' => 0,
							  'all' => 0,
							  'diagram' => array(0, 0, 0, 0, 0, 0),
							  'online' => array('none' => 0, 'facebook' => 0, 'google' => 0, 'zorgkaart' => 0, 'telefoonboek' => 0, 'vergelijkmondzorg' => 0, 'independer' => 0, 'kliniekoverzicht' => 0, 'own' => 0),
							  'doctors' => array(),
							  'vs' => 0,
							  'days' => array(),
							  'nps' => array('bad' => 0, 'good' => 0, 'delta' => 0, 'bad_doc' => 0, 'good_doc' => 0, 'delta_doc' => 0));

				$actives = array();
				$this->db->where("status <>", 3);
				$result = $this->db->get("sent")->result_array();
				foreach ($result as $row)
				{
					if ( ! isset($actives[$row['users_id']]))
					{
						$actives[$row['users_id']] = 0;
					}
					$actives[$row['users_id']] += 1;
				}

				if ( ! empty($post['user']))
				{
					$this->db->where("users_id", $post['user']);
				}
				
				if ( ! empty($post['doctor']))
				{
					$this->db->where("doctor", $post['doctor']);
				}
				$this->db->where("status <>", 3);
				$result = $this->db->get("sent")->result_array();

				if ( ! empty($result))
				{
					$average_all = 0;
					$diagram_all = 0;
					$online_all = 0;
					$doctors_all = 0;

					$days_all = 0;
					$days_count_all = 0;

					$vs_stars = 0;
					$vs_all = 0;

					$nps_5 = 0;
					$nps_1 = 0;
					$nps_all = 0;
					$nps_doc_5 = 0;
					$nps_doc_1 = 0;
					$nps_doc_all = 0;

					foreach ($result as $row)
					{
						$stat['all']++;
						if ($row['last'] >= $filter[$post['average']] && $row['stars'] > 0)
						{
							$stat['average'] += $row['stars'];
							$average_all++;
						}

						if ($row['last'] >= $filter[$post['diagram']])
						{
							$stat['diagram'][$row['stars']]++;
							$diagram_all++;
						}
						
						if ($row['last'] >= $filter[$post['doctors']])
						{
							if ( ! isset($stat['doctors'][$row['doctor']]))
							{
								$stat['doctors'][$row['doctor']] = 0;
							}
							
							$stat['doctors'][$row['doctor']]++;
							$doctors_all++;
						}
						
						if ($row['last'] >= $filter[$post['online']])
						{
							$none = 0;
							foreach ($stat['online'] as $key => $val)
							{
								if (isset($row[$key]))
								{
									$stat['online'][$key] += $row[$key];
									$none += $row[$key];
								}
							}
							$online_all++;
							if (empty($none))
							{
								$stat['online']['none'] += 1;
							}
						}

						if ($row['last'] >= $filter[$post['stars']])
						{
							if ($row['stars'] > 0)
							{
								$stat['stars']++;
							}
						}

						if ($row['last'] >= $filter[$post['feedbacks']])
						{
							if ($row['feedback'] != "")
							{
								$stat['feedbacks']++;
							}
						}

						if ($row['last'] >= $filter[$post['vs']])
						{
							if ($row['stars'] == 0)
							{
								$vs_stars++;
							}
							$vs_all++;
						}

						if ($row['last'] > 0)
						{
							$days_all += $row['stars'];
							$days_count_all++;
							//$stat['days'][date('d.m.Y', $row['last'])] = floor(round($days_all / $days_count_all, 2) * 2) / 2;
							$stat['days'][date('d.m.Y', $row['last'])] = round($days_all / $days_count_all, 1);
						}

						if ($row['stars'] == 5)
						{
							$nps_5++;
							if ( ! empty($post['doctor']) && $post['doctor'] == $row['doctor'])
							{
								$nps_doc_5++;
							}
						}

						if ($row['stars'] == 1 || $row['stars'] == 2)
						{
							$nps_1++;
							if ( ! empty($post['doctor']) && $post['doctor'] == $row['doctor'])
							{
								$nps_doc_1++;
							}
						}

						if ($row['stars'] > 0)
						{
							$nps_all++;
							if ( ! empty($post['doctor']) && $post['doctor'] == $row['doctor'])
							{
								$nps_doc_all++;
							}
						}
					}
					
					$users = array();
					$sents = array();
					arsort($actives);
					$max = array();
					$count = 0;
					
					foreach ($actives as $key => $val)
					{
						if ($count < 3)
						{
							$max[] = $key;
							$users[] = $key;
							$sents[$key] = $val;
						}
						$count++;
					}
					
					asort($actives);
					$min = array();
					$count = 0;
					foreach ($actives as $key => $val)
					{
						if ($count < 3)
						{
							$min[] = $key;
							$users[] = $key;
							$sents[$key] = $val;
						}
						$count++;
					}
					
					if ( ! empty($users))
					{
						$sessions = array();
						$this->db->where_in("users_id", $users);
						$res = $this->db->get("sessions")->result_array();

						foreach ($res as $row)
						{
							$sessions[$row['users_id']][] = $row['users_login'];
						}

						$this->db->where_in("id", $users);
						$res = $this->db->get("users")->result_array();

						foreach ($max as $id)
						{
							foreach ($res as $row)
							{
								$login_date = empty($sessions[$row['id']]) ? '---' : date("d-m-Y", max($sessions[$row['id']]));
								$login_date = $login_date == date("d-m-Y") ? "Vandaag" : ($login_date == date("d-m-Y", time() - 24 * 3600) ? "Gisteren" : $login_date);
								if ($id == $row['id'])
								{
									$stat['max'][] = array("id" => $row['id'],
														   "username" => $row['username'],
														   "login_date" => $login_date,
														   "login_number" => empty($sessions[$row['id']]) ? 0 : count($sessions[$row['id']]),
														   "sent_number" => $sents[$row['id']]);
								}
							}
						}
						
						foreach ($min as $id)
						{
							foreach ($res as $row)
							{
								$login_date = empty($sessions[$row['id']]) ? '---' : date("d-m-Y", max($sessions[$row['id']]));
								$login_date = $login_date == date("d-m-Y") ? "Vandaag" : ($login_date == date("d-m-Y", time() - 24 * 3600) ? "Gisteren" : $login_date);
								if ($id == $row['id'])
								{
									$stat['min'][] = array("id" => $row['id'],
														   "username" => $row['username'],
														   "login_date" => $login_date,
														   "login_number" => empty($sessions[$row['id']]) ? 0 : count($sessions[$row['id']]),
														   "sent_number" => $sents[$row['id']]);
								}
							}
						}
					}

					$stat['nps']['bad'] = $nps_all > 0 ? round($nps_1 / $nps_all * 100) : 0;
					$stat['nps']['good'] = $nps_all > 0 ? round($nps_5 / $nps_all * 100) : 0;
					$stat['nps']['delta'] = $stat['nps']['good'] - $stat['nps']['bad'];
					$stat['nps']['bad_doc'] = $nps_doc_all > 0 ? round($nps_doc_1 / $nps_doc_all * 100) : 0;
					$stat['nps']['good_doc'] = $nps_doc_all > 0 ? round($nps_doc_5 / $nps_doc_all * 100) : 0;
					$stat['nps']['delta_doc'] = $stat['nps']['good_doc'] - $stat['nps']['bad_doc'];

					//$stat['average'] = floor(round($stat['average'] / $average_all, 2) * 2) / 2;
					$stat['average'] = round($stat['average'] / $average_all, 1);
					foreach ($stat['diagram'] as $key => $val)
					{
						//$stat['diagram'][$key] = floor(round($val * 100 / $diagram_all) * 2) / 2;
						$stat['diagram'][$key] = round($val * 100 / $diagram_all, 1);
					}

					$onlines = array('none' => 'Niet doorgeklikt',
									 'facebook' => 'Facebook',
									 'google' => 'Google',
									 'zorgkaart' => 'Zorgkaart',
									 'telefoonboek' => 'Telefoonboek',
									 'vergelijkmondzorg' => 'Vergelijk Mondzorg',
									 'independer' => 'Independer',
									 'kliniekoverzicht' => 'Kliniekoverzicht',
									 'own' => 'Aangepaste doorverwijzing');
					
					$online_array = array();
					foreach ($onlines as $key => $val)
					{
						//$online_array[] = array('label' => $val,
						//						'data' => floor(round($stat['online'][$key] * 100 / $online_all) * 2) / 2);
						$online_array[] = array('label' => $val,
												'data' => round($stat['online'][$key] * 100 / $online_all, 1));
					}
					$stat['online'] = $online_array;
					
					if ( ! empty($stat['doctors']))
					{
						/*$doctors_ids = array();
						foreach ($stat['doctors'] as $key => $val)
						{
							if ($key != 0)
							{
								$doctors_ids[] = $key;
							}
						}
						
						$doctors_array = array();
						if ( ! empty($doctors_ids))
						{
							$this->db->where_in("id", $doctors_ids);
							$docs = $this->db->get("doctors")->result_array();
							foreach ($docs as $doc)
							{
								$doctors_array[] = array('label' => $doc['firstname'].' '.$doc['lastname'],
														 'data' => floor(round($stat['doctors'][$key] * 100 / $doctors_all) * 2) / 2);
							}
							
							if (isset($stat['doctors'][0]))
							{
								$doctors_array[] = array('label' => 'Beoordeeld op praktijk',
														 'data' => floor(round($stat['doctors'][0] * 100 / $doctors_all) * 2) / 2);
							}
						}*/
						
						$only_doctors = 0;
						foreach ($stat['doctors'] as $key => $val)
						{
							if ($key != 0)
							{
								$only_doctors += $val;
							}
						}

						//$doctors_array[] = array('label' => 'Beoordeeld op zorgverlener',
						//						 'data' => floor(round($only_doctors * 100 / $doctors_all) * 2) / 2);
						$doctors_array[] = array('label' => 'Beoordeeld op zorgverlener',
												 'data' => round($only_doctors * 100 / $doctors_all, 1));
						
						if (isset($stat['doctors'][0]))
						{
							//$doctors_array[] = array('label' => 'Beoordeeld op praktijk',
							//						 'data' => floor(round($stat['doctors'][0] * 100 / $doctors_all) * 2) / 2);
							$doctors_array[] = array('label' => 'Beoordeeld op praktijk',
													 'data' => round($stat['doctors'][0] * 100 / $doctors_all, 1));
						}
						$stat['doctors'] = $doctors_array;
					}

					if ($vs_all > 0)
					{
						//$stat['vs'] = floor(round($vs_stars * 100 / $vs_all, 2) * 2) / 2;
						$stat['vs'] = round($vs_stars * 100 / $vs_all, 1);
					}

					$start = $now;
					if ($post['days'] == 0)
					{
						foreach ($result as $row)
						{
							if ($row['last'] > 0)
							{
								$start = min($start, $row['last']);
							}
						}
						$start = strtotime(date("d.m.Y", $start));
					}
					else
					{
						$start = $filter[$post['days']];
					}

					$days = array();
					$days_y = array();
					$days_prev = 0;
					foreach ($stat['days'] as $key => $val)
					{
						if (strtotime($key) <= $start)
						{
							$days_prev = $val;
						}
					}

					for ($i = $start; $i <= $now; $i += (24 * 60 * 60))
					{
						if (isset($stat['days'][date('d.m.Y', $i)]))
						{
							$days[] = $stat['days'][date('d.m.Y', $i)];
							$days_prev = $stat['days'][date('d.m.Y', $i)];
						}
						else
						{
							$days[] = $days_prev;
						}

						$days_y[] = date("d M", $i);
					}

					$stat['days'] = $days;
					$stat['days_y'] = $days_y;

					$empty = array("rating" => 0, "reviews" => array());
					$ratings = $this->ratings(FALSE);
					$stat['google'] = isset($ratings['google']) ? $ratings['google'] : $empty;
					$stat['google'] = array_slice($stat['google'], 0, 10);
					$stat['zorgkaart'] = isset($ratings['zorgkaart']) ? $ratings['zorgkaart'] : $empty;
					$stat['zorgkaart'] = array_slice($stat['zorgkaart'], 0, 10);
					$stat['independer'] = isset($ratings['independer']) ? $ratings['independer'] : $empty;
					$stat['independer'] = array_slice($stat['independer'], 0, 10);
					$stat['telefoonboek'] = isset($ratings['telefoonboek']) ? $ratings['telefoonboek'] : $empty;
					$stat['telefoonboek'] = array_slice($stat['telefoonboek'], 0, 10);
				}

				return $stat;
			}

			return FALSE;
		}
		
		function stat_achart2($post)
		{
			if ($this->logged_in())
			{
				$actives = array();
				$this->db->where("status <>", 3);
				$result = $this->db->get("sent")->result_array();
				foreach ($result as $row)
				{
					if ( ! isset($actives[$row['users_id']]))
					{
						$actives[$row['users_id']] = 0;
					}
					$actives[$row['users_id']] += 1;
				}
				
				if ( ! empty($post['filter']))
				{
					$filter = array();
					foreach ($post['filter'] as $row)
					{
						if ( ! empty($row['value']))
						{
							$filter[$row['filter']][] = $row['value'];
						}
					}
					
					$sent_ids = array();
					if ( ! empty($filter['question']))
					{
						$this->db->where_in('questions_id', $filter['question']);
						$result = $this->db->get('sent_questions')->result_array();
						foreach ($result as $row)
						{
							$sent_ids[] = $row['sent_id'];
						}
					}
					
					if ( ! empty($sent_ids))
					{
						$this->db->where_in('id', $sent_ids);
					}
					
					foreach ($filter as $key => $val)
					{
						if ( ! empty($val))
						{
							if (in_array($key, array('doctor', 'location', 'treatment')))
							{
								$this->db->where_in($key, $val);
							}
							
							if ($key == 'online')
							{
								foreach ($val as $online)
								{
									$this->db->where($online.' >', 0);
								}
							}
							
							if ($key == 'date')
							{
								$query = array();
								foreach ($val as $date)
								{
									$time = array();
									if ( ! empty($date['from']))
									{
										$time[] = "`last` >= ".strtotime($date['from']);
									}
									
									if ( ! empty($date['to']))
									{
										$time[] = "`last` < ".strtotime($date['to']);
									}
									
									if ( ! empty($time))
									{
										$query[] = '('.implode(' AND ', $time).')';
									}
								}

								if ( ! empty($query))
								{
									$this->db->where('('.implode(' OR ', $query).')');
								}
							}
						}
					}
				}
				
				$this->db->order_by("last", "asc");
				$this->db->where("status <>", 3);
				$result = $this->db->get("sent")->result_array();

				if ( ! empty($result))
				{
					$stat = array();
					$stat['max'] = array();
					$stat['min'] = array();
					$stat['average'] = 0;
					$stat['for_user'] = 0;
					$stat['stars_count'] = array(0, 0, 0, 0, 0, 0);
					$stat['average_month_x'] = array();
					$stat['average_month_key'] = array();
					$stat['average_month'] = array();
					$stat['average_all_month'] = array();
					$stat['average_nps'] = array('12' => 0, '3' => 0, '45' => 0, '12p' => 0, '3p' => 0, '45p' => 0, 'all' => 0, 'delta' => 0);
					$stat['history_nps'] = array();
					$stat['nps_all_month'] = array();
					$stat['reply'] = array();
					$stat['reply_percent'] = 0;
					$stat['reply_click'] = 0;
					$stat['reply_percents'] = array();
					$stat['reply_clicks'] = array();
					$stat['reply_highest'] = 0;
					$stat['reply_lowest'] = 0;
					$stat['reply_chart'] = array('reply' => 0, 'click' => 0, 'none' => 0);
					$stat['hours'] = '';
					$stat['days'] = '';

					$count = array();
					$count['all'] = 0;
					$count['for_user'] = 0;
					$count['average_sum'] = 0;
					$count['reply_all'] = 0;
					$count['reply_only'] = 0;
					$count['reply_click'] = 0;
					$count['reply_count'] = array();
					$count['all_month_sum'] = array();
					$count['all_month_num'] = array();
					$count['all_nps'] = array();
					$count['hours'] = array();
					$count['days'] = array();

					$start_date = time();
					foreach ($result as $row)
					{
						if ( ! empty($row['last']))
						{
							$start_date = min($start_date, $row['last']);
						}
					}
					$month_start = date('n', $start_date);
					$year_start = date('Y', $start_date);
					$month_finish = date('n');
					$year_finish = date('Y');
					while ( ! ($month_start >= $month_finish && $year_start >= $year_finish))
					{
						$stat['average_month_x'][] = date("M 'y", mktime(0, 0, 0, $month_start, 1, $year_start));
						$stat['average_month_key'][] = $year_start.'-'.str_pad($month_start, 2, '0', STR_PAD_LEFT);
						
						$month_start++;
						if ($month_start > 12)
						{
							$month_start = 1;
							$year_start++;
						}
					}

					for ($i = 1; $i <= 5; $i++)
					{
						foreach ($stat['average_month_key'] as $key)
						{
							$stat['average_month'][$i][$key] = 0;
						}
					}

					foreach ($stat['average_month_key'] as $key)
					{
						$stat['history_nps']['12'][$key] = 0;
						$stat['history_nps']['3'][$key] = 0;
						$stat['history_nps']['45'][$key] = 0;

						$count['all_month_sum'][$key] = 0;
						$count['all_month_num'][$key] = 0;
						$count['all_nps']['12'][$key] = 0;
						$count['all_nps']['45'][$key] = 0;
					}
					
					$onlines = array('facebook', 'google', 'zorgkaart', 'telefoonboek', 'vergelijkmondzorg', 'independer', 'kliniekoverzicht', 'own');
					
					foreach ($result as $row)
					{
						$month = FALSE;
						if ( ! empty($row['last']))
						{
							$month = date('Y-m', $row['last']);
						}
						
						if ( ! empty($row['last']))
						{
							$hours = date('G', $row['last']);
							if ( ! isset($count['hours'][$hours]))
							{
								$count['hours'][$hours] = 0;
							}
							$count['hours'][$hours]++;
							
							$day = date('w', $row['last']);
							$day = $day == 0 ? 7 : $day;
							if ( ! isset($count['days'][$day]))
							{
								$count['days'][$day] = 0;
							}
							$count['days'][$day]++;
						}

						if ($row['stars'] > 0)
						{
							$count['for_user']++;
							$count['average_sum'] += $row['stars'];

							if (isset($stat['average_month'][$row['stars']][$month]))
							{
								$stat['average_month'][$row['stars']][$month]++;
							}
							
							if ($row['stars'] <= 2)
							{
								$stat['average_nps']['12']++;
								if (isset($stat['history_nps']['12'][$month]))
								{
									$stat['history_nps']['12'][$month]++;
								}
							}
							elseif ($row['stars'] == 3)
							{
								$stat['average_nps']['3']++;
								if (isset($stat['history_nps']['3'][$month]))
								{
									$stat['history_nps']['3'][$month]++;
								}
							}
							else
							{
								$stat['average_nps']['45']++;
								if (isset($stat['history_nps']['45'][$month]))
								{
									$stat['history_nps']['45'][$month]++;
								}
							}
							$stat['average_nps']['all']++;
						}
						
						$count['reply_all']++;
						if ($row['status'] == 2)
						{
							$count['reply_only']++;
							$check = 0;
							foreach ($onlines as $key)
							{
								$check += $row[$key];
							}

							if ( ! empty($check))
							{
								$count['reply_click']++;
							}
						}
						
						if ( ! empty($row['batches_id']))
						{
							if ( ! isset($count['reply_count'][$row['batches_id']]))
							{
								$count['reply_count'][$row['batches_id']]['all'] = 0;
								$count['reply_count'][$row['batches_id']]['only'] = 0;
								$count['reply_count'][$row['batches_id']]['click'] = 0;
							}
							
							$count['reply_count'][$row['batches_id']]['all']++;
							if ($row['status'] == 2)
							{
								$count['reply_count'][$row['batches_id']]['only']++;
								$check = 0;
								foreach ($onlines as $key)
								{
									$check += $row[$key];
								}

								if ( ! empty($check))
								{
									$count['reply_count'][$row['batches_id']]['click']++;
								}
							}
						}
						
						$stat['stars_count'][$row['stars']]++;

						if ( ! empty($month) && isset($count['all_nps']['12'][$month]))
						{
							if ($row['stars'] <= 2 && isset($count['all_nps']['12'][$month]))
							{
								$count['all_nps']['12'][$month]++;
							}
							elseif ($row['stars'] >= 4 && isset($count['all_nps']['45'][$month]))
							{
								$count['all_nps']['45'][$month]++;
							}
						}

						if ( ! empty($month) && isset($count['all_month_sum'][$month]))
						{
							$count['all_month_sum'][$month] += $row['stars'];
							$count['all_month_num'][$month]++;
						}
						
						$count['all']++;
					}
					
					if ( ! empty($count['hours']))
					{
						arsort($count['hours']);
						reset($count['hours']);
						$stat['hours'] = key($count['hours']);
					}
					
					if ( ! empty($count['days']))
					{
						arsort($count['days']);
						reset($count['days']);
						$stat['days'] = key($count['days']);
					}
					
					if ( ! empty($count['for_user']))
					{
						$stat['average'] = number_format(round($count['average_sum'] / $count['for_user'], 1), 1);
						$stat['for_user'] = $count['for_user'];
					}
					
					if ( ! empty($stat['average_nps']['all']))
					{
						$stat['average_nps']['12p'] = round($stat['average_nps']['12'] / $stat['average_nps']['all'] * 100);
						$stat['average_nps']['3p'] = round($stat['average_nps']['3'] / $stat['average_nps']['all'] * 100);
						$stat['average_nps']['45p'] = round($stat['average_nps']['45'] / $stat['average_nps']['all'] * 100);
						$stat['average_nps']['delta'] = $stat['average_nps']['45'] - $stat['average_nps']['12'];
					}

					$sum_all_month = 0;
					$num_all_month = 0;
					$nps_all_45 = 0;
					$nps_all_12 = 0;
					
					foreach ($count['all_month_num'] as $month => $val)
					{
						$all_sum = empty($count['all_month_sum'][$month]) ? 0 : $count['all_month_sum'][$month];
						$sum_all_month += $all_sum;
						$all_num = empty($count['all_month_num'][$month]) ? 0 : $count['all_month_num'][$month];
						$num_all_month += $all_num;
						$stat['average_all_month'][$month] = empty($num_all_month) ? 0 : round($sum_all_month / $num_all_month, 1);

						$nps_all_45 += $count['all_nps']['45'][$month];
						$nps_all_12 += $count['all_nps']['12'][$month];
						$stat['nps_all_month'][$month] = $nps_all_45 - $nps_all_12;
					}

					$stat['questions'] = $this->pub->get_questions();
					if ( ! empty($stat['questions']))
					{
						$q_sum = array();
						$q_num = array();
						if ( ! empty($sent_ids))
						{
							$this->db->where_in('sent_id', $sent_ids);
						}
						$result = $this->db->get('sent_questions')->result_array();
						foreach ($result as $row)
						{
							if ( ! isset($q_sum[$row['questions_id']]))
							{
								$q_sum[$row['questions_id']] = 0;
							}
							$q_sum[$row['questions_id']] += $row['stars'];
							
							if ( ! isset($q_num[$row['questions_id']]))
							{
								$q_num[$row['questions_id']] = 0;
							}
							$q_num[$row['questions_id']]++;
						}
						
						foreach ($stat['questions'] as $key => $row)
						{
							$stat['questions'][$key]['average'] = 0;
							if ( ! empty($q_num[$row['id']]))
							{
								$stat['questions'][$key]['average'] = number_format(round($q_sum[$row['id']] / $q_num[$row['id']], 1), 1);
							}
						}
					}
					
					if ( ! empty($count['reply_all']))
					{
						$stat['reply_percent'] = round($count['reply_only'] / $count['reply_all'] * 100, 1);
						$stat['reply_click'] = round($count['reply_click'] / $count['reply_all'] * 100, 1);
						
						$stat['reply_chart']['click'] = $stat['reply_click'];
						$stat['reply_chart']['none'] = 100 - $stat['reply_percent'];
						$stat['reply_chart']['reply'] = $stat['reply_percent'] - $stat['reply_click'];
					}
					
					if ( ! empty($count['reply_count']))
					{
						foreach ($count['reply_count'] as $id => $row)
						{
							$value = round($row['only'] / $row['all'] * 100, 1);
							$stat['reply_percents'][$id] = $value;
							
							$value = round($row['click'] / $row['all'] * 100, 1);
							$stat['reply_clicks'][$id] = $value;
							$stat['reply_highest'] = max($stat['reply_highest'], $value);
							if ( ! isset($stat['reply_lowest']))
							{
								$stat['reply_lowest'] = $value;
							}
							else
							{
								$stat['reply_lowest'] = min($stat['reply_lowest'], $value);
							}
						}
					}
					
					$this->db->order_by('sent_date', 'desc');
					$this->db->limit(10);
					$result = $this->db->get('sent_dates')->result_array();
					foreach ($result as $row)
					{
						$stat['batches'][] = array('date' => date('d-m-Y', $row['sent_date']),
												   'amount' => $row['emails_amount'],
												   'reply' => ! empty($stat['reply_percents'][$row['batches_id']]) ? $stat['reply_percents'][$row['batches_id']] : 0,
												   'click' => ! empty($stat['reply_clicks'][$row['batches_id']]) ? $stat['reply_clicks'][$row['batches_id']] : 0);
					}

					$users = array();
					$sents = array();
					arsort($actives);
					$max = array();
					$count = 0;
					
					foreach ($actives as $key => $val)
					{
						if ($count < 15)
						{
							$max[] = $key;
							$users[] = $key;
							$sents[$key] = $val;
						}
						$count++;
					}

					asort($actives);
					$min = array();
					$count = 0;
					foreach ($actives as $key => $val)
					{
						if ($count < 15)
						{
							$min[] = $key;
							$users[] = $key;
							$sents[$key] = $val;
						}
						$count++;
					}
					
					if ( ! empty($users))
					{
						$sessions = array();
						$this->db->where_in("users_id", $users);
						$res = $this->db->get("sessions")->result_array();

						foreach ($res as $row)
						{
							$sessions[$row['users_id']][] = $row['users_login'];
						}

						$this->db->where_in("id", $users);
						$res = $this->db->get("users")->result_array();

						foreach ($max as $id)
						{
							foreach ($res as $row)
							{
								$login_date = empty($sessions[$row['id']]) ? '---' : date("d-m-Y", max($sessions[$row['id']]));
								$login_date = $login_date == date("d-m-Y") ? "Vandaag" : ($login_date == date("d-m-Y", time() - 24 * 3600) ? "Gisteren" : $login_date);
								if ($id == $row['id'])
								{
									$stat['max'][] = array("id" => $row['id'],
														   "username" => $row['username'],
														   "login_date" => $login_date,
														   "login_number" => empty($sessions[$row['id']]) ? 0 : count($sessions[$row['id']]),
														   "sent_number" => $sents[$row['id']]);
								}
							}
						}

						foreach ($min as $id)
						{
							foreach ($res as $row)
							{
								$login_date = empty($sessions[$row['id']]) ? '---' : date("d-m-Y", max($sessions[$row['id']]));
								$login_date = $login_date == date("d-m-Y") ? "Vandaag" : ($login_date == date("d-m-Y", time() - 24 * 3600) ? "Gisteren" : $login_date);
								if ($id == $row['id'])
								{
									$stat['min'][] = array("id" => $row['id'],
														   "username" => $row['username'],
														   "login_date" => $login_date,
														   "login_number" => empty($sessions[$row['id']]) ? 0 : count($sessions[$row['id']]),
														   "sent_number" => $sents[$row['id']]);
								}
							}
						}
					}
					
					return $stat;
				}
			}

			return FALSE;
		}
		
		function stat()
		{
			$now = mktime(0, 0, 0, date("n"), date("j"), date("Y"));
			$stat = array("trial" => 0,
						  "trial_date" => "",
						  "basic" => 0,
						  "pro" => 0,
						  "ultimate" => 0,
						  "added14" => array(),
						  "expire14" => array(),
						  "spent" => 0,
						  "uploads" => 0,
						  "between" => 0);
			$result = $this->db->get("users")->result_array();
			$users_count = count($result);
			foreach ($result as $row)
			{
				if ($row['account'] == 2)
				{
					$stat['trial']++;
				}
				elseif ($row['account'] == 1)
				{
					if ($row['account_type'] == 0 && $row['organization'] == 0)
					{
						$stat['basic']++;
					}
					elseif ($row['account_type'] == 1 && $row['organization'] == 0)
					{
						$stat['pro']++;
					}
					elseif ($row['organization'] == 1)
					{
						$stat['ultimate']++;
					}
				}
				
				if ($row['signup'] >= $now - 30 * 24 * 3600)
				{
					$stat['added14'][] = array("id" => $row['id'], "username" => $row['username'], "date" => date("d-m-Y", $row['signup']));
				}
				
				if ($row['suspension'] > $now && $row['suspension'] <= $now + 30 * 24 * 3600)
				{
					$stat['expire14'][] = array("id" => $row['id'], "username" => $row['username'], "date" => date("d-m-Y", $row['suspension']));
				}
				
				$stat['trial_date'] = max($stat['trial_date'], $row['signup']);
			}
			
			if ( ! empty($stat['trial_date']))
			{
				$stat['trial_date'] = date("d-m-Y", $stat['trial_date']);
			}
			
			$result = $this->db->get("sessions")->result_array();
			if ( ! empty($result))
			{
				foreach ($result as $row)
				{
					$stat['spent'] += round(($row['users_logout'] - $row['users_login']) / 60);
				}
				
				$stat['spent'] = round($stat['spent'] / count($result));
			}
			
			$this->db->where("status <>", 3);
			$count = $this->db->count_all_results("sent");
			$stat['uploads'] = round($count / $users_count);
			
			$this->db->order_by("sent_date", "desc");
			$result = $this->db->get("sent_dates")->result_array();
			$dates = array();
			if ( ! empty($result))
			{
				foreach ($result as $row)
				{
					if ( ! empty($dates[$row['users_id']]) && count($dates[$row['users_id']]) < 2)
					{
						$dates[$row['users_id']][] = $row['sent_date'];
					}
				}
				
				foreach ($dates as $row)
				{
					$stat['between'] += round($row[0] - $row[1] / (24 * 60 * 60));
				}
				
				if ( ! empty($dates))
				{
					$stat['between'] = round($stat['between'] / count($dates));
				}
			}
			
			return $stat;
		}

		function check_one_month()
		{
			$now = time();
			$this->db->where("suspension >", $now);
			$this->db->where("suspension <=", $now + (30 * 24 * 60 * 60));
			$this->db->where("last_send <", "`suspension` - ".(30 * 24 * 60 * 60), FALSE);
			$result = $this->db->get("users")->result_array();

			if ( ! empty($result))
			{
				foreach ($result as $row)
				{
					$row['domain'] = (( ! empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://").$_SERVER['HTTP_HOST'].'/';
					$row['suspension'] = date('d-m-y', $row['suspension']);
					$message = $this->load->view('views/mail/tpl_one_month.html', $row, TRUE);
					if ($this->send("month", "info@patientenreview.nl", 'Notificatie: Abonnement verloopt binnenkort', $message))
					{
						$this->db->where("id", $row['id']);
						$this->db->update("users", array("last_send" => $now));
					}
				}
			}
		}

		function save_logo($tmp_file)
		{
			if ($tmp_file['type'] == "image/jpeg" || $tmp_file['type'] == "image/png")
			{
				if ( ! file_exists('./logos/tmp/'))
				{
					mkdir('./logos/tmp/', 0755, TRUE);
				}
				
				$part = explode('.', $tmp_file['name']);
				$ext = strtolower(array_pop($part));
				$file = time().mt_rand(1000, 9999).'.'.$ext;
				$config['source_image'] = $tmp_file['tmp_name'];
				$config['new_image'] = './logos/tmp/'.$file;
				$config['width'] = '300';
				$config['height'] = '80';

				$this->load->library('image_lib', $config);
				if ( ! $this->image_lib->resize())
				{
					$this->errors[] = array($this->image_lib->display_errors());
				}
				else
				{
					return $file;
				}
			}
			else
			{
				$this->errors[] = array("U kunt alleen .png en .jpg bestanden gebruiken.");
			}
		}
		
		function save_avatar($tmp_file)
		{
			if ($tmp_file['type'] == "image/jpeg" || $tmp_file['type'] == "image/png")
			{
				if ( ! file_exists('./avatars/tmp/'))
				{
					mkdir('./avatars/tmp/', 0755, TRUE);
				}
				
				$part = explode('.', $tmp_file['name']);
				$ext = strtolower(array_pop($part));
				$file = time().mt_rand(1000, 9999).'.'.$ext;
				$config['source_image'] = $tmp_file['tmp_name'];
				$config['new_image'] = './avatars/tmp/'.$file;
				$config['width'] = '100';
				$config['height'] = '100';

				$this->load->library('image_lib', $config);
				if ( ! $this->image_lib->resize())
				{
					$this->errors[] = array($this->image_lib->display_errors());
				}
				else
				{
					return $file;
				}
			}
			else
			{
				$this->errors[] = array("U kunt alleen .png en .jpg bestanden gebruiken.");
			}
		}
		
		function editor_upload($file)
		{
			$link = array('link' => '');
			if ($this->logged_in())
			{
				if ($file['type'] == "image/jpeg" || $file['type'] == "image/png")
				{
					$this->db->where('id', $this->session->userdata('id'));
					$this->db->limit(1);
					$row = $this->db->get('users')->row_array();
					if ( ! empty($row))
					{
						$folder = md5($row['id'].$row['signup']);
						$path = './files/'.$folder.'/';
						$part = explode('.', $file['name']);
						$ext = strtolower(array_pop($part));
						$filename = time().mt_rand(1000, 9999).'.'.$ext;

						if ( ! file_exists($path.'image/'))
						{
							mkdir($path.'image/', 0755, TRUE);
						}
						
						if (rename($file['tmp_name'], $path.'image/'.$filename))
						{
							if ( ! file_exists($path.'thumb/'))
							{
								mkdir($path.'thumb/', 0755, TRUE);
							}
							
							$config['source_image'] = $path.'image/'.$filename;
							$config['new_image'] = $path.'thumb/'.$filename;
							$config['width'] = '150';
							$config['height'] = '150';

							$this->load->library('image_lib', $config);
							if ($this->image_lib->resize())
							{
								$link['link'] = base_url().'files/'.$folder.'/image/'.$filename;
							}
						}
					}
				}
			}
			
			return $link;
		}
		
		function editor_get()
		{
			$items = array();
			if ($this->logged_in())
			{
				$this->db->where('id', $this->session->userdata('id'));
				$this->db->limit(1);
				$row = $this->db->get('users')->row_array();
				if ( ! empty($row))
				{
					$folder = md5($row['id'].$row['signup']);
					$path = './files/'.$folder.'/';
					
					if (file_exists($path.'image/'))
					{
						$files = array_diff(scandir($path.'image/'), array('.', '..'));
						foreach ($files as $file)
						{
							$items[] = array('url' => base_url().'files/'.$folder.'/image/'.$file,
											 'thumb' => base_url().'files/'.$folder.'/thumb/'.$file,
											 'tag' => 'Images');
						}
					}
				}
			}
			
			return $items;
		}
		
		function editor_delete()
		{
			if ( ! empty($_POST['src']))
			{
				$temp = explode('/thumb/', $_POST['src']);
				$file = $temp['1'];
				if ($this->logged_in())
				{
					$this->db->where('id', $this->session->userdata('id'));
					$this->db->limit(1);
					$row = $this->db->get('users')->row_array();
					if ( ! empty($row))
					{
						$folder = md5($row['id'].$row['signup']);
						$path = './files/'.$folder.'/';
						
						if (file_exists($path.'image/'.$file))
						{
							unlink($path.'image/'.$file);
							if (file_exists($path.'thumb/'.$file))
							{
								unlink($path.'thumb/'.$file);
							}
						}
					}
				}
			}
		}
		
		function users_invoices($ids)
		{
			$items = array();
			if (count($ids) > 0)
			{
				$this->db->order_by("date", "desc");
				$this->db->where_in("users_id", $ids);
				$result = $this->db->get("invoices")->result_array();
				foreach ($result as $row)
				{
					if ( ! isset($items[$row['users_id']]))
					{
						$items[$row['users_id']] = md5($row['id'].$row['date']);
					}
				}
			}
			return $items;
		}

		function click($post)
		{
			if (empty($post['id']))
			{
				$data_array = array('users_id' => $post['users_id'],
									'doctor' => $post['doctors_id'],
									'start' => time(),
									'date' => time(),
									'last' => time(),
									'ip' => $_SERVER['REMOTE_ADDR']);
				$data_array[$post['type']] = TRUE;
				
				$this->db->insert("sent", $data_array);
				return $this->db->insert_id();
			}
			else
			{
				$this->db->where("id", $post['id']);
				$this->db->update("sent", array($post['type'] => TRUE));
				return $post['id'];
			}
		}

		function last_dashboard($post)
		{
			$items = array("average" => 0,
						   "average_online" => 0);
			if ($this->logged_in())
			{
				$this->db->where("id", $this->session->userdata("id"));
				$this->db->update("users", array("average_now" => $post['average'], "average_online_now" => $post['average_online']));

				$this->db->where("id", $this->session->userdata("id"));
				$this->db->limit(1);
				$row = $this->db->get("users")->row_array();
				if ( ! empty($row))
				{
					$percent = $row['average_last'] / 100;
					if ($percent > 0)
					{
						//$items['average'] = floor(round(($row['average_now'] - $row['average_last']) / $percent, 2) * 2) / 2;
						$items['average'] = round(($row['average_now'] - $row['average_last']) / $percent, 1);
					}
					else
					{
						$items['average'] = 100;
					}

					$percent = $row['average_online_last'] / 100;
					if ($percent > 0)
					{
						//$items['average_online'] = floor(round(($row['average_online_now'] - $row['average_online_last']) / $percent, 2) * 2) / 2;
						$items['average_online'] = round(($row['average_online_now'] - $row['average_online_last']) / $percent, 1);
					}
					else
					{
						$items['average_online'] = 100;
					}
				}
			}

			return $items;
		}

		function save_facebook_token($token)
		{
			if ($this->logged_in())
			{
				$this->db->where("id", $this->session->userdata("id"));
				$this->db->update("users", array("facebook_token" => $token));
			}
		}
		
		function ratings($users_id = FALSE)
		{
			$items = array();
			if ( ! empty($users_id))
			{
				$this->db->where("users_id", $users_id);
			}
			$this->db->order_by("reviews.time", "desc");
			$this->db->join("users", "reviews.users_id = users.id");
			$result = $this->db->get("reviews")->result_array();
			foreach ($result as $row)
			{
				$items[$row['profile']]['rating'] = $row['rating'];
				$items[$row['profile']]['reviews'][] = $row;
				$items[$row['profile']]['username'][] = $row['username'];
			}
			
			return $items;
		}
		
		function onlines()
		{
			$today = mktime(0, 0, 0, date("n"), date("j"), date("Y"));
			$profiles = array("facebook", "google", "zorgkaart", "independer", "telefoonboek");
			
			$result = $this->db->get("users")->result_array();
			foreach ($result as $row)
			{
				foreach ($profiles as $profile)
				{
					if ($row[$profile.'_checked'] && ! empty($row[$profile]) && $row[$profile.'_last'] != $today)
					{
						$method = $profile."_info";
						$this->$method($row['id']);
						
						$this->db->where("id", $row['id']);
						$this->db->update("users", array($profile.'_last' => $today));
					}
				}
			}
		}
		
		function facebook_info($users_id)
		{
			$this->db->where("id", $users_id);
			$this->db->limit(1);
			$info = $this->db->get("users")->row_array();

			if (empty($info['sites']) && $info['facebook_checked'] && ! empty($info['facebook']))
			{
				$this->load->library('Facebook');
				if ($this->facebook->is_token($info['facebook_token']))
				{
					$temp = explode('/', $info['facebook']);
					$alias = $temp[3];
					
					$facebook_id = $this->facebook->get_facebook_id($alias);
					if ( ! empty($facebook_id))
					{
						$page_token = $this->facebook->get_page_token($facebook_id);
						if ( ! empty($page_token))
						{
							$ratings = $this->facebook->get_ratings($facebook_id, $page_token);
							if ( ! empty($ratings))
							{
								$rating = 0;
								$count = 0;
								foreach ($ratings as $row)
								{
									$rating += $row['rating'];
									$count++;
								}
								
								if ( ! empty($count))
								{
									$rating = round($rating / $count, 1);
								}
								
								$this->save_reviews_history($users_id, 'facebook', $rating);
								
								foreach ($ratings as $row)
								{
									if ( ! empty($row['review_text']))
									{
										$data_array = array("users_id" => $users_id,
															"profile" => "facebook",
															"rating" => $rating,
															"score" => $row['rating'],
															"text" => $row['review_text'],
															"link" => $info['facebook'],
															"date" => $row['created_time']->format('d-m-Y'),
															"time" => $row['created_time']->getTimestamp(),
															"hash" => md5($row['review_text']));

										$this->db->where("hash", $data_array['hash']);
										if ($this->db->count_all_results("reviews"))
										{
											$this->db->where("hash", $data_array['hash']);
											$this->db->update("reviews", $data_array);
										}
										else
										{
											$this->db->insert("reviews", $data_array);
										}
									}
								}
							}
						}
					}
				}
			}

			return TRUE;
		}

		function google_info($users_id)
		{
			$this->db->where("id", $users_id);
			$this->db->limit(1);
			$info = $this->db->get("users")->row_array();

			if (empty($info['sites']) && $info['google_checked'] && ! empty($info['google']))
			{
				if (empty($info['google_place_id']))
				{
					$part = explode("/", $info['google']);
					$google_id = ($part[3] == "u" && ! empty($part[5])) ? $part[5] : $part[3];

					$res = json_decode(file_get_contents("https://www.googleapis.com/plus/v1/people/".$google_id."?fields=nickname&key=".$this->google_key), TRUE);
					$username = ! empty($res['nickname']) ? $res['nickname'] : $info['username'];

					$search = json_decode(file_get_contents("https://maps.googleapis.com/maps/api/place/textsearch/json?query=".urlencode($username)."&key=".$this->google_key."&language=nl"), TRUE);
					if ( ! empty($search['results'][0]['place_id']))
					{
						$info['google_place_id'] = $search['results'][0]['place_id'];

						$this->db->where("id", $info['id']);
						$this->db->update("users", array("google_place_id" => $info['google_place_id']));
					}
				}

				if ( ! empty($info['google_place_id']))
				{
					$place = json_decode(file_get_contents("https://maps.googleapis.com/maps/api/place/details/json?placeid=".$info['google_place_id']."&key=".$this->google_key."&language=nl"), TRUE);
					$rating = ! empty($place['result']['rating']) ? $place['result']['rating'] : 0;
					if (empty($rating) && ! empty($place['result']['reviews']))
					{
						$av = 0;
						foreach ($place['result']['reviews'] as $r)
						{
							$av += $r['rating'];
						}
						$rating = round($av / count($place['result']['reviews']), 2);
					}
					
					$this->save_reviews_history($users_id, 'google', $rating);

					if ( ! empty($place['result']['reviews']))
					{
						for ($i = 0, $count = count($place['result']['reviews']); $i < $count; $i++)
						{
							if ( ! empty($place['result']['reviews'][$i]))
							{
								$data_array = array("users_id" => $users_id,
													"profile" => "google",
													"rating" => $rating,
													"score" => $place['result']['reviews'][$i]['rating'],
													"text" => $place['result']['reviews'][$i]['text'],
													"link" => $info['google'],
													"date" => date("d-m-Y", $place['result']['reviews'][$i]['time']),
													"time" => $place['result']['reviews'][$i]['time'],
													"hash" => md5($place['result']['reviews'][$i]['text']));

								$this->db->where("hash", $data_array['hash']);
								if ($this->db->count_all_results("reviews"))
								{
									$this->db->where("hash", $data_array['hash']);
									$this->db->update("reviews", $data_array);
								}
								else
								{
									$this->db->insert("reviews", $data_array);
								}
							}
						}
					}
				}
			}

			return TRUE;
		}

		function zorgkaart_info($users_id)
		{
			$this->db->where("id", $users_id);
			$this->db->limit(1);
			$info = $this->db->get("users")->row_array();

			if (empty($info['sites']) && $info['zorgkaart_checked'] && ! empty($info['zorgkaart']))
			{
				$url = str_replace("/waardeer", "", $info['zorgkaart']);
				$part = explode("-", $url);
				$id = array_pop($part);

				$rating = 0;
				$content = file_get_contents("https://www.zorgkaartnederland.nl/zkn/widget/score/t/3/v/2/organisatie/".$id);
				if ( ! empty($content) && ($pos = strpos($content, "ZorgkaartNederland en heeft een gemiddeld cijfer van ")) !== FALSE)
				{
					$last = str_replace("ZorgkaartNederland en heeft een gemiddeld cijfer van ", "", substr($content, $pos));
					$zorgkaart = substr($last, 0, 3);
					$rating = round($zorgkaart / 2, 2);
				}
				
				$this->save_reviews_history($users_id, 'zorgkaart', $rating);

				$feed = file_get_contents(rtrim($url, '/')."/rss");
				$feed = str_replace('<media:', '<', $feed);

				$count = 0;
				$rss = simplexml_load_string($feed);

				if ( ! empty($rss->channel->item))
				{
					foreach ($rss->channel->item as $item)
					{
						$title = $item->title->__toString();
						$temp = explode(":", $title);
						$score = floor(trim($temp[1]) / 2);
						$desc = $item->description->__toString();
						$desc .= (strlen($desc) == 150) ? "..." : "";

						$data_array = array("users_id" => $users_id,
											"profile" => "zorgkaart",
											"rating" => $rating,
											"score" => $score,
											"text" => $desc,
											"link" => $url,
											"date" => date("d-m-Y", strtotime($item->pubDate->__toString())),
											"time" => strtotime($item->pubDate->__toString()),
											"hash" => md5($desc));

						$this->db->where("hash", $data_array['hash']);
						if ($this->db->count_all_results("reviews"))
						{
							$this->db->where("hash", $data_array['hash']);
							$this->db->update("reviews", $data_array);
						}
						else
						{
							$this->db->insert("reviews", $data_array);
						}
					}
				}
			}

			return TRUE;
		}
		
		function independer_info($users_id)
		{
			$this->db->where("id", $users_id);
			$this->db->limit(1);
			$info = $this->db->get("users")->row_array();

			if (empty($info['sites']) && $info['independer_checked'] && ! empty($info['independer_scrap']))
			{
				$ciphers = implode(':', array(
												'ECDHE-RSA-AES128-GCM-SHA256',
												'ECDHE-ECDSA-AES128-GCM-SHA256',
												'ECDHE-RSA-AES256-GCM-SHA384',
												'ECDHE-ECDSA-AES256-GCM-SHA384',
												'DHE-RSA-AES128-GCM-SHA256',
												'DHE-DSS-AES128-GCM-SHA256',
												'kEDH+AESGCM',
												'ECDHE-RSA-AES128-SHA256',
												'ECDHE-ECDSA-AES128-SHA256',
												'ECDHE-RSA-AES128-SHA',
												'ECDHE-ECDSA-AES128-SHA',
												'ECDHE-RSA-AES256-SHA384',
												'ECDHE-ECDSA-AES256-SHA384',
												'ECDHE-RSA-AES256-SHA',
												'ECDHE-ECDSA-AES256-SHA',
												'DHE-RSA-AES128-SHA256',
												'DHE-RSA-AES128-SHA',
												'DHE-DSS-AES128-SHA256',
												'DHE-RSA-AES256-SHA256',
												'DHE-DSS-AES256-SHA',
												'DHE-RSA-AES256-SHA',
												'AES128-GCM-SHA256',
												 'AES256-GCM-SHA384',
												'ECDHE-RSA-RC4-SHA',
												'ECDHE-ECDSA-RC4-SHA',
												'AES128',
												'AES256',
												'RC4-SHA',
												'HIGH',
												'!aNULL',
												'!eNULL',
												'!EXPORT',
												'!DES',
												'!3DES',
												'!MD5',
												'!PSK'
											));
				$context = stream_context_create(array(
					/*'ssl' => array(
						'ciphers' => $ciphers,
						'verify_peer' => true,
						'cafile' => '/etc/ssl/certs/ca-certificates.crt', // <-- EDIT FOR NON-DEBIAN/UBUNTU SYSTEMS
						'CN_match' => "www.independer.nl",
						'verify_depth' => 3,
						'disable_compression' => true,
						'SNI_enabled' => true,
						'SNI_server_name' => "www.independer.nl"
					)*/
					'ssl' => array("verify_peer"=>false,
									"verify_peer_name"=>false)
				));
				$content = file_get_contents($info['independer_scrap'], null, $context);

				if ( ! empty($content))
				{
					$rating = 0;
					if (($pos = strpos($content, 'Klantcijfer: <span class="value">')) !== FALSE)
					{
						$last = explode('Klantcijfer: <span class="value">', $content);
						$independer = substr($last[1], 0, 3);
						$rating = round(str_replace(",", ".", $independer) / 2, 2);
					}
					
					$this->save_reviews_history($users_id, 'independer', $rating);

					if (strpos($content, '<div id="reviews" class="reviewList">') !== FALSE)
					{
						$part = explode('<div id="reviews" class="reviewList">', $content);
						if ( ! empty($part[1]))
						{
							$reviews = explode('<span class="scoreValue"><span class="value">', $part[1]);
							for ($i = 1, $count = count($reviews); $i < $count; $i++)
							{
								$score = substr($reviews[$i], 0, 3);
								$score = round(str_replace(",", ".", $score) / 2, 2);
								
								$t = explode('<span class="text">', $reviews[$i]);
								$text = explode('</span>', $t[1]);
								$desc = strip_tags($text[0]);
								
								$data_array = array("users_id" => $users_id,
													"profile" => "independer",
													"rating" => $rating,
													"score" => $score,
													"text" => $desc,
													"link" => $info['independer_scrap'],
													"date" => "",
													"time" => 0,
													"hash" => md5($desc));

								$this->db->where("hash", $data_array['hash']);
								if ($this->db->count_all_results("reviews"))
								{
									$this->db->where("hash", $data_array['hash']);
									$this->db->update("reviews", $data_array);
								}
								else
								{
									$this->db->insert("reviews", $data_array);
								}
							}
						}
					}
				}
			}

			return TRUE;
		}
		
		function telefoonboek_info($users_id)
		{
			$this->db->where("id", $users_id);
			$this->db->limit(1);
			$info = $this->db->get("users")->row_array();

			if (empty($info['sites']) && $info['telefoonboek_checked'] && ! empty($info['telefoonboek']))
			{
				$content = file_get_contents($info['telefoonboek']);
				if ( ! empty($content) && ($pos = strpos($content, '<span itemprop="ratingValue">')) !== FALSE)
				{
					$last = explode('<span itemprop="ratingValue">', $content);
					$telefoonboek = substr($last[1], 0, 3);
					$rating = round($telefoonboek / 2, 2);
					
					$data_array = array("users_id" => $users_id,
										"profile" => "telefoonboek",
										"rating" => $rating,
										"score" => 0,
										"text" => "",
										"link" => $info['telefoonboek'],
										"date" => "",
										"time" => 0,
										"hash" => md5($rating));
					
					$this->db->where("hash", $data_array['hash']);
					if ($this->db->count_all_results("reviews"))
					{
						$this->db->where("hash", $data_array['hash']);
						$this->db->update("reviews", $data_array);
					}
					else
					{
						$this->db->insert("reviews", $data_array);
					}
				}
			}

			return TRUE;
		}
		
		function save_reviews_history($users_id, $online, $rating)
		{
			$date = mktime(0, 0, 0, date('n'), date('j'), date('Y'));
			$data_array = array('users_id' => $users_id,
								$online => $rating,
								'date' => $date);

			$this->db->where('users_id', $users_id);
			$this->db->where('date', $date);
			$this->db->limit(1);
			$row = $this->db->get('reviews_history')->row_array();
			if ( ! empty($row))
			{
				$this->db->where('rows_id', $row['rows_id']);
				$this->db->update('reviews_history', $data_array);
			}
			else
			{
				$this->db->insert('reviews_history', $data_array);
			}
		}
		
		function mailgun_send($types = array(), $id = FALSE)
		{
			$config = array();
			include(ROOT.'/application/config/email.php');
			
			$mg = new Mailgun($config['key']);
			$domain = $config['domain'];
			
			if ($id)
			{
				$this->db->where("letters_id", $id);
			}
			else
			{
				if ( ! empty($types))
				{
					$this->db->where_in("letters_type", $types);
				}
			}
			$this->db->order_by("letters_id", "asc");
			$result = $this->db->get("letters")->result_array();

			if ( ! empty($result))
			{
				foreach ($result as $row)
				{
					$data = array('from' => $row['letters_from'].' <'.$row['letters_from_email'].'>', 
								  'to' => $row['letters_to'], 
								  'subject' => $row['letters_subject'],
								  'h:Reply-To' => $row['letters_from'].' <'.$row['letters_from_email'].'>',							  
								  'html' => $row['letters_message']);
					$attachment = array();

					if ($row['letters_type'] == "reminder")
					{
						$this->db->where("email", $row['letters_to']);
						$this->db->limit(1);
						$val = $this->db->get("users")->row_array();
						if ($val['account'] == 1 && $val['account_type'] == 0)
						{
							$attachment[] = ROOT.'/excel-basis-tpl.xls';
						}
						else
						{
							$attachment[] = ROOT.'/excel-tpl.xls';
						}
					}
					
					if ( ! empty($row['letters_attach']))
					{
						$attach = explode('&&', $row['letters_attach']);
						foreach ($attach as $file)
						{
							$attachment[] = str_replace('./', ROOT.'/', $file);
						}
					}

					$result = $mg->sendMessage($domain, $data, array('attachment' => $attachment));
					$code = $result->http_response_code;
					
					if ($code == 200)
					{
						$this->db->where("letters_id", $row['letters_id']);
						$this->db->delete("letters");
					}
					else
					{
						$content = '';
						$logItems = $result->http_response_body->items;
						foreach($logItems as $logItem)
						{
							$content .= $logItem->message_id."\n";
						}
						file_put_contents("log.txt", $content);
					}
				}
			}
			
			return TRUE;
		}
	}

/* End of file pub_model.php */
/* Location: ./application/models/pub_model.php */