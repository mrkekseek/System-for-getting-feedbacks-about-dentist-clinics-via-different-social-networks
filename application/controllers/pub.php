<?php

	if ( ! defined('BASEPATH')) exit('No direct script access allowed');
	
	class Pub extends CI_Controller
	{
		var $data = array();
		var $post = array();
		var $manage = array();
		function __construct()
		{
			parent::__construct();
			$this->load->model("pub_model", "pub");
			$this->post = $this->pub->get_post();
			
			/*$this->db->where("MD5(id)", 'f4f3bdcb2c623bae9976a83f8c83dcde');
			$row = $this->db->get('sent')->row_array();
			print_r($row);*/

			$this->manage = array('header', 'footer', 'sidebar', 'manage/add', 'manage/view', 'charts/acharts', 'charts/stat');
		}

		function cron()
		{
			if (strpos($_SERVER['HTTP_USER_AGENT'], "Wget") === 0)
			{
				$this->pub->cron();
			}
			else
			{
				//exit("error");
				$this->pub->cron();
			}
		}
		
		function index()
		{
			$this->load->view('index.html', $this->data);
		}
		
		function welcome()
		{
			redirect("/#/pages/online");
		}
		
		function fb_logged()
		{
			$this->load->library('Facebook');
			$fb_token = $this->facebook->save_token();
			$this->pub->save_facebook_token($fb_token);
			
			echo "<script type='text/javascript'>";
			echo "window.opener.fb_callback();";
			echo "window.close();";
			echo "</script>";
		}
		
		function send_new()
		{
			$this->session->unset_userdata(array("first" => ''));
			redirect("/#/dashboard");
		}

		function page($file = FALSE, $sub_file = FALSE, $id = FALSE)
		{
			$path = 'views/pages/404.html';
			if ($file)
			{
				if ($this->pub->logged_in())
				{
					$this->data['user'] = $this->pub->user();
					$part = $file.($sub_file ? '/'.$sub_file : '');
					if ($this->data['user']['status'] == 2)
					{
						if ( ! in_array($part, $this->manage))
						{
							$part = 'charts/stat';
						}
					}
					else
					{
						if ($part == 'manage/view' || $part == 'manage/add' || $part == 'charts/acharts' || $part == 'charts/stat')
						{
							$part = 'dashboard';
						}
					}

					$path = 'views/'.$part.'.html';
					if ($part == "pages/lock-screen")
					{
						$this->pub->lock_screen();
					}
					
					if ($this->pub->is_lock())
					{
						$path = 'views/pages/lock-screen.html';
					}
					else
					{
						if ($part == 'manage/view' || $part == 'charts/acharts')
						{
							$this->data['users'] = $this->pub->get_users();
						}
						
						if ($part == "mail/single")
						{
							$this->data['id'] = $id;
						}
						
						if ($part == "mail/reply")
						{
							$this->data['info'] = $this->pub->feedback_info($id);
						}
						
						/*if ($part == "pages/invoice")
						{
							$this->data['invoice'] = $this->pub->get_invoice($id);
						}*/
					}
				}
				else
				{
					if ($file == "header" || $file == "footer" || $file == "sidebar")
					{
						$path = 'views/'.$file.'.html';
					}
					elseif ($sub_file == "forgot-password")
					{
						$path = 'views/pages/forgot-password.html';
					}
					elseif ($sub_file == "new-password")
					{
						$path = 'views/pages/new-password.html';
					}
					elseif ($sub_file == "signup")
					{
						$path = 'views/pages/signup.html';
					}
					else
					{
						$path = 'views/pages/signin.html';
					}
				}
			}
			
			if ( ! file_exists('./application/views/'.$path))
			{
				$path = 'views/pages/500.html';
			}
			
			if ( ! empty($this->data['user']) && ! $this->data['user']['account'] && ($path == "views/mail/compose.html" || $path == "views/charts/charts.html"))
			{
				$path = 'views/pages/account.html';
			}
			
			$this->load->view($path, $this->data);
		}
		
		function show_suspend_popup()
		{
			$result['show_suspend_popup'] = $this->session->userdata("show_suspend_popup");
			$this->session->unset_userdata(array("show_suspend_popup" => ''));
			$this->response($result);
		}
		
		function login()
		{
			$result = $this->pub->login($this->post);
			$this->response($result);
		}
		
		function login_as_user()
		{
			$result = $this->pub->login_as_user($this->post);
			$this->response($result);
		}
		
		function logout_as_user()
		{
			$result = $this->pub->logout_as_user();
			$this->response($result);
		}
		
		function logout()
		{
			$result = $this->pub->logout();
			$this->response($result);
		}
		
		function check_updates()
		{
			$result = $this->pub->check_updates();
			$this->response($result);
		}
		
		function user($param = FALSE)
		{
			$result = $this->pub->user_info();
			if (empty($result['reminder_time']))
			{
				$result['reminder_time'] = time();
			}
			$result['reminder_time'] = $result['reminder_time'] * 1000;
			
			if ($param == "profile")
			{
				$result['emails'] = $this->pub->user_emails();
				$result['widget'] = $this->pub->user_widget();
				$result['questions_list'] = $this->pub->get_questions();
				$result['questions'] = $this->pub->user_questions($result['questions_list']);
				$result['questions_list'] = $this->pub->free_questions($result['questions_list'], $result['questions']);
			}
			
			if ($param == "doctors")
			{
				$result['doctors'] = count($this->pub->get_doctors($this->session->userdata("id")));
			}
			$this->response($result);
		}
		
		function users()
		{
			$result = $this->pub->get_users();
			$this->response($result);
		}
		
		function unlock()
		{
			$result = $this->pub->unlock_screen($this->post);
			$this->response($result);
		}
		
		function reset()
		{
			$result = $this->pub->reset_password($this->post);
			$this->response($result);
		}
		
		function save_pass()
		{
			$result = $this->pub->save_password($this->post);
			$this->response($result);
		}
		
		function profile_save()
		{
			$result = $this->pub->profile_save($this->post);
			$this->response($result);
		}
		
		function first_login_save()
		{
			$result = $this->pub->first_login_save($this->post);
			$this->response($result);
		}
		
		function change_times()
		{
			$result = $this->pub->change_times($this->post);
			$result = $this->pub->get_users();
			$this->response($result);
		}
		
		function change_user()
		{
			$result = $this->pub->change_user($this->post['user']);
			$result = $this->pub->get_users();
			$this->response($result);
		}
		
		function remove_user()
		{
			$result = $this->pub->remove_user($this->post);
			$result = $this->pub->get_users();
			$this->response($result);
		}
		
		function del_user()
		{
			$result = $this->pub->delete_user($this->post);
			$result = $this->pub->get_users();
			$this->response($result);
		}
		
		function sites()
		{
			$result = $this->pub->sites($this->post);
			$this->response($result);
		}
		
		function signup()
		{
			$result = $this->pub->signup($this->post);
			$this->response($result);
		}
		
		function trial()
		{
			$result = FALSE;
			if ( ! empty($_GET) && $_GET['protection'] == "YFjhkhugasd456")
			{
				$result = $this->pub->trial($_GET);
			}
			$this->response($result);
		}
		
		function upload()
		{
			$result = array();
			if ($this->pub->logged_in())
			{
				if ( ! empty($_FILES['file']['tmp_name']) && (strpos(strtolower($_FILES['file']['name']), 'xls') !== FALSE || strpos(strtolower($_FILES['file']['name']), 'tab') !== FALSE || strpos(strtolower($_FILES['file']['name']), 'csv') !== FALSE))
				{
					$result = $this->pub->parse_xls($_FILES['file']['tmp_name'], TRUE, strtolower($_FILES['file']['name']));
				}
				else
				{
					$result['error'] = TRUE;
				}
			}
			$this->response($result);
		}
		
		function save_field()
		{
			$this->pub->save_field($this->post);
			$result = $this->pub->parse_xls($this->post['file'], FALSE, $this->post['file']);
			$this->response($result);
		}
		
		function save_doctors_ids()
		{
			$this->pub->save_doctors_ids($this->post['ids']);
			$result = $this->pub->parse_xls($this->post['file'], FALSE, $this->post['file']);
			$this->response($result);
		}
		
		function save_locations_ids()
		{
			$this->pub->save_locations_ids($this->post['ids']);
			$result = $this->pub->parse_xls($this->post['file'], FALSE, $this->post['file']);
			$this->response($result);
		}
		
		function upload_help()
		{
			$result = $this->pub->upload_help($this->post['file']);
			$this->response($result);
		}
		
		function upload_logo()
		{
			$result = array();
			if ($this->pub->logged_in())
			{
				if ( ! empty($_FILES['file']['tmp_name']))
				{
					$result = $this->pub->save_logo($_FILES['file']);
				}
			}
			$this->response($result);
		}
		
		function feedback_info()
		{
			$result = $this->pub->feedback_info($this->post['id']);
			$this->response($result);
		}
		
		function send()
		{
			if ($this->pub->logged_in())
			{
				$result = $this->pub->send_letters($this->post);
				$this->response($result);
			}
		}
		
		function send_example()
		{
			if ($this->pub->logged_in())
			{
				$result = $this->pub->send_example();
				$this->response($result);
			}
		}
		
		function send_reply()
		{
			if ($this->pub->logged_in())
			{
				$result = $this->pub->send_reply($this->post);
				$this->response($result);
			}
		}
		
		function send_bulk_reply()
		{
			if ($this->pub->logged_in())
			{
				$result = $this->pub->send_bulk_reply($this->post);
				$this->response($result);
			}
		}
		
		function vote()
		{
			$result = $this->pub->vote($this->post);
			$this->response($result);
		}
		
		function vote_questions()
		{
			$result = $this->pub->vote_questions($this->post);
			$this->response($result);
		}
		
		function vote_doc()
		{
			$result = $this->pub->vote_doc($this->post);
			$this->response($result);
		}
		
		function feedback()
		{
			$result = $this->pub->feedback($this->post);
			$this->response($result);
		}
		
		function widget($hash)
		{
			$this->data['widget'] = $this->pub->widget($hash);
			$this->data['rating'] = $this->pub->get_rating($this->data['widget']['users_id']);
			$this->load->view('widget.html', $this->data);
		}

		function rating_page()
		{
			$this->load->view('invitation2.html', $this->data);
		}
		
		function rating_page_get()
		{
			$result = $this->pub->rating_page_get($this->post['segments']);
			$this->response($result);
		}
		
		function invitation($hash)
		{
			$this->data['short'] = FALSE;
			$this->data['info'] = $this->pub->invitation($hash);
			$this->data['user'] = $this->pub->user_info($this->data['info']['users_id']);
			if ( ! empty($this->data['user']['promo_checked']))
			{
				$this->data['promo'] = $this->pub->get_promo($this->data['info']['users_id']);
			}
			
			if ( ! empty($this->data['info']['doctor']))
			{
				$this->data['doctor'] = $this->pub->doctor_info($this->data['info']['doctor']);
			}
			else
			{
				$this->data['doctors'] = $this->pub->get_doctors($this->data['info']['users_id']);
			}
			$this->load->view('invitation.html', $this->data);
		}
		
		function unsubscribe($hash)
		{
			$this->data['short'] = FALSE;
			$this->data['info'] = array();
			$this->data['user'] = array();
			$this->pub->unsubscribe($hash);
			$this->data['unsubscribe'] = TRUE;
			$this->load->view('invitation.html', $this->data);
		}
		
		function unsubscribe_ajax()
		{
			$temp = explode("-", $this->post['hash']);
			$hash = substr($this->post['hash'], 1);
			$result = $this->pub->unsubscribe($hash);
			$this->response(array('hash' => $hash));
		}
		
		function undo()
		{
			$result = $this->pub->undo($this->post['hash']);
			$this->response($result);
		}
		
		function short_url($short)
		{
			$result = $this->pub->check_url(strtolower($short));
			if ( ! empty($result['users_id']))
			{
				/*$this->data['short'] = TRUE;
				$this->data['info'] = $this->pub->check_short_results($result['users_id'], $result['doctors_id']);
				$this->data['user'] = $this->pub->user_info($result['users_id']);
				if ( ! empty($this->data['user']['promo_checked']))
				{
					$this->data['promo'] = $this->pub->get_promo($result['users_id']);
				}
				if ( ! empty($result['doctors_id']))
				{
					$this->data['doctor'] = $this->pub->doctor_info($result['doctors_id']);
				}
				else
				{
					$this->data['doctors'] = $this->pub->get_doctors($result['users_id']);
				}*/
				$this->load->view('invitation2.html', $this->data);
			}
			else
			{
				show_404();
			}
		}
		
		function inbox()
		{
			$result = $this->pub->inbox($this->post);
			$this->pub->save_last();
			$this->response($result);
		}
		
		function read_letters()
		{
			$this->pub->read_letters($this->post);
			$result = $this->pub->inbox($this->post);
			$this->response($result);
		}
		
		function inbox_count()
		{
			$result = $this->pub->inbox($this->post);
			$this->response($result);
		}
		
		function stat_dashboard()
		{
			$result = $this->pub->stat_dashboard();
			$this->response($result);
		}
		
		function stat_chart()
		{
			$result = $this->pub->stat_chart($this->post);
			$this->response($result);
		}
		
		function stat_chart2()
		{
			$result = $this->pub->stat_chart2($this->post);
			$this->response($result);
		}
		
		function stat_achart()
		{
			$result = $this->pub->stat_achart($this->post);
			$this->response($result);
		}
		
		function stat()
		{
			$result = $this->pub->stat();
			$this->response($result);
		}
		
		function last_dashboard()
		{
			$result = $this->pub->last_dashboard($this->post);
			$this->response($result);
		}
		
		function click()
		{
			$result = $this->pub->click($this->post);
			$this->response($result);
		}

		function send_feedback()
		{
			$result = $this->pub->send_feedback($this->post);
			$this->response($result);
		}
		
		function check_login_times()
		{
			$result = $this->pub->check_login_times();
			$result['date'] = $this->pub->get_last_sent();
			$result['emails'] = $this->pub->user_emails();
			$this->response($result);
		}
		
		function subscription_info()
		{
			$result = $this->pub->subscription_info();
			$this->response($result);
		}
		
		function invoice_info()
		{
			$result = $this->pub->invoice_info($this->post['id'], $this->post['type']);
			$this->response($result);
		}
		
		function account_save()
		{
			$result = $this->pub->account_save($this->post);
			$this->response($result);
		}
		
		function suspend_account()
		{
			$result = $this->pub->suspend_account();
			$this->response($result);
		}
		
		function activate_account()
		{
			$result = $this->pub->activate_account($this->post);
			$this->response($result);
		}
		
		function get_locations()
		{
			$result = $this->pub->get_locations();
			$this->response($result);
		}
		
		function save_location()
		{
			$result = $this->pub->save_location($this->post);
			$this->response($result);
		}
		
		function get_location()
		{
			$result = $this->pub->location_info($this->post['id']);
			$this->response($result);
		}
		
		function remove_location()
		{
			$this->pub->remove_location($this->post['id']);
			$result = $this->pub->get_locations();
			$this->response($result);
		}
		
		function get_doctors()
		{
			$result = $this->pub->get_doctors(empty($this->post['type']) ? FALSE : $this->post['type']);
			$this->response($result);
		}
		
		function get_doctor()
		{
			$result = $this->pub->doctor_info($this->post['id']);
			$this->response($result);
		}
		
		function get_amount()
		{
			$result = $this->pub->get_amount();
			$this->response($result);
		}
		
		function save_doctor()
		{
			$result = $this->pub->save_doctor($this->post);
			$this->response($result);
		}
		
		function remove_doctor()
		{
			$this->pub->remove_doctor($this->post['id']);
			$result = $this->pub->get_doctors();
			$this->response($result);
		}
		
		function get_doctors_price()
		{
			$result['price'] = $this->pub->get_doctors_price();
			$this->response($result);
		}
		
		function save_online()
		{
			$result = $this->pub->save_online($this->post);
			$this->response($result);
		}
		
		function widget_save()
		{
			$result = $this->pub->widget_save($this->post['widget']);
			$this->response($result);
		}
		
		function questions_save()
		{
			$result = array();
			$this->pub->questions_save($this->post['questions_id']);
			$questions_list = $this->pub->get_questions();
			$result['questions'] = $this->pub->user_questions($questions_list);
			$result['questions_list'] = $this->pub->free_questions($questions_list, $result['questions']);
			$this->response($result);
		}
		
		function questions_ids_save()
		{
			$result = array();
			$this->pub->questions_ids_save($this->post['questions_ids']);
			$questions_list = $this->pub->get_questions();
			$result['questions'] = $this->pub->user_questions($questions_list);
			$result['questions_list'] = $this->pub->free_questions($questions_list, $result['questions']);
			$this->response($result);
		}
		
		function questions_remove()
		{
			$result = array();
			$this->pub->questions_remove($this->post['questions_id']);
			$questions_list = $this->pub->get_questions();
			$result['questions'] = $this->pub->user_questions($questions_list);
			$result['questions_list'] = $this->pub->free_questions($questions_list, $result['questions']);
			$this->response($result);
		}
		
		function questions_edit()
		{
			$result = array();
			$this->pub->questions_edit($this->post['questions_id'], $this->post['new_id']);
			$questions_list = $this->pub->get_questions();
			$result['questions'] = $this->pub->user_questions($questions_list);
			$result['questions_list'] = $this->pub->free_questions($questions_list, $result['questions']);
			$this->response($result);
		}
		
		function response($result)
		{
			$response = array();
			if ( ! empty($this->pub->errors))
			{
				$response['errors'] = $this->pub->errors;
			}
			
			if (isset($result))
			{
				$response['result'] = $result;
			}
			echo json_encode($response);
		}
		
		function intro_step()
		{
			$result = $this->pub->intro_step($this->post);
			$this->response($result);
		}
		
		function intro_close()
		{
			$result = $this->pub->intro_close();
			$this->response($result);
		}
		
		function intro_open()
		{
			$result = $this->pub->intro_open();
			$this->response($result);
		}
		
		function get_test_email()
		{
			$result = $this->pub->user_emails();
			$this->response($result);
		}
		
		function send_test_email()
		{
			$result = $this->pub->send_test_email($this->post);
			$this->response($result);
		}
		
		function users_invoices()
		{
			$result = $this->pub->users_invoices($this->post['ids']);
			$this->response($result);
		}
		
		function excel_tpl()
		{
			$file = './excel-tpl.xls';
			header('Content-Type: application/vnd.ms-excel; charset=utf-8');
			header("Content-Transfer-Encoding: Binary"); 
			header("Content-disposition: attachment; filename=\"Patientenreview upload ".date("d-m-Y").".xls\"");
			readfile($file);
			exit;
		}
		
		function fast_email()
		{
			$data_array = array("letters_to" => "hallo@cloudrocket.co",
								"letters_subject" => "Test",
								"letters_message" => "Test",
								"letters_from" => "Site",
								"letters_from_email" => "info@patientenreview.nl",
								"letters_type" => "test");
			$this->db->insert("letters", $data_array);
			$this->pub->real_send(array("test"));
		}
		
		function invoice($hash)
		{
			/*$this->data['print'] = TRUE;
			$this->data['invoice'] = $this->pub->get_invoice($hash, TRUE);
			$this->data['user'] = $this->pub->user($this->data['invoice']['users_id']);
			$this->data['content'] = $this->load->view('views/pages/invoice.html', $this->data, TRUE);*/
			$this->load->view('tpl.html', $this->data);
		}
		
		function change_trial()
		{
			$result = $this->pub->change_trial($this->post);
			$this->response($result);
		}
		
		function test()
		{
			//$this->data['domain'] = "http://app.patientenreview.nl/";
			$this->data['domain'] = "http://tr.div-art.com.ua/";
			$this->data['username'] = "Ivan";
			$this->data['subject'] = "Subject of the letter";
			$this->data['logo'] = FALSE;
			$this->data['sent_id'] = 1;
			$this->data['account'] = 1;
			$this->data['account_type'] = 1;
			$this->data['current_date'] = date("d-m-Y");
			$this->data['end_date'] = date("d-m-Y", time() + 30 * 24 * 3600);
			$this->data['payment_link'] = "http://div-art.com/";
			$this->load->view('views/mail/tpl_example.html', $this->data);
		}
	}

/* End of file pub.php */
/* Location: ./application/controllers/pub.php */