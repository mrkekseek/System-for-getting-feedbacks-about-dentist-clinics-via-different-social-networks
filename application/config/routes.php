<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	http://codeigniter.com/user_guide/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There area two reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router what URI segments to use if those provided
| in the URL cannot be matched to a valid route.
|
*/

$route['default_controller'] = "pub";
$route['404_override'] = '';

$route['welcome'] = 'pub/welcome';
$route['send_new'] = 'pub/send_new';
$route['cron'] = 'pub/cron';
//$route['invitation/(:any)'] = 'pub/invitation/$1';
//$route['unsubscribe/(:any)'] = 'pub/unsubscribe/$1';
$route['invitation/(:any)'] = 'pub/rating_page';
$route['unsubscribe/(:any)'] = 'pub/rating_page';
$route['widget/(:any)'] = 'pub/widget/$1';
$route['excel-tpl'] = 'pub/excel_tpl';
$route['pub/(:any)'] = 'pub/$1';
$route['pub/(:any)/(:any)'] = 'pub/$1/$2';
$route['(:any)'] = 'pub/short_url/$1';


/* End of file routes.php */
/* Location: ./application/config/routes.php */