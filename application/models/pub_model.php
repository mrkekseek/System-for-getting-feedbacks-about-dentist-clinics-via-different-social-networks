<?php

	if ( ! defined('BASEPATH')) exit('No direct script access allowed');
	class Pub_model extends CI_Model
	{
		var $errors = array();
		var $google_key = "AIzaSyCektmWg5NTvgzkwnRGq95_EPXYNOuhTGI";
		var $per_hour = 350;
		var $base_amount = 275;
		var $pro_amount = 450;
		var $doctor_amount = 60;
		var $period = 365;
		var $tags = array('subject' => '[ONDERWERP VAN E-MAIL]',
						  'title' => '[AANHEF PATIËNT]',
						  'name' => '[VOORNAAM PATIËNT]',
						  'sname' => '[ACHTERNAAM PATIËNT]',
						  'doctors_title' => '[AANHEF ZORGVERLENER]',
						  'doctors_name' => '[VOORNAAM ZORGVERLENER]',
						  'doctors_sname' => '[ACHTERNAAM ZORGVERLENER]',
						  'username' => '[NAAM PRAKTIJK]');
						  
		var $defaults = array('subject' => "Hoe was uw behandeling bij [NAAM PRAKTIJK]?",
							  'header' => "Hoe was uw behandeling?",
							  'gray' => "Zou u [NAAM PRAKTIJK] aanbevelen?",
							  'text1' => "Geachte heer/mevrouw,\n\nU bent onlangs behandeld in onze praktijk. We sturen u deze e-mail omdat we benieuwd zijn hoe u uw behandeling heeft ervaren. Uw mening is van onmisbaar belang voor de zorgverlener. Bovendien kunt u bijdragen aan het bevorderen van transparantie in de gezondheidszorg door uw beoordeling te plaatsen op online kanalen.\n\nOp een schaal van 1 tot 5 sterren, hoe waarschijnlijk is het dat u onze praktijk zou aanbevelen bij familie of vrienden?",
							  'text2' => "Klik op de knop hierboven om aan te geven in hoeverre u ons zou aanbevelen. Op de pagina die wordt geopend kunt u uw mening delen met anderen of ons team van feedback voorzien.\n\nBedankt voor het delen van uw mening!\n\nMet vriendelijke groet,\n\n[NAAM PRAKTIJK]",
							  'promo' => "Beoordeel ons en win een ... t.w.v. €..,..!",
							  'footer' => "U ontvangt deze eenmalige e-mail omdat uw e-mailadres is opgenomen in het patiëntenbestand van [NAAM PRAKTIJK]. Deze e-mail is een eenmalige uitnodiging volgend op uw behandeling. Uw e-mailadres wordt uitsluitend gebruikt voor het verzoek tot deelname aan dit patiënttevredenheidsonderzoek en wordt op geen enkele manier openbaar gemaakt.");
						  
		var $reserved = array('pub', 'welcome', 'send_new', 'cron', 'invitation', 'excel-tpl', 'excel-basis-tpl');
		function __construct()
		{
			parent::__construct();
			if (date("n") <= 2 && (date("Y") % 4 == 0) || date("n") > 2 && ((date("Y") + 1) % 4 == 0))
			{
				$this->period = 366;
			}
			
			$this->renew_logout();
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
			$this->db->where("reminder_time < ", $time + 30 * 60);
			$this->db->where("reminder_last <>", date("j"));
			$this->db->where("reminder_period", 1);
			$this->db->or_where("reminder_period", 0);
			$this->db->where("reminder_checked", TRUE);
			$this->db->where("reminder_time >=", $time);
			$this->db->where("reminder_time < ", $time + 30 * 60);
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
			if ($this->session->userdata("id"))
			{
				$this->db->where("id", $this->session->userdata("id"));
				$this->db->update("users", array("last" => time()));
			}
 		}
		
		function generate_invoices()
		{
			$time = time() - 24 * 3600;
			$today = mktime(0, 0, 0, date("m", $time), date("j", $time), date("Y", $time));
			
			$users_ids = array();
			$end = array();
			$users = array();
			$this->db->where("account", 1);
			$result = $this->db->get("users")->result_array();
			foreach ($result as $row)
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
						$base_amount = $this->base_amount;
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

							$response = file_get_contents("https://www.mollie.com/xml/ideal?a=createlink&partnerid=1959041&amount=".round($amount * 100)."&description=".$this->db->insert_id());
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
				$result['amount'] = $result['account_type'] == 0 ? $this->base_amount : $this->pro_amount;
				foreach ($result['doctors'] as $doc)
				{
					if ( ! $doc['free'])
					{
						$result['amount'] += $this->doctor_amount;
					}
				}
				
				$result['invoices'] = array();
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
				}
			}

			return $result;
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
			return $this->db->get("doctors")->row_array();
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
			$result['doctors'] = $this->get_doctors($id);
			$result['doctors_amount'] = 0;
			foreach ($result['doctors'] as $doc)
			{
				if (($type == 1 && ! $doc['free']) || $type == 0)
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
				$result['days'] = (mktime(0, 0, 0, date("n", $end), date("j", $end), date("Y", $end)) - $time) / (24 * 3600);
				$result['half_pro'] = round(($this->pro_amount / $this->period) * $result['days'], 2);
				$result['half_basic'] = round(($this->base_amount / $this->period) * $result['days'], 2);
				
				$result['amount'] = 0;
				if ($row['account'] == 1 && $row['account_type'] == 0)
				{
					$result['amount'] = $result['half_pro'] - $result['half_basic'];
					$result['half'] = TRUE;
				}
				else
				{
					if ($type !== FALSE)
					{
						$result['amount'] = $result['doctors_amount'] + ($type == 0 ? $result['base_amount'] : $result['pro_amount']);
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

					$this->db->where("users_id", $this->session->userdata("id"));
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
					
					$amount = $this->invoice_info($this->session->userdata("id"), $post['type']);
					
					$year = date("Y", $time);
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
						}
						
						$this->db->where("id", $row['id']);
						$this->db->update("users", array("account_type" => $post['type'], "account" => 1, "account_stop" => 0, "activation" => $time, "suspension" => ($time + $this->period * 24 * 3600)));
						
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

						$response = file_get_contents("https://www.mollie.com/xml/ideal?a=createlink&partnerid=1959041&amount=".round($amount['amount'] * 100)."&description=".$this->db->insert_id());
						$xml = simplexml_load_string($response);
						$data = array("email" => $row['email'],
									  "username" => $row['username'],
									  "color" => empty($user['color']) ? "#0f75bc" : $user['color'],
									  "current_date" => date("d-m-Y", $row['activation']),
									  "end_date" => date("d-m-Y", $row['suspension']),
									  "payment_link" => (string)$xml->link->URL,
									  "attach" => $attach);
						$this->send_payment($data);
					}
				}
				
				$this->errors[] = array("Success" => "Uw abonnement is geactiveerd.");
				return TRUE;
			}
			
			return FALSE;
		}
		
		function get_amount()
		{
			$result = array();
			$result['base_amount'] = $this->base_amount;
			$result['pro_amount'] = $this->pro_amount;
			$result['doctor_amount'] = $this->doctor_amount;
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
			
			$this->db->where("id", $id);
			$this->db->where("account_type", 1);
			if ($this->db->count_all_results("users"))
			{
				$this->db->where("users_id", $id);
				$this->db->where("free", 1);
				if ($this->db->count_all_results("doctors") < 3)
				{
					$price = 0;
				}
			}
			
			return $price;
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
						if ($this->db->count_all_results("doctors") < 3)
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
										"title" => $post['title'],
										"zorgkaart" => $post['zorgkaart'],
										"short" => ! empty($post['short']) ? $post['short'] : "",
										"short_checked" => ! empty($post['short_checked']) ? $post['short_checked'] : 0);

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
					
					if ( ! empty($doctors_id) && ! empty($amount))
					{
						$data_array = array("doctors_id" => $doctors_id,
											"users_id" => $this->session->userdata("id"),
											"firstname" => $post['firstname'],
											"lastname" => $post['lastname'],
											"title" => $post['title'],
											"amount" => $amount);
						$this->db->insert("doctors_pay", $data_array);
					}
					
					return TRUE;
				}
				else
				{
					$this->errors[] = array("URL already exists");
				}
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
			}
			$row['admin_id'] = $this->session->userdata("admin_id");
			$row['intro'] = $this->session->userdata("intro");
			$row['intro_step'] = $this->session->userdata("intro_step");
			$row['intro_online_step'] = $this->session->userdata("intro_online_step");
			$row['rating'] = $this->get_rating($id);
			
			$this->db->where("users_id", $id);
			$row['login_count'] = $this->db->count_all_results("sessions");
			
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
			$result['gray'] = empty($result['gray']) ? $this->defaults['gray'] : $result['gray'];
			$result['text1'] = empty($result['text1']) ? $this->defaults['text1'] : $result['text1'];
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
			}
			return $result;
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
				$this->errors[] = array("Empty email");
			}
			elseif (empty($post['password']))
			{
				$this->errors[] = array("Empty password");
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
								$data_array['trial_end'] = $now + 14 * 24 * 3600;
							}

							$this->db->where("id", $row['id']);
							$this->db->update("users", $data_array);
							
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
			}
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
					$this->errors[] = array("Empty password");
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
						$this->errors[] = array("Wrong password");
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
				$this->errors[] = array("Empty email");
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
						$this->errors[] = array("Database error");
					}
				}
				else
				{
					$this->errors[] = array("Wrong email");
				}
			}

			return FALSE;
		}
		
		function save_password($post)
		{
			if (empty($post['hash']))
			{
				$this->errors[] = array("Wrong URL");
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
						return $this->login(array("email" => $row['email'], "password" => $post['password']));
					}
					else
					{
						$this->errors[] = array("Database error");
					}
				}
				else
				{
					$this->errors[] = array("Wrong URL");
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
									"trial_end" => time() + (14 * 24 * 3600));

				$this->db->where("id", $this->session->userdata("id"));
				if ($this->db->update("users", $data_array))
				{
					return TRUE;
				}
				else
				{
					$this->errors[] = array("Database error");
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
					$this->errors[] = array("Empty username");
				}
				elseif (empty($post['email']))
				{
					$this->errors[] = array("Empty email");
				}
				else
				{
					$this->db->where("id <>", $this->session->userdata("id"));
					$this->db->where("email", strtolower($post['email']));
					$this->db->limit(1);
					if ($this->db->count_all_results("users"))
					{
						$this->errors[] = array("Email already use by another user");
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
												"address" => $post['address'],
												"postcode" => $post['postcode'],
												"city" => $post['city'],
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
												"stars_text" => $post['stars_text']);

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
			$this->db->update("users", array("trial_end" => time() + 14 * 24 * 3600));
			$this->errors[] = array("Success" => "Proefperiode verlengd met 14 dagen");
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
					$data_array['suspension'] = $data_array['activation'] + 14 * 24 * 3600;
					$data_array['trial_end'] = $data_array['suspension'];
					$data_array['account'] = 2;
					unset($data_array['suspension_str']);

					$post['end_date'] = date("d-m-Y", $data_array['suspension']);

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
					$data_array['suspension'] = $data_array['activation'] + 14 * 24 * 3600;
					$data_array['reminder_checked'] = TRUE;
					$data_array['reminder_period'] = 0;
					$data_array['reminder_time'] = 2703600;
					$data_array['reminder_day'] = 2;

					$send = array();
					$send['username'] = $post['UserCompanyName'];
					$send['email'] = $post['UserEmailadress'];
					$send['password'] = $post['UserPassword'];
					$send['end_date'] = date("d-m-Y", $data_array['suspension']);

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
						return $post;
					}
				}
				else
				{
					$this->db->where("id", $post['id']);
					if ($this->db->update("sent", array('doctor' => $post['doctors_id'], 'last' => time())))
					{
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
				$this->db->where("id", $post['id']);
				if ($this->db->update("sent", array('feedback' => $post['feedback'], 'status' => 2, 'last' => time())))
				{
					$this->errors[] = array("Success" => "Feedback verstuurd.");
					return $post;
				}
				else
				{
					$this->errors[] = array("Database error");
				}
			}
		}

		function parse_xls($file)
		{
			$this->load->library('excel');

			$obj = $this->excel->load($file);

			$emails = array();
			$rows = $this->excel->rows($obj);
			if ( ! empty($rows))
			{
				$title = FALSE;
				$name = FALSE;
				$sname = FALSE;
				$doctor = FALSE;
				$birth = FALSE;
				foreach ($rows[0] as $key => $row)
				{
					if (strtolower($row) == "aanhef patiënt")
					{
						$title = $key;
					}
					
					if (strtolower($row) == "voornaam patiënt")
					{
						$name = $key;
					}

					if (strtolower($row) == "achternaam patiënt")
					{
						$sname = $key;
					}
					
					if (strtolower($row) == "zorgverlenernummer")
					{
						$doctor = $key;
					}
					
					if (strtolower($row) == "geboortedatum")
					{
						$birth = $key;
					}
				}

				$added = array();
				$pattern = '/[a-z\d._%+-]+@[a-z\d.-]+\.[a-z]{2,4}\b/i';
				for ($i = 1; $i < count($rows); $i++)
				{
					$email = "";
					foreach ($rows[$i] as $cell)
					{
						$res = array();
						preg_match_all($pattern, $cell, $res);
						if ( ! empty($res[0]))
						{
							$email = strtolower($res[0][0]);
						}
					}

					if ( ! empty($email) && ! in_array($email, $added))
					{
						$added[] = $email;
						$temp = array("title" => ($title !== FALSE ? $rows[$i][$title] : ""),
									  "name" => ($name !== FALSE ? $rows[$i][$name] : ""),
									  "sname" => ($sname !== FALSE ? $rows[$i][$sname] : ""),
									  "doctor" => ($doctor !== FALSE ? $rows[$i][$doctor] : ""),
									  "birth" => ($birth !== FALSE ? $rows[$i][$birth] : ""),
									  "email" => $email);
						$emails[] = $temp;
					}
				}
			}

			return $emails;
		}
		
		function check_emails_tags($emails)
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
							$requred[] = $key;
						}
					}
				}
				
				$error = FALSE;
				$requred = array_unique($requred);
				foreach (array('title', 'name', 'sname') as $i)
				{
					if (in_array($i, $requred))
					{
						$check = FALSE;
						foreach ($emails as $email)
						{
							if (empty($email[$i]))
							{
								$check = TRUE;
							}
						}
						
						if ($check)
						{
							$error = TRUE;
						}
					}
				}
				
				if (in_array('doctors_title', $requred) || in_array('doctors_name', $requred) || in_array('doctors_sname', $requred))
				{
					$check = FALSE;
					$ids = array();
					foreach ($emails as $email)
					{
						if (empty($email['doctor']))
						{
							$check = TRUE;
						}
						else
						{
							$ids[] = $email['doctor'];
						}
					}
					
					if ( ! empty($ids))
					{
						$this->db->where_in("id", $ids);
						$doctors = $this->db->get("doctors")->result_array();
						foreach ($doctors as $doc)
						{
							if (in_array('doctors_title', $requred) && empty($doc['title']))
							{
								$check = TRUE;
							}
							
							if (in_array('doctors_name', $requred) && empty($doc['firstname']))
							{
								$check = TRUE;
							}
							
							if (in_array('doctors_sname', $requred) && empty($doc['lastname']))
							{
								$check = TRUE;
							}
						}
					}
					
					if ($check)
					{
						$error = TRUE;
					}
				}
				
				if ($error)
				{
					$this->errors[] = array("modal" => "emptyTags.html");
				}
				else
				{
					return TRUE;
				}
			}
			
			return FALSE;
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
				if ( ! $sent)
				{
					$this->db->insert("sent_dates", array("users_id" => $this->session->userdata("id"), "sent_date" => time()));
				}
				
				$error = TRUE;
				foreach ($post['emails'] as $list)
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
							if ( ! $this->send("mailing", $list['text'], $subject, $message, $row['username'], $row['email']))
							{
								$error = FALSE;
								$this->errors[] = array("Warning" => "Wasn't send to ".$list['text']);
							}
						}
					}
					else
					{
						$users_id = $this->session->userdata("id");
						$this->db->where("id", $users_id);
						$this->db->limit(1);
						$row = $this->db->get("users")->row_array();

						if ( ! empty($row))
						{
							$email = strtolower($list['text']);
							$this->db->where("email", $email);
							if ( ! $this->db->count_all_results("unsubscribes"))
							{	
								$email_data = array('domain' => (( ! empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://").$_SERVER['HTTP_HOST'].'/',
													'logo' => ( ! empty($row['logo']) ? str_replace('./', '', $row['logo']) : 'application/views/images/logo_full.png'),
													'username' => $row['username'],
													'id' => md5($row['id']),
													'color' => empty($row['color']) ? "#0f75bc" : $row['color'],
													'account_type' => $row['account_type'],
													'account' => $row['account']);
													
								if ( ! empty($list['doctor']))
								{
									$this->db->where("id", $list['doctor']);
									$this->db->where("users_id", $this->session->userdata("id"));
									if ( ! $this->db->count_all_results("doctors"))
									{
										$list['doctor'] = 0;
									}
								}

								$data_array = array("users_id" => $this->session->userdata("id"),
													"title" => ! empty($list['title']) ? $list['title'] : "",
													"name" => ! empty($list['name']) ? $list['name'] : "",
													"sname" => ! empty($list['sname']) ? $list['sname'] : "",
													"doctor" => ! empty($list['doctor']) ? $list['doctor'] : 0,
													"birth" => ! empty($list['birth']) ? $list['birth'] : "",
													"email" => strtolower($list['text']),
													"date" => time(),
													"status" => 1,
													"stars" => 0,
													"feedback" => "");
								if ($this->db->insert("sent", $data_array))
								{
									$email_data['sent_id'] = $this->db->insert_id();
									$email_data['promo_checked'] = $row['promo_checked'];
									$email_data['stars_type'] = $row['stars_type'];
									$email_data['stars_text'] = $row['stars_text'];
									$email_data['texts'] = $this->get_emails_texts($row, $list);
									
									$message = $this->load->view('views/mail/tpl_feedback.html', $email_data, TRUE);

									if ( ! $this->send("mailing", $list['text'], (empty($subject) ? $email_data['texts']['subject'] : $subject), $message, $row['username'], $row['email']))
									{
										$error = FALSE;
										$this->errors[] = array("Warning" => "Wasn't send to ".$list['text']);
									}
								}
							}
						}
					}
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
							empty($list['title']) ? '[EMPTY]' : $list['title'],
							empty($list['name']) ? '[EMPTY]' : $list['name'],
							empty($list['sname']) ? '[EMPTY]' : $list['sname'],
							empty($doc['title']) ? '[EMPTY]' : $doc['title'],
							empty($doc['firstname']) ? '[EMPTY]' : $doc['firstname'],
							empty($doc['lastname']) ? '[EMPTY]' : $doc['lastname'],
							empty($user['username']) ? '[EMPTY]' : $user['username'],
							'<br />');
			
			$texts = $this->user_emails($user['id']);
			if ($text == "")
			{
				if ($user['account'] == 1 && $user['account_type'] == 0)
				{
					$tags = array('[ONDERWERP VAN E-MAIL]', '[NAAM PRAKTIJK]', '\n');
					$values = array('', empty($user['username']) ? '[EMPTY]' : $user['username'], '<br />');
				}
				
				$texts['subject'] = str_replace($tags, $values, $texts['subject']);
				$values[0] = $texts['subject'];
			
				foreach ($texts as $key => $text)
				{
					$texts[$key] = str_replace($tags, $values, $text);
				}
				
				foreach ($texts as $key => $text)
				{
					if (strpos($texts[$key], "[EMPTY]") !== FALSE)
					{
						$texts[$key] = str_replace($tags, $values, $this->defaults[$key]);
					}
				}
			}
			else
			{
				$texts = str_replace($tags, $values, $text);
				$texts = str_replace("[EMPTY]", "", $texts);
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
							empty($post['user']['username']) ? '' : $post['user']['username'],
							'<br />');
			
			$texts['subject'] = str_replace($tags, $values, $texts['subject']);
			$values[0] = $texts['subject'];
			
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
			$post['domain'] = (( ! empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://").$_SERVER['HTTP_HOST'].'/';
			$message = $this->load->view('views/mail/tpl_payment.html', $post, TRUE);
			return $this->send("renew", $post['email'], 'Uw factuur van Patiëntenreview', $message, 'Patiëntenreview', 'info@patientenreview.nl', $post['attach']);
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
				$config = array();
				$config['protocol'] = 'smtp';
				$config['smtp_user'] = 'info@patientenreview.nl';
				$config['smtp_pass'] = '1001reviews$#WK';
				$config['smtp_host'] = 'mail.patientenreview.nl';
				$config['smtp_port'] = '2525';
				$config['charset'] = 'utf-8';
				$config['mailtype'] = 'html';
				$config['newline'] = "\r\n";
				$config['crlf'] = "\r\n";

				$this->load->library('email', $config);
				//$this->email->set_newline("\r\n");

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
						$this->email->attach($row['letters_attach']);
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
			
			return TRUE;
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
				if (empty($row['stars']) || ( ! empty($row['stars']) && ($row['date'] + 2 * 24 * 60 * 60) >= time()))
				{
					if ( ! $ex)
					{
						$this->db->where("id", $row['id']);
						$data_array = array("stars" => $stars, 'last' => time(), 'start' => time());
						if ($row['status'] != 3)
						{
							$data_array['status'] = 2; 
						}
						$this->db->update("sent", $data_array);
						$row['stars'] = $stars;
					}

					$row['ex'] = $ex;
					return $row;
				}
			}

			return FALSE;
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

			$this->db->where("users_id", $users_id);
			$this->db->where("doctor", $doctors_id);
			$this->db->where("ip", $ip);
			$this->db->where("last <=", time() + 48 * 3600);
			$this->db->where("status <>", 3);
			$this->db->limit(1);
			$row = $this->db->get("sent")->row_array();

			if ( ! empty($row))
			{
				$row['ex'] = FALSE;
				if (($row['date'] + 21 * 24 * 60 * 60) < time())
				{
					return FALSE;
				}
			}
			else
			{
				$row = array('stars' => 0,
							 'feedback' => '',
							 'id' => 0,
							 'ex' => FALSE);
			}

			return $row;
		}
		
		function get_promo($users_id)
		{
			$this->db->where("users_id", $users_id);
			$this->db->limit(1);
			$row = $this->db->get("emails")->row_array();
			return $row['promo'];
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

					foreach ($result as $row)
					{
						$row['new_letter'] = ($row['last'] >= $user['last']) ? 1 : 0;
						$row['date_time'] = date("d-m-y H:i", ($row['last'] > 0 ? $row['last'] : $row['date']));
						$row['doctor_name'] = "";
						if ( ! empty($doctors[$row['doctor']]))
						{
							$row['doctor_name'] = $doctors[$row['doctor']]['firstname'].' '.$doctors[$row['doctor']]['lastname'];
						}
						$items[] = $row;
					}
				}
			}

			return $items;
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
			}
			return $row;
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
						if ($row['last'] >= $this->session->userdata("login"))
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
						//$stat['average'] = floor(round($stat['average'] / $stat['all'], 2) * 2) / 2;
						$stat['average'] = round($stat['average'] / $stat['all'], 1);
						if ($stat['all_before'] > 0)
						{
							//$stat['average_before'] = floor(round($stat['average_before'] / $stat['all_before'], 2) * 2) / 2;
							$stat['average_before'] = round($stat['average_before'] / $stat['all_before'], 1);
						}
					}

					foreach ($stat['diagram'] as $key => $val)
					{
						//$stat['diagram'][$key] = $stat['all'] > 0 ? floor(round($val * 100 / $stat['all']) * 2) / 2 : 0;
						$stat['diagram'][$key] = $stat['all'] > 0 ? round($val * 100 / $stat['all'], 1) : 0;
					}

					$percent = $stat['average'] / 100;
					if ($percent > 0)
					{
						//$stat['delta'] = floor(round(($stat['average'] - $stat['average_before']) / $percent, 2) * 2) / 2;
						$stat['delta'] = round(($stat['average'] - $stat['average_before']) / $percent, 1);
					}

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

		function stat_chart($post)
		{
			if ($this->logged_in())
			{
				$this->db->order_by("last", "asc");
				$this->db->where("users_id", $this->session->userdata("id"));
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
								  'nps' => array('bad' => 0, 'good' => 0, 'delta' => 0, 'bad_doc' => 0, 'good_doc' => 0, 'delta_doc' => 0));

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

					$stat['nps']['bad'] = $nps_all > 0 ? round($nps_1 / $nps_all * 100) : 0;
					$stat['nps']['good'] = $nps_all > 0 ? round($nps_5 / $nps_all * 100) : 0;
					$stat['nps']['delta'] = $stat['nps']['good'] - $stat['nps']['bad'];
					$stat['nps']['bad_doc'] = $nps_doc_all > 0 ? round($nps_doc_1 / $nps_doc_all * 100) : 0;
					$stat['nps']['good_doc'] = $nps_doc_all > 0 ? round($nps_doc_5 / $nps_doc_all * 100) : 0;
					$stat['nps']['delta_doc'] = $stat['nps']['good_doc'] - $stat['nps']['bad_doc'];

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
		
		function stat()
		{
			$now = mktime(0, 0, 0, date("n"), date("j"), date("Y"));
			$stat = array("trial" => 0,
						  "trial_date" => "",
						  "basic" => 0,
						  "pro" => 0,
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
					if ($row['account_type'] == 0)
					{
						$stat['basic']++;
					}
					elseif ($row['account_type'] == 1)
					{
						$stat['pro']++;
					}
				}
				
				if ($row['signup'] >= $now - 14 * 24 * 3600)
				{
					$stat['added14'][] = array("id" => $row['id'], "username" => $row['username'], "date" => date("d-m-Y", $row['signup']));
				}
				
				if ($row['suspension'] > $now && $row['suspension'] <= $now + 14 * 24 * 3600)
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
			if ($this->logged_in())
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
					$this->db->update("sent", array($post['type'] => 1));
					return $post['id'];
				}
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

		function save_facebook_token($post)
		{
			if ($this->logged_in())
			{
				$this->db->where("id", $this->session->userdata("id"));
				$this->db->update("users", array("facebook_token" => $post['token']));
			}
		}
		
		function ratings($users_id = FALSE)
		{
			$items = array();
			if ($users_id)
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
			$profiles = array("google", "zorgkaart", "independer", "telefoonboek");
			
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
					'ssl' => array(
						'ciphers' => $ciphers,
						'verify_peer' => true,
						'cafile' => '/etc/ssl/certs/ca-certificates.crt', // <-- EDIT FOR NON-DEBIAN/UBUNTU SYSTEMS
						'CN_match' => "www.independer.nl",
						'verify_depth' => 3,
						'disable_compression' => true,
						'SNI_enabled' => true,
						'SNI_server_name' => "www.independer.nl"
					)
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
	}

/* End of file pub_model.php */
/* Location: ./application/models/pub_model.php */