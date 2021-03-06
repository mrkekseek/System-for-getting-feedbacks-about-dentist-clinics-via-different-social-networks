(function () {
    'use strict';

    angular.module('app', [
        // Angular modules
        'ngRoute',
        'ngAnimate',

        // 3rd Party Modules
        'ui.bootstrap',
        'easypiechart',
        'ui.tree',
        'ngMap',
        'ngTagsInput',
        'textAngular',
        'angular-loading-bar',
        'ui.calendar',

        // Custom modules
        'app.nav',
        'app.localization',
        'app.chart',
        'app.ui',
        'app.ui.form',
        'app.ui.form.validation',
        'app.ui.map',
        'app.page',
        'app.table',
        'app.task',
        'app.calendar',

		'lr.upload',
		'ngFileUpload',
		'as.sortable',
		'colorpicker.module',
		'froala'
    ]);

})();









;
(function () {
    'use strict';

    angular.module('app')
        .config(['$routeProvider', function($routeProvider) {
            var routes, titles, setRoutes;

            routes = [
                'dashboard', 'invitation/:hash?',
                'charts/charts', 'charts/onlines',
                'pages/404', 'pages/500', 'pages/forgot-password', 'pages/new-password/:hash', 'pages/lock-screen', 'pages/signin', 'pages/signup',
				'pages/profile', 'pages/subscription', 'pages/advanced', 'pages/doctors_add', 'pages/doctors_edit/:id', 'pages/locations_add', 'pages/locations_add/:id', 'pages/treatments_add', 'pages/treatments_add/:id', 'pages/online', 'pages/activate/:id', 'pages/invoice/:id', 
                'mail/compose', 'mail/inbox', 'mail/single/:id', 'mail/reply/:id',
				'manage/add', 'manage/view', 'charts/acharts', 'charts/aonlines', 'charts/stat'
            ];

			titles = {'dashboard': 'Dashboard',
					  'invitation/:hash?': '',
					  'charts/charts': 'Statistieken',
					  'pages/404': '404',
					  'pages/500': '500',
					  'pages/forgot-password': 'Wachtwoord vergeten',
					  'pages/new-password/:hash': 'Uw wachtwoord herstellen',
					  'pages/lock-screen': 'Vergrendel',
					  'pages/signin': 'Aanmelden',
					  'pages/profile': 'Algemeen',
					  'pages/subscription': 'Abonnement',
					  'pages/advanced': 'Geavanceerd',
					  'pages/doctors_add': 'Voeg zorgverlener toe',
					  'pages/doctors_edit/:id': 'Instellingen',
					  'pages/locations_add': 'Voeg locatie toe',
					  'pages/locations_add/:id': 'Instellingen',
					  'pages/treatments_add': 'Voeg behandelingen toe',
					  'pages/treatments_add/:id': 'Instellingen',
					  'pages/online': 'Online profielen',
					  'pages/activate/:id': 'Abonnement Activeren',
					  'pages/invoice/:id': 'Abonnement Activeren',
					  'mail/compose': 'Stuur nieuwe uitnodiging',
					  'mail/inbox': 'Ontvangen',
					  'mail/single/:id': 'Bekijk feedback',
					  'mail/reply/:id': 'Beantwoord feedback',
					  'manage/add': 'Nieuw abonnement',
					  'manage/view': 'Beheer abonnementen',
					  'charts/acharts': 'Statistieken',
					  'charts/aonlines': 'Statistieken',
					  'charts/onlines': 'Statistieken',
					  'charts/stat': 'Statistieken'
            };

            setRoutes = function(route) {
                var config, url;
                url = '/' + route;
                config = {
					title: ("Patiëntenreview.nl" + (titles[route] ? (" - " + titles[route]) : "")),
					templateUrl: function(params){ return 'pub/page/' + (params.hash ? (route.replace(':hash?', '') + params.hash) : (params.id ? (route.replace(':id', '') + params.id) : route)); }
                };
                $routeProvider.when(url, config);
                return $routeProvider;
            };

            routes.forEach(function(route) {
                return setRoutes(route);
            });

            $routeProvider
                .when('/', {redirectTo: '/dashboard'})
                .when('/404', {templateUrl: 'application/views/views/pages/404.html'})
                .otherwise({ redirectTo: '/404'});

        }]
    )
	.service('inbox_count', function($http, logger) {
		var self = this;
		self.count = 0;
		self.all = 0;
		self.get_ajax = function() {
			$http.post("/pub/inbox_count/", {filter: {stars: 'none'}}).success(function(data, status, headers, config) {
				var result = logger.check(data);
				self.count = 0;
				if (result && result.length)
				{
					for (var key in result)
					{
						if (result[key].new_letter)
						{
							self.count++;
						}
						self.all++;
					}
				}
			});
		};
		self.get_ajax();

		self.get = function() {
			return self.count;
		};

		self.get_all = function() {
			return self.all;
		};

		self.set = function(num) {
			self.count = num;
		};
	}).service('with_feedback_count', function($http, logger) {
		var self = this;
		self.count = 0;
		self.filter = "none";
		self.all = 0;
		self.get_ajax = function() {
			$http.post("/pub/inbox_count/", {filter: {stars: 'none'}}).success(function(data, status, headers, config) {
				var result = logger.check(data);
				self.count = 0;
				if (result && result.length)
				{
					for (var key in result)
					{
						if (result[key].marked_as_read == "0" && result[key].reply == "" && result[key].email != "" && (result[key].feedback != "" || (result[key].stars > 0 && result[key].stars <= 2)))
						{
							self.count++;
						}
						self.all++;
					}
				}
			});
		};
		self.get_ajax();

		self.get = function() {
			return self.count;
		};

		self.get_all = function() {
			return self.all;
		};

		self.set = function(num) {
			self.count = num;
		};
	});
})();
;
(function () {
    'use strict';

    angular.module('app')
        .controller('AppCtrl', [ '$scope', '$rootScope', '$window', '$http', '$location', '$modal', 'logger', 'inbox_count', 'upload', '$anchorScroll', AppCtrl]) // overall control
		.run(['$location', '$rootScope', function($location, $rootScope) {
			$rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
				$rootScope.title = current.$$route.title;
			});
		}]);

    function AppCtrl($scope, $rootScope, $window, $http, $location, $modal, logger, inbox_count, upload, $anchorScroll) {
		$scope.inbox_count = inbox_count.get;
		$scope.inbox_all = inbox_count.get_all;

        $scope.main = {
            brand: 'Patiëntenreview.nl',
            name: 'Lisa Doe' // those which use i18n directive will not be updated for now
        };
		
		$scope.$on('$viewContentLoaded', function(event) {
			//$window._gaq.push(['_trackPageview', $location.url()]);
			$window.ga('send', 'pageview', {page: $location.url()});
		});
		
		$scope.apps = {};
		$scope.apps.title = 'Patiëntenreview.nl';
		$scope.apps.ready = false;
		
		$scope.loader = false;

        $scope.pageTransitionOpts = [
            {
                name: 'Fade up',
                "class": 'animate-fade-up'
            }, {
                name: 'Scale up',
                "class": 'ainmate-scale-up'
            }, {
                name: 'Slide in from right',
                "class": 'ainmate-slide-in-right'
            }, {
                name: 'Flip Y',
                "class": 'animate-flip-y'
            }
        ];

        $scope.admin = {
            layout: 'wide',                                 // 'boxed', 'wide'
            menu: 'vertical',                               // 'horizontal', 'vertical', 'collapsed'
            fixedHeader: true,                              // true, false
            fixedSidebar: true,                             // true, false
            pageTransition: $scope.pageTransitionOpts[0],   // unlimited
            skin: '12'                                      // 11,12,13,14,15,16; 21,22,23,24,25,26; 31,32,33,34,35,36
        };

        $scope.$watch('admin', function(newVal, oldVal) {
            if (newVal.menu === 'horizontal' && oldVal.menu === 'vertical') {
                $rootScope.$broadcast('nav:reset');
            }
            if (newVal.fixedHeader === false && newVal.fixedSidebar === true) {
                if (oldVal.fixedHeader === false && oldVal.fixedSidebar === false) {
                    $scope.admin.fixedHeader = true;
                    $scope.admin.fixedSidebar = true;
                }
                if (oldVal.fixedHeader === true && oldVal.fixedSidebar === true) {
                    $scope.admin.fixedHeader = false;
                    $scope.admin.fixedSidebar = false;
                }
            }
            if (newVal.fixedSidebar === true) {
                $scope.admin.fixedHeader = true;
            }
            if (newVal.fixedHeader === false) {
                $scope.admin.fixedSidebar = false;
            }
        }, true);

        $scope.color = {
            primary: '#4E7FE1',
            success: '#81CA80',
            info: '#6BBCD7',
            infoAlt: '#7266BD',
            warning: '#E9C842',
            danger: '#E96562',
            gray: '#DCDCDC'
        };

		$scope.logout = function () {
            $http.post("/pub/logout").success(function(data, status, headers, config) {
				if (logger.check(data))
				{
					$window.location.reload(true);
				}
			});
        };

		$scope.closeAlert = function(index)
		{
			return $scope.alerts.splice(index, 1);
		};

		$scope.send_feedback = function()
		{
			var modalInstance;
			modalInstance = $modal.open({
				templateUrl: 'feedback.html',
				controller: 'ModalInstanceFeedbackCtrl',
				resolve: {
					items: function() {
						return ["Behoud alle e-mailadressen", "Laat e-mailadressen weg"];
					}
				}
			});

			modalInstance.result.then((function(items) {
                console.log(items);
            }), function() {
                console.log("Modal dismissed at: " + new Date());
            });
		};

		$scope.after_logged_in = function() {
			$http.post("/pub/check_updates/").success(function(data, status, headers, config) {
				var result = logger.check(data);
				if (result && (result[0] || result[1]))
				{
					var modalInstance;
					modalInstance = $modal.open({
						size: "md",
						templateUrl: 'updates.html',
						controller: 'ModalInstanceUpdatesCtrl',
						resolve: {
							items: function() {
								return result;
							}
						}
					});

					modalInstance.result.then((function(items) {
						if (items == "feedback")
						{
							$scope.send_feedback();
						}
					}), function() {
						console.log("Modal dismissed at: " + new Date());
					});
				}
				else
				{
					$scope.check_suspended();
				}
			});
		};

		if ($window.location.pathname == '/')
		{
			$scope.after_logged_in();
		}
			
		$scope.users_list = "";
		$scope.user = {};
		$scope.users_select = [];
		$scope.check_suspended = function() {
			$http.post("/pub/user/").success(function(data, status, headers, config) {
				$scope.user = logger.check(data);
				//$scope.reply.text = "Beste " + ($scope.user.title ? $scope.user.title : "") + " " + ($scope.user.name ? $scope.user.name : "") + " " + ($scope.user.sname ? $scope.user.sname : "") + ",\n\nMet vriendelijke groet,\n\n" + ($scope.user.username ? $scope.user.username : "");
				
				$scope.intro = $scope.user.intro;
				$scope.intro_step = $scope.user.intro_step;
				$scope.intro_online_step = $scope.user.intro_online_step;
				if ($scope.intro)
				{
					$scope.build_intro();
				}
				
				if ($scope.user.status != 2 && $scope.user.account == 0 && $scope.user.account_stop == 0 && ! (window.location.href.indexOf("invitation") + 1))
				{
					$scope.renew_modal();
				}

				if ($scope.user.admin_id)
				{
					$http.get("/pub/users/").success(function(data, status, headers, config) {
						$scope.users_select = logger.check(data);
						$scope.users_list = $scope.user.id;
					});
				}
			});
		};

		$scope.renew_modal = function() {
			var modalInstance;
			modalInstance = $modal.open({
				templateUrl: 'suspended.html',
				controller: 'ModalInstanceSuspendedCtrl',
				resolve: {
					items: function() {
						return [];
					}
				}
			});

			modalInstance.result.then((function(items) {
				console.log(items);
			}), function() {
				console.log("Modal dismissed at: " + new Date());
			});
		};

		$scope.logout_as_user = function() {
			$http.get("/pub/logout_as_user/").success(function(data, status, headers, config) {
				if (logger.check(data))
				{
					$window.location.reload();
				}
			});
		};
		
		$scope.logout_as_child = function() {
			$http.get("/pub/logout_as_child/").success(function(data, status, headers, config) {
				if (logger.check(data))
				{
					$window.location.reload();
				}
			});
		};
		
		$scope.login_as_user = function(users_id) {
			$http.post("/pub/login_as_user/", {id: users_id}).success(function(data, status, headers, config) {
				if (logger.check(data))
				{
					$window.location.reload();
				}
			});
		};
		
		$scope.login_as_child = function(users_id) {
			$http.post("/pub/login_as_child/", {id: users_id}).success(function(data, status, headers, config) {
				if (logger.check(data))
				{
					$window.location.reload();
				}
			});
		}
		
		$scope.intro = false;
		$scope.intro_step = 0;
		$scope.intro_online_step = 0;
		$scope.build_intro = function() {
			if ($scope.intro_step == 1)
			{
				$location.url("/dashboard");
			}
			
			if ($scope.intro_step == 2 || $scope.intro_step == 3)
			{
				$location.url("/pages/online");
			}
			
			if ($scope.intro_step >= 4)
			{
				$location.url("/mail/compose");
			}
			
			var modalInstance;
			modalInstance = $modal.open({
				templateUrl: 'intro-popup.html',
				controller: 'ModalInstanceIntroCtrl',
				backdrop: 'static',
				resolve: {
					items: function() {
						return {user: $scope.user, intro: $scope.intro, step: $scope.intro_step, online_step: $scope.intro_online_step};
					}
				}
			});

			modalInstance.result.then((function(items) {
				$scope.user = items.user;
				$http.post("/pub/intro_close/", {user: $scope.user}).success(function(data, status, headers, config) {
					logger.check(data);
				});
			}), function() {
				console.log("Modal dismissed at: " + new Date());
			});
		};
		
		$scope.start_intro = function() {
			$http.get("/pub/intro_open/").success(function(data, status, headers, config) {
				logger.check(data);
				$scope.intro = true;
				$scope.intro_step = 1;
				$scope.intro_online_step = 0;
				
				$scope.user.intro = true;
				$scope.user.intro_step = 1;
				$scope.user.intro_online_step = 0;
				$scope.build_intro();
			});
		};
		
		/*$scope.intro = false;
		$scope.intro_step = 0;
		$scope.intro_box = document.getElementById("intro-box");
		$scope.close_class = [];
		$scope.close_class[0] = "intro-opened";
		$scope.current_tpl = false;
		$scope.intro_open = '';
		$scope.build_intro = function() {
			if ($scope.intro_step == 1)
			{
				$location.url("/pages/online");
				$scope.current_tpl = "intro1.html";
			}
			
			if ($scope.intro_step == 2)
			{
				$location.url("/pages/profile#intro2");
				$scope.current_tpl = "intro2.html";
			}
			
			if ($scope.intro_step == 3)
			{
				$scope.current_tpl = "intro3.html";
				$scope.intro_open = 'open';
				$location.url("/pages/profile#intro3");
			}
			
			if ($scope.intro_step == 4)
			{
				$scope.current_tpl = "intro4.html";
				$scope.intro_open = '';
				$location.url("/pages/profile#intro4");
			}
			
			if ($scope.intro_step == 5)
			{
				$location.url("/mail/compose");
				$scope.current_tpl = "intro5.html";
			}
			
			if ($scope.intro_step == 6)
			{
				$scope.current_tpl = "intro6.html";
			}
		};
		
		$scope.next_intro = function($event, check) {
			check = check || false;
			if (check || ( ! check && $scope.close_class[0] == "intro-blink intro-closed" && $event.target.className != "ti-close"))
			{
				$scope.intro_step++;
				$http.post("/pub/intro_step/", {step: $scope.intro_step}).success(function(data, status, headers, config) {
					logger.check(data);
				});
				$scope.build_intro();
			}
		};
		
		$scope.prev_intro = function() {
			$scope.intro_step--;
			$scope.build_intro();
			$http.post("/pub/intro_step/", {step: $scope.intro_step}).success(function(data, status, headers, config) {
				logger.check(data);
			});
		};
		
		$scope.intro_close_class = "open_all";
		$scope.intro_close = function() {
			$http.get("/pub/intro_close/").success(function(data, status, headers, config) {
				logger.check(data);
				$scope.intro_close_class = "close_all";
			});
		};
		
		$scope.start_intro = function() {
			$http.get("/pub/intro_open/").success(function(data, status, headers, config) {
				logger.check(data);
				$scope.intro = true;
				$scope.intro_step = 1;
				$scope.close_class = [];
				$scope.close_class[0] = "intro-opened";
				$scope.current_tpl = false;
				$scope.intro_open = '';
				$scope.intro_close_class = "open_all";
				
				$scope.user.intro = true;
				$scope.user.intro_step = 1;
				$scope.build_intro();
			});
		};*/
    }

})();
;
(function () {
    'use strict';

    angular.module('app')
        .controller('DashboardCtrl', [ '$scope', '$rootScope', '$window', '$location', '$http', '$timeout', 'logger', DashboardCtrl]); // overall control

    function DashboardCtrl($scope, $rootScope, $window, $location, $http, $timeout, logger) {
		$scope.first_time = true;
		$scope.ready = false;
		$scope.stat = {};

		$scope.get_dashboard = function() {
			$http.get("/pub/stat_dashboard/").success(function(data, status, headers, config) {
				$scope.stat = logger.check(data);
				$scope.ready = true;

				if ($scope.stat.average)
				{
					$scope.stat.average = ($scope.stat.average * 1).toFixed(1);
					$scope.first_time = false;
				}
				
				if ($scope.stat.average_online)
				{
					$scope.stat.average_online = ($scope.stat.average_online * 1).toFixed(1);
				}

				$scope.stat.reviews = [];
				if ($scope.stat.facebook && $scope.stat.facebook.reviews && $scope.stat.facebook.reviews[0])
				{
					for (var key in $scope.stat.facebook.reviews)
					{
						$scope.stat.reviews.push($scope.stat.facebook.reviews[key]);
					}
				}
				
				if ($scope.stat.google && $scope.stat.google.reviews && $scope.stat.google.reviews[0])
				{
					for (var key in $scope.stat.google.reviews)
					{
						$scope.stat.reviews.push($scope.stat.google.reviews[key]);
					}
				}

				if ($scope.stat.zorgkaart && $scope.stat.zorgkaart.reviews && $scope.stat.zorgkaart.reviews[0])
				{
					for (var key in $scope.stat.zorgkaart.reviews)
					{
						$scope.stat.reviews.push($scope.stat.zorgkaart.reviews[key]);
					}
				}
				
				if ($scope.stat.independer && $scope.stat.independer.reviews && $scope.stat.independer.reviews[0])
				{
					for (var key in $scope.stat.independer.reviews)
					{
						$scope.stat.reviews.push($scope.stat.independer.reviews[key]);
					}
				}
				
				if ($scope.stat.reviews)
				{
					$scope.stat.reviews.sort(function(a, b) { return (a.time > b.time) ? -1 : ((a.time < b.time) ? 1 : 0); });
				}
			});
		};
		
		$scope.get_dashboard();

		$scope.letters = [];
		$http.post("/pub/inbox/", {filter: {stars: "none"}, limit: 10}).success(function(data, status, headers, config) {
			$scope.letters = logger.check(data);
		});

		$scope.go_to_compose = function()
		{
			$location.url("/mail/compose");
		};

		$scope.more = function(id, is_feedback, email)
		{
			if (email || is_feedback)
			{
				$location.url('mail/single/' + id);
			}
		};

		$scope.fb_login = function()
		{
			$window['fb_callback'] = $scope.fb_callback;
			$window.open($scope.stat.fb_link, "Facebook Login", "height=300,width=500");
		};
		
		$scope.fb_callback = function()
		{
			$scope.get_dashboard();
		};
    }

})();
;
(function () {
    'use strict';

    angular.module('app')
        .controller('Charts2Ctrl', [ '$scope', '$rootScope', '$window', '$http', '$location', '$timeout', 'logger', Charts2Ctrl]); // overall control

    function Charts2Ctrl($scope, $rootScope, $window, $http, $location, $timeout, logger) {
		$scope.data_load = false;
		
		$scope.ultimate_class = {};
        $scope.ultimate_over = function(name)
        {
            $scope.ultimate_class[name] = 'over';
        };
        
        $scope.ultimate_out = function(name)
        {
            $scope.ultimate_class[name] = '';
        };
		
		$scope.hex_to_rgba = function(hex, opacity)
		{
			hex = hex.replace('#', '');
			var r = parseInt(hex.substring(0, 2), 16);
			var g = parseInt(hex.substring(2, 4), 16);
			var b = parseInt(hex.substring(4, 6), 16);

			var result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
			return result;
		};
		$scope.color = $scope.user.color || '#0F75BC';
		$scope.color_a = $scope.hex_to_rgba($scope.color, 50);
		
		$scope.stat_filter_list = [{'filter': '', 'value': ''}];
		$scope.stat_filter_data = {};
		
		$http.get("/pub/stat_filter/").success(function(data, status, headers, config) {
			$scope.stat_filter_data = logger.check(data);
		});
		
		$scope.change_filter = function(filter) {
			if (filter.filter == 'date')
			{
				filter.value = {'from': '', 'to': ''};
			}
			else
			{
				filter.value = '';
			}
		};
		
		$scope.add_filter = function() {
			$scope.stat_filter_list.push({'filter': '', 'value': ''});
		};
		
		$scope.remove_filter = function(i) {
			var filter_list = [];
			for (var k in $scope.stat_filter_list)
			{
				if (k != i)
				{
					filter_list.push($scope.stat_filter_list[k]);
				}
			}
			$scope.stat_filter_list = filter_list;
			$scope.run_filter();
		};
		
		$scope.stat_filter_dates = {'from': '', 'to': ''};
		$scope.today = function(type) {
			return $scope.stat_filter_dates[type] = new Date();
		};

		$scope.showWeeks = true;
		$scope.clear = function(type) {
			$scope.stat_filter_dates[type] = null;
		};

		$scope.disabled = function(date, mode) {
			mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
		};

		$scope.open_date = function($event, type, i) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope['opened_' + type + '_' + i] = true;
		};

		$scope.dateOptions = {
			'year-format': "'yy'",
			'starting-day': 1
		};

		$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd/MM/yy', 'shortDate'];
		$scope.format = $scope.formats[2];

		$scope.run_filter = function() {
			$scope.get_email();
		};
		
		$scope.data = {};
		$scope.nps = {};
		$scope.pie_stars = echarts.init(document.getElementById('pie_stars'));
		$window.onresize = function() { $scope.pie_stars.resize(); };
		$scope.pie_stars.setOption({
				tooltip: {trigger:"item", formatter:"{b} : {c} ({d}%)"},
				toolbox: {show: true, feature: {restore : {show: true, title: 'Herstel weergave'}, saveAsImage : {show: true, title: 'Bewaar afbeelding'}}},
				legend: {orient: "vertical", x: "left", data: ["5 sterren", "4 sterren", "3 sterren", "2 sterren", "1 sterren"]},
				calculable: true,
				series:[{type: "pie", radius:["50%", "88%"], center: ['63%', '50%'],
						itemStyle: {normal: {label: {show: false}, labelLine: {show: false}},
									emphasis: {label: {show: true, position: "center", textStyle: {fontSize: "15", fontWeight: "bold"}}}},
						data:[{name: '5 sterren', value: 0, itemStyle: {normal: {color: '#2F91D5'}}},
							  {name: '4 sterren', value: 0, itemStyle: {normal: {color: '#0F75BC'}}},
							  {name: '3 sterren', value: 0, itemStyle: {normal: {color: '#3E769D'}}},
							  {name: '2 sterren', value: 0, itemStyle: {normal: {color: '#2D5775'}}},
							  {name: '1 sterren', value: 0, itemStyle: {normal: {color: '#04090C'}}}]
						}]
		});
		
		$scope.area_averages = echarts.init(document.getElementById('area_averages'));
		$window.onresize = function() { $scope.area_averages.resize(); };
		$scope.area_averages.setOption({
				tooltip: {trigger: "axis"},
				legend: {orient: "horizontal", x: "center", y: "30", data: ['Landelijk gemiddelde', 'Beoordeling van uw praktijk']},
				calculable: true,
				xAxis: [{type: 'category', boundaryGap: false, data: ['Wait']}],
				yAxis: [{type: 'value', boundaryGap: false}],
				series:[{type: 'line', symbol: 'emptyCircle', smooth: true, name: 'Landelijk gemiddelde', data: [0], itemStyle: {normal: {color: '#D3D3D3', borderColor: '#D3D3D3', lineStyle: {color: '#D3D3D3'}, areaStyle: {color: 'rgba(211, 211, 211, 0.5)'}}}},
						{type: 'line', symbol: 'emptyCircle', smooth: true, name: 'Beoordeling van uw praktijk', data: [0], itemStyle: {normal: {color: $scope.color, borderColor: $scope.color, lineStyle: {color: $scope.color}, areaStyle: {color: $scope.color_a}}}}]
		});
		
		$scope.area_stars = echarts.init(document.getElementById('area_stars'));
		$window.onresize = function() { $scope.area_stars.resize(); };
		$scope.area_stars.setOption({
				tooltip: {trigger: "axis"},
				toolbox: {show: true, feature: {restore : {show: true, title: 'Herstel weergave'}, saveAsImage : {show: true, title: 'Bewaar afbeelding'}}},
				legend: {orient: "horizontal", x: "center", y: "30", data: ['5 sterren', '4 sterren', '3 sterren', '2 sterren', '1 sterren']},
				calculable: true,
				xAxis: [{type: 'category', data: ['Wait']}],
				yAxis: [{type: 'value', boundaryGap: false}],
				series:[{type: 'bar', name: '5 sterren', data: [0], itemStyle: {normal: {color: '#2F91D5', barBorderRadius: 5}}},
						{type: 'bar', name: '4 sterren', data: [0], itemStyle: {normal: {color: '#0F75BC', barBorderRadius: 5}}},
						{type: 'bar', name: '3 sterren', data: [0], itemStyle: {normal: {color: '#3E769D', barBorderRadius: 5}}},
						{type: 'bar', name: '2 sterren', data: [0], itemStyle: {normal: {color: '#2D5775', barBorderRadius: 5}}},
						{type: 'bar', name: '1 sterren', data: [0], itemStyle: {normal: {color: '#04090C', barBorderRadius: 5}}}]
		});
		
		$scope.pie_nps = echarts.init(document.getElementById('pie_nps'));
		$window.onresize = function() { $scope.pie_nps.resize(); };
		$scope.pie_nps.setOption({
				tooltip: {trigger:"item", formatter:"{b} : {c} ({d}%)"},
				toolbox: {show: true, feature: {restore : {show: true, title: 'Herstel weergave'}, saveAsImage : {show: true, title: 'Bewaar afbeelding'}}},
				legend: {orient: "vertical", x: "left", data: ["Promotors", "Passives", "Detractors"]},
				calculable: true,
				series:[{type: "pie", radius:["50%", "88%"], center: ['63%', '50%'],
						itemStyle: {normal: {label: {show: false}, labelLine: {show: false}},
									emphasis: {label: {show: true, position: "center", textStyle: {fontSize: "13", fontWeight: "normal"}}}},
						data:[{name: 'Promotors', value: 0, itemStyle: {normal: {color: '#98EA3D'}}},
							  {name: 'Passives', value: 0, itemStyle: {normal: {color: '#FFE165'}}},
							  {name: 'Detractors', value: 0, itemStyle: {normal: {color: '#EE4C61'}}}]
						}]
		});
		
		$scope.area_nps_average = echarts.init(document.getElementById('area_nps_average'));
		$window.onresize = function() { $scope.area_nps_average.resize(); };
		$scope.area_nps_average.setOption({
				tooltip: {trigger: "axis"},
				legend: {orient: "horizontal", x: "center", y: "30", data: ['Landelijk gemiddelde', 'NPS van uw praktijk']},
				calculable: true,
				xAxis: [{type: 'category', boundaryGap: false, data: ['Wait']}],
				yAxis: [{type: 'value', boundaryGap: false}],
				series:[{type: 'line', symbol: 'emptyCircle', smooth: true, name: 'Landelijk gemiddelde', data: [0], itemStyle: {normal: {color: '#D3D3D3', borderColor: '#D3D3D3', lineStyle: {color: '#D3D3D3'}, areaStyle: {color: 'rgba(211, 211, 211, 0.5)'}}}},
						{type: 'line', symbol: 'emptyCircle', smooth: true, name: 'NPS van uw praktijk', data: [0], itemStyle: {normal: {color: $scope.color, borderColor: $scope.color, lineStyle: {color: $scope.color}, areaStyle: {color: $scope.color_a}}}}]
		});
		
		$scope.area_nps = echarts.init(document.getElementById('area_nps'));
		$window.onresize = function() { $scope.area_nps.resize(); };
		$scope.area_nps.setOption({
				tooltip: {trigger: "axis"},
				toolbox: {show: true, feature: {restore : {show: true, title: 'Herstel weergave'}, saveAsImage : {show: true, title: 'Bewaar afbeelding'}}},
				legend: {orient: "horizontal", x: "center", y: "30", data: ['Promotors', 'Passives', 'Detractors']},
				calculable: true,
				xAxis: [{type: 'category', data: ['Wait']}],
				yAxis: [{type: 'value', boundaryGap: false}],
				series:[{type: 'bar', name: 'Promotors', data: [0], itemStyle: {normal: {color: '#98EA3D', barBorderRadius: 5}}},
						{type: 'bar', name: 'Passives', data: [0], itemStyle: {normal: {color: '#FFE165', barBorderRadius: 5}}},
						{type: 'bar', name: 'Detractors', data: [0], itemStyle: {normal: {color: '#EE4C61', barBorderRadius: 5}}}]
		});
		
		$scope.pie_reply = echarts.init(document.getElementById('pie_reply'));
		$window.onresize = function() { $scope.pie_reply.resize(); };
		$scope.pie_reply.setOption({
				tooltip: {trigger:"item", formatter:"{b} : {c} ({d}%)"},
				toolbox: {show: true, feature: {restore : {show: true, title: 'Herstel weergave'}, saveAsImage : {show: true, title: 'Bewaar afbeelding'}}},
				legend: {orient: "vertical", x: "left", data: ["Beoordeeld", "Doorgeklikt", "Niet gereageerd"]},
				calculable: true,
				series:[{type: "pie", radius:["50%", "88%"], center: ['63%', '50%'],
						itemStyle: {normal: {label: {show: false}, labelLine: {show: false}},
									emphasis: {label: {show: true, position: "center", textStyle: {fontSize: "13", fontWeight: "normal"}}}},
						data:[{name: 'Beoordeeld', value: 0, itemStyle: {normal: {color: '#2E91D5'}}}, {name: 'Doorgeklikt', value: 0, itemStyle: {normal: {color: '#0F75BD'}}}, {name: 'Niet gereageerd', value: 0, itemStyle: {normal: {color: '#2F5874'}}}] }]
		});
		
		$scope.less_30 = false;
		$scope.empty_filter = false;
		$scope.area_averages_empty = false;
		$scope.area_stars_empty = false;
		$scope.area_nps_average_empty = false;
		$scope.area_nps_empty = false;
		$scope.get_email = function() {
			$http.post("/pub/stat_chart2/", {'filter': $scope.stat_filter_list}).success(function(data, status, headers, config) {
				$scope.data_load = true;
				$scope.data = logger.check(data);
				$scope.color = $scope.user.color || '#0F75BC';
				$scope.color_a = $scope.hex_to_rgba($scope.color, 50);
				
				var is_filter = false;
				for (var k in $scope.stat_filter_list)
				{
					if ($scope.stat_filter_list[k].value != '')
					{
						is_filter = true;
					}
				}

				if ($scope.data.for_user >= 30 || (is_filter && $scope.data && $scope.data.for_user > 0))
				{
					$scope.less_30 = false;
					$scope.empty_filter = false;

					if ($scope.data && $scope.data.hours != '')
					{
						$scope.data.hours_from = ($scope.data.hours < 10 ? '0' : '') + $scope.data.hours + ":00";
						$scope.data.hours_to = ($scope.data.hours + 1) > 23 ? '0' : ($scope.data.hours + 1);
						$scope.data.hours_to = ($scope.data.hours_to < 10 ? '0' : '') + $scope.data.hours_to + ":00";
					}
					
					if ($scope.data && $scope.data.days != '')
					{
						$scope.days = {'1': 'maandag',
									   '2': 'dinsdag',
									   '3': 'woensdag',
									   '4': 'donderdag',
									   '5': 'vrijdag',
									   '6': 'zaterdag',
									   '7': 'zondag'};
						$scope.data.days_text = $scope.days[$scope.data.days];
					}
					
					if ($scope.data && $scope.data.stars_count)
					{
						for (var i = 5; i > 0; i--)
						{
							$scope.pie_stars.addData([[0, {name: i + ' sterren', value: ($scope.data.stars_count[i] ? $scope.data.stars_count[i] : 0) * 1}, false, false]]);
						}
					}
					
					if ($scope.data && $scope.data.average_my_month)
					{
						var series = [];
						var max = 5;
						var data = [];
						var empty_check = true;
						for (var m in $scope.data.average_all_month)
						{
							var value = $scope.data.average_all_month[m];
							data.push(value);
							if (value > 0)
							{
								empty_check = false;
							}
						}
						series.push({type: 'line', name: 'Landelijk gemiddelde', data: data});
						
						data = [];
						for (var m in $scope.data.average_my_month)
						{
							var value = $scope.data.average_my_month[m];
							data.push(value);
							if (value > 0)
							{
								empty_check = false;
							}
						}
						series.push({type: 'line', name: 'Beoordeling van uw praktijk', data: data, itemStyle: {normal: {color: $scope.color, borderColor: $scope.color, lineStyle: {color: $scope.color}, areaStyle: {color: $scope.color_a}}}});
						
						$scope.area_averages.setOption({xAxis: [{data: $scope.data.average_month_x}],
														yAxis: [{min: 0, max: max}],
														series: series});
						$scope.area_averages_empty = empty_check;
					}
					
					if ($scope.data && $scope.data.average_month)
					{
						var series = [];
						var max = 0;
						var max_num = {};
						var empty_check = true;
						for (var i = 5; i > 0; i--)
						{
							var data = [];
							for (var m in $scope.data.average_month[i])
							{
								var value = $scope.data.average_month[i][m];
								data.push(value);
								if (value > 0)
								{
									empty_check = false;
								}
								
								if ( ! max_num[m])
								{
									max_num[m] = 0;
								}
								max_num[m] += $scope.data.average_month[i][m] * 1;
							}
							series.push({type: 'bar', stack: m, name: (i + ' sterren'), data: data});
						}
						
						for (var m in max_num)
						{
							max = Math.max(max, max_num[m]);
						}

						$scope.area_stars.setOption({xAxis: [{data: $scope.data.average_month_x}],
													 yAxis: [{min: 0, max: max}],
													 series: series});
						$scope.area_stars_empty = empty_check;
					}
					
					if ($scope.data && $scope.data.average_nps.all)
					{
						$scope.nps['12'] = Math.round($scope.data.average_nps['12p'] / 10);
						$scope.nps['45'] = Math.round($scope.data.average_nps['45p'] / 10);
						$scope.nps['3'] = 10 - ($scope.nps['12'] + $scope.nps['45']);
						
						$scope.pie_nps.addData([[0, {name: 'Promotors', value: $scope.data.average_nps['45']}, false, false]]);
						$scope.pie_nps.addData([[0, {name: 'Passives', value: $scope.data.average_nps['3']}, false, false]]);
						$scope.pie_nps.addData([[0, {name: 'Detractors', value: $scope.data.average_nps['12']}, false, false]]);
					}
					
					if ($scope.data && $scope.data.nps_my_month)
					{
						var series = [];
						var data = [];
						var max = 0;
						var min = false;
						var empty_check = true;

						for (var m in $scope.data.nps_all_month)
						{
							var value = $scope.data.nps_all_month[m];
							data.push(value);
							if (value > 0)
							{
								empty_check = false;
							}
								
							max = Math.max(max, $scope.data.nps_all_month[m] * 1);
							if (min === false)
							{
								min = $scope.data.nps_all_month[m] * 1
							}
							else
							{
								min = Math.max(min, $scope.data.nps_all_month[m] * 1);
							}
						}
						series.push({type: 'line', name: 'Landelijk gemiddelde', data: data});
						
						data = [];
						for (var m in $scope.data.nps_my_month)
						{
							var value = $scope.data.nps_my_month[m];
							data.push(value);
							if (value > 0)
							{
								empty_check = false;
							}
							
							max = Math.max(max, $scope.data.nps_my_month[m] * 1);
							if (min === false)
							{
								min = $scope.data.nps_my_month[m] * 1
							}
							else
							{
								min = Math.max(min, $scope.data.nps_my_month[m] * 1);
							}
						}
						series.push({type: 'line', name: 'NPS van uw praktijk', data: data});

						$scope.area_nps_average.setOption({xAxis: [{data: $scope.data.average_month_x}],
														   yAxis: [{min: (min > 0 ? 0 : Math.round(min * 1.2)), max: Math.round(max * 1.2)}],
														   series: series});
						$scope.area_nps_average_empty = empty_check;
					}
					
					if ($scope.data && $scope.data.history_nps)
					{
						var series = [];
						var data = [];
						var max = 0;
						var max_num = {};
						var empty_check = true;
						for (var m in $scope.data.history_nps['45'])
						{
							var value = $scope.data.history_nps['45'][m];
							data.push(value);
							if (value > 0)
							{
								empty_check = false;
							}
							
							if ( ! max_num[m])
							{
								max_num[m] = 0;
							}
							max_num[m] += $scope.data.history_nps['45'][m] * 1;
						}
						series.push({type: 'bar', stack: m, name: 'Promotors', data: data});
						
						data = [];
						for (var m in $scope.data.history_nps['3'])
						{
							var value = $scope.data.history_nps['3'][m];
							data.push(value);
							if (value > 0)
							{
								empty_check = false;
							}
							
							if ( ! max_num[m])
							{
								max_num[m] = 0;
							}
							max_num[m] += $scope.data.history_nps['3'][m] * 1;
						}
						series.push({type: 'bar', stack: m, name: 'Passives', data: data});
						
						data = [];
						for (var m in $scope.data.history_nps['12'])
						{
							var value = $scope.data.history_nps['12'][m];
							data.push(value);
							if (value > 0)
							{
								empty_check = false;
							}
							
							if ( ! max_num[m])
							{
								max_num[m] = 0;
							}
							max_num[m] += $scope.data.history_nps['12'][m] * 1;
						}
						series.push({type: 'bar', stack: m, name: 'Detractors', data: data});
						
						for (var m in max_num)
						{
							max = Math.max(max, max_num[m]);
						}

						$scope.area_nps.setOption({xAxis: [{data: $scope.data.average_month_x}],
												   yAxis: [{min: 0, max: max}],
												   series: series});
						$scope.area_nps_empty = empty_check;
					}
					
					if ($scope.data && $scope.data.reply_chart)
					{
						$scope.pie_reply.addData([[0, {name: 'Beoordeeld', value: $scope.data.reply_chart['reply']}, false, false]]);
						$scope.pie_reply.addData([[0, {name: 'Doorgeklikt', value: $scope.data.reply_chart['click']}, false, false]]);
						$scope.pie_reply.addData([[0, {name: 'Niet gereageerd', value: $scope.data.reply_chart['none']}, false, false]]);
					}
				}
				else
				{
					if ( ! is_filter)
					{
						$scope.less_30 = true;
					}
					else
					{
						$scope.empty_filter = true;
					}
				}
			});
		};

		$scope.get_email();
		
		$scope.range = function(num)
		{
			var array = [];
			for (var i = 0; i < num; i++)
			{
				array.push(i);
			}
			return array;
		};
		
		$scope.pdf_export = function() {
			html2canvas($('#charts')[0], {
				onrendered: function(canvas) {
					var doc = new jsPDF("p", "mm", "a4");
					var width = doc.internal.pageSize.width;    
					var height = doc.internal.pageSize.height - 10;
					
					var logo_png_white = 'data:image/png;base64,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';
					doc.addImage(logo_png_white, 'PNG', 30, 100, 150, 26);
					
					doc.setFont('helvetica');
					doc.setFontType('bold');
					doc.setFontSize(40);
					doc.setTextColor(0, 0, 0);
					doc.text(105, 150, 'Rapportage', null, null, 'center');
					
					doc.setFontSize(16);
					doc.text(105, 160, $scope.user.username, null, null, 'center');
					
				
					for (var k in $scope.stat_filter_list)
					{
						if ($scope.stat_filter_list[k].filter == 'date')
						{
							if ($scope.stat_filter_list[k].value.from && $scope.stat_filter_list[k].value.to)
							{
								var from_d = new Date($scope.stat_filter_list[k].value.from);
								var from_date = (from_d.getDate() < 10 ? '0' : '') + from_d.getDate() + '-' + ((from_d.getMonth() + 1) < 10 ? '0' : '') + (from_d.getMonth() + 1) + '-' + from_d.getFullYear();
								var to_d = new Date($scope.stat_filter_list[k].value.to);
								var to_date = (to_d.getDate() < 10 ? '0' : '') + to_d.getDate() + '-' + ((to_d.getMonth() + 1) < 10 ? '0' : '') + (to_d.getMonth() + 1) + '-' + to_d.getFullYear();
								
								doc.setFontSize(14);
								doc.setFontType('normal');
								doc.text(105, 167, from_date + ' t/m ' + to_date, null, null, 'center');
							}
						}
					}
					
					doc.addPage();
					
					var image = canvas.toDataURL("image/png");
					var charts_width = canvas.width / (canvas.height / height);
					console.log(Math.round((width - charts_width) / 2));
					doc.addImage(image, 'PNG', Math.round((width - charts_width) / 2), 5, charts_width, height);
					
					doc.save('test.pdf');
				}
			});
		};
    }

})();
;
(function () {
    'use strict';

    angular.module('app')
        .controller('OnlinesCtrl', [ '$scope', '$rootScope', '$window', '$http', '$location', '$timeout', 'logger', OnlinesCtrl]); // overall control

    function OnlinesCtrl($scope, $rootScope, $window, $http, $location, $timeout, logger) {
		$scope.data_load = false;
		$scope.onlines = ['Zorgkaart', 'Facebook', 'Independer', 'Google'];
		$scope.hex_to_rgba = function(hex, opacity)
		{
			hex = hex.replace('#', '');
			var r = parseInt(hex.substring(0, 2), 16);
			var g = parseInt(hex.substring(2, 4), 16);
			var b = parseInt(hex.substring(4, 6), 16);

			var result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
			return result;
		};
		$scope.color = $scope.user.color || '#0F75BC';
		$scope.color_a = $scope.hex_to_rgba($scope.color, 50);
		
		$scope.pie_online = echarts.init(document.getElementById('pie_online'));
		$window.onresize = function() { $scope.pie_online.resize(); };
		$scope.pie_online.setOption({
				tooltip: {trigger:"item", formatter:"{b} : {c} ({d}%)"},
				/*toolbox: {show: true, feature: {restore : {show: true, title: 'Herstel weergave'}, saveAsImage : {show: true, title: 'Bewaar afbeelding'}}},*/
				legend: {orient: "vertical", x: "left", data: ["Zorgkaart", "Facebook", "Independer", "Google"]},
				calculable: true,
				series:[{type: "pie", radius:["50%", "88%"], center: ['63%', '50%'],
						itemStyle: {normal: {label: {show: false}, labelLine: {show: false}},
									emphasis: {label: {show: true, position: "center", textStyle: {fontSize: "14", fontWeight: "bold"}}}},
						data:[{name: 'Zorgkaart', value: 0, itemStyle: {normal: {color: '#F29619'}}},
							  {name: 'Facebook', value: 0, itemStyle: {normal: {color: '#3B589E'}}},
							  {name: 'Independer', value: 0, itemStyle: {normal: {color: '#825F87'}}},
							  {name: 'Google', value: 0, itemStyle: {normal: {color: '#C1C1C1'}}}]
						}]
		});
		
		$scope.area_online = echarts.init(document.getElementById('area_online'));
		$window.onresize = function() { $scope.area_online.resize(); };
		$scope.area_online.setOption({
				tooltip: {trigger: "axis"},
				legend: {orient: "horizontal", x: "center", y: "30", data: ['Zorgkaart', 'Facebook', 'Independer', 'Google']},
				calculable: true,
				xAxis: [{type: 'category', boundaryGap: false, data: ['Wait']}],
				yAxis: [{type: 'value', boundaryGap: false}],
				series:[{type: 'line', symbol: 'emptyCircle', smooth: true, name: 'Zorgkaart', data: [0], itemStyle: {normal: {color: '#F29619', borderColor: '#F29619', lineStyle: {color: '#F29619'}, areaStyle: {color: 'rgba(242, 150, 25, 0.5)'}}}},
						{type: 'line', symbol: 'emptyCircle', smooth: true, name: 'Facebook', data: [0], itemStyle: {normal: {color: '#3B589E', borderColor: '#3B589E', lineStyle: {color: '#3B589E'}, areaStyle: {color: 'rgba(59, 88, 158, 0.5)'}}}},
						{type: 'line', symbol: 'emptyCircle', smooth: true, name: 'Independer', data: [0], itemStyle: {normal: {color: '#825F87', borderColor: '#825F87', lineStyle: {color: '#825F87'}, areaStyle: {color: 'rgba(130, 95, 135, 0.5)'}}}},
						{type: 'line', symbol: 'emptyCircle', smooth: true, name: 'Google', data: [0], itemStyle: {normal: {color: '#C1C1C1', borderColor: '#C1C1C1', lineStyle: {color: '#C1C1C1'}, areaStyle: {color: 'rgba(193, 193, 193, 0.5)'}}}}]
		});
		
		$scope.onl = {};
		$scope.empty_filter = false;
		$scope.area_online_empty = false;
		$scope.get_online = function()
		{
			$http.post('/pub/stat_online/', {}).success(function(data, status, headers, config) {
				$scope.data_load = true;
				$scope.onl = logger.check(data);

				if ($scope.onl && $scope.onl.months)
				{
					$scope.empty_filter = false;
					if ($scope.onl && $scope.onl.pie)
					{
						for (var k in $scope.onlines)
						{
							$scope.pie_online.addData([[0, {name: $scope.onlines[k], value: ($scope.onl.pie[$scope.onlines[k].toLowerCase()] ? $scope.onl.pie[$scope.onlines[k].toLowerCase()] : 0) * 1}, false, false]]);
						}
					}
						
					if ($scope.onl && $scope.onl.history)
					{
						var series = [];
						var max = 5;
						var data = [];
						var empty_check = true;
						for (var k in $scope.onlines)
						{
							data = [];
							for (var m in $scope.onl.history)
							{
								var value = $scope.onl.history[m][$scope.onlines[k].toLowerCase()];
								data.push(value);
								if (value > 0)
								{
									empty_check = false;
								}
							}
							series.push({type: 'line', name: $scope.onlines[k], data: data});
						}
						
						$scope.area_online.setOption({xAxis: [{data: $scope.onl.months}],
													  yAxis: [{min: 0, max: max}],
													  series: series});
						$scope.area_online.resize();
						$scope.area_online_empty = empty_check;
					}
				}
				else
				{
					$scope.empty_filter = true;
				}
			});
		};

		$scope.get_online();
		
		$scope.range = function(num)
		{
			var array = [];
			for (var i = 0; i < num; i++)
			{
				array.push(i);
			}
			return array;
		};
    }

})();
;
(function () {
    'use strict';

    angular.module('app')
        .controller('ChartsCtrl', [ '$scope', '$rootScope', '$window', '$http', '$location', '$timeout', 'logger', ChartsCtrl]); // overall control

    function ChartsCtrl($scope, $rootScope, $window, $http, $location, $timeout, logger) {
		$scope.first_time = false;
		$scope.ready = false;
		$scope.show_difference = false;
		$scope.stat = {};
		$scope.filter = {average: 0,
						 stars: 0,
						 feedbacks: 0,
						 diagram: 0,
						 online: 0,
						 doctors: 0,
						 vs: 0,
						 days: 2,
						 nps: {bad: 0, good: 0, delta: 0},
						 doctor: 0,
						 compare: 0};
		$scope.donutChart2 = {};
		$scope.donutChartOnline = {};
		$scope.donutChartDoctors = {};
		
		$scope.doctors = [];
		$http.post("/pub/get_doctors/").success(function(data, status, headers, config) {
			var result = logger.check(data);
			$scope.doctors = [];
			for (var key in result)
			{
				$scope.doctors.push(result[key]);
			}
		});

        $scope.donutChart2.data = [
			{
                label: "Geen reactie",
                data: 0
            }, {
                label: "1 ster",
                data: 0
            }, {
                label: "2 sterren",
                data: 0
            }, {
                label: "3 sterren",
                data: 0
            }, {
                label: "4 sterren",
                data: 0
            }, {
                label: "5 sterren",
                data: 0
            }
        ];
		
        $scope.donutChart2.options = {
            series: {
                pie: {
                    show: true,
                    innerRadius: 0.45
                }
            },
            legend: {
                show: false
            },
            grid: {
                hoverable: true,
                clickable: true
            },
            colors: ["#1BB7A0", "#39B5B9", "#52A3BB", "#619CC4", "#6D90C5"],
            tooltip: true,
            tooltipOpts: {
                content: "%p.0%, %s",
                defaultTheme: false
            }
        };
		
		$scope.donutChartOnline.data = [];
		$scope.donutChartOnline.options = {
            series: {
                pie: {
                    show: true,
                    innerRadius: 0.45
                }
            },
            legend: {
                show: false
            },
            grid: {
                hoverable: true,
                clickable: true
            },
            colors: ["#1BB7A0", "#39B5B9", "#52A3BB", "#619CC4", "#6D90C5"],
            tooltip: true,
            tooltipOpts: {
                content: "%p.0%, %s",
                defaultTheme: false
            }
        };
		
		$scope.donutChartDoctors.data = [];
		$scope.donutChartDoctors.options = {
            series: {
                pie: {
                    show: true,
                    innerRadius: 0.45
                }
            },
            legend: {
                show: false
            },
            grid: {
                hoverable: true,
                clickable: true
            },
            colors: ["#1BB7A0", "#39B5B9", "#52A3BB", "#619CC4", "#6D90C5"],
            tooltip: true,
            tooltipOpts: {
                content: "%p.0%, %s",
                defaultTheme: false
            }
        };

		$scope.easypiechart = {
            percent: 0,
            options: {
                animate: {
                    duration: 1000,
                    enabled: true
                },
                barColor: $scope.color.primary,
                lineCap: 'round',
                size: 180,
                lineWidth: 5
            }
        };

		$scope.largeChart1 = {
            data: [],
            options: {
                type: 'line',
                lineColor: $scope.color.info,
                highlightLineColor: '#fff',
                fillColor: $scope.color.info,
                spotColor: false,
                minSpotColor: false,
                maxSpotColor: false,
                width: '100%',
                height: '190px',
				chartRangeMin: 0,
				chartRangeMax: 5
            }
        };

		$scope.get = function() {
			$http.post("/pub/stat_chart/", $scope.filter).success(function(data, status, headers, config) {
				var average_online = $scope.stat.average_online ? $scope.stat.average_online : 0;
				$scope.stat = logger.check(data);
				$scope.show_difference = ($scope.stat.all >= 10);
				$scope.ready = true;

				if ($scope.stat.average)
				{
					$scope.stat.average = ($scope.stat.average * 1).toFixed(1);
					
					for (var key in $scope.stat.diagram)
					{
						$scope.donutChart2.data[key].data = $scope.stat.diagram[key];
					}
					
					$scope.donutChartOnline.data = [];
					for (var key in $scope.stat.online)
					{
						$scope.donutChartOnline.data.push({label: $scope.stat.online[key].label,
														   data: $scope.stat.online[key].data});
					}
					
					if ($scope.data && $scope.data.reply_chart)
					{
						$scope.pie_reply.addData([[0, {name: 'Beoordeeld', value: $scope.data.reply_chart['reply']}, false, false]]);
						$scope.pie_reply.addData([[0, {name: 'Doorgeklikt', value: $scope.data.reply_chart['click']}, false, false]]);
						$scope.pie_reply.addData([[0, {name: 'Niet gereageerd', value: $scope.data.reply_chart['none']}, false, false]]);
					}
				}
				else
				{
					$scope.less_30 = true;
				}
			});
		};
		
		$scope.pie_online = echarts.init(document.getElementById('pie_online'));
		$window.onresize = function() { $scope.pie_online.resize(); };
		$scope.pie_online.setOption({
				tooltip: {trigger:"item", formatter:"{b} : {c} ({d}%)"},
				/*toolbox: {show: true, feature: {restore : {show: true, title: 'Herstel weergave'}, saveAsImage : {show: true, title: 'Bewaar afbeelding'}}},*/
				legend: {orient: "vertical", x: "left", data: ["Zorgkaart", "Facebook", "Independer", "Google"]},
				calculable: true,
				series:[{type: "pie", radius:["50%", "88%"], center: ['63%', '50%'],
						itemStyle: {normal: {label: {show: false}, labelLine: {show: false}},
									emphasis: {label: {show: true, position: "center", textStyle: {fontSize: "14", fontWeight: "bold"}}}},
						data:[{name: 'Zorgkaart', value: 0, itemStyle: {normal: {color: '#F29619'}}},
							  {name: 'Facebook', value: 0, itemStyle: {normal: {color: '#3B589E'}}},
							  {name: 'Independer', value: 0, itemStyle: {normal: {color: '#825F87'}}},
							  {name: 'Google', value: 0, itemStyle: {normal: {color: '#C1C1C1'}}}]
						}]
		});
		
		$scope.area_online = echarts.init(document.getElementById('area_online'));
		$window.onresize = function() { $scope.area_online.resize(); };
		$scope.area_online.setOption({
				tooltip: {trigger: "axis"},
				legend: {orient: "horizontal", x: "center", y: "30", data: ['Zorgkaart', 'Facebook', 'Independer', 'Google']},
				calculable: true,
				xAxis: [{type: 'category', boundaryGap: false, data: ['Wait']}],
				yAxis: [{type: 'value', boundaryGap: false}],
				series:[{type: 'line', symbol: 'emptyCircle', smooth: true, name: 'Zorgkaart', data: [0], itemStyle: {normal: {color: '#F29619', borderColor: '#F29619', lineStyle: {color: '#F29619'}, areaStyle: {color: 'rgba(242, 150, 25, 0.5)'}}}},
						{type: 'line', symbol: 'emptyCircle', smooth: true, name: 'Facebook', data: [0], itemStyle: {normal: {color: '#3B589E', borderColor: '#3B589E', lineStyle: {color: '#3B589E'}, areaStyle: {color: 'rgba(59, 88, 158, 0.5)'}}}},
						{type: 'line', symbol: 'emptyCircle', smooth: true, name: 'Independer', data: [0], itemStyle: {normal: {color: '#825F87', borderColor: '#825F87', lineStyle: {color: '#825F87'}, areaStyle: {color: 'rgba(130, 95, 135, 0.5)'}}}},
						{type: 'line', symbol: 'emptyCircle', smooth: true, name: 'Google', data: [0], itemStyle: {normal: {color: '#C1C1C1', borderColor: '#C1C1C1', lineStyle: {color: '#C1C1C1'}, areaStyle: {color: 'rgba(193, 193, 193, 0.5)'}}}}]
		});
		
		$scope.onl = {};
		$scope.get_online = function()
		{
			$http.post('/pub/stat_online/', {}).success(function(data, status, headers, config) {
				$scope.onl = logger.check(data);
				if ($scope.onl && $scope.onl.pie)
				{
					for (var k in $scope.onlines)
					{
						$scope.pie_online.addData([[0, {name: $scope.onlines[k], value: ($scope.onl.pie[$scope.onlines[k].toLowerCase()] ? $scope.onl.pie[$scope.onlines[k].toLowerCase()] : 0) * 1}, false, false]]);
					}
				}
					
				if ($scope.onl && $scope.onl.history)
				{
					var series = [];
					var max = 5;
					var data = [];
					for (var k in $scope.onlines)
					{
						data = [];
						for (var m in $scope.onl.history)
						{
							data.push($scope.onl.history[m][$scope.onlines[k].toLowerCase()]);
						}
						series.push({type: 'line', name: $scope.onlines[k], data: data});
					}
					
					$scope.area_online.setOption({xAxis: [{data: $scope.onl.months}],
												  yAxis: [{min: 0, max: max}],
												  series: series});
					$scope.area_online.resize();
				}
			});
		};
		
		$scope.get = function()
		{
			if ($scope.type == 'email')
			{
				$scope.get_email();
			}
			else
			{
				$scope.get_online();
			}
		};

		$scope.get();
		
		$scope.range = function(num)
		{
			var array = [];
			for (var i = 0; i < num; i++)
			{
				array.push(i);
			}
			return array;
		};
    }

})();
;
(function () {
    'use strict';

    angular.module('app')
        .controller('AChartsCtrl', [ '$scope', '$rootScope', '$window', '$http', '$timeout', 'logger', AChartsCtrl]); // overall control

    function AChartsCtrl($scope, $rootScope, $window, $http, $timeout, logger) {
		$scope.stat = {};
		$scope.filter = {id: 0,
						 average: 0,
						 average_online: 0,
						 stars: 0,
						 feedbacks: 0,
						 diagram: 0,
						 online: 0,
						 doctors: 0,
						 vs: 0,
						 days: 2,
						 nps: {bad: 0, good: 0, delta: 0},
						 user: 0,
						 doctor: 0,
						 compare: 0};
		$scope.donutChart2 = {};
		$scope.donutChartOnline = {};
		$scope.donutChartDoctors = {};
		
		$scope.users = [];
		$http.post("/pub/users/").success(function(data, status, headers, config) {
			var result = logger.check(data);
			$scope.users = [];
			for (var key in result)
			{
				$scope.users.push(result[key]);
			}
		});
		
		$scope.doctors = [];
		$http.post("/pub/get_doctors/", {type: "all"}).success(function(data, status, headers, config) {
			var result = logger.check(data);
			$scope.doctors = [];
			for (var key in result)
			{
				$scope.doctors.push(result[key]);
			}
		});

		$scope.login_as_user = function(users_id) {
			$http.post("/pub/login_as_user/", {id: users_id}).success(function(data, status, headers, config) {
				if (logger.check(data))
				{
					$window.location.reload();
				}
			});
		};

        $scope.donutChart2.data = [
			{
                label: "Geen reactie",
                data: 0
            }, {
                label: "1 ster",
                data: 0
            }, {
                label: "2 sterren",
                data: 0
            }, {
                label: "3 sterren",
                data: 0
            }, {
                label: "4 sterren",
                data: 0
            }, {
                label: "5 sterren",
                data: 0
            }
        ];

        $scope.donutChart2.options = {
            series: {
                pie: {
                    show: true,
                    innerRadius: 0.45
                }
            },
            legend: {
                show: false
            },
            grid: {
                hoverable: true,
                clickable: true
            },
            colors: ["#1BB7A0", "#39B5B9", "#52A3BB", "#619CC4", "#6D90C5"],
            tooltip: true,
            tooltipOpts: {
                content: "%p.0%, %s",
                defaultTheme: false
            }
        };
		
		$scope.donutChartOnline.data = [];
		$scope.donutChartOnline.options = {
            series: {
                pie: {
                    show: true,
                    innerRadius: 0.45
                }
            },
            legend: {
                show: false
            },
            grid: {
                hoverable: true,
                clickable: true
            },
            colors: ["#1BB7A0", "#39B5B9", "#52A3BB", "#619CC4", "#6D90C5"],
            tooltip: true,
            tooltipOpts: {
                content: "%p.0%, %s",
                defaultTheme: false
            }
        };
		
		$scope.donutChartDoctors.data = [];
		$scope.donutChartDoctors.options = {
            series: {
                pie: {
                    show: true,
                    innerRadius: 0.45
                }
            },
            legend: {
                show: false
            },
            grid: {
                hoverable: true,
                clickable: true
            },
            colors: ["#1BB7A0", "#39B5B9", "#52A3BB", "#619CC4", "#6D90C5"],
            tooltip: true,
            tooltipOpts: {
                content: "%p.0%, %s",
                defaultTheme: false
            }
        };

		$scope.easypiechart = {
            percent: 0,
            options: {
                animate: {
                    duration: 1000,
                    enabled: true
                },
                barColor: $scope.color.primary,
                lineCap: 'round',
                size: 180,
                lineWidth: 5
            }
        };

		$scope.largeChart1 = {
            data: [],
            options: {
                type: 'line',
                lineColor: $scope.color.info,
                highlightLineColor: '#fff',
                fillColor: $scope.color.info,
                spotColor: false,
                minSpotColor: false,
                maxSpotColor: false,
                width: '100%',
                height: '190px',
				chartRangeMin: 0,
				chartRangeMax: 5
            }
        };

		$scope.get = function() {
			$http.post("/pub/stat_achart/", $scope.filter).success(function(data, status, headers, config) {
				var average_online = $scope.stat.average_online ? $scope.stat.average_online : 0;
				$scope.stat = logger.check(data);
				if ($scope.stat.average)
				{
					$scope.stat.average = ($scope.stat.average * 1).toFixed(1);
				}
				
				for (var key in $scope.stat.diagram)
				{
					$scope.donutChart2.data[key].data = $scope.stat.diagram[key];
				}
				
				$scope.donutChartOnline.data = [];
				for (var key in $scope.stat.online)
				{
					$scope.donutChartOnline.data.push({label: $scope.stat.online[key].label,
													   data: $scope.stat.online[key].data});
				}
				
				$scope.donutChartDoctors.data = [];
				for (var key in $scope.stat.doctors)
				{
					$scope.donutChartDoctors.data.push({label: $scope.stat.doctors[key].label,
														data: $scope.stat.doctors[key].data});
				}

				$.plot($(".donutChart2"), $scope.donutChart2.data, $scope.donutChart2.options);
				$.plot($(".donutChartOnline"), $scope.donutChartOnline.data, $scope.donutChartOnline.options);
				$.plot($(".donutChartDoctors"), $scope.donutChartDoctors.data, $scope.donutChartDoctors.options);

				$scope.easypiechart.percent = $scope.stat.vs;
				$scope.largeChart1.data = $scope.stat.days;
				$scope.largeChart1.options.tooltipFormat = '<span style="color: {{color}}">&#9679;</span> {{offset:names}} ({{y}})';
				$scope.largeChart1.options.tooltipValueLookups = {
					names: $scope.stat.days_y
				};

				$("#days_chart").sparkline($scope.largeChart1.data, $scope.largeChart1.options);

				$scope.stat.average_online = average_online;
				$scope.online();
			});
		};

		$scope.get();

		$scope.online = function()
		{
			$scope.print_online();
		};

		$scope.last = {average: 0, average_online: 0};
		$scope.first_time_init = true;
		$scope.print_online = function(type)
		{
			$scope.type = type || "all";

			$scope.stat.average_online = 0;
			var all_count = 0;

			if ($scope.stat.google && $scope.stat.google.rating && $scope.stat.google.rating > 0)
			{
				$scope.stat.average_online += $scope.stat.google.rating;
				all_count++;
			}

			if ($scope.stat.zorgkaart && $scope.stat.zorgkaart.rating && $scope.stat.zorgkaart.rating > 0)
			{
				$scope.stat.average_online += $scope.stat.zorgkaart.rating;
				all_count++;
			}
			
			if ($scope.stat.independer && $scope.stat.independer.rating && $scope.stat.independer.rating > 0)
			{
				$scope.stat.average_online += $scope.stat.independer.rating;
				all_count++;
			}
			
			if ($scope.stat.telefoonboek && $scope.stat.telefoonboek.rating && $scope.stat.telefoonboek.rating > 0)
			{
				$scope.stat.average_online += $scope.stat.telefoonboek.rating;
				all_count++;
			}

			if (all_count > 0)
			{
				$scope.stat.average_online = Math.round($scope.stat.average_online / all_count * 10) / 10;
			}

			switch ($scope.type)
			{
				case "google": $scope.stat.average_online = $scope.stat.google.rating; break;
				case "zorgkaart": $scope.stat.average_online = $scope.stat.zorgkaart.rating; break;
				case "independer": $scope.stat.average_online = $scope.stat.independer.rating; break;
				case "telefoonboek": $scope.stat.average_online = $scope.stat.telefoonboek.rating; break;
			}

			if ($scope.first_time_init)
			{
				$scope.stat.average_online = ($scope.stat.average_online * 1).toFixed(1);
				$scope.first_time_init = false;

				$http.post("/pub/last_dashboard/", {average: $scope.stat.average, average_online: $scope.stat.average_online}).success(function(data, status, headers, config) {
					$scope.last = logger.check(data);
				});
			}
		};
    }

})();
;
(function () {
    'use strict';

    angular.module('app')
        .controller('ACharts2Ctrl', [ '$scope', '$rootScope', '$window', '$http', '$timeout', 'logger', ACharts2Ctrl]); // overall control

    function ACharts2Ctrl($scope, $rootScope, $window, $http, $timeout, logger) {
		$scope.data_load = false;
		$scope.login_as_user = function(users_id) {
			$http.post("/pub/login_as_user/", {id: users_id}).success(function(data, status, headers, config) {
				if (logger.check(data))
				{
					$window.location.reload();
				}
			});
		};

		$scope.hex_to_rgba = function(hex, opacity)
		{
			hex = hex.replace('#', '');
			var r = parseInt(hex.substring(0, 2), 16);
			var g = parseInt(hex.substring(2, 4), 16);
			var b = parseInt(hex.substring(4, 6), 16);

			var result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
			return result;
		};
		$scope.color = '#0F75BC';
		$scope.color_a = $scope.hex_to_rgba($scope.color, 50);
		
		$scope.stat_filter_list = [{'filter': '', 'value': ''}];
		$scope.stat_filter_data = {};
		
		$http.post("/pub/stat_filter/", {'admin': 1}).success(function(data, status, headers, config) {
			$scope.stat_filter_data = logger.check(data);
		});
		
		$scope.change_filter = function(filter) {
			if (filter.filter == 'date')
			{
				filter.value = {'from': '', 'to': ''};
			}
			else
			{
				filter.value = '';
			}
		};
		
		$scope.add_filter = function() {
			$scope.stat_filter_list.push({'filter': '', 'value': ''});
		};
		
		$scope.remove_filter = function(i) {
			var filter_list = [];
			for (var k in $scope.stat_filter_list)
			{
				if (k != i)
				{
					filter_list.push($scope.stat_filter_list[k]);
				}
			}
			$scope.stat_filter_list = filter_list;
			$scope.run_filter();
		};
		
		$scope.stat_filter_dates = {'from': '', 'to': ''};
		$scope.today = function(type) {
			return $scope.stat_filter_dates[type] = new Date();
		};

		$scope.showWeeks = true;
		$scope.clear = function(type) {
			$scope.stat_filter_dates[type] = null;
		};

		$scope.disabled = function(date, mode) {
			mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
		};

		$scope.open_date = function($event, type, i) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope['opened_' + type + '_' + i] = true;
		};

		$scope.dateOptions = {
			'year-format': "'yy'",
			'starting-day': 1
		};

		$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd/MM/yy', 'shortDate'];
		$scope.format = $scope.formats[2];

		$scope.run_filter = function() {
			$scope.get();
		};

		$scope.data = {};
		$scope.nps = {};
		$scope.pie_stars = echarts.init(document.getElementById('pie_stars'));
		$window.onresize = function() { $scope.pie_stars.resize(); };
		$scope.pie_stars.setOption({
				tooltip: {trigger:"item", formatter:"{b} : {c} ({d}%)"},
				toolbox: {show: true, feature: {restore : {show: true, title: 'Herstel weergave'}, saveAsImage : {show: true, title: 'Bewaar afbeelding'}}},
				legend: {orient: "vertical", x: "left", data: ["5 sterren", "4 sterren", "3 sterren", "2 sterren", "1 sterren"]},
				calculable: true,
				series:[{type: "pie", radius:["50%", "88%"], center: ['63%', '50%'],
						itemStyle: {normal: {label: {show: false}, labelLine: {show: false}},
									emphasis: {label: {show: true, position: "center", textStyle: {fontSize: "15", fontWeight: "bold"}}}},
						data:[{name: '5 sterren', value: 0, itemStyle: {normal: {color: '#2F91D5'}}},
							  {name: '4 sterren', value: 0, itemStyle: {normal: {color: '#0F75BC'}}},
							  {name: '3 sterren', value: 0, itemStyle: {normal: {color: '#3E769D'}}},
							  {name: '2 sterren', value: 0, itemStyle: {normal: {color: '#2D5775'}}},
							  {name: '1 sterren', value: 0, itemStyle: {normal: {color: '#04090C'}}}]
						}]
		});
		
		$scope.area_averages = echarts.init(document.getElementById('area_averages'));
		$window.onresize = function() { $scope.area_averages.resize(); };
		$scope.area_averages.setOption({
				tooltip: {trigger: "axis"},
				legend: {orient: "horizontal", x: "center", y: "30", data: ['Landelijk gemiddelde']},
				calculable: true,
				xAxis: [{type: 'category', boundaryGap: false, data: ['Wait']}],
				yAxis: [{type: 'value', boundaryGap: false}],
				series:[{type: 'line', symbol: 'emptyCircle', smooth: true, name: 'Landelijk gemiddelde', data: [0], itemStyle: {normal: {color: '#D3D3D3', borderColor: '#D3D3D3', lineStyle: {color: '#D3D3D3'}, areaStyle: {color: 'rgba(211, 211, 211, 0.5)'}}}}]
		});
		
		$scope.area_stars = echarts.init(document.getElementById('area_stars'));
		$window.onresize = function() { $scope.area_stars.resize(); };
		$scope.area_stars.setOption({
				tooltip: {trigger: "axis"},
				toolbox: {show: true, feature: {restore : {show: true, title: 'Herstel weergave'}, saveAsImage : {show: true, title: 'Bewaar afbeelding'}}},
				legend: {orient: "horizontal", x: "center", y: "30", data: ['5 sterren', '4 sterren', '3 sterren', '2 sterren', '1 sterren']},
				calculable: true,
				xAxis: [{type: 'category', data: ['Wait']}],
				yAxis: [{type: 'value', boundaryGap: false}],
				series:[{type: 'bar', name: '5 sterren', data: [0], itemStyle: {normal: {color: '#2F91D5', barBorderRadius: 5}}},
						{type: 'bar', name: '4 sterren', data: [0], itemStyle: {normal: {color: '#0F75BC', barBorderRadius: 5}}},
						{type: 'bar', name: '3 sterren', data: [0], itemStyle: {normal: {color: '#3E769D', barBorderRadius: 5}}},
						{type: 'bar', name: '2 sterren', data: [0], itemStyle: {normal: {color: '#2D5775', barBorderRadius: 5}}},
						{type: 'bar', name: '1 sterren', data: [0], itemStyle: {normal: {color: '#04090C', barBorderRadius: 5}}}]
		});
		
		$scope.pie_nps = echarts.init(document.getElementById('pie_nps'));
		$window.onresize = function() { $scope.pie_nps.resize(); };
		$scope.pie_nps.setOption({
				tooltip: {trigger:"item", formatter:"{b} : {c} ({d}%)"},
				toolbox: {show: true, feature: {restore : {show: true, title: 'Herstel weergave'}, saveAsImage : {show: true, title: 'Bewaar afbeelding'}}},
				legend: {orient: "vertical", x: "left", data: ["Promotors", "Passives", "Detractors"]},
				calculable: true,
				series:[{type: "pie", radius:["50%", "88%"], center: ['63%', '50%'],
						itemStyle: {normal: {label: {show: false}, labelLine: {show: false}},
									emphasis: {label: {show: true, position: "center", textStyle: {fontSize: "13", fontWeight: "normal"}}}},
						data:[{name: 'Promotors', value: 0, itemStyle: {normal: {color: '#98EA3D'}}},
							  {name: 'Passives', value: 0, itemStyle: {normal: {color: '#FFE165'}}},
							  {name: 'Detractors', value: 0, itemStyle: {normal: {color: '#EE4C61'}}}]
						}]
		});
		
		$scope.area_nps_average = echarts.init(document.getElementById('area_nps_average'));
		$window.onresize = function() { $scope.area_nps_average.resize(); };
		$scope.area_nps_average.setOption({
				tooltip: {trigger: "axis"},
				legend: {orient: "horizontal", x: "center", y: "30", data: ['Landelijk gemiddelde']},
				calculable: true,
				xAxis: [{type: 'category', boundaryGap: false, data: ['Wait']}],
				yAxis: [{type: 'value', boundaryGap: false}],
				series:[{type: 'line', symbol: 'emptyCircle', smooth: true, name: 'Landelijk gemiddelde', data: [0], itemStyle: {normal: {color: '#D3D3D3', borderColor: '#D3D3D3', lineStyle: {color: '#D3D3D3'}, areaStyle: {color: 'rgba(211, 211, 211, 0.5)'}}}}]
		});
		
		$scope.area_nps = echarts.init(document.getElementById('area_nps'));
		$window.onresize = function() { $scope.area_nps.resize(); };
		$scope.area_nps.setOption({
				tooltip: {trigger: "axis"},
				toolbox: {show: true, feature: {restore : {show: true, title: 'Herstel weergave'}, saveAsImage : {show: true, title: 'Bewaar afbeelding'}}},
				legend: {orient: "horizontal", x: "center", y: "30", data: ['Promotors', 'Passives', 'Detractors']},
				calculable: true,
				xAxis: [{type: 'category', data: ['Wait']}],
				yAxis: [{type: 'value', boundaryGap: false}],
				series:[{type: 'bar', name: 'Promotors', data: [0], itemStyle: {normal: {color: '#98EA3D', barBorderRadius: 5}}},
						{type: 'bar', name: 'Passives', data: [0], itemStyle: {normal: {color: '#FFE165', barBorderRadius: 5}}},
						{type: 'bar', name: 'Detractors', data: [0], itemStyle: {normal: {color: '#EE4C61', barBorderRadius: 5}}}]
		});
		
		$scope.pie_reply = echarts.init(document.getElementById('pie_reply'));
		$window.onresize = function() { $scope.pie_reply.resize(); };
		$scope.pie_reply.setOption({
				tooltip: {trigger:"item", formatter:"{b} : {c} ({d}%)"},
				toolbox: {show: true, feature: {restore : {show: true, title: 'Herstel weergave'}, saveAsImage : {show: true, title: 'Bewaar afbeelding'}}},
				legend: {orient: "vertical", x: "left", data: ["Beoordeeld", "Doorgeklikt", "Niet gereageerd"]},
				calculable: true,
				series:[{type: "pie", radius:["50%", "88%"], center: ['63%', '50%'],
						itemStyle: {normal: {label: {show: false}, labelLine: {show: false}},
									emphasis: {label: {show: true, position: "center", textStyle: {fontSize: "13", fontWeight: "normal"}}}},
						data:[{name: 'Beoordeeld', value: 0, itemStyle: {normal: {color: '#2E91D5'}}}, {name: 'Doorgeklikt', value: 0, itemStyle: {normal: {color: '#0F75BD'}}}, {name: 'Niet gereageerd', value: 0, itemStyle: {normal: {color: '#2F5874'}}}] }]
		});
		
		$scope.empty_filter = false;
		$scope.area_averages_empty = false;
		$scope.area_stars_empty = false;
		$scope.area_nps_average_empty = false;
		$scope.area_nps_empty = false;
		$scope.get = function() {
			$http.post("/pub/stat_achart2/", {'filter': $scope.stat_filter_list}).success(function(data, status, headers, config) {
				$scope.data_load = true;
				$scope.data = logger.check(data);

				var is_filter = false;
				for (var k in $scope.stat_filter_list)
				{
					if ($scope.stat_filter_list[k].value != '')
					{
						is_filter = true;
					}
				}

				if ($scope.data && $scope.data.for_user > 0)
				{
					$scope.empty_filter = false;
					if ($scope.data && $scope.data.hours != '')
					{
						$scope.data.hours_from = ($scope.data.hours < 10 ? '0' : '') + $scope.data.hours + ":00";
						$scope.data.hours_to = ($scope.data.hours + 1) > 23 ? '0' : ($scope.data.hours + 1);
						$scope.data.hours_to = ($scope.data.hours_to < 10 ? '0' : '') + $scope.data.hours_to + ":00";
					}
					
					if ($scope.data && $scope.data.days != '')
					{
						$scope.days = {'1': 'maandag',
									   '2': 'dinsdag',
									   '3': 'woensdag',
									   '4': 'donderdag',
									   '5': 'vrijdag',
									   '6': 'zaterdag',
									   '7': 'zondag'};
						$scope.data.days_text = $scope.days[$scope.data.days];
					}
					
					if ($scope.data && $scope.data.stars_count)
					{
						for (var i = 5; i > 0; i--)
						{
							$scope.pie_stars.addData([[0, {name: i + ' sterren', value: ($scope.data.stars_count[i] ? $scope.data.stars_count[i] : 0) * 1}, false, false]]);
						}
					}

					if ($scope.data && $scope.data.average_all_month)
					{
						var series = [];
						var max = 5;
						var data = [];
						var empty_check = true;
						for (var m in $scope.data.average_all_month)
						{
							var value = $scope.data.average_all_month[m];
							data.push(value);
							if (value > 0)
							{
								empty_check = false;
							}
						}
						series.push({type: 'line', name: 'Landelijk gemiddelde', data: data});

						$scope.area_averages.setOption({xAxis: [{data: $scope.data.average_month_x}],
														yAxis: [{min: 0, max: max}],
														series: series});
						$scope.area_averages_empty = empty_check;
					}
					
					if ($scope.data && $scope.data.average_month)
					{
						var series = [];
						var max = 0;
						var max_num = {};
						var empty_check = true;
						for (var i = 5; i > 0; i--)
						{
							var data = [];
							for (var m in $scope.data.average_month[i])
							{
								var value = $scope.data.average_month[i][m];
								data.push(value);
								if (value > 0)
								{
									empty_check = false;
								}
							
								if ( ! max_num[m])
								{
									max_num[m] = 0;
								}
								max_num[m] += $scope.data.average_month[i][m] * 1;
							}
							series.push({type: 'bar', stack: m, name: (i + ' sterren'), data: data});
						}
						
						for (var m in max_num)
						{
							max = Math.max(max, max_num[m]);
						}

						$scope.area_stars.setOption({xAxis: [{data: $scope.data.average_month_x}],
													 yAxis: [{min: 0, max: max}],
													 series: series});
						$scope.area_stars_empty = empty_check;
					}
					
					if ($scope.data && $scope.data.average_nps.all)
					{
						$scope.nps['12'] = Math.round($scope.data.average_nps['12p'] / 10);
						$scope.nps['45'] = Math.round($scope.data.average_nps['45p'] / 10);
						$scope.nps['3'] = 10 - ($scope.nps['12'] + $scope.nps['45']);
						
						$scope.pie_nps.addData([[0, {name: 'Promotors', value: $scope.data.average_nps['45']}, false, false]]);
						$scope.pie_nps.addData([[0, {name: 'Passives', value: $scope.data.average_nps['3']}, false, false]]);
						$scope.pie_nps.addData([[0, {name: 'Detractors', value: $scope.data.average_nps['12']}, false, false]]);
					}
					
					if ($scope.data && $scope.data.nps_all_month)
					{
						var series = [];
						var data = [];
						var max = 0;
						var min = false;
						var empty_check = true;

						for (var m in $scope.data.nps_all_month)
						{
							var value = $scope.data.nps_all_month[m];
							data.push(value);
							if (value > 0)
							{
								empty_check = false;
							}
							
							max = Math.max(max, $scope.data.nps_all_month[m] * 1);
							if (min === false)
							{
								min = $scope.data.nps_all_month[m] * 1
							}
							else
							{
								min = Math.max(min, $scope.data.nps_all_month[m] * 1);
							}
						}
						series.push({type: 'line', name: 'Landelijk gemiddelde', data: data});

						$scope.area_nps_average.setOption({xAxis: [{data: $scope.data.average_month_x}],
														   yAxis: [{min: (min > 0 ? 0 : Math.round(min * 1.2)), max: Math.round(max * 1.2)}],
														   series: series});
						$scope.area_nps_average_empty = empty_check;
					}
					
					if ($scope.data && $scope.data.history_nps)
					{
						var series = [];
						var data = [];
						var max = 0;
						var max_num = {};
						var empty_check = true;
						for (var m in $scope.data.history_nps['45'])
						{
							var value = $scope.data.history_nps['45'][m];
							data.push(value);
							if (value > 0)
							{
								empty_check = false;
							}
							
							if ( ! max_num[m])
							{
								max_num[m] = 0;
							}
							max_num[m] += $scope.data.history_nps['45'][m] * 1;
						}
						series.push({type: 'bar', stack: m, name: 'Promotors', data: data});
						
						data = [];
						for (var m in $scope.data.history_nps['3'])
						{
							var value = $scope.data.history_nps['3'][m];
							data.push(value);
							if (value > 0)
							{
								empty_check = false;
							}
							
							if ( ! max_num[m])
							{
								max_num[m] = 0;
							}
							max_num[m] += $scope.data.history_nps['3'][m] * 1;
						}
						series.push({type: 'bar', stack: m, name: 'Passives', data: data});
						
						data = [];
						for (var m in $scope.data.history_nps['12'])
						{
							var value = $scope.data.history_nps['12'][m];
							data.push(value);
							if (value > 0)
							{
								empty_check = false;
							}
							
							if ( ! max_num[m])
							{
								max_num[m] = 0;
							}
							max_num[m] += $scope.data.history_nps['12'][m] * 1;
						}
						series.push({type: 'bar', stack: m, name: 'Detractors', data: data});
						
						for (var m in max_num)
						{
							max = Math.max(max, max_num[m]);
						}

						$scope.area_nps.setOption({xAxis: [{data: $scope.data.average_month_x}],
												   yAxis: [{min: 0, max: max}],
												   series: series});
						$scope.area_nps_empty = empty_check;
					}
					
					if ($scope.data && $scope.data.reply_chart)
					{
						$scope.pie_reply.addData([[0, {name: 'Beoordeeld', value: $scope.data.reply_chart['reply']}, false, false]]);
						$scope.pie_reply.addData([[0, {name: 'Doorgeklikt', value: $scope.data.reply_chart['click']}, false, false]]);
						$scope.pie_reply.addData([[0, {name: 'Niet gereageerd', value: $scope.data.reply_chart['none']}, false, false]]);
					}
				}
				else
				{
					$scope.empty_filter = true;
				}
			});
		};

		$scope.get();
		
		$scope.range = function(num)
		{
			var array = [];
			for (var i = 0; i < num; i++)
			{
				array.push(i);
			}
			return array;
		};
    }

})();
;
(function () {
    'use strict';

    angular.module('app')
        .controller('AOnlinesCtrl', [ '$scope', '$rootScope', '$window', '$http', '$timeout', 'logger', AOnlinesCtrl]); // overall control

    function AOnlinesCtrl($scope, $rootScope, $window, $http, $timeout, logger) {
		$scope.data_load = false;
		$scope.onlines = ['Zorgkaart', 'Facebook', 'Independer', 'Google'];
		$scope.hex_to_rgba = function(hex, opacity)
		{
			hex = hex.replace('#', '');
			var r = parseInt(hex.substring(0, 2), 16);
			var g = parseInt(hex.substring(2, 4), 16);
			var b = parseInt(hex.substring(4, 6), 16);

			var result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
			return result;
		};
		$scope.color = '#0F75BC';
		$scope.color_a = $scope.hex_to_rgba($scope.color, 50);

		$scope.pie_online = echarts.init(document.getElementById('pie_online'));
		$window.onresize = function() { $scope.pie_online.resize(); };
		$scope.pie_online.setOption({
				tooltip: {trigger:"item", formatter:"{b} : {c} ({d}%)"},
				legend: {orient: "vertical", x: "left", data: ["Zorgkaart", "Facebook", "Independer", "Google"]},
				calculable: true,
				series:[{type: "pie", radius:["50%", "88%"], center: ['63%', '50%'],
						itemStyle: {normal: {label: {show: false}, labelLine: {show: false}},
									emphasis: {label: {show: true, position: "center", textStyle: {fontSize: "14", fontWeight: "bold"}}}},
						data:[{name: 'Zorgkaart', value: 0, itemStyle: {normal: {color: '#F29619'}}},
							  {name: 'Facebook', value: 0, itemStyle: {normal: {color: '#3B589E'}}},
							  {name: 'Independer', value: 0, itemStyle: {normal: {color: '#825F87'}}},
							  {name: 'Google', value: 0, itemStyle: {normal: {color: '#C1C1C1'}}}]
						}]
		});
		
		$scope.area_online = echarts.init(document.getElementById('area_online'));
		$window.onresize = function() { $scope.area_online.resize(); };
		$scope.area_online.setOption({
				tooltip: {trigger: "axis"},
				legend: {orient: "horizontal", x: "center", y: "30", data: ['Zorgkaart', 'Facebook', 'Independer', 'Google']},
				calculable: true,
				xAxis: [{type: 'category', boundaryGap: false, data: ['Wait']}],
				yAxis: [{type: 'value', boundaryGap: false}],
				series:[{type: 'line', symbol: 'emptyCircle', smooth: true, name: 'Zorgkaart', data: [0], itemStyle: {normal: {color: '#F29619', borderColor: '#F29619', lineStyle: {color: '#F29619'}, areaStyle: {color: 'rgba(242, 150, 25, 0.5)'}}}},
						{type: 'line', symbol: 'emptyCircle', smooth: true, name: 'Facebook', data: [0], itemStyle: {normal: {color: '#3B589E', borderColor: '#3B589E', lineStyle: {color: '#3B589E'}, areaStyle: {color: 'rgba(59, 88, 158, 0.5)'}}}},
						{type: 'line', symbol: 'emptyCircle', smooth: true, name: 'Independer', data: [0], itemStyle: {normal: {color: '#825F87', borderColor: '#825F87', lineStyle: {color: '#825F87'}, areaStyle: {color: 'rgba(130, 95, 135, 0.5)'}}}},
						{type: 'line', symbol: 'emptyCircle', smooth: true, name: 'Google', data: [0], itemStyle: {normal: {color: '#C1C1C1', borderColor: '#C1C1C1', lineStyle: {color: '#C1C1C1'}, areaStyle: {color: 'rgba(193, 193, 193, 0.5)'}}}}]
		});
		
		$scope.onl = {};
		$scope.area_online_empty = false;
		$scope.get = function()
		{
			$http.post('/pub/astat_online/', {}).success(function(data, status, headers, config) {
				$scope.data_load = true;
				$scope.onl = logger.check(data);
				if ($scope.onl && $scope.onl.pie)
				{
					for (var k in $scope.onlines)
					{
						$scope.pie_online.addData([[0, {name: $scope.onlines[k], value: ($scope.onl.pie[$scope.onlines[k].toLowerCase()] ? $scope.onl.pie[$scope.onlines[k].toLowerCase()] : 0) * 1}, false, false]]);
					}
				}
					
				if ($scope.onl && $scope.onl.history)
				{
					var series = [];
					var max = 5;
					var data = [];
					var empty_check = true;
					for (var k in $scope.onlines)
					{
						data = [];
						for (var m in $scope.onl.history)
						{
							var value = $scope.onl.history[m][$scope.onlines[k].toLowerCase()];
							data.push(value);
							if (value > 0)
							{
								empty_check = false;
							}
						}
						series.push({type: 'line', name: $scope.onlines[k], data: data});
					}

					$scope.area_online.setOption({xAxis: [{data: $scope.onl.months}],
												  yAxis: [{min: 0, max: max}],
												  series: series});
					$scope.area_online.resize();
					$scope.area_online_empty = empty_check;
				}
			});
		};

		$scope.get();
		
		$scope.range = function(num)
		{
			var array = [];
			for (var i = 0; i < num; i++)
			{
				array.push(i);
			}
			return array;
		};
    }

})();
;
(function () {
    'use strict';

    angular.module('app')
        .controller('StatCtrl', [ '$scope', '$rootScope', '$window', '$http', 'logger', StatCtrl]); // overall control

    function StatCtrl($scope, $rootScope, $window, $http, logger) {
		$scope.stat = {};

		$scope.login_as_user = function(users_id) {
			$http.post("/pub/login_as_user/", {id: users_id}).success(function(data, status, headers, config) {
				if (logger.check(data))
				{
					$window.location.reload();
				}
			});
		};

		$scope.get = function() {
			$http.post("/pub/stat/").success(function(data, status, headers, config) {
				$scope.stat = logger.check(data);
			});
		};

		$scope.get();
    }
})();
;
(function () {
    'use strict';

    angular.module('app')
        .controller('ProfileCtrl', [ '$scope', '$rootScope', '$window', '$http', '$location', '$modal', 'logger', ProfileCtrl]); // overall control

    function ProfileCtrl($scope, $rootScope, $window, $http, $location, $modal, logger) {
		$scope.user = {};
		$scope.old_user = {};
		$scope.email_text_class = "close";
		$scope.tags = ['{{Vraagstelling}}', '{{Formulering van de vraagstelling}}', '{{Aanhef Patiënt}}', '{{Voornaam Patiënt}}', '{{Achternaam Patiënt}}', '{{Aanhef Zorgverlener}}', '{{Voornaam Zorgverlener}}', '{{Achternaam Zorgverlener}}', '{{Profielfoto Zorgverlener}}', '{{Onderwerp van E-mail}}', '{{Naam Praktijk}}'];
		
		$scope.set_var = function(variable) {
			var pos = jQuery('[name=subject]').prop("selectionStart");
			var start = $scope.user.emails.subject.slice(0, pos);
			var finish = $scope.user.emails.subject.slice(pos);
			$scope.user.emails.subject = start + '{{' + variable + '}}' + finish;
		};
		
		$scope.find_tags = function(text, key) {
			if (text)
			{
				for (var k in $scope.tags)
				{
					text = text.replace($scope.tags[k], "<span class='tag-box'>" + $scope.tags[k].replace("{{", "").replace("}}", "") + "<a href='javascript:void(0);' class='tag-remove' rel='" + key + "|" + $scope.tags[k] + "'>×</a></span>");
				}
			}
			
			return text;
		};
		
		$scope.emails_edit = function(type, $event) {
			if ($event.target.className == "tag-remove")
			{
				var rel = $event.target.getAttribute("rel");
				var part = rel.split("|");
				if (part[1].toLowerCase() == '{{formulering van de vraagstelling}}')
				{
					var modalInstance;
					modalInstance = $modal.open({
						templateUrl: "emails_remove_questions.html",
						controller: 'ModalEmailsRemoveQuestionsCtrl',
						resolve: {
							items: function() {
								return [];
							}
						}
					});
					
					modalInstance.result.then((function(result) {
						$scope.user.emails[part[0]] = $scope.user.emails[part[0]].replace(part[1], "");
						$scope.user.rating_questions = '0';
					}), function() {
						console.log("Modal dismissed at: " + new Date());
					});
				}
				else
				{
					$scope.user.emails[part[0]] = $scope.user.emails[part[0]].replace(part[1], "");
				}
			}
			else
			{
				var modalInstance;
				modalInstance = $modal.open({
					templateUrl: "emails_edit.html",
					controller: 'ModalInstanceEmailsEditCtrl',
					size: 'lg',
					resolve: {
						items: function() {
							return {value: $scope.user.emails[type], type: type, user: $scope.user};
						}
					}
				});
				
				modalInstance.result.then((function(items) {
					if (items.type == 'text1_mq' && ! (items.value.toLowerCase().indexOf('{{formulering van de vraagstelling}}') + 1))
					{
						var modalInstance;
						modalInstance = $modal.open({
							templateUrl: "emails_remove_questions.html",
							controller: 'ModalEmailsRemoveQuestionsCtrl',
							resolve: {
								items: function() {
									return [];
								}
							}
						});
						
						modalInstance.result.then((function(result) {
							$scope.user.emails[items.type] = items.value;
							$scope.user.rating_questions = '0';
						}), function() {
							console.log("Modal dismissed at: " + new Date());
						});
					}
					else
					{
						$scope.user.emails[items.type] = items.value;
					}
				}), function() {
					console.log("Modal dismissed at: " + new Date());
				});
			}
		};
		
		$scope.check_reply = function() {
			if ($scope.user.email_negative_check == 0 && $scope.user.email_feedback_check == 0)
			{
				$scope.user.email_reply_check = 0;
			}
		};
		
		$scope.check_reply_check = function() {
			if ($scope.user.email_reply_check == 1 && $scope.user.email_negative_check == 0 && $scope.user.email_feedback_check == 0)
			{
				$scope.user.email_feedback_check = 1;
			}
			
			if ($scope.user.email_reply_check == 0)
			{
				$scope.user.email_negative_check = 0;
				$scope.user.email_feedback_check = 0;
			}
		};
		
		$scope.passwords = {};
		$scope.password_form = '0';
		$scope.show_password_form = function() {
			$scope.password_form = '1';
		};
		
		$scope.save_password = function() {
			if ($scope.passwords.old)
			{
				if ($scope.passwords.new && $scope.passwords.new.length >= 6)
				{
					if ($scope.passwords.new == $scope.passwords.confirm)
					{
						$http.post("/pub/save_new_pass/", $scope.passwords).success(function(data, status, headers, config) {
							var result = logger.check(data);
							if (result)
							{
								$scope.password_form = '0';
								$scope.passwords.old = '';
								$scope.passwords.new = '';
								$scope.passwords.confirm = '';
							}
						});
					}
					else
					{
						logger.logError("De wachtwoorden komen niet overeen.");
					}
				}
				else
				{
					logger.logError("Uw wachtwoord moet minimaal 6 tekens bevatten.");
				}
			}
			else
			{
				logger.logError("Empty old password");
			}
		};
		
		$scope.widget_edit = function(type, $event) {
			var modalInstance;
			modalInstance = $modal.open({
				templateUrl: "widget_edit.html",
				controller: 'ModalInstanceWidgetEditCtrl',
				resolve: {
					items: function() {
						return {value: $scope.user.widget[type], type: type, color: (type == 'widgets_textb' ? $scope.user.widget.widgets_button : false)};
					}
				}
			});
			
			modalInstance.result.then((function(items) {
				$scope.user.widget[items.type] = items.value;
				if (items.type == 'widgets_textb')
				{
					$scope.user.widget.widgets_button = items.color;
				}
			}), function() {
				console.log("Modal dismissed at: " + new Date());
			});
		};
		
		$scope.widget_save = function() {
			$http.post("/pub/widget_save/", {widget: $scope.user.widget}).success(function(data, status, headers, config) {
				var result = logger.check(data);
				
				var modalInstance;
				modalInstance = $modal.open({
					templateUrl: "widget_save.html",
					controller: 'ModalInstanceWidgetSaveCtrl',
					resolve: {
						items: function() {
							return {code: result, widget: $scope.user.widget};
						}
					}
				});
				
				modalInstance.result.then((function(items) {
					
				}), function() {
					console.log("Modal dismissed at: " + new Date());
				});
			});
		};
		
		$scope.stars_edit = function($event) {
			var modalInstance;
			modalInstance = $modal.open({
				templateUrl: "stars_edit.html",
				controller: 'ModalInstanceStarsEditCtrl',
				resolve: {
					items: function() {
						return [$scope.user.stars_type, $scope.user.stars_text];
					}
				}
			});
			
			modalInstance.result.then((function(items) {
				$scope.user.stars_type = items[0];
				$scope.user.stars_text = items[1];
			}), function() {
				console.log("Modal dismissed at: " + new Date());
			});
		};
		
		$scope.test_email_modal = function() {
			var existing_tags = {};
			var tags = {title: '{{Aanhef Patiënt}}',
						name: '{{Voornaam Patiënt}}',
						sname: '{{Achternaam Patiënt}}',
						doctors_title: '{{Aanhef Zorgverlener}}',
						doctors_name: '{{Voornaam Zorgverlener}}',
						doctors_sname: '{{Achternaam Zorgverlener}}',
						doctors_avatar: '{{Profielfoto Zorgverlener}}'};
						
			var fields = ['subject', 'header', 'text1', 'promo', 'text2', 'footer'];
			if ($scope.user.rating_questions == '1')
			{
				fields = ['subject', 'header_mq', 'text1_mq', 'promo', 'text2_mq', 'footer'];
			}

			for (var i in fields)
			{
				for (var key in tags)
				{
					if ($scope.user.emails[fields[i]] && $scope.user.emails[fields[i]].indexOf(tags[key]) + 1)
					{
						existing_tags[key] = true;
					}
				}
			}

			var modalInstance;
			modalInstance = $modal.open({
				templateUrl: "test_emails.html",
				controller: 'ModalInstanceTestEmailCtrl',
				resolve: {
					items: function() {
						return [existing_tags, $scope.user];
					}
				}
			});
			
			modalInstance.result.then((function(items) {
				$http.post("/pub/send_test_email/", {emails: $scope.user.emails, values: items, user: $scope.user}).success(function(data, status, headers, config) {
					logger.check(data);
				});
			}), function() {
				console.log("Modal dismissed at: " + new Date());
			});
		};
		
		$scope.upgrade_to_pro = function()
		{
			if ($scope.user.account_type == 0 && $scope.user.organization == 0 && $scope.user.account != 2)
			{
				var modalInstance;
				modalInstance = $modal.open({
					templateUrl: "questions_basic.html",
					controller: 'ModalQuestionsBasicCtrl',
					resolve: {
						items: function() {
							return [];
						}
					}
				});
				
				modalInstance.result.then((function(items) {
					$location.url("pages/activate/1");
				}), function() {
					console.log("Modal dismissed at: " + new Date());
				});
			}
		};
		
		$scope.upgrade_to_ultimate = function()
		{
			if ($scope.user.account_type == 1 && $scope.user.organization == 0 && $scope.user.account != 2)
			{
				var modalInstance;
				modalInstance = $modal.open({
					templateUrl: "questions_ultimate.html",
					controller: 'ModalQuestionsBasicCtrl',
					resolve: {
						items: function() {
							return [];
						}
					}
				});
				
				modalInstance.result.then((function(items) {
					$location.url("pages/activate/1");
				}), function() {
					console.log("Modal dismissed at: " + new Date());
				});
			}
		};
		
		$scope.check_questions_for_user = function()
		{
			if ($scope.user.rating_questions)
			{
				if ($scope.user.account_type == 1 || $scope.user.organization == 1)
				{
					var modalInstance;
					modalInstance = $modal.open({
						templateUrl: "questions_confirm.html",
						controller: 'ModalQuestionsConfirmCtrl',
						resolve: {
							items: function() {
								return [];
							}
						}
					});
					
					modalInstance.result.then((function(result) {
						if (result)
						{
							$scope.email_text_class = 'open';
							var ids = [];
							for (var i = $scope.user.questions.length; i < 2; i++)
							{
								ids.push($scope.questions_list[i].id);
							}
							$scope.first_questions_save(ids);
						}
						else
						{
							$scope.user.rating_questions = 0;
						}
					}), function() {
						console.log("Modal dismissed at: " + new Date());
					});
				}
			}
			else
			{
				$scope.user.emails.subject = $scope.user.emails.subject.replace(/{{Vraagstelling}}/ig, '');
			}
		};
		
		$scope.check_phone = 'none';
		$scope.phone_check = function(phone) {
			var reg = /(^\+[0-9]{2}|^\+[0-9]{2}\(0\)|^\(\+[0-9]{2}\)\(0\)|^00[0-9]{2}|^0)([0-9]{9}$|[0-9\-\s]{10}$)/;
			if (phone.match(reg))
			{
				$scope.check_phone = 'valid';
				return true;
			}
			else
			{
				$scope.check_phone = 'none';
				return false;
			}
		};
		
		$scope.rating = 0;
		$scope.questions_list = {};
		$scope.add_new_question = 0;
		$scope.new_question = {};
		$http.get("/pub/user/profile/").success(function(data, status, headers, config) {
			var result;
			if (result = logger.check(data))
			{
				for (var key in result)
				{
					if (key == 'questions_list')
					{
						$scope.questions_list = result.questions_list;
					}
					else
					{
						$scope.user[key] = result[key];
					}
				}
				
				if ( ! $scope.user.questions.length)
				{
					$scope.add_new_question = 1;
				}
				else
				{
					$scope.edit_init();
				}

				$scope.rating = $scope.user.rating;
				$scope.user.short = $scope.user.short == '' ? $scope.user.username.replace(/ /ig, '-').toLowerCase() : $scope.user.short;
				angular.copy($scope.user, $scope.old_user);
			}
		});
		
		$scope.edit_question = {};
		$scope.edit_questions = {};
		$scope.edit_questions_list = {}
		$scope.edit_init = function()
		{
			for (var k in $scope.user.questions)
			{
				var item = $scope.user.questions[k];
				$scope.edit_question[item.id] = 0;
				
				$scope.edit_questions[item.id] = {};
				$scope.edit_questions[item.id].name = item.question_name;
				$scope.edit_questions[item.id].desc = item.question_description;
				
				$scope.edit_questions_list[item.id] = angular.copy($scope.questions_list);
				$scope.edit_questions_list[item.id].push(item);
			}
		};
		
		$scope.add_new_question_show = function()
		{
			$scope.add_new_question = 1;
		};
		
		$scope.add_new_question_hide = function()
		{
			$scope.add_new_question = 0;
		};
		
		$scope.add_new_question_save = function()
		{
			if ($scope.new_question && $scope.new_question.name != '' && $scope.new_question.desc != '')
			{
				$http.post("/pub/questions_save/", $scope.new_question).success(function(data, status, headers, config) {
					var result = logger.check(data);
					$scope.user.questions = result.questions;
					$scope.questions_list = result.questions_list;
					$scope.add_new_question_hide();
					
					$scope.new_question = {};
					$scope.question_desc = '';
					
					$scope.edit_init();
				});
			}
		};
		
		$scope.first_questions_save = function(ids)
		{
			if (ids && ids.length)
			{
				$http.post("/pub/questions_ids_save/", {questions_ids: ids}).success(function(data, status, headers, config) {
					var result = logger.check(data);
					$scope.user.questions = result.questions;
					$scope.questions_list = result.questions_list;
					$scope.add_new_question_hide();
					
					$scope.new_question = {};
					$scope.question_desc = '';
					
					$scope.edit_init();
				});
			}
		};
		
		$scope.remove_questions = function(questions_id)
		{
			if ($scope.user.questions.length == 2)
			{
				logger.logError("U dient minimaal twee vraagstellingen te gebruiken.");
			}
			else
			{
				$http.post("/pub/questions_remove/", {questions_id: questions_id}).success(function(data, status, headers, config) {
					var result = logger.check(data);
					$scope.user.questions = result.questions;
					$scope.questions_list = result.questions_list;
					
					if ( ! $scope.user.questions.length)
					{
						$scope.add_new_question_show();
					}
					else
					{
						$scope.add_new_question_hide();
					}
					
					$scope.edit_init();
				});
			}
		};
		
		$scope.autos = {};
		$scope.index = {};
		$scope.auto_question = function(questions_id)
		{
			questions_id = questions_id || 0;
			$scope.autos = {};
			$scope.index = {};
			$scope.index[questions_id] = 'z-top';
			
			var field = false;
			if (questions_id)
			{
				field = $scope.edit_questions[questions_id];
			}
			else
			{
				field = $scope.new_question;
			}
			
			var text = field.name || '';
			var list = [];
			if (text != '')
			{
				for (var k in $scope.questions_list)
				{
					if ($scope.questions_list[k].question_name.toLowerCase().indexOf(text.toLowerCase()) == 0 && $scope.questions_list[k].question_name.toLowerCase() != text.toLowerCase())
					{
						list.push($scope.questions_list[k]);
					}
				}
			}
			else
			{
				list = $scope.questions_list;
			}
			list = list.slice(0, (text != '' ? 30 : 7));
			list.sort(function(a, b) { return (a.count - b.count); });

			$scope.autos[questions_id] = list;
		};
		
		$scope.auto_over = function(questions_id, auto_id)
		{
			questions_id = questions_id || false;
			for (var k in $scope.questions_list)
			{
				if ($scope.questions_list[k].id == auto_id)
				{
					if (questions_id)
					{
						$scope.edit_questions[questions_id].desc = $scope.questions_list[k].question_description;
					}
					else
					{
						$scope.new_question.desc = $scope.questions_list[k].question_description;
					}
				}
			}
		};
		
		$scope.auto_out = function(questions_id)
		{
			questions_id = questions_id || false;
			if (questions_id)
			{
				$scope.edit_questions[questions_id].desc = $scope.last_edit_desc;
			}
			else
			{
				$scope.new_question.desc = '';
			}
		};
		
		$scope.auto_click = function(questions_id, auto_id)
		{
			questions_id = questions_id || false;
			for (var k in $scope.questions_list)
			{
				if ($scope.questions_list[k].id == auto_id)
				{
					if (questions_id)
					{
						$scope.edit_questions[questions_id].id = $scope.questions_list[k].id;
						$scope.edit_questions[questions_id].name = $scope.questions_list[k].question_name;
						$scope.edit_questions[questions_id].desc = $scope.questions_list[k].question_description;
					}
					else
					{
						$scope.new_question.id = $scope.questions_list[k].id;
						$scope.new_question.name = $scope.questions_list[k].question_name;
						$scope.new_question.desc = $scope.questions_list[k].question_description;
					}
				}
			}
			
			$scope.autos = {};
		};
		
		$scope.auto_keyup = function($event, questions_id)
		{
			if ($event.keyCode == 13)
			{
				questions_id = questions_id || 0;
				$window.document.getElementById('desc_' + questions_id).focus();

				$scope.autos = {};
			}
		};
		
		$scope.last_edit_desc = '';
		$scope.edit_questions = function(questions_id)
		{
			$scope.last_edit_desc = $scope.edit_questions[questions_id].desc;
			$scope.edit_question[questions_id] = 1;
		};

		$scope.save_questions = function(questions_id)
		{
			$http.post("/pub/questions_edit/", {questions_id: questions_id, question: $scope.edit_questions[questions_id]}).success(function(data, status, headers, config) {
				var result = logger.check(data);
				$scope.user.questions = result.questions;
				$scope.questions_list = result.questions_list;
				
				$scope.add_new_question_hide();
				
				$scope.edit_init();
			});
		};
		
		$scope.question_desc = '';
		$scope.change_new_question = function()
		{
			$scope.question_desc = '';
			for (var k in $scope.questions_list)
			{
				if ($scope.new_question && $scope.questions_list[k].id == $scope.new_question.id)
				{
					$scope.question_desc = $scope.questions_list[k].question_description;
				}
			}
		};

		$scope.onLogo = function(response)
		{
			var data = response.data;
			$scope.user.logo = logger.check(data);
			if ($scope.user.logo)
			{
				$scope.user.new_logo = $scope.user.logo;
				$scope.user.logo = './logos/tmp/' + $scope.user.logo;
			}
		};

		$scope.remove_logo = function()
		{
			$scope.user.remove_logo = 1;
			$scope.user.logo = '';
		};
		
		$scope.check_mobile = function(mobile)
		{
			var new_mobile = '';
			for (var k in mobile)
			{
				if ((mobile[k] >= 0 && mobile[k] <= 9) || mobile[k] == ' ')
				{
					new_mobile += mobile[k];
				}
			}
			$scope.user.mobile = new_mobile;
		};

		$scope.save = function(callback)
		{
			callback = callback || false;
			var date = new Date($scope.user.reminder_time);
			var new_date = new Date(1970, 1, 1, date.getHours(), date.getMinutes(), 0, 0);
			$scope.user.reminder_time = new_date.getTime();
			if ( ! $scope.form.$error.required && ! $scope.form.$error.email)
			{
				var mobile_check = true;
				if ($scope.user.mobile != '')
				{
					var numeric = true;
					for (var k in $scope.user.mobile)
					{
						if ($scope.user.mobile[k] != ' ' && typeof($scope.user.mobile[k]) != 'function')
						{
							if ( ! ( ! isNaN(parseFloat($scope.user.mobile[k])) && isFinite($scope.user.mobile[k])))
							{
								numeric = false;
							}
						}
					}
					
					if ( ! numeric)
					{
						logger.logError("Het telefoonnummer kan enkel nummers bevatten");
						mobile_check = false;
					}
					
					if (($scope.user.mobile.indexOf('06') + 1) != 1)
					{
						logger.logError("Het telefoonnummer dient met 06 te beginnen");
						mobile_check = false;
					}
					
					var length_mobile = $scope.user.mobile.replace(/ /gi, '');
					if (length_mobile.length != 10)
					{
						logger.logError("Het telefoonnummer dient 10 cijfers te bevatten");
						mobile_check = false;
					}
				}
				
				if (mobile_check)
				{
					if ($scope.user.phone != '' && $scope.phone_check($scope.user.phone) || $scope.user.phone == '')
					{
						if ($scope.user.color.toLowerCase() == "#fff" || $scope.user.color.toLowerCase() == "#ffffff")
						{
							logger.logError("Om de leesbaarheid van de gebruikersinterface te waarborgen kunt u niet de kleur wit gebruiken voor uw huisstijl. Kies alstublieft een andere kleur.");
						}
						else
						{
							var check = true;
							if ($scope.short_checked && ! $scope.validate_url())
							{
								check = false;
								logger.logError("Voer alstublieft een geldige URL in.");
							}
							
							if (check)
							{
								$http.post("/pub/profile_save/", $scope.user).success(function(data, status, headers, config) {
									var result = logger.check(data);
									angular.copy($scope.user, $scope.old_user);
									
									var logo_box = document.getElementsByClassName("logo")[0];
									var logo = logo_box.getElementsByTagName("img")[0];
									logo.src = $scope.user.logo == '' ? './application/views/images/logo_full.png' : $scope.user.logo;
									
									if ($scope.user.color != "")
									{
										var css = "/colors/" + $scope.user.id + "/color.css";
										var links = document.getElementsByTagName("link");
										var to_remove = false;
										for (var i = 0, count = links.length; i < count; i++)
										{
											if (links[i].href.indexOf(css) + 1)
											{
												to_remove = links[i];
											}
										}
										
										if (to_remove)
										{
											to_remove.parentNode.removeChild(to_remove)
										}
										
										var date = new Date();
										
										var link = document.createElement("link");
										link.rel = "stylesheet";
										link.href = "." + css + "?v=" + date.getSeconds();
										
										document.getElementsByTagName("head")[0].appendChild(link);
									}
									
									if (callback)
									{
										callback();
									}
								});
							}
						}
					}
					else
					{
						logger.logError("Wrong Phone Format");
					}
				}
			}
		};

		$scope.$on("$locationChangeStart", function(event, next, current) {
			if ( ! angular.equals($scope.user, $scope.old_user))
			{
				event.preventDefault();
				next = next.split("/#/")[1];
				
				var modalInstance;
				modalInstance = $modal.open({
					templateUrl: "profile_save.html",
					controller: 'ModalInstanceProfileSaveCtrl',
					resolve: {
						items: function() {
							return [];
						}
					}
				});
				
				modalInstance.result.then((function(result) {
					if (result == "save_profile")
					{
						$scope.save(function() {
							angular.copy($scope.user, $scope.old_user);
							$location.url(next);
						});
					}
					else
					{
						angular.copy($scope.user, $scope.old_user);
						$location.url(next);
					}
				}), function() {
					console.log("Modal dismissed at: " + new Date());
				});
			}
        });
		
		$scope.short_class = "none";
		$scope.validate_url = function() {
			$scope.short_class = "none";
			if ($scope.user.short.length)
			{
				var re = /^[a-zA-Z0-9_-]+$/;
				if (re.test($scope.user.short))
				{
					$scope.short_class = "valid";
				}
				else
				{
					$scope.short_class = "invalid";
				}
			}
			
			return ($scope.short_class != "invalid");
		};
    }

})();
;
(function () {
    'use strict';

    angular.module('app')
        .controller('AccountCtrl', [ '$scope', '$rootScope', '$window', '$http', '$location', '$modal', 'logger', AccountCtrl]); // overall control

    function AccountCtrl($scope, $rootScope, $window, $http, $location, $modal, logger) {
		logger.logError("Uw abonnement is stopgezet. Ga naar instellingen om uw account te heractiveren.");
    }

})();
;
(function () {
    'use strict';

    angular.module('app')
        .controller('SubscriptionCtrl', [ '$scope', '$rootScope', '$window', '$http', '$location', '$modal', '$timeout', 'logger', SubscriptionCtrl]); // overall control

    function SubscriptionCtrl($scope, $rootScope, $window, $http, $location, $modal, $timeout, logger) {
		$scope.info = {};
		$http.get("/pub/subscription_info/").success(function(data, status, headers, config) {
			var result;
			if (result = logger.check(data))
			{
				for (var key in result)
				{
					$scope.info[key] = result[key];
				}
			}
			$scope.info.account_link = $scope.info.account != 1 ? ("#/pages/activate/" + $scope.info.id) : "#/pages/subscription";
			$scope.info.account_text = $scope.info.account == 0 ? ($scope.info.account_stop == 1 ? "Actief tot einde betaaltermijn" : "Gestopt") : ($scope.info.account == 1 ? ($scope.info.account_stop == 1 ? "Actief tot einde betaaltermijn" : "Actief") : "Proefperiode");
			
			$timeout(function() {
				if ($scope.info.account != $scope.user.account || $scope.info.account_type != $scope.user.account_type)
				{
					$window.location.reload();
				}
			}, 500);
		});
		
		$scope.account_change = function()
		{
			if ($scope.info.account == 1)
			{
				var modalInstance;
				modalInstance = $modal.open({
					templateUrl: "confirm_suspendion.html",
					controller: 'ModalInstanceConfirmSuspendionCtrl',
					resolve: {
						items: function() {
							return {suspension: $scope.user.suspension_date};
						}
					}
				});
				
				modalInstance.result.then((function(result) {
					$scope.user.account_stop = 1;
					$scope.info.account_link = $scope.info.account_stop == 1 ? ("#/pages/activate/" + $scope.info.id) : "javascript:void(0);";
					$scope.info.account_text = $scope.info.account_stop == 1 ? "Gestopt" : ($scope.info.account_stop == 0 ? "Actief" : "Proefperiode");
					$http.post("/pub/account_save/", $scope.info).success(function(data, status, headers, config) {
						var result = logger.check(data);
					});
				}), function() {
					console.log("Modal dismissed at: " + new Date());
				});
			}
		};

		$scope.suspend_account = function() {
			var modalInstance;
			modalInstance = $modal.open({
				templateUrl: "suspend_account.html",
				controller: 'ModalInstanceSuspendAccountCtrl',
				resolve: {
					items: function() {
						return [];
					}
				}
			});
			
			modalInstance.result.then((function(result) {
				$http.get("/pub/suspend_account/").success(function(data, status, headers, config) {
					var result = logger.check(data);
					$window.location.reload();
				});
			}), function() {
				console.log("Modal dismissed at: " + new Date());
			});
		};
    }

})();
;
(function () {
    'use strict';

    angular.module('app')
        .controller('ActivateCtrl', [ '$scope', '$rootScope', '$window', '$http', '$location', '$modal', 'logger', ActivateCtrl]); // overall control

    function ActivateCtrl($scope, $rootScope, $window, $http, $location, $modal, logger) {
		$scope.type = [];
		$scope.type[0] = 0;
		$scope.step = 1;
		$scope.doctors = [];
		$scope.activate = function()
		{
			$http.post("/pub/activate_account/", {type: $scope.type[0]}).success(function(data, status, headers, config) {
				if (logger.check(data))
				{
					$location.url("pages/subscription");
				}
			});
		};
		
		$scope.next_step = function(type)
		{
			$scope.type[0] = type * 1;
			$scope.step = 2;
			$scope.info = {};
			$http.post("/pub/invoice_info/", {id: $scope.user.id, type: $scope.type[0]}).success(function(data, status, headers, config) {
				$scope.info = logger.check(data);
				for (var k in $scope.info.doctors)
				{
					$scope.doctors.push($scope.info.doctors[k]);
				}
				$scope.info.price = ($scope.type[0] == 0 ? $scope.info.base_amount : ($scope.type[0] == 1 ? $scope.info.pro_amount : $scope.info.ultimate_amount));
				$scope.info.amount = $scope.info.amount == 0 ? ($scope.info.price + $scope.info.doctors_amount) : $scope.info.amount;
			});
		};
    }

})();
;
(function () {
    'use strict';

    angular.module('app')
        .controller('OnlineCtrl', [ '$scope', '$rootScope', '$window', '$http', '$location', '$timeout', '$modal', 'logger', OnlineCtrl]); // overall control

    function OnlineCtrl($scope, $rootScope, $window, $http, $location, $timeout, $modal, logger) {
		$scope.online = ['google', 'facebook', 'zorgkaart', 'telefoonboek', 'vergelijkmondzorg', 'independer', 'kliniekoverzicht', 'own', 'youtube'];
		$scope.blocked = {};
		
		$timeout(function() {
			if ($scope.user.account_type < 1 && $scope.user.account != '2')
			{
				$scope.blocked = {'telefoonboek': true, 'vergelijkmondzorg': true, 'kliniekoverzicht': true, 'own': true};
			}
			
			if ($scope.user.organization == '0' && $scope.user.account != '2')
			{
				$scope.blocked.youtube = true;
			}
		}, 1000);
		
		$scope.order = [];
		for (var key in $scope.online)
		{
			$scope.order.push({name: $scope.online[key], pos: $scope.user[$scope.online[key] + "_pos"]});
		}
		$scope.order.sort(function(a, b) { return a.pos > b.pos ? 1 : (a.pos < b.pos ? -1 : 0); });
		for (var key in $scope.order)
		{
			$scope.order[key].pos = key * 1 + 1;
			$scope.user[$scope.order[key].name + "_pos"] = $scope.order[key].pos;
		}
	
		$scope.sort_options = {containment: '#online_container', orderChanged: function(event) { $scope.orderChanged(event); }};
		$scope.orderChanged = function(obj) {
			for (var key in $scope.order)
			{
				$scope.order[key].pos = (key * 1 + 1);
			}
			$scope.save();
		};

		$scope.online_check = function(system) {
			var count = 0;
			for (var key in $scope.online)
			{
				count += $scope.user[$scope.online[key] + '_checked'] * 1;
			}
			
			if (count > 4)
			{
				logger.logError("U kunt niet meer dan vier profielen tonen. Schakel één van de actieve profielen uit voordat u een vervangend profiel activeert.");
				$scope.user[system + '_checked'] = 0;
			}
			else
			{
				if ($scope.user[system + '_checked'])
				{
					if ($scope.user[system] == "")
					{
						$scope.online_modal(system);
					}
					else
					{
						$scope.save();
					}
				}
				else
				{
					$scope.save();
				}
			}
		};
		
		$scope.online_modal = function(system) {
			var modalInstance;
            modalInstance = $modal.open({
                templateUrl: "online.html",
                controller: 'ModalInstanceOnlineCtrl',
                resolve: {
                    items: function() {
						return {data: $scope.user, system: system};
					}
                }
            });
			
            modalInstance.result.then((function(items) {
				$scope.user = items.data;
				if ($scope.user[items.system] == "")
				{
					$scope.user[items.system + '_checked'] = 0;
				}
				
				var count = 0;
				for (var key in $scope.online)
				{
					count += $scope.user[$scope.online[key] + '_checked'] * 1;
				}
				
				if (count < 4)
				{
					$scope.user[items.system + '_checked'] = 1;
				}
				$scope.save();
            }), function() {
                console.log("Modal dismissed at: " + new Date());
            });
		};
		
		$scope.save = function() {
			for (var key in $scope.order)
			{
				$scope.user[$scope.order[key].name + "_pos"] = $scope.order[key].pos;
			}
			
			var count = 0;
			for (var key in $scope.online)
			{
				count += $scope.user[$scope.online[key] + '_checked'] * 1;
			}
			
			$http.post("/pub/save_online/", $scope.user).success(function(data, status, headers, config) {
				logger.check(data);
			});
		};
    }

})();
;
(function () {
    'use strict';

    angular.module('app')
        .controller('DoctorsCtrl', [ '$scope', '$rootScope', '$window', '$http', '$location', '$modal', 'logger', DoctorsCtrl]); // overall control

    function DoctorsCtrl($scope, $rootScope, $window, $http, $location, $modal, logger) {
		$scope.doctor = {};
		$scope.location = {};
		$scope.treatment = {};
		$scope.redirect_url = "";
		$scope.zorgkaart = "none";
		
		if ($location.path() == "/pages/advanced")
		{
			$scope.doctors = [];
			$http.get("/pub/get_doctors/").success(function(data, status, headers, config) {
				var result;
				if (result = logger.check(data))
				{
					for (var key in result)
					{
						$scope.doctors.push(result[key]);
					}
				}
			});
			
			$scope.remove_doctor = function(id) {
				var modalInstance;
				modalInstance = $modal.open({
					templateUrl: "removeDoctor.html",
					controller: 'ModalInstanceRemoveDoctorCtrl',
					resolve: {
						items: function() {
							return [id];
						}
					}
				});
				modalInstance.result.then((function(remove) {
					$http.post("/pub/remove_doctor/", {id: id}).success(function(data, status, headers, config) {
						$scope.doctors = logger.check(data);
					});
				}), function() {
					console.log("Modal dismissed at: " + new Date());
				});
			};
			
			$scope.locations = [];
			$http.get("/pub/get_locations/").success(function(data, status, headers, config) {
				var result;
				if (result = logger.check(data))
				{
					for (var key in result)
					{
						$scope.locations.push(result[key]);
					}
				}
			});
			
			$scope.remove_location = function(id) {
				var modalInstance;
				modalInstance = $modal.open({
					templateUrl: "removeLocation.html",
					controller: 'ModalInstanceRemoveLocationCtrl',
					resolve: {
						items: function() {
							return [id];
						}
					}
				});
				modalInstance.result.then((function(remove) {
					$http.post("/pub/remove_location/", {id: id}).success(function(data, status, headers, config) {
						$scope.locations = logger.check(data);
					});
				}), function() {
					console.log("Modal dismissed at: " + new Date());
				});
			};
			
			$scope.locations_modal = function() {
				var modalInstance;
				modalInstance = $modal.open({
					templateUrl: "access_location.html",
					controller: 'ModalInstanceAccessLocationCtrl',
					resolve: {
						items: function() {
							return [];
						}
					}
				});
				modalInstance.result.then((function(remove) {

				}), function() {
					console.log("Modal dismissed at: " + new Date());
				});
			};
			
			$scope.access_location = function() {
				$http.post("/pub/access_location/", {}).success(function(data, status, headers, config) {
					if (logger.check(data))
					{
						$scope.locations_modal();
					}
				});
			};
			
			$scope.treatments = [];
			$http.get("/pub/get_treatments/").success(function(data, status, headers, config) {
				var result;
				if (result = logger.check(data))
				{
					for (var key in result)
					{
						$scope.treatments.push(result[key]);
					}
				}
			});
			
			$scope.remove_treatment = function(id) {
				var modalInstance;
				modalInstance = $modal.open({
					templateUrl: "removeTreatments.html",
					controller: 'ModalInstanceRemoveTreatmentCtrl',
					resolve: {
						items: function() {
							return [id];
						}
					}
				});
				modalInstance.result.then((function(remove) {
					$http.post("/pub/remove_treatment/", {id: id}).success(function(data, status, headers, config) {
						$scope.treatments = logger.check(data);
					});
				}), function() {
					console.log("Modal dismissed at: " + new Date());
				});
			};
		}
		
		if ($location.path() == "/pages/doctors_add")
		{
			$scope.doctor.avatar = '';
			$scope.doctors_count = 0;
			$scope.amount = {};
			$http.get("/pub/get_amount/").success(function(data, status, headers, config) {
				var result;
				if (result = logger.check(data))
				{
					for (var key in result)
					{
						$scope.amount[key] = result[key];
					}
					$scope.doctors_count = result.doctors.length;
				}
			});
			
			$scope.step = 0;
			$scope.redirect_url = "pages/subscription";
			$scope.next_step = function(index)
			{
				if (index == 1)
				{
					var error = 1;
					if ( ! $scope.doctor.firstname)
					{
						logger.logError("Vergeet niet de voornaam in te vullen!");
						error = 0;
					}
					
					if ( ! $scope.doctor.lastname)
					{
						logger.logError("Vergeet niet de achternaam in te vullen!");
						error = 0;
					}

					if (error)
					{
						$scope.step = 1;
					}
				}
				
				if (index == 2)
				{
					var error = 1;
					/*$scope.check_link();
					if ($scope.zorgkaart != "valid")
					{
						logger.logError("Vergeet niet het Zorgkaart profiel in te vullen!");
						error = 0;
					}*/
					
					if (error)
					{
						$http.get("/pub/get_doctors_price/").success(function(data, status, headers, config) {
							var result = logger.check(data);
							$scope.amount.doctor_amount = result.price.price;
							$scope.amount.doctor_days = result.price.days;
							$scope.amount.doctor_end = result.price.end;
							$scope.step = 2;
						});
					}
				}
			};
			
			$scope.prev_step = function(index)
			{
				$scope.step = index;
			};
		}
		
		$scope.onAvatar = function(response)
		{
			var data = response.data;
			$scope.doctor.avatar = logger.check(data);
			if ($scope.doctor.avatar)
			{
				$scope.doctor.new_avatar = $scope.doctor.avatar;
				$scope.doctor.avatar = './avatars/tmp/' + $scope.doctor.avatar;
			}
		};
		
		$scope.remove_avatar = function()
		{
			$scope.doctor.remove_avatar = 1;
			$scope.doctor.avatar = '';
		};
		
		if ($location.path().indexOf("/pages/doctors_edit") + 1)
		{
			var id = $location.path().split("/").pop();
			$scope.doctors_count = 0;
			$scope.redirect_url = "pages/advanced";
			$http.post("/pub/get_doctor/", {id: id}).success(function(data, status, headers, config) {
				var result = {};
				if (result = logger.check(data))
				{
					for (var key in result)
					{
						$scope.doctor[key] = result[key];
					}
					$scope.doctor.short = $scope.doctor.short == '' ? ($scope.doctor.firstname + '-' + $scope.doctor.lastname).replace(/ /ig, '-').toLowerCase() : $scope.doctor.short;
					$scope.doctors_count = result.doctors_count;
				}
			});
		}
		
		if ($location.path() == "/pages/locations_add")
		{
			$scope.redirect_url = "pages/advanced";
		}
		
		if ($location.path().indexOf("/pages/locations_add/") + 1)
		{
			var id = $location.path().split("/").pop();
			$scope.redirect_url = "pages/advanced";
			$http.post("/pub/get_location/", {id: id}).success(function(data, status, headers, config) {
				var result = {};
				if (result = logger.check(data))
				{
					for (var key in result)
					{
						$scope.location[key] = result[key];
					}
				}
			});
		}
		
		if ($location.path() == "/pages/treatments_add")
		{
			$scope.redirect_url = "pages/advanced";
		}
		
		if ($location.path().indexOf("/pages/treatments_add/") + 1)
		{
			var id = $location.path().split("/").pop();
			$scope.redirect_url = "pages/advanced";
			$http.post("/pub/get_treatment/", {id: id}).success(function(data, status, headers, config) {
				var result = {};
				if (result = logger.check(data))
				{
					for (var key in result)
					{
						$scope.treatment[key] = result[key];
					}
				}
			});
		}

		$scope.check_link = function(type)
		{
			type = type || 'doctor';
			$scope.zorgkaart = "none";
			if ($scope[type].zorgkaart && $scope[type].zorgkaart != '')
			{
				if ( ! ($scope[type].zorgkaart.indexOf("https://www.zorgkaartnederland.nl/") + 1) && ! ($scope[type].zorgkaart.indexOf("http://www.zorgkaartnederland.nl/") + 1) &&  ! ($scope[type].zorgkaart.indexOf("https://zorgkaartnederland.nl/") + 1) && ! ($scope[type].zorgkaart.indexOf("http://zorgkaartnederland.nl/") + 1))
				{
					$scope.zorgkaart = "invalid";
				}
				else
				{
					$scope.zorgkaart = "valid";
				}
			}
			else
			{
				$scope.zorgkaart = type == 'doctor' ? 'invalid' : 'none';
			}
		};
		
		$scope.save_doctor = function()
		{
			/*$scope.check_link();
			if ($scope.zorgkaart == "valid")
			{*/
				var check = true;
				if ($scope.short_checked && ! $scope.validate_url())
				{
					check = false;
					logger.logError("Voer alstublieft een geldige URL in.");
				}
				
				if (check)
				{
					$http.post("/pub/save_doctor/", $scope.doctor).success(function(data, status, headers, config) {
						if (logger.check(data))
						{
							$location.url($scope.redirect_url);
						}
					});
				}
			/*}
			else
			{
				logger.logError("Vergeet niet het Zorgkaart profiel in te vullen!");
			}*/
		};
		
		$scope.save_location = function()
		{
			$scope.check_link('location');
			if ($scope.zorgkaart != "invalid")
			{
				$http.post("/pub/save_location/", $scope.location).success(function(data, status, headers, config) {
					if (logger.check(data))
					{
						$location.url($scope.redirect_url);
					}
				});
			}
		};
		
		$scope.save_treatment = function()
		{
			$http.post("/pub/save_treatment/", $scope.treatment).success(function(data, status, headers, config) {
				if (logger.check(data))
				{
					$location.url($scope.redirect_url);
				}
			});
		};
		
		$scope.short_class = "none";
		$scope.validate_url = function() {
			$scope.short_class = "none";
			if ($scope.doctor.short.length)
			{
				var re = /^[a-zA-Z0-9_-]+$/;
				if (re.test($scope.doctor.short))
				{
					$scope.short_class = "valid";
				}
				else
				{
					$scope.short_class = "invalid";
				}
			}
			
			return ($scope.short_class != "invalid");
		};
    }

})();
;
(function () {
    'use strict';

    angular.module('app')
        .controller('UsersCtrl', [ '$scope', '$rootScope', '$window', '$http', '$location', '$modal', '$filter', 'logger', UsersCtrl]); // overall control

    function UsersCtrl($scope, $rootScope, $window, $http, $location, $modal, $filter, logger) {
		$scope.users = [];
		$http.post("/pub/users/").success(function(data, status, headers, config) {
			$scope.users = logger.check(data);
			init();
		});

		$scope.open_modal = function(user) {
            var modalInstance;
            modalInstance = $modal.open({
                templateUrl: "change_account.html",
                controller: 'ModalInstanceChangeAccountCtrl',
				size: 'lg',
                resolve: {
                    items: function() {
						return user;
					}
                }
            });
            modalInstance.result.then((function(times) {
				if (times.user)
				{
					var user = times.user;
					
					var date = new Date(user.activation);
					user.activation = date.getTime() / 1000;

					var date = new Date(user.suspension);
					user.suspension = date.getTime() / 1000;
					
					var date = new Date(user.trial_end);
					user.trial_end = date.getTime() / 1000;

					$http.post("/pub/change_user/", {user: user}).success(function(data, status, headers, config) {
						$scope.users = logger.check(data);
						
						$scope.order('-date');
					});
				}
				else
				{
					if (times.users)
					{
						$scope.users = times.users;
						$scope.order('-date');
						$scope.order('date');
					}
					else
					{
						for (var key in $scope.users)
						{
							if ($scope.users[key].id == times[0])
							{
								$scope.users[key].admin_stop = times[1];
							}
						}
						
						$http.post("/pub/remove_user/", {id: times[0], action: times[1]}).success(function(data, status, headers, config) {
							$scope.users = logger.check(data);
							$scope.order('-id');
							$scope.order('id');
						});
					}
				}
            }), function() {
                console.log("Modal dismissed at: " + new Date());
            });
        };

		$scope.change_sites = function($event, users_id) {
			$http.post("/pub/sites/", {id: users_id, checked: $event.originalEvent.target.checked * 1}).success(function(data, status, headers, config) {
				logger.check(data);
			});
		};
		
		$scope.login_as_user = function(users_id) {
			$http.post("/pub/login_as_user/", {id: users_id}).success(function(data, status, headers, config) {
				if (logger.check(data))
				{
					$window.location.reload();
				}
			});
		};
		
		$scope.checks = [];
		$scope.check_checks = function(id) {
			var check = true;
			var new_checks = [];
			for (var key in $scope.checks)
			{
				if ($scope.checks[key] == id)
				{
					check = false;
				}
				else
				{
					new_checks.push($scope.checks[key]);
				}
			}
			
			$scope.checks = new_checks;
			if (check)
			{
				$scope.checks.push(id);
			}
		};
		
		$scope.print_invoices = function() {
			$http.post("/pub/users_invoices/", {ids: $scope.checks}).success(function(data, status, headers, config) {
				var result = logger.check(data)
				if (result)
				{
					for (var key in result)
					{
						$window.open($window.location.protocol + "//" + window.location.host + "/pub/invoice/" + result[key] + "/");
					}
				}
			});
		};
		
		
		
		
		var init;
        $scope.searchKeywords = '';
        $scope.filteredStores = [];
        $scope.row = '';

        $scope.select = function(page) {
            var end, start;
            start = (page - 1) * $scope.numPerPage;
            end = start + $scope.numPerPage;
            return $scope.currentPageStores = $scope.filteredStores.slice(start, end);
        };

        $scope.onFilterChange = function() {
            $scope.select(1);
            $scope.currentPage = 1;
            return $scope.row = '';
        };

        $scope.onNumPerPageChange = function() {
            $scope.select(1);
            return $scope.currentPage = 1;
        };

        $scope.onOrderChange = function() {
            $scope.select(1);
            return $scope.currentPage = 1;
        };

        $scope.search = function() {
            $scope.filteredStores = $filter('filter')($scope.users, $scope.searchKeywords);
            return $scope.onFilterChange();
        };

        $scope.order = function(rowName) {
            if ($scope.row === rowName) {
                return;
            }
            $scope.row = rowName;
            $scope.filteredStores = $filter('orderBy')($scope.users, rowName);
            return $scope.onOrderChange();
        };

        $scope.numPerPageOpt = [10, 20, 30, 50];
        $scope.numPerPage = $scope.numPerPageOpt[2];
        $scope.currentPage = 1;
        $scope.currentPageStores = [];

        init = function() {
            $scope.order('id');
            return $scope.select($scope.currentPage);
        };
    }

})();
;
;
(function () {
    'use strict';

    angular.module('app')
        .controller('AddUserCtrl', [ '$scope', '$rootScope', '$window', '$http', '$location', '$modal', 'logger', AddUserCtrl]); // overall control

    function AddUserCtrl($scope, $rootScope, $window, $http, $location, $modal, logger) {
		$scope.user = {};
		$scope.save = function()
		{
			if ( ! $scope.form.$error.required && ! $scope.form.$error.email)
			{
				var mobile_check = true;
				if ($scope.user.mobile != '')
				{
					var numeric = true;
					for (var k in $scope.user.mobile)
					{
						if ($scope.user.mobile[k] != ' ' && typeof($scope.user.mobile[k]) != 'function')
						{
							if ( ! ( ! isNaN(parseFloat($scope.user.mobile[k])) && isFinite($scope.user.mobile[k])))
							{
								numeric = false;
							}
						}
					}
					
					if ( ! numeric)
					{
						logger.logError("Het telefoonnummer kan enkel nummers bevatten");
						mobile_check = false;
					}
					
					if (($scope.user.mobile.indexOf('06') + 1) != 1)
					{
						logger.logError("Het telefoonnummer dient met 06 te beginnen");
						mobile_check = false;
					}
					
					var length_mobile = $scope.user.mobile.replace(/ /gi, '');
					if (length_mobile.length != 10)
					{
						logger.logError("Het telefoonnummer dient 10 cijfers te bevatten");
						mobile_check = false;
					}
				}
				
				if (mobile_check)
				{
					var date = new Date($scope.user.activation);
					$scope.user.activation = date.getTime() / 1000;

					var date = new Date($scope.user.suspension);
					$scope.user.suspension = date.getTime() / 1000;

					$http.post("/pub/signup/", $scope.user).success(function(data, status, headers, config) {
						if (logger.check(data))
						{
							$scope.user = {};
						}
					});
				}
			}
		};
		
		$scope.check_mobile = function(mobile)
		{
			var new_mobile = '';
			for (var k in mobile)
			{
				if ((mobile[k] >= 0 && mobile[k] <= 9) || mobile[k] == ' ')
				{
					new_mobile += mobile[k];
				}
			}
			$scope.user.mobile = new_mobile;
		};

		$scope.today = function(type) {
			return $scope.user[type] = new Date();
		};
		$scope.today('activation');
		
		var date = new Date();
		$scope.user['suspension'] = new Date(date.getTime() + 30 * 24 * 3600 * 1000);
		$scope.user['suspension_str'] = $scope.user['suspension'].getDate() + "-" + ($scope.user['suspension'].getMonth() + 1) + "-" + $scope.user['suspension'].getFullYear();

		$scope.showWeeks = true;
		$scope.clear = function(type) {
			$scope.user[type] = null;
		};

		$scope.disabled = function(date, mode) {
			mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
		};

		$scope.open_date = function($event, type) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope['opened_' + type] = true;
		};

		$scope.dateOptions = {
			'year-format': "'yy'",
			'starting-day': 1
		};

		$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
		$scope.format = $scope.formats[0];
    }

})();
;
(function () {
    'use strict';

    angular.module('app')
        .controller('InvitationCtrl', [ '$scope', '$rootScope', '$window', '$http', '$location', '$modal', 'logger', '$timeout', 'Upload', InvitationCtrl]); // overall control

    function InvitationCtrl($scope, $rootScope, $window, $http, $location, $modal, logger, $timeout, Upload) {
		$scope.ex = false;
		$scope.vote = 0;
		$scope.is_vote = false;
		$scope.revote = false;
		$scope.id = 0;
		$scope.doc = {};
		$scope.doc.id = 0;
		$scope.location = {};
		$scope.loc = {};
		$scope.loc.id = 0;
		$scope.treatment = {};
		$scope.treat = {};
		$scope.treat.id = 0;
		$scope.short = false;
		$scope.feedback_success = false;
		$scope.feedback = {};
		$scope.feedback_success2 = false;
		
		$scope.i = {};
		$scope.logo = '/application/views/images/logo_full.png';
		$scope.color = '#0f75bc';
		$scope.color_style = {};
		$scope.onlines_keys = ['google', 'facebook', 'zorgkaart', 'independer'];
		$scope.onlines = [];
		$scope.onlines_col = 12;
		$scope.anonymus = [];
		$scope.anonymus[0] = false;
		$scope.limit = false;
		$scope.errors = false;
		
		$scope.feedback_sent = false;
		
		$scope.questions = {};
		$scope.q_show = false;
		$scope.q_vote = {};
		$scope.voted = 0;
		$scope.abc = ['a', 'b', 'c', 'd'];
		
		$scope.cat_name = {};
		$scope.cat_name[0] = '';
		$scope.doctors_cats = [];
		$scope.cats_list = [];
		$scope.cat_empty = 'Without category';

		$scope.init = function()
		{
			var segments = $window.location.pathname.split('/');
			$http.post("/pub/rating_page_get/", {segments: segments}).success(function(data, status, headers, config) {
				$scope.i = logger.check(data);
				if ($scope.i && $scope.i.user)
				{
					$scope.short = $scope.i.short;
					$scope.id = $scope.i.info.id || 0;
					$scope.vote = $scope.i.info.stars;
					$scope.vote_tmp = $scope.vote;
					$scope.is_vote = $scope.vote > 0 ? true : false;
					$scope.feedback.one = $scope.i.info.feedback;
					$scope.feedback.init = $scope.i.info.feedback;
					$scope.users_id = $scope.i.user ? $scope.i.user.id : 0;
					$scope.doctors_id = ($scope.i.info && $scope.i.info.doctor) ? $scope.i.info.doctor : 0;
					$scope.doc.id = $scope.doctors_id * 1;
					$scope.locations_id = ($scope.i.info && $scope.i.info.location) ? $scope.i.info.location : 0;
					$scope.loc.id = $scope.locations_id * 1;
					$scope.treatments_id = ($scope.i.info && $scope.i.info.treatment) ? $scope.i.info.treatment : 0;
					$scope.treat.id = $scope.treatments_id * 1;
					$scope.ex = $scope.i.info ? $scope.i.info.ex : $scope.ex;
					$scope.limit = $scope.i.info ? $scope.i.info.limit : $scope.limit;
					$scope.errors = $scope.i.info ? $scope.i.info.errors : $scope.errors;
					
					if ($scope.i && $scope.i.doctors)
					{
						$scope.cats_list = [];
						if ($scope.i.doctors.length > 6)
						{
							var keys = {};
							for (var k in $scope.i.doctors)
							{
								if ($scope.i.doctors[k].cat != '')
								{
									keys[$scope.i.doctors[k].cat] = true;
								}
							}
							
							for (var k in keys)
							{
								//$scope.cats_list.push(k.replace('zzz[empty]', $scope.cat_empty));
								$scope.cats_list.push(k);
								$scope.cats_list.sort(function(a, b) { return a > b ? 1 : (a < b ? -1 : 0); });
							}
						}
						else
						{
							$scope.doctors_cats = $scope.i.doctors;
						}
					}	
					
					
					$scope.questions = $scope.i.questions;
					if ($scope.questions.main)
					{
						$scope.q_show = true;
						$scope.is_vote = $scope.questions.main.stars > 0 ? true : false;
						$scope.q_vote[$scope.questions.main.id] = $scope.questions.main.stars;
						
						if ($scope.questions.others)
						{
							for (var k in $scope.questions.others)
							{
								$scope.is_vote = $scope.questions.others[k].stars > 0 ? true : $scope.is_vote;
								$scope.q_vote[$scope.questions.others[k].id] = $scope.questions.others[k].stars;
							}
						}
					}
					
					$scope.is_voted();

					if ($scope.i.user)
					{
						$scope.logo = ($scope.i.user.logo ? $scope.i.user.logo : $scope.logo).replace('./', '/');
						$scope.color = $scope.i.user.color ? $scope.i.user.color : $scope.color;
						$scope.color_style = {"background-image": "linear-gradient(" + $scope.color + ", #F5F5F5)"};
						
						if ($scope.i.user.account_type == "1" || $scope.i.user.account == "2")
						{
							$scope.onlines_keys = ['google', 'facebook', 'zorgkaart', 'telefoonboek', 'vergelijkmondzorg', 'independer', 'kliniekoverzicht', 'own'];
							if (($scope.i.user.organization == "1" || $scope.i.user.account == "2") && $scope.is_mobile())
							{
								$scope.onlines_keys.push('youtube');
							}
						}
						
						if ($scope.voted < 0)
						{
							$scope.onlines_keys = ['zorgkaart', 'google', 'facebook', 'independer'];
						}
						
						$scope.rebuild_onlines();
					}
					
					if ($scope.ex)
					{
						$scope.open_modal();
					}
					
					if ($scope.vote <= 2 && $scope.vote > 0 && ! $scope.limit && ! $scope.errors)
					{
						$scope.negative_modal();
					}
				}
				else if ($scope.i.unsubscribe)
				{
					$scope.color_style = {"background-image": "linear-gradient(" + $scope.color + ", #F5F5F5)"};
				}
				
				$scope.apps.title = ! $scope.i.unsubscribe && ! $scope.i.user ? "Oeps..." : ($scope.i.unsubscribe ? "We hebben uw verzoek ontvangen" : "Beoordeel " + $scope.i.user.username + " - Patiëntenreview");
				$scope.apps.ready = true;
			});
		};
		
		$scope.init();
		
		$scope.set_cat = function()
		{
			$scope.doctors_cats = [];
			$scope.cat_name[0] = $scope.cat_name[0] == $scope.cat_empty ? '' : $scope.cat_name[0];
			for (var k in $scope.i.doctors)
			{
				if ($scope.cat_name[0] == $scope.i.doctors[k].cat)
				{
					$scope.doctors_cats.push($scope.i.doctors[k]);
				}
			}
		}
		
		$scope.is_voted = function()
		{
			$scope.voted = 0;
			if ($scope.q_show)
			{
				for (var k in $scope.q_vote)
				{
					if ($scope.q_vote[k] > 0)
					{
						if ($scope.q_vote[k] <= 2)
						{
							$scope.voted = -1;
						}
						else
						{
							if ($scope.voted >= 0)
							{
								$scope.voted = 1;
							}
						}
					}
				}
			}
			else
			{
				if ($scope.vote > 0)
				{
					if ($scope.vote <= 2)
					{
						$scope.voted = -1;
					}
					else
					{
						$scope.voted = 1;
					}
				}
			}
		};
		
		$scope.is_mobile = function()
		{
			var check = false;
			(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
			return check;
		};
		
		$scope.rebuild_onlines = function() {
			var cols = 0;
			var onlines = [];
			for (var key in $scope.onlines_keys)
			{
				var s = $scope.onlines_keys[key];
				if ($scope.i.user[s + '_checked'] == '1' && $scope.i.user[s] != '')
				{
					var temp = {"system": s,
								"url": $scope.i.user[s],
								"pos": $scope.i.user[s + '_pos'] * 1};
								
					if (s == "zorgkaart" && $scope.i.location && $scope.i.location.zorgkaart != '')
					{
						temp.url = $scope.i.location.zorgkaart;
					}

					if (s == "zorgkaart" && $scope.i.doctor && $scope.i.doctor.zorgkaart != '')
					{
						temp.url = $scope.i.doctor.zorgkaart;
					}
					
					if (s == "zorgkaart" && $scope.i.location && $scope.i.location.zorgkaart != '')
					{
						temp.url = $scope.i.location.zorgkaart;
					}
					
					if ($scope.voted < 0)
					{
						temp.url = 'http://zorgkaartnederland.nl/';
					}
					
					if ($scope.voted < 0 && ! onlines.length || $scope.voted > 0)
					{
						cols++;
						onlines.push(temp);
					}
				}
			}
			
			onlines.sort(function(a, b) { return a.pos - b.pos; });
			$scope.onlines = onlines;
			
			if (cols > 0)
			{
				cols = Math.round(12 / cols);
				$scope.onlines_col = cols < 4 ? 4 : cols;
			}
		};
		
		$scope.set_doctor = function($event, id) {
			$scope.doc.id = id;
			$scope.doctors_id = $scope.doc.id;
			var next = $($event.target).closest('.step-cont').next('.step-cont');
			if (next.length)
			{
				$("html, body").animate({scrollTop: next.offset().top + 'px'}, "fast");
			}
			else
			{
				$("html, body").animate({scrollTop: $('.step-cont-last').offset().top + 'px'}, "fast");
			}
			
			$http.post("/pub/vote_doc/", {id: $scope.id, users_id: $scope.users_id, doctors_id: $scope.doctors_id}).success(function(data, status, headers, config) {
				var result = logger.check(data);
				if (result.doctor)
				{
					$scope.i.doctor = result.doctor;
					$scope.id = result.id;
				}
				$scope.rebuild_onlines();
			});
		};
		
		$scope.set_location = function(id) {
			$scope.locations_id = $scope.loc.id;
			var next = $('#' + id).closest('.step-cont').next('.step-cont');
			if (next.length)
			{
				$("html, body").animate({scrollTop: next.offset().top + 'px'}, "fast");
			}
			else
			{
				$("html, body").animate({scrollTop: $('.step-cont-last').offset().top + 'px'}, "fast");
			}
			$http.post("/pub/vote_loc/", {id: $scope.id, users_id: $scope.users_id, locations_id: $scope.locations_id}).success(function(data, status, headers, config) {
				var result = logger.check(data);
				if (result.location)
				{
					$scope.i.location = result.location;
					$scope.id = result.id;
				}
				$scope.rebuild_onlines();
			});
		};
		
		$scope.set_treatment = function(id) {
			$scope.treatments_id = $scope.treat.id;
			var next = $('#' + id).closest('.step-cont').next('.step-cont');
			if (next.length)
			{
				$("html, body").animate({scrollTop: next.offset().top + 'px'}, "fast");
			}
			else
			{
				$("html, body").animate({scrollTop: $('.step-cont-last').offset().top + 'px'}, "fast");
			}
			$http.post("/pub/vote_treat/", {id: $scope.id, users_id: $scope.users_id, treatments_id: $scope.treatments_id}).success(function(data, status, headers, config) {
				var result = logger.check(data);
				if (result.treatment)
				{
					$scope.i.treatment = result.treatment;
					$scope.id = result.id;
				}
				$scope.rebuild_onlines();
			});
		};
		
		$scope.open_modal = function() {
            var modalInstance;
            modalInstance = $modal.open({
                templateUrl: "exinv.html",
                controller: 'ModalExampleInvCtrl',
                resolve: {
                    items: function() {
						return [];
					}
                }
            });
			
			modalInstance.result.then((function(times) {
				console.log(times);
            }), function() {
                console.log("Modal dismissed at: " + new Date());
            });
        };
		
		$scope.hash = "";
		$scope.unsubscribe = function() {
			var segments = $window.location.pathname.split('/');
			$http.post("/pub/unsubscribe_ajax/", {hash: segments[2]}).success(function(data, status, headers, config) {
				var result = {};
				if (result = logger.check(data))
				{
					$scope.hash = result.hash;
					var modalInstance;
					modalInstance = $modal.open({
						templateUrl: "unsubscribe.html",
						controller: 'ModalUnsubscribeCtrl',
						resolve: {
							items: function() {
								return [];
							}
						}
					});
					
					modalInstance.result.then((function(result) {
						if (result == 'undo')
						{
							$scope.undo();
						}
					}), function() {
						console.log("Modal dismissed at: " + new Date());
					});
				}
			});
		};
		
		$scope.undo_check = false;
		$scope.undo = function() {
			var segments = $window.location.pathname.split('/');
			$scope.hash = segments[2];
			$http.post("/pub/undo/", {hash: $scope.hash}).success(function(data, status, headers, config) {
				var modalInstance;
				modalInstance = $modal.open({
					templateUrl: "undo.html",
					controller: 'ModalUndoCtrl',
					resolve: {
						items: function() {
							return [];
						}
					}
				});
				
				modalInstance.result.then((function(result) {
					$scope.undo_check = true;
				}), function() {
					console.log("Modal dismissed at: " + new Date());
				});
			});
		};
		
		$scope.vote_tmp = 0;
		$scope.negative_modal = function() {
            var modalInstance;
            modalInstance = $modal.open({
                templateUrl: "negative.html",
                controller: 'ModalExampleNegativeCtrl',
                resolve: {
                    items: function() {
						return $scope.vote_tmp;
					}
                }
            });
			
			modalInstance.result.then((function(vote) {
				vote = vote == "zero" ? 0 : $scope.vote_tmp;
				$http.post("/pub/vote/", {id: $scope.id, users_id: $scope.users_id, doctors_id: $scope.doctors_id, stars: vote}).success(function(data, status, headers, config) {
					var result = {};
					if (result = logger.check(data))
					{
						$scope.id = result.id;
						$scope.vote = result.stars;
						$scope.is_voted();
						if ($scope.vote == 0)
						{
							$scope.is_vote = false;
						}
						$scope.change_revote( ! $scope.is_vote);
						
						if ($scope.vote <= 2 && $scope.vote > 0)
						{
							$scope.onlines_keys = ['zorgkaart', 'google', 'facebook', 'independer'];
						}
						else
						{
							if ($scope.i.user && ($scope.i.user.account_type == "1" || $scope.i.user.account == "2"))
							{
								$scope.onlines_keys = ['google', 'facebook', 'zorgkaart', 'telefoonboek', 'vergelijkmondzorg', 'independer', 'kliniekoverzicht', 'own'];
								if (($scope.i.user.organization == "1" || $scope.i.user.account == "2") && $scope.is_mobile())
								{
									$scope.onlines_keys.push('youtube');
								}
							}
							else
							{
								$scope.onlines_keys = ['google', 'facebook', 'zorgkaart', 'independer'];
							}
						}
						$scope.rebuild_onlines();
					}
				});
            }), function() {
                console.log("Modal dismissed at: " + new Date());
            });
        };
		
		$scope.show_other = false;
		$scope.show_other_questions = function()
		{
			$scope.show_other = true;
		};
		
		$scope.click_question_star = function(num, questions_id)
		{
			if ( ! $scope.ex)
			{
				$http.post("/pub/vote_questions/", {id: $scope.id, users_id: $scope.users_id, doctors_id: $scope.doctors_id, questions_id: questions_id, stars: num}).success(function(data, status, headers, config) {
					var result = {};
					if (result = logger.check(data))
					{
						$scope.q_vote[questions_id] = result.stars;
						$scope.is_voted();

						$scope.id = result.id;
						$scope.i.info.last = result.last;
						$scope.i.info.last_date = result.last_date;
						$scope.i.info.last_time = result.last_time;
						$scope.change_revote( ! $scope.is_vote);
						
						if ($scope.voted < 0)
						{
							$scope.onlines_keys = ['zorgkaart'];
						}
						else
						{
							if ($scope.i.user && ($scope.i.user.account_type == "1" || $scope.i.user.account == "2"))
							{
								$scope.onlines_keys = ['google', 'facebook', 'zorgkaart', 'telefoonboek', 'vergelijkmondzorg', 'independer', 'kliniekoverzicht', 'own'];
								if (($scope.i.user.organization == "1" || $scope.i.user.account == "2") && $scope.is_mobile())
								{
									$scope.onlines_keys.push('youtube');
								}
							}
							else
							{
								$scope.onlines_keys = ['google', 'facebook', 'zorgkaart', 'independer'];
							}
						}
						$scope.rebuild_onlines();
					}
				});
			}
		};

		$scope.click_star = function(num)
		{
			if ( ! $scope.ex)
			{
				$scope.vote_tmp = num;
				if (num <= 2 && num > 0)
				{
					$scope.negative_modal();
				}
				else
				{
					$http.post("/pub/vote/", {id: $scope.id, users_id: $scope.users_id, doctors_id: $scope.doctors_id, stars: num}).success(function(data, status, headers, config) {
						var result = {};
						if (result = logger.check(data))
						{
							$scope.vote = result.stars;
							$scope.is_voted();
							
							$scope.id = result.id;
							$scope.i.info.last = result.last;
							$scope.i.info.last_date = result.last_date;
							$scope.i.info.last_time = result.last_time;
							$scope.change_revote( ! $scope.is_vote);
							
							if ($scope.voted < 0)
							{
								$scope.onlines_keys = ['zorgkaart'];
							}
							else
							{
								if ($scope.i.user && ($scope.i.user.account_type == "1" || $scope.i.user.account == "2"))
								{
									$scope.onlines_keys = ['google', 'facebook', 'zorgkaart', 'telefoonboek', 'vergelijkmondzorg', 'independer', 'kliniekoverzicht', 'own'];
									if (($scope.i.user.organization == "1" || $scope.i.user.account == "2") && $scope.is_mobile())
									{
										$scope.onlines_keys.push('youtube');
									}
								}
								else
								{
									$scope.onlines_keys = ['google', 'facebook', 'zorgkaart', 'independer'];
								}
							}
							$scope.rebuild_onlines();
						}
					});
				}
			}
		};
		
		$scope.change_revote = function(value) {
			$scope.revote = value;
		};

		$scope.form = {};
		$scope.save_feedback = function()
		{
			if ( ! $scope.ex)
			{
				if ( ! $scope.form.formOne.$error.required)
				{
					$http.post("/pub/feedback/", {id: $scope.id, users_id: $scope.users_id, doctors_id: $scope.doctors_id, feedback: $scope.feedback.one, anonymus: $scope.anonymus[0]}).success(function(data, status, headers, config) {
						var result = {};
						if (result = logger.check(data))
						{
							$scope.id = result.id;
							$scope.i.info.last = result.last;
							$scope.i.info.last_date = result.last_date;
							$scope.i.info.last_time = result.last_time;
							$scope.feedback_success = true;
							
							$scope.feedback_sent = true;
							$scope.feedback.init = $scope.feedback.one;
						}
					});
				}
				else
				{
					logger.check({'errors': [['U heeft geen feedback ingevuld']]});
				}
			}
		};
		
		$scope.save_feedback2 = function()
		{
			if ( ! $scope.ex)
			{
				if ( ! $scope.form.formTwo.$error.required)
				{
					$http.post("/pub/feedback/", {id: $scope.id, users_id: $scope.users_id, doctors_id: $scope.doctors_id, feedback: $scope.feedback.two}).success(function(data, status, headers, config) {
						var result = {};
						if (result = logger.check(data))
						{
							$scope.id = result.id;
							$scope.feedback_success2 = true;
						}
					});
				}
				else
				{
					logger.check({'errors': [['U heeft geen feedback ingevuld']]});
				}
			}
		};

		$scope.onlines_youtube = 0;
		$scope.click = function(type, url)
		{
			if ( ! $scope.ex)
			{
				if ($scope.voted != 0)
				{
					type = type || false;
					if (type && type != 'youtube')
					{
						$http.post("/pub/click/", {id: $scope.id, users_id: $scope.users_id, doctors_id: $scope.doctors_id, type: type}).success(function(data, status, headers, config) {
							var result = logger.check(data);
							if (result)
							{
								$scope.id = result;
								//$window.location.href = url;
							}
						});
					}
					else if (type && type == 'youtube')
					{
						$scope.onlines_youtube = 1;
						$timeout(function(){
							$("html, body").animate({scrollTop: $('.youtube-box').offset().top + 'px'}, "fast");							
						}, 500);
					}
				}
				else
				{
					logger.check({'errors': [['U dient eerst een beoordeling te geven.']]});
				}
			}
			else
			{
				$window.location.href = url;
			}
		};
		
		$scope.status = 0;
		$scope.upload_timer = 0;
		$scope.uploadFile = function(file) {
			$scope.status = 1;
			$scope.timer = 0;
			file.progress = 0;
			$scope.result = [];
			
			$scope.upload_timer = setTimeout(function() {
				$scope.too_long();
			}, 10000);
			
			file.upload = Upload.upload({
				url: '/pub/upload_video/',
				data: {file: file}
			});

			file.upload.then(function (response)
			{
				$timeout(function () {
					file.result = response.data;
					file.progress = 100;
					clearInterval($scope.timer);

					$scope.result = logger.check(file.result);
					if ($scope.result.error)
					{
						file.progress = 100;
						$scope.status = 3;
					}
					else
					{
						$timeout(function() {
							file.progress = 100;
							$scope.status = 2;
						}, 1100);
						
						$scope.save_video_review($scope.result);
					}
				});
			}, function (response)
			{
				if (response.status > 0)
				{
					file.progress = 100;
					$scope.status = 3;
				}
			}, function (evt)
			{
				file.progress = Math.ceil(Math.min(100, parseInt(100.0 * evt.loaded / evt.total)) / 2);
				if (file.progress >= 50 && file.progress < 95)
				{
					$scope.timer = setInterval(function() {
						if (file.progress <= 98)
						{
							file.progress += 2;
						}
					}, 300);
				}
			});
		};
		
		$scope.save_video_review = function(result)
		{
			$http.post("/pub/video_review/", {id: $scope.id, users_id: $scope.users_id, doctors_id: $scope.doctors_id, file: result}).success(function(data, status, headers, config) {
				$scope.id = logger.check(data);
			});
		};
	};
})();
;
(function () {
    'use strict';

    angular.module('app')
        .controller('InboxCtrl', [ '$scope', '$rootScope', '$window', '$http', '$location', '$modal', '$filter', 'logger', 'inbox_count', 'with_feedback_count', InboxCtrl]); // overall control

    function InboxCtrl($scope, $rootScope, $window, $http, $location, $modal, $filter, logger, inbox_count, with_feedback_count) {
		$scope.ready = false;
		$scope.letters = [];
		$scope.filter = with_feedback_count.filter;
		$scope.dates = {};
		$scope.doctor = 0;
		$scope.doctors = [];
		inbox_count.set(0);
		$scope.with_feedback_count = with_feedback_count.get;
		
		$scope.export_inbox = function() {
			var filter = {stars: $scope.filter};

			if ($scope.dates.from)
			{
				var date = new Date($scope.dates.from);
				filter.from = date.getTime() / 1000;
			}

			if ($scope.dates.to)
			{
				var date = new Date($scope.dates.to);
				filter.to = date.getTime() / 1000;
			}
			
			if ($scope.doctor)
			{
				filter.doctor = $scope.doctor;
			}
				
			var modalInstance;
			modalInstance = $modal.open({
				templateUrl: "export_inbox.html",
				controller: 'ModalInstanceExportInboxCtrl',
				resolve: {
					items: function() {
						return {filter: filter};
					}
				}
			});
			
			modalInstance.result.then((function(items) {

			}), function() {
				console.log("Modal dismissed at: " + new Date());
			});
		};

		$http.post("/pub/get_doctors/").success(function(data, status, headers, config) {
			var result = logger.check(data);
			$scope.doctors = [];
			for (var key in result)
			{
				$scope.doctors.push(result[key]);
			}
		});
		
		$scope.hide_badge = false;
		$scope.read_letters = function() {
			var filter = {stars: $scope.filter};

			if ($scope.dates.from)
			{
				var date = new Date($scope.dates.from);
				filter.from = date.getTime() / 1000;
			}

			if ($scope.dates.to)
			{
				var date = new Date($scope.dates.to);
				filter.to = date.getTime() / 1000;
			}
			
			if ($scope.doctor)
			{
				filter.doctor = $scope.doctor;
			}

			$http.post("/pub/read_letters/", {filter: filter, letters: $scope.check_letter}).success(function(data, status, headers, config) {
				$scope.hide_badge = true;
				$scope.letters = logger.check(data);
				for (var key in $scope.letters)
				{
					$scope.letters[key].date *= 1;
				}
				$scope.ready = true;
				init();
				
				$scope.check_letter = {};
				$scope.check_all[0] = false;
				
				with_feedback_count.get_ajax();
			});
		};

		$scope.on_page = 30;
		$scope.this_page = 1;
		$scope.order = 'last-desc';
		$scope.count = 0;
		$scope.reprint = function(stars) {
			$scope.filter = (stars || $scope.filter);
			with_feedback_count.filter = $scope.filter;
			var filter = {stars: $scope.filter};

			if ($scope.dates.from)
			{
				var date = new Date($scope.dates.from);
				filter.from = date.getTime() / 1000;
			}

			if ($scope.dates.to)
			{
				var date = new Date($scope.dates.to);
				filter.to = date.getTime() / 1000;
			}
			
			if ($scope.doctor)
			{
				filter.doctor = $scope.doctor;
			}

			$http.post("/pub/inbox/", {filter: filter, on_page: $scope.on_page, this_page: $scope.this_page, order: $scope.order}).success(function(data, status, headers, config) {
				var result = logger.check(data);
				$scope.letters = result.letters;
				$scope.count = result.count;
				for (var key in $scope.letters)
				{
					$scope.letters[key].date *= 1;
				}
				$scope.ready = true;

				$scope.check_letter = {};
				$scope.check_all[0] = false;
				
				with_feedback_count.get_ajax();
			});
		};

		$scope.reprint();

		$scope.change_filter = function(filter)
		{
			if ($scope.filter == filter)
			{
				$scope.filter = "none";
			}
			else
			{
				$scope.filter = filter;
			}
			$scope.this_page = 1;
			$scope.reprint();
		};
		
		$scope.change_page = function(page) {
			$scope.this_page = page;
			$scope.reprint();
		};
		
		$scope.set_order = function(order) {
			$scope.this_page = 1;
			$scope.order = order;
			$scope.reprint();
		};

		$scope.more = function(id, is_feedback, email, $event)
		{
			if ($event.target.tagName.toLowerCase() != "span" && $event.target.tagName.toLowerCase() != "input" && $event.target.className.toLowerCase() != "ui-checkbox")
			{
				if (email || is_feedback)
				{
					$location.url('mail/single/' + id);
				}
			}
		};
		
		$scope.check_letter = {};
		$scope.check_all = [];
		$scope.check_all[0] = false;
		$scope.check_all_letters = function() {
			var val = $scope.check_all[0];
			$scope.check_letter = {};
			for (var key in $scope.letters)
			{
				var item = $scope.letters[key];
				if (item.reply == "")
				{
					$scope.check_letter[item.id] = val;
				}
			}
		};
		
		$scope.check_one_letter = function(id) {
			var check = true;
			for (var key in $scope.letters)
			{
				var item = $scope.letters[key];
				if (item.reply == "" && ! $scope.check_letter[item.id])
				{
					check = false;
				}
			}
			
			$scope.check_all[0] = check;
		};
		
		$scope.count_letters = function() {
			var count = 0;
			for (var key in $scope.check_letter)
			{
				if ($scope.check_letter[key])
				{
					count++;
				}
			}
			
			return count > 0 && $scope.filter == 'positive';
		};
		
		$scope.bulk_modal = function() {
			var modalInstance;
			modalInstance = $modal.open({
				templateUrl: "bulk.html",
				controller: 'ModalInstanceBulkCtrl',
				resolve: {
					items: function() {
						return {user: $scope.user};
					}
				}
			});
			
			modalInstance.result.then((function(items) {
				$http.post("/pub/send_bulk_reply/", {letter: items.letter, first: items.first, subject: items.subject, letters: $scope.check_letter}).success(function(data, status, headers, config) {
					logger.check(data);
				});
			}), function() {
				console.log("Modal dismissed at: " + new Date());
			});
		};


		$scope.today = function(type) {
			$scope.dates = {};
			return $scope.dates[type] = new Date();
		};

		$scope.showWeeks = true;
		$scope.clear = function(type) {
			$scope.dates[type] = null;
		};

		$scope.disabled = function(date, mode) {
			mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
		};

		$scope.open_date = function($event, type) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope['opened_' + type] = true;
		};

		$scope.dateOptions = {
			'year-format': "'yy'",
			'starting-day': 1
		};

		$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
		$scope.format = $scope.formats[0];

		$scope.date_change = function()
		{
			$scope.this_page = 1;
			$scope.reprint();
		};
		
		$scope.all_pages = 0;
		$scope.visible = 2;
		$scope.pages = function()
		{
			var begin = $scope.this_page - $scope.visible;
			var end = $scope.this_page + $scope.visible;
			$scope.all_pages = Math.ceil($scope.count / $scope.on_page);
			if ($scope.all_pages <= ($scope.visible * 2 + 1))
			{
				begin = 1;
				end = $scope.all_pages;
			}
			else
			{
				if (begin < 1)
				{
					end += (1 - begin);
					begin = 1;
				}
				
				if (end > $scope.all_pages)
				{
					begin -= (end - $scope.all_pages);
					end = $scope.all_pages;
				}
			}

			var array = [];
			for (var i = begin; i <= end; i++)
			{
				array.push(i);
			}
			return array;
		};
    }
})();
;
(function () {
    'use strict';

    angular.module('app')
        .controller('ComposeCtrl', [ '$scope', '$rootScope', '$window', '$http', '$location', '$modal', 'logger', 'Upload', '$timeout', ComposeCtrl]); // overall control

    function ComposeCtrl($scope, $rootScope, $window, $http, $location, $modal, logger, Upload, $timeout) {
		$scope.step = 0;
		$scope.status = 0;
		$scope.compose_type = 'upload';
		$scope.paste_rows = '';
		$scope.first_upload = true;
		$scope.all_finished = false;
		$scope.too_long_time = false;
		$scope.too_long_text = 'Uw patiëntenbestand wordt verwerkt.';
		
		$timeout(function() {
			$scope.first_upload = $scope.user.first_upload;
		}, 500);
		
		$scope.compose_next = function() {
			$scope.step++;
			$scope.define_doctors();
		};
		
		$scope.compose_prev = function() {
			$scope.step--;
			$scope.define_doctors();
		};
		
		$scope.too_long = function() {
			$scope.too_long_time = true;
			$timeout(function() {
				$scope.too_long_text = 'Het uploaden van grote bestanden duurt wat langer...';
				$scope.too_long_time = false;
			}, 400);
		};
		
		$scope.upload_timer = 0;
		$scope.uploadFile = function(file) {
			$scope.status = 1;
			$scope.timer = 0;
			file.progress = 0;
			$scope.result = [];
			
			$scope.upload_timer = setTimeout(function() {
				$scope.too_long();
			}, 10000);
			
			file.upload = Upload.upload({
				url: '/pub/upload/',
				data: {file: file}
			});

			file.upload.then(function (response)
			{
				$timeout(function () {
					file.result = response.data;
					file.progress = 100;
					clearInterval($scope.timer);

					$scope.result = logger.check(file.result);
					if ($scope.result.error)
					{
						file.progress = 100;
						$scope.status = 3;
					}
					else
					{
						$timeout(function() {
							file.progress = 100;
							$scope.status = 2;
						}, 1100);
						
						$scope.print($scope.result);
						if ($scope.first_upload)
						{
							$scope.first_upload_modal();
						}
					}
				});
			}, function (response)
			{
				if (response.status > 0)
				{
					file.progress = 100;
					$scope.status = 3;
				}
			}, function (evt)
			{
				file.progress = Math.ceil(Math.min(100, parseInt(100.0 * evt.loaded / evt.total)) / 2);
				if (file.progress >= 50 && file.progress < 95)
				{
					$scope.timer = setInterval(function() {
						if (file.progress <= 98)
						{
							file.progress += 2;
						}
					}, 300);
				}
			});
		};
		
		$scope.parse_paste = function() {
			if ($scope.paste_rows != '')
			{
				$http.post("/pub/parse_paste/", {'text': $scope.paste_rows}).success(function(data, status, headers, config) {
					$scope.result = logger.check(data)
					if ($scope.result.error)
					{
						$scope.status = 3;
					}
					else
					{
						$scope.status = 2;
						$scope.print($scope.result);
					}
				});
			}
		};
		
		$scope.page = 1;
		$scope.pages = 0;
		$scope.on_page = 30;
		
		$scope.column = {};
		$scope.headers = {};
		$scope.keys = [];
		$scope.data = [];
		$scope.all_data = [];
		$scope.cols = [];
		$scope.dont_use = [];
		$scope.empty = false;
		$scope.check = true;
		$scope.file = false;
		$scope.checked_columns = {};
		$scope.print = function(result) {
			$scope.dont_use = result.dont_use;
			$scope.column = result.cols_check;
			$scope.headers = result.headers;
			$scope.all_data = result.data;
			$scope.cols = result.cols;
			$scope.empty = result.empty;
			$scope.check = result.check;
			$scope.file = result.file;

			if ($scope.headers)
			{
				$scope.keys = Object.keys($scope.headers);
				if ($scope.all_data && $scope.all_data.length)
				{
					$scope.reprint_rows();
				}
			}
		};
		
		$scope.rows_shown = 0;
		$scope.rows_all = 0;
		$scope.doctors = [];
		$scope.unknown_doctors = [];
		$scope.locations = [];
		$scope.unknown_locations = [];
		$scope.treatments = [];
		$scope.unknown_treatments = [];
		$scope.reprint_rows = function()
		{
			$scope.unknown_doctors = [];
			$scope.unknown_locations = [];
			$scope.unknown_treatments = [];
			$scope.data = [];
			$scope.send_emails = [];
			$scope.rows_all = $scope.all_data.length;
			$scope.all_data.sort(function(a, b) { return a.sname > b.sname ? 1 : (b.sname > a.sname ? -1 : 0)});
			$scope.all_data.sort(function(a, b) { return b.error - a.error});
			for (var key in $scope.all_data)
			{
				if ($scope.all_data[key].error < 1)
				{
					$scope.all_data[key].text = $scope.all_data[key].email;
					$scope.send_emails.push($scope.all_data[key]);
				}

				if ($scope.all_data[key].doctor != '' && $scope.all_data[key].doctor_id == 0)
				{
					var check = true;
					for (var i in $scope.unknown_doctors)
					{
						if ($scope.all_data[key].doctor == $scope.unknown_doctors[i])
						{
							check = false;
						}
					}
					
					if (check)
					{
						$scope.unknown_doctors.push($scope.all_data[key].doctor);
					}
				}
				
				if ($scope.all_data[key].location != '' && $scope.all_data[key].location_id == 0)
				{
					var check = true;
					for (var i in $scope.unknown_locations)
					{
						if ($scope.all_data[key].location == $scope.unknown_locations[i])
						{
							check = false;
						}
					}
					
					if (check)
					{
						$scope.unknown_locations.push($scope.all_data[key].location);
					}
				}
				
				if ($scope.all_data[key].treatment != '' && $scope.all_data[key].treatment_id == 0)
				{
					var check = true;
					for (var i in $scope.unknown_treatments)
					{
						if ($scope.all_data[key].treatment == $scope.unknown_treatments[i])
						{
							check = false;
						}
					}
					
					if (check)
					{
						$scope.unknown_treatments.push($scope.all_data[key].treatment);
					}
				}
				
				if ($scope.warnings || ( ! $scope.warnings && $scope.all_data[key].error == 0))
				{
					$scope.data.push($scope.all_data[key]);
				}
			}
			
			$scope.pages = Math.ceil($scope.data.length / $scope.on_page);
			$scope.change_page(1);
			
			$scope.define_doctors();
		};
		
		$scope.first_upload_modal = function()
		{
			var modalInstance;
			modalInstance = $modal.open({
				templateUrl: 'first_upload.html',
				controller: 'ModalFirstUploadCtrl',
				resolve: {
					items: function() {
						return [];
					}
				}
			});

			modalInstance.result.then((function(result) {
				if (result == 'ignore')
				{
					$scope.first_upload = false;
				}
				else
				{
					$http.post("/pub/upload_help/", {file: $scope.file}).success(function(data, status, headers, config) {
						logger.check(data);
						$location.url("/dashboard");
					});
				}
			}), function() {
				console.log("Modal dismissed at: " + new Date());
			});
		};
		
		$scope.define_doctors = function()
		{
			if ($scope.step == 1)
			{
				if ($scope.unknown_doctors.length)
				{
					$http.post("/pub/get_doctors/", {}).success(function(data, status, headers, config) {
						$scope.doctors = logger.check(data);
						
						var modalInstance;
						modalInstance = $modal.open({
							templateUrl: 'define_doctors.html',
							controller: 'ModalDefineDoctorsCtrl',
							resolve: {
								items: function() {
									return [$scope.doctors, $scope.unknown_doctors];
								}
							}
						});

						modalInstance.result.then((function(ids) {
							$http.post("/pub/save_doctors_ids/", {ids: ids, file: $scope.file}).success(function(data, status, headers, config) {
								$scope.result = logger.check(data);
								if ($scope.result.data && $scope.result.data.length)
								{
									$scope.result.data.sort(function(a, b) { return b.error - a.error});
									$scope.print($scope.result);
								}
							});
						}), function() {
							console.log("Modal dismissed at: " + new Date());
						});
					});
				}
				else
				{
					$scope.define_locations();
				}
			}
		};
		
		$scope.define_locations = function()
		{
			if ($scope.unknown_locations.length)
			{
				$http.post("/pub/get_locations/", {}).success(function(data, status, headers, config) {
					$scope.locations = logger.check(data);
					
					var modalInstance;
					modalInstance = $modal.open({
						templateUrl: 'define_locations.html',
						controller: 'ModalDefineLocationsCtrl',
						resolve: {
							items: function() {
								return [$scope.locations, $scope.unknown_locations];
							}
						}
					});

					modalInstance.result.then((function(ids) {
						$http.post("/pub/save_locations_ids/", {ids: ids, file: $scope.file}).success(function(data, status, headers, config) {
							$scope.result = logger.check(data);
							if ($scope.result.data && $scope.result.data.length)
							{
								$scope.result.data.sort(function(a, b) { return b.error - a.error});
								$scope.print($scope.result);
							}
						});
					}), function() {
						console.log("Modal dismissed at: " + new Date());
					});
				});
			}
			else
			{
				$scope.define_treatments();
			}
		};
		
		$scope.define_treatments = function()
		{
			if ($scope.unknown_treatments.length)
			{
				$http.post("/pub/get_treatments/", {}).success(function(data, status, headers, config) {
					$scope.treatments = logger.check(data);
					
					var modalInstance;
					modalInstance = $modal.open({
						templateUrl: 'define_treatments.html',
						controller: 'ModalDefineTreatmentsCtrl',
						resolve: {
							items: function() {
								return [$scope.treatments, $scope.unknown_treatments];
							}
						}
					});

					modalInstance.result.then((function(ids) {
						$http.post("/pub/save_treatments_ids/", {ids: ids, file: $scope.file}).success(function(data, status, headers, config) {
							$scope.result = logger.check(data);
							if ($scope.result.data && $scope.result.data.length)
							{
								$scope.result.data.sort(function(a, b) { return b.error - a.error});
								$scope.print($scope.result);
							}
						});
					}), function() {
						console.log("Modal dismissed at: " + new Date());
					});
				});
			}
		};
		
		$scope.page_data = [];
		$scope.change_page = function(page) {
			$scope.page = page;
			var start = ($scope.page - 1) * $scope.on_page;
			var end = start + $scope.on_page;
			$scope.page_data = $scope.data.slice(start, end);
			$scope.rows_shown = $scope.page_data.length;
		};
		
		$scope.get_array = function(num) {
			var result = [];
			var delta = 2;
			
			var start = $scope.page - delta;
			var end = $scope.page + delta;
			if (start < 1)
			{
				end = end - start + 1;
				start = 1;
			}
			
			if (end > num)
			{
				start = start - (end - num);
				if (start < 1)
				{
					start = 1;
				}
				end = num;
			}
			
			for (var i = start; i <= end; i++)
			{
				result.push(i);
			}
			return result;
		};

		$scope.save_col = function(field) {
			$http.post("/pub/save_field/", {file: $scope.file, field: field, value: $scope.column[field]}).success(function(data, status, headers, config) {
				$scope.result = logger.check(data);
				if ($scope.result.data && $scope.result.data.length)
				{
					$scope.result.data.sort(function(a, b) { return b.error - a.error});
					$scope.print($scope.result);
				}
			});
		};
		
		$scope.send_emails = [];
		$scope.send = function()
		{
			if ($scope.send_emails.length)
			{
				$http.post("/pub/send/", {emails: $scope.send_emails, column: $scope.column, file: $scope.file}).success(function(data, status, headers, config) {
					logger.check(data);
					//$location.url("/mail/inbox");
					$scope.all_finished = true;
				});
			}
			else
			{
				logger.check({errors: [['U heeft geen e-mailadres ingevuld.']]});
			}
		};
		
		$scope.help = function() {
			var modalInstance;
			modalInstance = $modal.open({
				templateUrl: 'help_upload.html',
				controller: 'ModalInstanceHelpCtrl',
				resolve: {
					items: function() {
						return [];
					}
				}
			});

			modalInstance.result.then((function(result) {
                $http.post("/pub/upload_help/", {file: $scope.file}).success(function(data, status, headers, config) {
					logger.check(data);
					$location.url("/dashboard");
				});
            }), function() {
                console.log("Modal dismissed at: " + new Date());
            });
		};
		
		$scope.warnings = false;
		$scope.show_warnings = function() {
			$scope.warnings = ! $scope.warnings;
			
			$scope.reprint_rows();
		};
		
		$scope._data = {};
		$scope.get_email = function() {
			$http.post("/pub/stat_chart2/", {'filter': ''}).success(function(data, status, headers, config) {
				$scope._data = logger.check(data);
			});
		}
		$scope.get_email();
	}
})();
;
(function () {
    'use strict';

    angular.module('app')
        .controller('SingleCtrl', [ '$scope', '$rootScope', '$window', '$http', '$location', '$modal', 'logger', SingleCtrl]); // overall control

    function SingleCtrl($scope, $rootScope, $window, $http, $location, $modal, logger) {
		$scope.id = false;
		$scope.info = {};
		$scope.words = ['Geen reactie', '1 ster', '2 sterren', '3 sterren', '4 sterren', '5 sterren'];

		$scope.init = function(id)
		{
			$scope.id = id;
			if ($scope.id)
			{
				$scope.feedback_info();
			}
		};
		
		$scope.feedback_info = function() {
			$http.post("/pub/feedback_info/", {id: $scope.id}).success(function(data, status, headers, config) {
				$scope.result = logger.check(data);
				if ($scope.result)
				{
					$scope.info = $scope.result;
					$scope.info.feedback = $scope.info.feedback.replace(/\n/gi, "<br />");
					$scope.info.reply = $scope.info.reply.replace(/\n/gi, "<br />");
				}
			});
		};
		
		$scope.range = function(num)
		{
			var array = [];
			for (var i = 0; i < num; i++)
			{
				array.push(i);
			}
			return array;
		};
		
		$scope.reply = '';
		$scope.send_reply = function()
		{
			$http.post("/pub/send_reply/", {id: $scope.id, reply: $scope.reply}).success(function(data, status, headers, config) {
				logger.check(data);
				$scope.info.reply = $scope.reply.replace(/\n/gi, "<br />");
			});
		};
    }
})();
;
(function () {
    'use strict'

    angular.module('app.localization', [])
        .factory('localize', ['$http', '$rootScope', '$window', localize])
        .filter('i18n', ['localize', i18nFilter])
        .directive('i18n', ['localize', i18nDirective])
        .controller('LangCtrl', ['$scope', 'localize', LangCtrl]);


    // English, Español, 日本語, 中文, Deutsch, français, Italiano, Portugal, Русский язык, 한국어
    // English:          EN-US
    // Spanish:          Español ES-ES
    // Japanese:         日本語 JA-JP
    // Chinese:          简体中文 ZH-CN
    // Chinese:          繁体中文 ZH-TW
    // German:           Deutsch DE-DE
    // French:           français FR-FR
    // Italian:          Italiano IT-IT
    // Portugal:         Portugal PT-BR
    // Russian:          Русский язык RU-RU
    // Korean:           한국어 KO-KR

    // thanks for the icons: https://www.iconfinder.com/search/?q=iconset%3Aflags_gosquared

    function localize($http, $rootScope, $window) {
        var localize;

        localize = {
            language: '',
            url: void 0,
            resourceFileLoaded: false,
            successCallback: function(data) {
                localize.dictionary = data;
                localize.resourceFileLoaded = true;
                return $rootScope.$broadcast('localizeResourcesUpdated');
            },
            setLanguage: function(value) {
                localize.language = value.toLowerCase().split("-")[0];
                return localize.initLocalizedResources();
            },
            setUrl: function(value) {
                localize.url = value;
                return localize.initLocalizedResources();
            },
            buildUrl: function() {
                if (!localize.language) {
                    localize.language = ($window.navigator.userLanguage || $window.navigator.language).toLowerCase();
                    localize.language = localize.language.split("-")[0];
                }
                return 'i18n/resources-locale_' + localize.language + '.js';
            },
            initLocalizedResources: function() {
                var url;
                url = localize.url || localize.buildUrl();
                return $http({
                    method: "GET",
                    url: url,
                    cache: false
                }).success(localize.successCallback).error(function() {
                    return $rootScope.$broadcast('localizeResourcesUpdated');
                });
            },
            getLocalizedString: function(value) {
                var result, valueLowerCase;
                result = void 0;
                if (localize.dictionary && value) {
                    valueLowerCase = value.toLowerCase();
                    if (localize.dictionary[valueLowerCase] === '') {
                        result = value;
                    } else {
                        result = localize.dictionary[valueLowerCase];
                    }
                } else {
                    result = value;
                }
                return result;
            }
        };

        return localize;

    }

    // Note: filter will be called on and on, so directive is preferred
    function i18nFilter(localize) {
        return function(input) {
            return localize.getLocalizedString(input);
        };
    }

    function i18nDirective(localize) {
        var i18nDirective;

        i18nDirective = {
            restrict: "EA",
            updateText: function(ele, input, placeholder) {
                var result;
                result = void 0;
                if (input === 'i18n-placeholder') {
                    result = localize.getLocalizedString(placeholder);
                    return ele.attr('placeholder', result);
                } else if (input.length >= 1) {
                    result = localize.getLocalizedString(input);
                    return ele.text(result);
                }
            },
            link: function(scope, ele, attrs) {
                scope.$on('localizeResourcesUpdated', function() {
                    return i18nDirective.updateText(ele, attrs.i18n, attrs.placeholder);
                });
                return attrs.$observe('i18n', function(value) {
                    return i18nDirective.updateText(ele, value, attrs.placeholder);
                });
            }
        };

        return i18nDirective;
    }

    function LangCtrl($scope, localize) {
        $scope.lang = 'English';

        $scope.setLang = function(lang) {
            switch (lang) {
                case 'English':
                    localize.setLanguage('EN-US');
                    break;
                case 'Español':
                    localize.setLanguage('ES-ES');
                    break;
                case '日本語':
                    localize.setLanguage('JA-JP');
                    break;
                case '中文':
                    localize.setLanguage('ZH-TW');
                    break;
                case 'Deutsch':
                    localize.setLanguage('DE-DE');
                    break;
                case 'français':
                    localize.setLanguage('FR-FR');
                    break;
                case 'Italiano':
                    localize.setLanguage('IT-IT');
                    break;
                case 'Portugal':
                    localize.setLanguage('PT-BR');
                    break;
                case 'Русский язык':
                    localize.setLanguage('RU-RU');
                    break;
                case '한국어':
                    localize.setLanguage('KO-KR');
            }
            return $scope.lang = lang;
        };

        $scope.getFlag = function() {
            var lang;
            lang = $scope.lang;
            switch (lang) {
                case 'English':
                    return 'flags-american';
                case 'Español':
                    return 'flags-spain';
                case '日本語':
                    return 'flags-japan';
                case '中文':
                    return 'flags-china';
                case 'Deutsch':
                    return 'flags-germany';
                case 'français':
                    return 'flags-france';
                case 'Italiano':
                    return 'flags-italy';
                case 'Portugal':
                    return 'flags-portugal';
                case 'Русский язык':
                    return 'flags-russia';
                case '한국어':
                    return 'flags-korea';
            }
        };

    }

})();
;
(function () {
    'use strict';

    angular.module('app.chart', []);
})();
;
(function () {
    'use strict';

    angular.module('app.chart')
        .controller('chartCtrl', ['$scope', chartCtrl])
        .controller('flotChartCtrl', ['$scope', flotChartCtrl])
        .controller('sparklineCtrl', ['$scope', sparklineCtrl]);

    function chartCtrl($scope) {
        $scope.easypiechartsm1 = {
            percent: 63,
            options: {
                animate: {
                    duration: 1000,
                    enabled: false
                },
                barColor: $scope.color.success,
                lineCap: 'round',
                size: 120,
                lineWidth: 5
            }
        };

        $scope.easypiechartsm2 = {
            percent: 35,
            options: {
                animate: {
                    duration: 1000,
                    enabled: false
                },
                barColor: $scope.color.info,
                lineCap: 'round',
                size: 120,
                lineWidth: 5
            }
        };

        $scope.easypiechartsm3 = {
            percent: 75,
            options: {
                animate: {
                    duration: 1000,
                    enabled: false
                },
                barColor: $scope.color.warning,
                lineCap: 'round',
                size: 120,
                lineWidth: 5
            }
        };

        $scope.easypiechartsm4 = {
            percent: 66,
            options: {
                animate: {
                    duration: 1000,
                    enabled: false
                },
                barColor: $scope.color.danger,
                lineCap: 'round',
                size: 120,
                lineWidth: 5
            }
        };

        $scope.easypiechart = {
            percent: 65,
            options: {
                animate: {
                    duration: 1000,
                    enabled: true
                },
                barColor: $scope.color.primary,
                lineCap: 'round',
                size: 180,
                lineWidth: 5
            }
        };

        $scope.easypiechart2 = {
            percent: 35,
            options: {
                animate: {
                    duration: 1000,
                    enabled: true
                },
                barColor: $scope.color.success,
                lineCap: 'round',
                size: 180,
                lineWidth: 10
            }
        };

        $scope.easypiechart3 = {
            percent: 68,
            options: {
                animate: {
                    duration: 1000,
                    enabled: true
                },
                barColor: $scope.color.info,
                lineCap: 'square',
                size: 180,
                lineWidth: 20,
                scaleLength: 0
            }
        };
    }

    function flotChartCtrl($scope) {
        var areaChart, barChart, barChartH, lineChart1, sampledata1, sampledata2;

        lineChart1 = {};

        lineChart1.data1 = [[1, 15], [2, 20], [3, 14], [4, 10], [5, 10], [6, 20], [7, 28], [8, 26], [9, 22]];

        $scope.line1 = {};

        $scope.line1.data = [
            {
                data: lineChart1.data1,
                label: 'Trend'
            }
        ];

        $scope.line1.options = {
            series: {
                lines: {
                    show: true,
                    fill: true,
                    fillColor: {
                        colors: [
                            {
                                opacity: 0
                            }, {
                                opacity: 0.3
                            }
                        ]
                    }
                },
                points: {
                    show: true,
                    lineWidth: 2,
                    fill: true,
                    fillColor: "#ffffff",
                    symbol: "circle",
                    radius: 5
                }
            },
            colors: [$scope.color.primary, $scope.color.infoAlt],
            tooltip: true,
            tooltipOpts: {
                defaultTheme: false
            },
            grid: {
                hoverable: true,
                clickable: true,
                tickColor: "#f9f9f9",
                borderWidth: 1,
                borderColor: "#eeeeee"
            },
            xaxis: {
                ticks: [[1, 'Jan.'], [2, 'Feb.'], [3, 'Mar.'], [4, 'Apr.'], [5, 'May'], [6, 'June'], [7, 'July'], [8, 'Aug.'], [9, 'Sept.'], [10, 'Oct.'], [11, 'Nov.'], [12, 'Dec.']]
            }
        };

        areaChart = {};

        areaChart.data1 = [[2007, 15], [2008, 20], [2009, 10], [2010, 5], [2011, 5], [2012, 20], [2013, 28]];

        areaChart.data2 = [[2007, 15], [2008, 16], [2009, 22], [2010, 14], [2011, 12], [2012, 19], [2013, 22]];

        $scope.area = {};

        $scope.area.data = [
            {
                data: areaChart.data1,
                label: "Value A",
                lines: {
                    fill: true
                }
            }, {
                data: areaChart.data2,
                label: "Value B",
                points: {
                    show: true
                },
                yaxis: 2
            }
        ];

        $scope.area.options = {
            series: {
                lines: {
                    show: true,
                    fill: false
                },
                points: {
                    show: true,
                    lineWidth: 2,
                    fill: true,
                    fillColor: "#ffffff",
                    symbol: "circle",
                    radius: 5
                },
                shadowSize: 0
            },
            grid: {
                hoverable: true,
                clickable: true,
                tickColor: "#f9f9f9",
                borderWidth: 1,
                borderColor: "#eeeeee"
            },
            colors: [$scope.color.success, $scope.color.danger],
            tooltip: true,
            tooltipOpts: {
                defaultTheme: false
            },
            xaxis: {
                mode: "time"
            },
            yaxes: [
                {}, {
                    position: "right"
                }
            ]
        };

        sampledata1 = [[1, 65], [2, 59], [3, 90], [4, 81], [5, 56], [6, 55], [7, 68], [8, 45], [9, 66]];

        sampledata2 = [[1, 28], [2, 48], [3, 30], [4, 60], [5, 100], [6, 50], [7, 10], [8, 25], [9, 50]];

        $scope.area1 = {};

        $scope.area1.data = [
            {
                label: " A",
                data: sampledata1,
                bars: {
                    order: 0,
                    fillColor: {
                        colors: [
                            {
                                opacity: 0.3
                            }, {
                                opacity: 0.3
                            }
                        ]
                    },
                    show: true,
                    fill: 1,
                    barWidth: 0.3,
                    align: "center",
                    horizontal: false
                }
            }, {
                data: sampledata2,
                curvedLines: {
                    apply: true
                },
                lines: {
                    show: true,
                    fill: true,
                    fillColor: {
                        colors: [
                            {
                                opacity: 0.2
                            }, {
                                opacity: 0.2
                            }
                        ]
                    }
                }
            }, {
                data: sampledata2,
                label: "D",
                points: {
                    show: true
                }
            }
        ];

        $scope.area1.options = {
            series: {
                curvedLines: {
                    active: true
                },
                points: {
                    lineWidth: 2,
                    fill: true,
                    fillColor: "#ffffff",
                    symbol: "circle",
                    radius: 4
                }
            },
            grid: {
                hoverable: true,
                clickable: true,
                tickColor: "#f9f9f9",
                borderWidth: 1,
                borderColor: "#eeeeee"
            },
            tooltip: true,
            tooltipOpts: {
                defaultTheme: false
            },
            colors: [$scope.color.gray, $scope.color.primary, $scope.color.primary]
        };

        barChart = {};

        barChart.data1 = [[2008, 20], [2009, 10], [2010, 5], [2011, 5], [2012, 20], [2013, 28]];

        barChart.data2 = [[2008, 16], [2009, 22], [2010, 14], [2011, 12], [2012, 19], [2013, 22]];

        barChart.data3 = [[2008, 12], [2009, 30], [2010, 20], [2011, 19], [2012, 13], [2013, 20]];

        $scope.barChart = {};

        $scope.barChart.data = [
            {
                label: "Value A",
                data: barChart.data1
            }, {
                label: "Value B",
                data: barChart.data2
            }, {
                label: "Value C",
                data: barChart.data3
            }
        ];

        $scope.barChart.options = {
            series: {
                stack: true,
                bars: {
                    show: true,
                    fill: 1,
                    barWidth: 0.3,
                    align: "center",
                    horizontal: false,
                    order: 1
                }
            },
            grid: {
                hoverable: true,
                borderWidth: 1,
                borderColor: "#eeeeee"
            },
            tooltip: true,
            tooltipOpts: {
                defaultTheme: false
            },
            colors: [$scope.color.success, $scope.color.info, $scope.color.warning, $scope.color.danger]
        };

        $scope.barChart1 = {};

        $scope.barChart1.data = [
            {
                label: "Value A",
                data: barChart.data1,
                bars: {
                    order: 0
                }
            }, {
                label: "Value B",
                data: barChart.data2,
                bars: {
                    order: 1
                }
            }, {
                label: "Value C",
                data: barChart.data3,
                bars: {
                    order: 2
                }
            }
        ];

        $scope.barChart1.options = {
            series: {
                stack: true,
                bars: {
                    show: true,
                    fill: 1,
                    barWidth: 0.2,
                    align: "center",
                    horizontal: false
                }
            },
            grid: {
                hoverable: true,
                borderWidth: 1,
                borderColor: "#eeeeee"
            },
            tooltip: true,
            tooltipOpts: {
                defaultTheme: false
            },
            colors: [$scope.color.success, $scope.color.info, $scope.color.warning, $scope.color.danger]
        };

        $scope.barChart3 = {};

        $scope.barChart3.data = [
            {
                label: " A",
                data: [[40, 1], [59, 2], [90, 3], [81, 4], [56, 5]],
                bars: {
                    order: 0,
                    fillColor: {
                        colors: [
                            {
                                opacity: 0.3
                            }, {
                                opacity: 0.3
                            }
                        ]
                    }
                }
            }, {
                label: " B",
                data: [[28, 1], [48, 2], [40, 3], [19, 4], [45, 5]],
                bars: {
                    order: 1,
                    fillColor: {
                        colors: [
                            {
                                opacity: 0.3
                            }, {
                                opacity: 0.3
                            }
                        ]
                    }
                }
            }
        ];

        $scope.barChart3.options = {
            series: {
                stack: true,
                bars: {
                    show: true,
                    fill: 1,
                    barWidth: .35,
                    align: "center",
                    horizontal: true
                }
            },
            grid: {
                show: true,
                aboveData: false,
                color: '#eaeaea',
                hoverable: true,
                borderWidth: 1,
                borderColor: "#eaeaea"
            },
            tooltip: true,
            tooltipOpts: {
                defaultTheme: false
            },
            colors: [$scope.color.gray, $scope.color.primary, $scope.color.info, $scope.color.danger]
        };

        barChartH = {};

        barChartH.data1 = [[85, 10], [50, 20], [55, 30]];

        barChartH.data2 = [[77, 10], [60, 20], [70, 30]];

        barChartH.data3 = [[100, 10], [70, 20], [55, 30]];

        $scope.barChart2 = {};

        $scope.barChart2.data = [
            {
                label: "Value A",
                data: barChartH.data1,
                bars: {
                    order: 1
                }
            }, {
                label: "Value B",
                data: barChartH.data2,
                bars: {
                    order: 2
                }
            }, {
                label: "Value C",
                data: barChartH.data3,
                bars: {
                    order: 3
                }
            }
        ];

        $scope.barChart2.options = {
            series: {
                stack: true,
                bars: {
                    show: true,
                    fill: 1,
                    barWidth: 1,
                    align: "center",
                    horizontal: true
                }
            },
            grid: {
                hoverable: true,
                borderWidth: 1,
                borderColor: "#eeeeee"
            },
            tooltip: true,
            tooltipOpts: {
                defaultTheme: false
            },
            colors: [$scope.color.success, $scope.color.info, $scope.color.warning, $scope.color.danger]
        };

        $scope.pieChart = {};

        $scope.pieChart.data = [
            {
                label: "Download Sales",
                data: 12
            }, {
                label: "In-Store Sales",
                data: 30
            }, {
                label: "Mail-Order Sales",
                data: 20
            }, {
                label: "Online Sales",
                data: 19
            }
        ];

        $scope.pieChart.options = {
            series: {
                pie: {
                    show: true
                }
            },
            legend: {
                show: true
            },
            grid: {
                hoverable: true,
                clickable: true
            },
            colors: [$scope.color.primary, $scope.color.success, $scope.color.info, $scope.color.warning, $scope.color.danger],
            tooltip: true,
            tooltipOpts: {
                content: "%p.0%, %s",
                defaultTheme: false
            }
        };

        $scope.donutChart = {};

        $scope.donutChart.data = [
            {
                label: "Download Sales",
                data: 12
            }, {
                label: "In-Store Sales",
                data: 30
            }, {
                label: "Mail-Order Sales",
                data: 20
            }, {
                label: "Online Sales",
                data: 19
            }
        ];

        $scope.donutChart.options = {
            series: {
                pie: {
                    show: true,
                    innerRadius: 0.5
                }
            },
            legend: {
                show: true
            },
            grid: {
                hoverable: true,
                clickable: true
            },
            colors: [$scope.color.primary, $scope.color.success, $scope.color.info, $scope.color.warning, $scope.color.danger],
            tooltip: true,
            tooltipOpts: {
                content: "%p.0%, %s",
                defaultTheme: false
            }
        };

        $scope.donutChart2 = {};

        $scope.donutChart2.data = [
            {
                label: "1 ster",
                data: 12
            }, {
                label: "2 sterren",
                data: 20
            }, {
                label: "3 sterren",
                data: 20
            }, {
                label: "4 sterren",
                data: 19
            }, {
                label: "5 sterren",
                data: 15
            }, {
                label: "Geen reactie",
                data: 10
            }
        ];

        $scope.donutChart2.options = {
            series: {
                pie: {
                    show: true,
                    innerRadius: 0.45
                }
            },
            legend: {
                show: false
            },
            grid: {
                hoverable: true,
                clickable: true
            },
            colors: ["#1BB7A0", "#39B5B9", "#52A3BB", "#619CC4", "#6D90C5"],
            tooltip: true,
            tooltipOpts: {
                content: "%p.0%, %s",
                defaultTheme: false
            }
        };
    }

    function sparklineCtrl($scope) {
        $scope.demoData1 = {
            data: [3, 1, 2, 2, 4, 6, 4, 5, 2, 4, 5, 3, 4, 6, 4, 7],
            options: {
                type: 'line',
                lineColor: '#fff',
                highlightLineColor: '#fff',
                fillColor: $scope.color.success,
                spotColor: false,
                minSpotColor: false,
                maxSpotColor: false,
                width: '100%',
                height: '150px'
            }
        };

        $scope.simpleChart1 = {
            data: [3, 1, 2, 3, 5, 3, 4, 2],
            options: {
                type: 'line',
                lineColor: $scope.color.primary,
                fillColor: '#fafafa',
                spotColor: false,
                minSpotColor: false,
                maxSpotColor: false
            }
        };

        $scope.simpleChart2 = {
            data: [3, 1, 2, 3, 5, 3, 4, 2],
            options: {
                type: 'bar',
                barColor: $scope.color.primary
            }
        };

        $scope.simpleChart3 = {
            data: [3, 1, 2, 3, 5, 3, 4, 2],
            options: {
                type: 'pie',
                sliceColors: [$scope.color.primary, $scope.color.success, $scope.color.info, $scope.color.infoAlt, $scope.color.warning, $scope.color.danger]
            }
        };

        $scope.tristateChart1 = {
            data: [1, 2, -3, -5, 3, 1, -4, 2],
            options: {
                type: 'tristate',
                posBarColor: $scope.color.success,
                negBarColor: $scope.color.danger
            }
        };

        $scope.largeChart1 = {
            data: [3, 1, 2, 3, 5, 3, 4, 2],
            options: {
                type: 'line',
                lineColor: $scope.color.info,
                highlightLineColor: '#fff',
                fillColor: $scope.color.info,
                spotColor: false,
                minSpotColor: false,
                maxSpotColor: false,
                width: '100%',
                height: '190px'
            }
        };

        $scope.largeChart2 = {
            data: [3, 1, 2, 3, 5, 3, 4, 2],
            options: {
                type: 'bar',
                barColor: $scope.color.success,
                barWidth: 10,
                width: '100%',
                height: '150px'
            }
        };

        $scope.largeChart3 = {
            data: [3, 1, 2, 3, 5],
            options: {
                type: 'pie',
                sliceColors: [$scope.color.primary, $scope.color.success, $scope.color.info, $scope.color.infoAlt, $scope.color.warning, $scope.color.danger],
                width: '150px',
                height: '150px'
            }
        };
    }


})();
;
(function () {
    'use strict';

    angular.module('app.chart')
        .directive('flotChart', flotChart)
        .directive('flotChartRealtime', flotChartRealtime)
        .directive('sparkline', sparkline);

    function flotChart() {
        var directive = {
            restrict: 'A',
            scope: {
                data: '=',
                options: '='
            },
            link: link
        };

        return directive;

        function link(scope, ele, attrs) {
            var data, options, plot;
            data = scope.data;
            options = scope.options;

            // console.log data
            // console.log options

            plot = $.plot(ele[0], data, options);
        }
    }

    function flotChartRealtime() {
        var directive = {
            restrict: 'A',
            link: link
        };

        return directive;

        function link(scope, ele, attrs) {
            var data1, data2, getRandomData1, getRandomData2, makeGetRandomData;
            var data, getRandomData, plot, totalPoints, update, updateInterval;

            data1 = [];
            data2 = [];
            totalPoints = 200;
            updateInterval = 200;


            makeGetRandomData = function(data, min, max) {

                function getRandomData() {
                    var i, prev, res, y;
                    if (data.length > 0) {
                        data = data.slice(1);
                    }
                    while (data.length < totalPoints) {
                        prev = (data.length > 0 ? data[data.length - 1] : (min + max)/2);
                        y = prev + Math.random() * 4 - 2;
                        if (y < min) {
                            y = min;
                        } else {
                            if (y > max) {
                                y = max;
                            }
                        }
                        data.push(y);
                    }
                    res = [];
                    i = 0;
                    while (i < data.length) {
                        res.push([i, data[i]]);
                        ++i;
                    }
                    return res;
                }
                return getRandomData;
            }

            getRandomData1 = makeGetRandomData(data1, 28, 42);
            getRandomData2 = makeGetRandomData(data2, 56, 72);


            update = function() {
                plot.setData([getRandomData1(), getRandomData2()]);
                plot.draw();
                setTimeout(update, updateInterval);
            };


            plot = $.plot(ele[0], [getRandomData1(), getRandomData2()], {
                series: {
                    lines: {
                        show: true,
                        fill: true
                    },
                    shadowSize: 0
                },
                yaxis: {
                    min: 0,
                    max: 100
                },
                xaxis: {
                    show: false
                },
                grid: {
                    hoverable: true,
                    borderWidth: 1,
                    borderColor: '#eeeeee'
                },
                colors: ["#5B90BF", "#CCE7FF"]
            });

            update();

        }
    }

    function sparkline() {
        var directive = {
            restrict: 'A',
            scope: {
                data: '=',
                options: '='
            },
            link: link
        };

        return directive;

        function link(scope, ele, attrs) {
            var data, options, sparkResize, sparklineDraw;

            data = scope.data;

            options = scope.options;

            sparkResize = void 0;

            sparklineDraw = function() {
                ele.sparkline(data, options);
            };

            $(window).resize(function(e) {
                clearTimeout(sparkResize);
                sparkResize = setTimeout(sparklineDraw, 200);
            });

            sparklineDraw();
        }
    }

})();
;
(function () {
    'use strict';

    angular.module('app.ui.form', []);
})();
;
(function () {
    'use strict';

    // Dependencies: jQuery, related jQuery plugins

    angular.module('app.ui.form')
        .controller('TagsDemoCtrl', ['$scope', TagsDemoCtrl])
        .controller('DatepickerDemoCtrl', ['$scope', DatepickerDemoCtrl])
        .controller('TimepickerDemoCtrl', ['$scope', TimepickerDemoCtrl])
        .controller('TypeaheadCtrl', ['$scope', TypeaheadCtrl])
        .controller('RatingDemoCtrl', ['$scope', RatingDemoCtrl]);

    function TagsDemoCtrl($scope) {

    }

    function DatepickerDemoCtrl($scope) {
        $scope.today = function() {
            return $scope.dt = new Date();
        };

        $scope.today();

        $scope.showWeeks = true;

        $scope.toggleWeeks = function() {
            $scope.showWeeks = !$scope.showWeeks;
        };

        $scope.clear = function() {
            $scope.dt = null;
        };

        $scope.disabled = function(date, mode) {
            mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        };

        $scope.toggleMin = function() {
            var _ref;
            $scope.minDate = (_ref = $scope.minDate) != null ? _ref : {
                "null": new Date()
            };
        };

        $scope.toggleMin();

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };

        $scope.dateOptions = {
            'year-format': "'yy'",
            'starting-day': 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];

        $scope.format = $scope.formats[0];
    }

    function TimepickerDemoCtrl($scope) {
        $scope.mytime = new Date();

        $scope.hstep = 1;

        $scope.mstep = 15;

        $scope.options = {
            hstep: [1, 2, 3],
            mstep: [1, 5, 10, 15, 25, 30]
        };

        $scope.ismeridian = true;

        $scope.toggleMode = function() {
            return $scope.ismeridian = !$scope.ismeridian;
        };

        $scope.update = function() {
            var d;
            d = new Date();
            d.setHours(14);
            d.setMinutes(0);
            return $scope.mytime = d;
        };

        $scope.changed = function() {
            return console.log('Time changed to: ' + $scope.mytime);
        };

        $scope.clear = function() {
            return $scope.mytime = null;
        };

    }


    function TypeaheadCtrl($scope) {
        $scope.selected = undefined;
        $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    }

    function RatingDemoCtrl($scope) {
        $scope.rate = 7;

        $scope.max = 10;

        $scope.isReadonly = false;

        $scope.hoveringOver = function(value) {
            $scope.overStar = value;
            return $scope.percent = 100 * (value / $scope.max);
        };

        $scope.ratingStates = [
            {
                stateOn: 'glyphicon-ok-sign',
                stateOff: 'glyphicon-ok-circle'
            }, {
                stateOn: 'glyphicon-star',
                stateOff: 'glyphicon-star-empty'
            }, {
                stateOn: 'glyphicon-heart',
                stateOff: 'glyphicon-ban-circle'
            }, {
                stateOn: 'glyphicon-heart'
            }, {
                stateOff: 'glyphicon-off'
            }
        ];

    }

})();
;
(function () {
    'use strict';

    angular.module('app.ui.form')
        .directive('uiRangeSlider', uiRangeSlider)
        .directive('uiFileUpload', uiFileUpload)
        .directive('uiSpinner', uiSpinner)
        .directive('uiWizardForm', uiWizardForm);

    // Dependency: http://www.eyecon.ro/bootstrap-slider/ OR https://github.com/seiyria/bootstrap-slider
    function uiRangeSlider() {
        return {
            restrict: 'A',
            link: function(scope, ele) {
                ele.slider();
            }
        }
    }

    // Dependency: https://github.com/grevory/bootstrap-file-input
    function uiFileUpload() {
        return {
            restrict: 'A',
            link: function(scope, ele) {
                ele.bootstrapFileInput();
            }
        }
    }

    // Dependency: https://github.com/xixilive/jquery-spinner
    function uiSpinner() {
        return {
            restrict: 'A',
            compile: function(ele, attrs) { // link and compile do not work together
                ele.addClass('ui-spinner');
                return {
                    post: function() {
                        ele.spinner();
                    }
                };
            }
            // link: // link and compile do not work together
        }
    }


    // Dependency: https://github.com/rstaib/jquery-steps
    function uiWizardForm() {
        return {
            restrict: 'A',
            link: function(scope, ele) {
                ele.steps()
            }
        }
    }

})();



;
(function () {
    'use strict';

    angular.module('app.ui.form.validation', []);
})();
;
(function () {
    'use strict';

    angular.module('app.ui.form.validation')
        .controller('formConstraintsCtrl', ['$scope', formConstraintsCtrl])
        .controller('signinCtrl', ['$scope', signinCtrl])
        .controller('signupCtrl', ['$scope', signupCtrl]);

    function formConstraintsCtrl($scope) {
        var original;

        $scope.form = {
            required: '',
            minlength: '',
            maxlength: '',
            length_rage: '',
            type_something: '',
            confirm_type: '',
            foo: '',
            email: '',
            url: '',
            num: '',
            minVal: '',
            maxVal: '',
            valRange: '',
            pattern: ''
        };

        original = angular.copy($scope.form);

        $scope.revert = function() {
            $scope.form = angular.copy(original);
            return $scope.form_constraints.$setPristine();
        };

        $scope.canRevert = function() {
            return !angular.equals($scope.form, original) || !$scope.form_constraints.$pristine;
        };

        $scope.canSubmit = function() {
            return $scope.form_constraints.$valid && !angular.equals($scope.form, original);
        };
    }

    function signinCtrl($scope) {
        var original;

        $scope.user = {
            email: '',
            password: ''
        };

        $scope.showInfoOnSubmit = false;

        original = angular.copy($scope.user);

        $scope.revert = function() {
            $scope.user = angular.copy(original);
            return $scope.form_signin.$setPristine();
        };

        $scope.canRevert = function() {
            return !angular.equals($scope.user, original) || !$scope.form_signin.$pristine;
        };

        $scope.canSubmit = function() {
            return $scope.form_signin.$valid && !angular.equals($scope.user, original);
        };

        $scope.submitForm = function() {
            $scope.showInfoOnSubmit = true;
            return $scope.revert();
        };
    }

    function signupCtrl($scope) {
        var original;

        $scope.user = {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            age: ''
        };

        $scope.showInfoOnSubmit = false;

        original = angular.copy($scope.user);

        $scope.revert = function() {
            $scope.user = angular.copy(original);
            $scope.form_signup.$setPristine();
            return $scope.form_signup.confirmPassword.$setPristine();
        };

        $scope.canRevert = function() {
            return !angular.equals($scope.user, original) || !$scope.form_signup.$pristine;
        };

        $scope.canSubmit = function() {
            return $scope.form_signup.$valid && !angular.equals($scope.user, original);
        };

        $scope.submitForm = function() {
            $scope.showInfoOnSubmit = true;
            return $scope.revert();
        };

    }

})();
;
(function () {
    'use strict';

    angular.module('app.ui.form.validation')
        .directive('validateEquals', validateEquals);

    // used for confirm password
    // Note: if you modify the "confirm" input box, and then update the target input box to match it, it'll still show invalid style though the values are the same now
    // Note2: also remember to use " ng-trim='false' " to disable the trim
    function validateEquals() {
        var directive = {
            require: 'ngModel',
            link: link
        };

        return directive;

        function link(scope, ele, attrs, ngModelCtrl) {
            var validateEqual;

            validateEqual = function(value) {
                var valid;
                valid = value === scope.$eval(attrs.validateEquals);
                ngModelCtrl.$setValidity('equal', valid);
                typeof valid === "function" ? valid({
                    value: void 0
                }) : void 0;
            };

            ngModelCtrl.$parsers.push(validateEqual);

            ngModelCtrl.$formatters.push(validateEqual);

            scope.$watch(attrs.validateEquals, function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    ngModelCtrl.$setViewValue(ngModelCtrl.$ViewValue);
                }
            });

        }
    }

})();
;
(function () {
    'use strict';

    angular.module('app.nav', []);

})();
;
(function () {
    'use strict';

    angular.module('app.nav')
        .directive('toggleNavCollapsedMin', ['$rootScope', toggleNavCollapsedMin])
        .directive('collapseNav', collapseNav)
        .directive('highlightActive', highlightActive)
        .directive('toggleOffCanvas', toggleOffCanvas);

    // swtich for mini style NAV, realted to 'collapseNav' directive
    function toggleNavCollapsedMin($rootScope) {
        var directive = {
            restrict: 'A',
            link: link
        };

        return directive;

        function link(scope, ele, attrs) {
            var app;

            app = $('#app');

            ele.on('click', function(e) {
                if (app.hasClass('nav-collapsed-min')) {
                    app.removeClass('nav-collapsed-min');
                } else {
                    app.addClass('nav-collapsed-min');
                    $rootScope.$broadcast('nav:reset');
                }
                return e.preventDefault();
            });
        }
    }

    // for accordion/collapse style NAV
    function collapseNav() {
        var directive = {
            restrict: 'A',
            link: link
        };

        return directive;

        function link(scope, ele, attrs) {
            var $a, $aRest, $app, $lists, $listsRest, $nav, $window, Timer, prevWidth, slideTime, updateClass;

            slideTime = 250;

            $window = $(window);

            $lists = ele.find('ul').parent('li');

            $lists.append('<i class="ti-angle-down icon-has-ul-h"></i><i class="ti-angle-right icon-has-ul"></i>');

            $a = $lists.children('a');

            $listsRest = ele.children('li').not($lists);

            $aRest = $listsRest.children('a');

            $app = $('#app');

            $nav = $('#nav-container');

            $a.on('click', function(event) {
                var $parent, $this;
                if ($app.hasClass('nav-collapsed-min') || ($nav.hasClass('nav-horizontal') && $window.width() >= 768)) {
                    return false;
                }
                $this = $(this);
                $parent = $this.parent('li');
                $lists.not($parent).removeClass('open').find('ul').slideUp(slideTime);
                $parent.toggleClass('open').find('ul').stop().slideToggle(slideTime);
                event.preventDefault();
            });

            $aRest.on('click', function(event) {
                $lists.removeClass('open').find('ul').slideUp(slideTime);
            });

            scope.$on('nav:reset', function(event) {
                $lists.removeClass('open').find('ul').slideUp(slideTime);
            });

            Timer = void 0;

            prevWidth = $window.width();

            updateClass = function() {
                var currentWidth;
                currentWidth = $window.width();
                if (currentWidth < 768) {
                    $app.removeClass('nav-collapsed-min');
                }
                if (prevWidth < 768 && currentWidth >= 768 && $nav.hasClass('nav-horizontal')) {
                    $lists.removeClass('open').find('ul').slideUp(slideTime);
                }
                prevWidth = currentWidth;
            };

            $window.resize(function() {
                var t;
                clearTimeout(t);
                t = setTimeout(updateClass, 300);
            });

        }
    }

    // Add 'active' class to li based on url, muli-level supported, jquery free
    function highlightActive() {
        var directive = {
            restrict: 'A',
            controller: [ '$scope', '$element', '$attrs', '$location', toggleNavCollapsedMinCtrl]
        };

        return directive;

        function toggleNavCollapsedMinCtrl($scope, $element, $attrs, $location) {
            var highlightActive, links, path;

            links = $element.find('a');

            path = function() {
                return $location.path();
            };

            highlightActive = function(links, path) {
                path = '#' + path;
                return angular.forEach(links, function(link) {
                    var $li, $link, href;
                    $link = angular.element(link);
                    $li = $link.parent('li');
                    href = $link.attr('href');
                    if ($li.hasClass('active')) {
                        $li.removeClass('active');
                    }
                    if (path.indexOf(href) === 0) {
                        return $li.addClass('active');
                    }
                });
            };

            highlightActive(links, $location.path());

            $scope.$watch(path, function(newVal, oldVal) {
                if (newVal === oldVal) {
                    return;
                }
                return highlightActive(links, $location.path());
            });

        }

    }

    // toggle on-canvas for small screen, with CSS
    function toggleOffCanvas() {
        var directive = {
            restrict: 'A',
            link: link
        };

        return directive;

        function link(scope, ele, attrs) {
            ele.on('click', function() {
                return $('#app').toggleClass('on-canvas');
            });
        }
    }


})();




;
(function () {
    'use strict';

    angular.module('app.page', []);
})();
;
(function () {
    'use strict';

    angular.module('app.page')
        .controller('invoiceCtrl', ['$scope', '$window', invoiceCtrl])
        .controller('authCtrl', ['$scope', '$window', '$location', '$http', '$route', '$modal', '$timeout', 'logger', authCtrl]);

    function invoiceCtrl($scope, $window) {
        var printContents, originalContents, popupWin;

        $scope.printInvoice = function() {
            printContents = document.getElementById('invoice').innerHTML;
            originalContents = document.body.innerHTML;
            popupWin = window.open();
            popupWin.document.open();
            popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="styles/main.css" /></head><body onload="window.print()">' + printContents + '</html>');
            popupWin.document.close();
        }
    }

    function authCtrl($scope, $window, $location, $http, $route, $modal, $timeout, logger) {
			$scope.logged_in = false;
			$scope.tfa = false;
			$scope.last_slide = false;
			$scope.slide_step = 1;

			var part = $window.location.hash.split("#");
			if (part.length > 2)
			{
				$scope.email = part.pop().replace("$", "@");
			}

            $scope.login = function() {
				if ( ! $scope.form.$error.required && ! $scope.form.$error.email)
				{
					var post_mas = {email: $scope.email,
									password: $scope.password};
					$http.post("/pub/login", post_mas).success(function(data, status, headers, config) {
						if (data.errors && data.errors[0] && data.errors[0].modal)
						{
							$scope.open_modal(data.errors[0].modal, ((data.errors[1] && data.errors[1].start) ? data.errors[1].start : false));
						}
						else
						{
							var result;
							if (result = logger.check(data))
							{
								if (result.id)
								{
									if ($location.path() == "/pages/signin")
									{
										$window.location.href = "/";
									}
									else
									{
										$window.location.reload(true);
									}
								}
								else
								{
									$timeout(function() {
										$window.document.getElementById('code_1').focus();
									}, 500);
									$scope.tfa = true;
								}
							}
						}
					});
				}
            };

			$scope.open_modal = function(script, start) {
				var modalInstance;
				modalInstance = $modal.open({
					templateUrl: script,
					controller: 'ModalInstanceCtrl',
					resolve: {
						items: function() {
							return [start];
						}
					}
				});
				modalInstance.result.then((function() {

				}), function() {
					console.log("Modal dismissed at: " + new Date());
				});
			};
			
			$scope.prev = '';
			$scope.code_change = function($event, num) {
				var current_value = '';
				if ($scope.code_valid != '')
				{
					current_value = $event.key;
					for (var i = 1; i <= 5; i++)
					{
						$scope['code_' + i] = '';
					}
					num = 1;
					$scope['code_' + num] = current_value;
				}
				
				$scope.code_valid = '';
				$scope.count_valid = '';
				var next = 0;
				if (($scope['code_' + num] >= 0 && $scope['code_' + num] <= 9) || $event.keyCode == 8)
				{
					if ($event.keyCode != 8)
					{
						next = num + 1;
						if (next > 5)
						{
							next = 5;
							$scope.code_check();
						}
					}
					else
					{
						if ($scope.prev == '')
						{
							next = num - 1;
							next = (next <= 0) ? 1 : next;
							$scope['code_' + next] = '';
						}
						else
						{
							next = num;
						}
					}
					$scope.prev = $scope['code_' + next] || '';
					$window.document.getElementById('code_' + next).focus();
				}
				else
				{
					$scope['code_' + num] = '';
				}
			};
			
			$scope.code_wait = false;
			$scope.blocked = false;
			$scope.count_valid = '';
			$scope.code_valid = '';
			$scope.code_count = 0;
			$scope.code_check = function() {
				$scope.code_wait = true;
				$scope.code_valid = '';
				var post_mas = {code: ($scope.code_1 + $scope.code_2 + $scope.code_3 + $scope.code_4 + $scope.code_5)};
				$http.post("/pub/code_check/", post_mas).success(function(data, status, headers, config) {
					$scope.code_wait = false;
					var result = logger.check(data);
					if (result)
					{
						if (result.count)
						{
							$scope.code_valid = '0';
							$scope.count_valid = '0';
							$scope.code_count = result.count;
						}
						else
						{
							$scope.count_valid = '1';
							$scope.code_valid = '1';
							if (result.first_time)
							{
								$scope.tfa = false;
								$scope.logged_in = true;
										
								$scope.user.facebook = result.facebook;
								$scope.user.zorgkaart = result.zorgkaart;
								$scope.user.google = result.google;
								$scope.user.username = result.username;
								$scope.user.phone = result.phone;
							}
							else
							{
								if ($location.path() == "/pages/signin")
								{
									$window.location.href = "/";
								}
								else
								{
									$window.location.reload(true);
								}
							}
						}
					}
					else
					{
						$scope.code_valid = '0';
						$scope.blocked = true;
						$scope.blocked_support();
					}
				});
			};
			
			$scope.code_resend = function() {
				$scope.code_wait = true;
				$http.post("/pub/code_resend/", {}).success(function(data, status, headers, config) {
					$scope.code_wait = false;
				});
			};
			
			$scope.blocked_support = function() {
				$http.post("/pub/blocked_support/", {}).success(function(data, status, headers, config) {
					logger.check(data);
				});
			};

            $scope.go = function() {
				$window.location.href = "/welcome";
            };

            $scope.reset = function() {
                if ( ! $scope.form.$error.required && ! $scope.form.$error.email)
				{
					var post_mas = {email: $scope.email};
					$http.post("/pub/reset", post_mas).success(function(data, status, headers, config) {
						if (logger.check(data))
						{
							$location.url("pages/signin");
						}
					});
				}
            };
			
			$scope.save_pass = function() {
                if ( ! $scope.form.$error.required)
				{
					if ($scope.password == $scope.confirm)
					{
						var part = $location.path().split("/");
						var post_mas = {hash: part.pop(), password: $scope.password};
						$http.post("/pub/save_pass", post_mas).success(function(data, status, headers, config) {
							if (logger.check(data))
							{
								$window.location.href = "/";
							}
						});
					}
					else
					{
						logger.logError("Wachtwoorden komen niet overeen");
					}
				}
            };

            $scope.unlock = function() {
                if ( ! $scope.form.$error.required)
				{
					var post_mas = {password: $scope.password};
					$http.post("/pub/unlock", post_mas).success(function(data, status, headers, config) {
						if (logger.check(data))
						{
							if ($location.path() == "/pages/lock-screen")
							{
								$window.location.href = "/";
							}
							else
							{
								$window.location.reload(true);
							}
						}
					});
				}
            };

			$scope.user = {};
			$scope.inc_slide = function()
			{
				if ($scope.slide_step == 5)
				{
					$scope.last_slide = true;
					$http.post("/pub/first_login_save", $scope.user).success(function(data, status, headers, config) {
						console.log("Done");
					});
				}
				else
				{
					$scope.slide_step = $scope.slide_step + 1;
					$scope.last_slide = false;
				}
			};
			
			$scope.trial = function() {
                if ( ! $scope.form.$error.required)
				{
					var post_mas = {username: $scope.username,
									email: $scope.email,
									password: $scope.password};
					$http.post("/pub/trial", post_mas).success(function(data, status, headers, config) {
						if (logger.check(data))
						{
							$window.location.href = "/#/pages/signin";
						}
					});
				}
            };
			
			$http.get("/pub/show_suspend_popup/").success(function(data, status, headers, config) {
				var result = logger.check(data);
				if (result.show_suspend_popup)
				{
					var modalInstance;
					modalInstance = $modal.open({
						templateUrl: "suspend_popup.html",
						controller: 'ModalInstanceSuspendPopupCtrl',
						resolve: {
							items: function() {
								return [];
							}
						}
					});
					
					modalInstance.result.then((function() {

					}), function() {
						console.log("Modal dismissed at: " + new Date());
					});
				}
			});
    }

})();




;
(function () {
    'use strict';

    angular.module('app.page')
        .directive('customPage', customPage);


    // add class for specific pages to achieve fullscreen, custom background etc.
    function customPage() {
        var directive = {
            restrict: 'A',
            controller: ['$scope', '$element', '$location', customPageCtrl]
        };

        return directive;

        function customPageCtrl($scope, $element, $location) {
            var addBg, path;

            path = function() {
                return $location.path();
            };

            addBg = function(path) {
                $element.removeClass('body-wide body-err body-lock body-auth');
                switch (path) {
                    case '/404':
                    case '/pages/404':
                    case '/pages/500':
                        return $element.addClass('body-wide body-err');
                    case '/pages/signin':
                    case '/pages/signup':
                    case '/pages/forgot-password':
                        return $element.addClass('body-wide body-auth');
                    case '/pages/lock-screen':
                        return $element.addClass('body-wide body-lock');
                }
				
				if (path.indexOf('/pages/new-password') + 1)
				{
					return $element.addClass('body-wide body-auth');
				}
            };

            addBg($location.path());

            $scope.$watch(path, function(newVal, oldVal) {
                if (newVal === oldVal) {
                    return;
                }
                return addBg($location.path());
            });
        }
    }

})();



;
(function () {
    'use strict';

    angular.module('app.table', []);
})();
;
(function () {
    'use strict';

    angular.module('app.table')
        .controller('tableCtrl', ['$scope', '$filter', tableCtrl]);

    function tableCtrl($scope, $filter) {
        var init;

        $scope.stores = [
            {
                name: 'Nijiya Market',
                price: '$$',
                sales: 292,
                rating: 4.0
            }, {
                name: 'Eat On Monday Truck',
                price: '$',
                sales: 119,
                rating: 4.3
            }, {
                name: 'Tea Era',
                price: '$',
                sales: 874,
                rating: 4.0
            }, {
                name: 'Rogers Deli',
                price: '$',
                sales: 347,
                rating: 4.2
            }, {
                name: 'MoBowl',
                price: '$$$',
                sales: 24,
                rating: 4.6
            }, {
                name: 'The Milk Pail Market',
                price: '$',
                sales: 543,
                rating: 4.5
            }, {
                name: 'Nob Hill Foods',
                price: '$$',
                sales: 874,
                rating: 4.0
            }, {
                name: 'Scratch',
                price: '$$$',
                sales: 643,
                rating: 3.6
            }, {
                name: 'Gochi Japanese Fusion Tapas',
                price: '$$$',
                sales: 56,
                rating: 4.1
            }, {
                name: 'Cost Plus World Market',
                price: '$$',
                sales: 79,
                rating: 4.0
            }, {
                name: 'Bumble Bee Health Foods',
                price: '$$',
                sales: 43,
                rating: 4.3
            }, {
                name: 'Costco',
                price: '$$',
                sales: 219,
                rating: 3.6
            }, {
                name: 'Red Rock Coffee Co',
                price: '$',
                sales: 765,
                rating: 4.1
            }, {
                name: '99 Ranch Market',
                price: '$',
                sales: 181,
                rating: 3.4
            }, {
                name: 'Mi Pueblo Food Center',
                price: '$',
                sales: 78,
                rating: 4.0
            }, {
                name: 'Cucina Venti',
                price: '$$',
                sales: 163,
                rating: 3.3
            }, {
                name: 'Sufi Coffee Shop',
                price: '$',
                sales: 113,
                rating: 3.3
            }, {
                name: 'Dana Street Roasting',
                price: '$',
                sales: 316,
                rating: 4.1
            }, {
                name: 'Pearl Cafe',
                price: '$',
                sales: 173,
                rating: 3.4
            }, {
                name: 'Posh Bagel',
                price: '$',
                sales: 140,
                rating: 4.0
            }, {
                name: 'Artisan Wine Depot',
                price: '$$',
                sales: 26,
                rating: 4.1
            }, {
                name: 'Hong Kong Chinese Bakery',
                price: '$',
                sales: 182,
                rating: 3.4
            }, {
                name: 'Starbucks',
                price: '$$',
                sales: 97,
                rating: 3.7
            }, {
                name: 'Tapioca Express',
                price: '$',
                sales: 301,
                rating: 3.0
            }, {
                name: 'House of Bagels',
                price: '$',
                sales: 82,
                rating: 4.4
            }
        ];

        $scope.searchKeywords = '';

        $scope.filteredStores = [];

        $scope.row = '';

        $scope.select = function(page) {
            var end, start;
            start = (page - 1) * $scope.numPerPage;
            end = start + $scope.numPerPage;
            return $scope.currentPageStores = $scope.filteredStores.slice(start, end);
        };

        $scope.onFilterChange = function() {
            $scope.select(1);
            $scope.currentPage = 1;
            return $scope.row = '';
        };

        $scope.onNumPerPageChange = function() {
            $scope.select(1);
            return $scope.currentPage = 1;
        };

        $scope.onOrderChange = function() {
            $scope.select(1);
            return $scope.currentPage = 1;
        };

        $scope.search = function() {
            $scope.filteredStores = $filter('filter')($scope.stores, $scope.searchKeywords);
            return $scope.onFilterChange();
        };

        $scope.order = function(rowName) {
            if ($scope.row === rowName) {
                return;
            }
            $scope.row = rowName;
            $scope.filteredStores = $filter('orderBy')($scope.stores, rowName);
            return $scope.onOrderChange();
        };

        $scope.numPerPageOpt = [3, 5, 10, 20];

        $scope.numPerPage = $scope.numPerPageOpt[2];

        $scope.currentPage = 1;

        $scope.currentPageStores = [];

        init = function() {
            $scope.search();
            return $scope.select($scope.currentPage);
        };

        init();
    }

})();
;
(function () {
    'use strict';

    angular.module('app.task', []);

})();

;
(function () {
    'use strict';

    angular.module('app.task')
        .controller('taskCtrl', [ '$scope', 'taskStorage', 'filterFilter', '$rootScope', 'logger', taskCtrl]);

    function taskCtrl($scope, taskStorage, filterFilter, $rootScope, logger) {
        var tasks;

        tasks = $scope.tasks = taskStorage.get();

        $scope.newTask = '';

        $scope.remainingCount = filterFilter(tasks, {completed: false}).length;

        $scope.editedTask = null;

        $scope.statusFilter = {
            completed: false
        };

        $scope.filter = function(filter) {
            switch (filter) {
                case 'all':
                    return $scope.statusFilter = '';
                case 'active':
                    return $scope.statusFilter = {
                        completed: false
                    };
                case 'completed':
                    return $scope.statusFilter = {
                        completed: true
                    };
            }
        };

        $scope.add = function() {
            var newTask;
            newTask = $scope.newTask.trim();
            if (newTask.length === 0) {
                return;
            }
            tasks.push({
                title: newTask,
                completed: false
            });
            logger.logSuccess('New task: "' + newTask + '" added');
            taskStorage.put(tasks);
            $scope.newTask = '';
            $scope.remainingCount++;
        };

        $scope.edit = function(task) {
            $scope.editedTask = task;
        };

        $scope.doneEditing = function(task) {
            $scope.editedTask = null;
            task.title = task.title.trim();
            if (!task.title) {
                $scope.remove(task);
            } else {
                logger.log('Task updated');
            }
            taskStorage.put(tasks);
        };

        $scope.remove = function(task) {
            var index;
            $scope.remainingCount -= task.completed ? 0 : 1;
            index = $scope.tasks.indexOf(task);
            $scope.tasks.splice(index, 1);
            taskStorage.put(tasks);
            logger.logError('Task removed');
        };

        $scope.completed = function(task) {
            $scope.remainingCount += task.completed ? -1 : 1;
            taskStorage.put(tasks);
            if (task.completed) {
                if ($scope.remainingCount > 0) {
                    if ($scope.remainingCount === 1) {
                        logger.log('Almost there! Only ' + $scope.remainingCount + ' task left');
                    } else {
                        logger.log('Good job! Only ' + $scope.remainingCount + ' tasks left');
                    }
                } else {
                    logger.logSuccess('Congrats! All done :)');
                }
            }
        };

        $scope.clearCompleted = function() {
            $scope.tasks = tasks = tasks.filter(function(val) {
                return !val.completed;
            });
            taskStorage.put(tasks);
        };

        $scope.markAll = function(completed) {
            tasks.forEach(function(task) {
                task.completed = completed;
            });
            $scope.remainingCount = completed ? 0 : tasks.length;
            taskStorage.put(tasks);
            if (completed) {
                logger.logSuccess('Congrats! All done :)');
            }
        };

        $scope.$watch('remainingCount == 0', function(val) {
            $scope.allChecked = val;
        });

        $scope.$watch('remainingCount', function(newVal, oldVal) {
            $rootScope.$broadcast('taskRemaining:changed', newVal);
        });

    }
})();
;
(function () {
    'use strict';

    angular.module('app.task')
        .directive('taskFocus', ['$timeout', taskFocus]);

    // cusor focus when dblclick to edit
    function taskFocus($timeout) {
        var directive = {
            link: link
        };

        return directive;

        function link (scope, ele, attrs) {
            scope.$watch(attrs.taskFocus, function(newVal) {
                if (newVal) {
                    $timeout(function() {
                        return ele[0].focus();
                    }, 0, false);
                }
            });
        }
    }

})();

;
(function () {
    'use strict';

    angular.module('app.task')
        .factory('taskStorage', taskStorage);


    function taskStorage() {
        var STORAGE_ID, DEMO_TASKS;

        STORAGE_ID = 'tasks';
        DEMO_TASKS = '[ {"title": "Upgrade to Yosemite", "completed": true},' +
            '{"title": "Finish homework", "completed": false},' +
            '{"title": "Try Google glass", "completed": false},' +
            '{"title": "Build a snowman :)", "completed": false},' +
            '{"title": "Play games with friends", "completed": true},' +
            '{"title": "Learn Swift", "completed": false},' +
            '{"title": "Shopping", "completed": true} ]';

        return {
            get: function() {
                return JSON.parse(localStorage.getItem(STORAGE_ID) || DEMO_TASKS );
            },

            put: function(tasks) {
                return localStorage.setItem(STORAGE_ID, JSON.stringify(tasks));
            }
        }
    }
})();
;
(function () {
    'use strict';

    angular.module('app.calendar', ['ui.calendar', 'ui.bootstrap']);

})();

;
(function () {
    'use strict';

    angular.module('app.calendar')
        .controller('calendarCtrl', [ '$scope', calendarCtrl]);

    function calendarCtrl($scope) {
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        /* event source that contains custom events on the scope */
        $scope.events = [
            {title: 'All Day Event',start: new Date(y, m, 1)},
            {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
            {title: 'Go Hiking',start: new Date(y, m, d - 1), className: ['fc-event-warning']},
            {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false, className: ['fc-event-success']},
            {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false, className: ['fc-event-success']},
            {title: 'Birthday Party',start: new Date(y, m, d + 1, 11, 0),end: new Date(y, m, d + 1, 12, 30),allDay: false, className: ['fc-event-danger']},
            {title: 'Shopping',start: new Date(y, m, d + 2, 9, 0),end: new Date(y, m, d + 2, 12, 0),allDay: false, className: ['fc-event-success']},
            {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'},
            {title: 'Shopping',start: new Date(y, m + 1, 8)},
        ];
        /* event source that calls a function on every view switch */
        $scope.eventsF = function (start, end, timezone, callback) {
            var s = new Date(start).getTime() / 1000;
            var e = new Date(end).getTime() / 1000;
            var m = new Date(start).getMonth();
            var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
            callback(events);
        };

        $scope.calEventsExt = {
             color: '#f00',
             textColor: 'yellow',
             events: [
                    {type:'party',title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
                    {type:'party',title: 'Lunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
                    {type:'party',title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
                ]
        };
        /* alert on eventClick */
        $scope.alertOnEventClick = function( event, allDay, jsEvent, view ){
                $scope.alertMessage = (event.title + ' was clicked ');
        };
        /* alert on Drop */
         $scope.alertOnDrop = function( event, revertFunc, jsEvent, ui, view){
             $scope.alertMessage = ('Event Droped on ' + event.start.format());
        };
        /* alert on Resize */
        $scope.alertOnResize = function( event, jsEvent, ui, view){
             $scope.alertMessage = ('Event end date was moved to ' + event.end.format());
        };
        /* add and removes an event source of choice */
        $scope.addRemoveEventSource = function(sources,source) {
            var canAdd = 0;
            angular.forEach(sources,function(value, key){
                if(sources[key] === source){
                    sources.splice(key,1);
                    canAdd = 1;
                }
            });
            if(canAdd === 0){
                sources.push(source);
            }
        };
        /* add custom event*/
        $scope.addEvent = function() {
            $scope.events.push({
                title: 'New Event',
                start: new Date(y, m, d),
                end: new Date(y, m, d + 1)
            });
        };
        /* remove event */
        $scope.remove = function(index) {
            $scope.events.splice(index,1);
        };
        /* Change View */
        $scope.changeView = function(view) {
            // console.log($scope.myCalendar1);
            $scope.myCalendar1.fullCalendar('changeView',view);
        };
        /* Change View */
        $scope.renderCalender = function(calendar) {
            if(calendar){
                calendar.fullCalendar('render');
            }
        };
        /* config object */
        $scope.uiConfig = {
            calendar:{
                height: 450,
                editable: true,
                header:{
                    left: 'title',
                    center: '',
                    right: 'today prev,next'
                },
                eventClick: $scope.alertOnEventClick,
                eventDrop: $scope.alertOnDrop,
                eventResize: $scope.alertOnResize
            }
        };

        /* event sources array*/
        $scope.eventSources = [$scope.events, $scope.eventsF];
    }

})();

;
(function () {
    'use strict';

    angular.module('app.ui', []);
})();
;
(function () {
    'use strict';

    angular.module('app.ui')
        .controller('LoaderCtrl', ['$scope', 'cfpLoadingBar', LoaderCtrl])
        .controller('NotifyCtrl', ['$scope', 'logger', NotifyCtrl])
        .controller('AlertDemoCtrl', ['$scope', AlertDemoCtrl])
        .controller('ProgressDemoCtrl', ['$scope', ProgressDemoCtrl])
        .controller('AccordionDemoCtrl', ['$scope', AccordionDemoCtrl])
        .controller('CollapseDemoCtrl', ['$scope', CollapseDemoCtrl])
        .controller('ModalDemoCtrl', ['$scope', '$modal', '$log', ModalDemoCtrl])
        .controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'items', ModalInstanceCtrl])
		.controller('ModalInstanceUsersCtrl', ['$scope', '$modalInstance', '$modal', '$http', 'logger', 'items', ModalInstanceUsersCtrl])
		.controller('ModalInstanceChangeAccountCtrl', ['$scope', '$modalInstance', '$modal', '$http', 'logger', 'items', ModalInstanceChangeAccountCtrl])
		.controller('ModalInstanceDeleteUsersCtrl', ['$scope', '$modalInstance', 'items', ModalInstanceDeleteUsersCtrl])
		.controller('ModalInstanceFeedbackCtrl', ['$scope', '$modalInstance', '$http', 'logger', 'items', ModalInstanceFeedbackCtrl])
		.controller('ModalInstanceSuspendedCtrl', ['$scope', '$modalInstance', '$http', '$location', 'logger', 'items', ModalInstanceSuspendedCtrl])
		.controller('ModalInstanceUpdatesCtrl', ['$scope', '$modalInstance', '$http', '$location', 'logger', 'items', ModalInstanceUpdatesCtrl])
		.controller('ModalInstanceOnlineCtrl', ['$scope', '$modalInstance', '$http', '$window', '$timeout', '$location', 'logger', 'items', ModalInstanceOnlineCtrl])
		.controller('ModalInstanceEmailsEditCtrl', ['$scope', '$modalInstance', '$http', '$location', 'logger', 'items', ModalInstanceEmailsEditCtrl])
		.controller('ModalEmailsRemoveQuestionsCtrl', ['$scope', '$modalInstance', '$http', '$location', 'logger', 'items', ModalEmailsRemoveQuestionsCtrl])
		.controller('ModalInstanceWidgetEditCtrl', ['$scope', '$modalInstance', '$http', '$location', 'logger', 'items', ModalInstanceWidgetEditCtrl])
		.controller('ModalInstanceWidgetSaveCtrl', ['$scope', '$modalInstance', '$http', '$location', 'logger', 'items', ModalInstanceWidgetSaveCtrl])
		.controller('ModalInstanceProfileSaveCtrl', ['$scope', '$modalInstance', '$http', '$location', 'logger', 'items', ModalInstanceProfileSaveCtrl])
		.controller('ModalInstanceConfirmSuspendionCtrl', ['$scope', '$modalInstance', '$http', '$location', 'logger', 'items', ModalInstanceConfirmSuspendionCtrl])
		.controller('ModalInstanceSuspendAccountCtrl', ['$scope', '$modalInstance', '$http', '$location', 'logger', 'items', ModalInstanceSuspendAccountCtrl])
		.controller('ModalInstanceRemoveDoctorCtrl', ['$scope', '$modalInstance', '$http', '$location', 'logger', 'items', ModalInstanceRemoveDoctorCtrl])
		.controller('ModalInstanceRemoveLocationCtrl', ['$scope', '$modalInstance', '$http', '$location', 'logger', 'items', ModalInstanceRemoveLocationCtrl])
		.controller('ModalInstanceAccessLocationCtrl', ['$scope', '$modalInstance', '$http', '$location', 'logger', 'items', ModalInstanceAccessLocationCtrl])
		.controller('ModalInstanceRemoveTreatmentCtrl', ['$scope', '$modalInstance', '$http', '$location', 'logger', 'items', ModalInstanceRemoveTreatmentCtrl])
		.controller('ModalInstanceSuspendPopupCtrl', ['$scope', '$modalInstance', '$http', '$location', 'logger', 'items', ModalInstanceSuspendPopupCtrl])
		.controller('ModalInstanceTestEmailCtrl', ['$scope', '$modalInstance', '$http', '$location', 'logger', 'items', ModalInstanceTestEmailCtrl])
		.controller('ModalInstanceStarsEditCtrl', ['$scope', '$modalInstance', '$http', '$location', 'logger', 'items', ModalInstanceStarsEditCtrl])
		.controller('ModalInstanceIntroCtrl', ['$scope', '$modalInstance', '$http', '$window', '$location', '$timeout', 'logger', 'items', ModalInstanceIntroCtrl])
		.controller('ModalExampleCtrl', ['$scope', '$modalInstance', '$http', 'logger', 'items', ModalExampleCtrl])
		.controller('ModalExampleInvCtrl', ['$scope', '$modalInstance', '$http', 'logger', 'items', ModalExampleInvCtrl])
		.controller('ModalExampleNegativeCtrl', ['$scope', '$modalInstance', '$http', 'logger', 'items', ModalExampleNegativeCtrl])
		.controller('ModalInstanceBulkCtrl', ['$scope', '$modalInstance', '$http', 'logger', 'items', ModalInstanceBulkCtrl])
		.controller('ModalInstanceExportInboxCtrl', ['$scope', '$modalInstance', '$http', '$window', '$interval', 'logger', 'items', ModalInstanceExportInboxCtrl])
		.controller('ModalUnsubscribeCtrl', ['$scope', '$modalInstance', '$http', 'logger', 'items', ModalUnsubscribeCtrl])
		.controller('ModalUndoCtrl', ['$scope', '$modalInstance', '$http', 'logger', 'items', ModalUndoCtrl])
		.controller('ModalInstanceHelpCtrl', ['$scope', '$modalInstance', '$http', 'logger', 'items', ModalInstanceHelpCtrl])
		.controller('ModalDefineDoctorsCtrl', ['$scope', '$modalInstance', '$http', 'logger', 'items', ModalDefineDoctorsCtrl])
		.controller('ModalFirstUploadCtrl', ['$scope', '$modalInstance', '$http', 'logger', 'items', ModalFirstUploadCtrl])
		.controller('ModalDefineLocationsCtrl', ['$scope', '$modalInstance', '$http', 'logger', 'items', ModalDefineLocationsCtrl])
		.controller('ModalDefineTreatmentsCtrl', ['$scope', '$modalInstance', '$http', 'logger', 'items', ModalDefineTreatmentsCtrl])
		.controller('ModalQuestionsBasicCtrl', ['$scope', '$modalInstance', '$http', 'logger', 'items', ModalQuestionsBasicCtrl])
		.controller('ModalQuestionsConfirmCtrl', ['$scope', '$modalInstance', '$http', 'logger', 'items', ModalQuestionsConfirmCtrl])
        .controller('PaginationDemoCtrl', ['$scope', PaginationDemoCtrl])
        .controller('TabsDemoCtrl', ['$scope', TabsDemoCtrl])
        .controller('TreeDemoCtrl', ['$scope', TreeDemoCtrl])
        .controller('MapDemoCtrl', ['$scope', '$http', '$interval', MapDemoCtrl]);


    function LoaderCtrl($scope, cfpLoadingBar) {
        $scope.start = function() {
            cfpLoadingBar.start();
        }

        // increments the loading bar by a random amount.
        $scope.inc = function() {
            cfpLoadingBar.inc();
        }

        $scope.set = function() {
            cfpLoadingBar.set(0.3);
        }

        $scope.complete = function() {
            cfpLoadingBar.complete()
        }
    }

    function NotifyCtrl($scope, logger) {
        $scope.notify = function(type) {
            switch (type) {
                case 'info':
                    return logger.log("Heads up! This alert needs your attention, but it's not super important.");
                case 'success':
                    return logger.logSuccess("Well done! You successfully read this important alert message.");
                case 'warning':
                    return logger.logWarning("Warning! Best check yo self, you're not looking too good.");
                case 'error':
                    return logger.logError("Oh snap! Change a few things up and try submitting again.");
            }
        };
    }

    function AlertDemoCtrl($scope) {
        $scope.alerts = [
            {
                type: 'success',
                msg: 'Well done! You successfully read this important alert message.'
            }, {
                type: 'info',
                msg: 'Heads up! This alert needs your attention, but it is not super important.'
            }, {
                type: 'warning',
                msg: "Warning! Best check yo self, you're not looking too good."
            }, {
                type: 'danger',
                msg: 'Oh snap! Change a few things up and try submitting again.'
            }
        ];

        $scope.addAlert = function() {
            var num, type;
            num = Math.ceil(Math.random() * 4);
            type = void 0;
            switch (num) {
                case 0:
                    type = 'info';
                    break;
                case 1:
                    type = 'success';
                    break;
                case 2:
                    type = 'info';
                    break;
                case 3:
                    type = 'warning';
                    break;
                case 4:
                    type = 'danger';
            }
            return $scope.alerts.push({
                type: type,
                msg: "Another alert!"
            });
        };

        $scope.closeAlert = function(index) {
            return $scope.alerts.splice(index, 1);
        };
    }

    function ProgressDemoCtrl($scope) {
        $scope.max = 200;

        $scope.random = function() {
            var type, value;
            value = Math.floor((Math.random() * 100) + 10);
            type = void 0;
            if (value < 25) {
                type = "success";
            } else if (value < 50) {
                type = "info";
            } else if (value < 75) {
                type = "warning";
            } else {
                type = "danger";
            }
            $scope.showWarning = type === "danger" || type === "warning";
            $scope.dynamic = value;
            $scope.type = type;
        };

        $scope.random();

    }

    function AccordionDemoCtrl($scope) {
        $scope.oneAtATime = true;

        $scope.groups = [
            {
                title: "Dynamic Group Header - 1",
                content: "Dynamic Group Body - 1"
            }, {
                title: "Dynamic Group Header - 2",
                content: "Dynamic Group Body - 2"
            }, {
                title: "Dynamic Group Header - 3",
                content: "Dynamic Group Body - 3"
            }
        ];

        $scope.items = ["Item 1", "Item 2", "Item 3"];

        $scope.status = {
            isFirstOpen: true,
            isFirstOpen1: true
        };

        $scope.addItem = function() {
            var newItemNo;
            newItemNo = $scope.items.length + 1;
            $scope.items.push("Item " + newItemNo);
        };
    }

    function CollapseDemoCtrl($scope) {
        $scope.isCollapsed = false;
    }

    function ModalDemoCtrl($scope, $modal, $log) {
        $scope.items = ["item1", "item2", "item3"];

        $scope.open = function() {
            var modalInstance;
            modalInstance = $modal.open({
                templateUrl: "myModalContent.html",
                controller: 'ModalInstanceCtrl',
                resolve: {
                    items: function() {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then((function(selectedItem) {
                $scope.selected = selectedItem;
            }), function() {
                $log.info("Modal dismissed at: " + new Date());
            });
        };

    };

    function ModalInstanceCtrl($scope, $modalInstance, items) {
        $scope.items = items;

        $scope.selected = {
            item: $scope.items[0]
        };

        $scope.ok = function() {
            $modalInstance.close($scope.selected.item);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss("cancel");
        };
    };

	function ModalInstanceUsersCtrl($scope, $modalInstance, $modal, $http, logger, items) {
		$scope.id = items[0];
		$scope.activation = items[1] * 1000;
		$scope.suspension = items[2] * 1000;
		var date = new Date($scope.suspension);
		$scope.suspension_str = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
		$scope.type = items[3];
		$scope.stop = items[4];
		$scope.user = items[5];

        $scope.ok = function() {
            $modalInstance.close([$scope.id, $scope.activation, $scope.suspension]);
        };

		$scope.remove = function() {
            $modalInstance.close([$scope.id, 1]);
        };
		
		$scope.activate = function() {
            $modalInstance.close([$scope.id, 0]);
        };

		$scope.reprint_users = function(users) {
            $modalInstance.close({users: users});
        };

        $scope.cancel = function() {
            $modalInstance.dismiss("cancel");
        };

		$scope.today = function(type) {
			return $scope[type] = new Date();
		};

		$scope.showWeeks = true;
		$scope.clear = function(type) {
			$scope[type] = null;
		};

		$scope.disabled = function(date, mode) {
			mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
		};

		$scope.open_date = function($event, type) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope['opened_' + type] = true;
		};

		$scope.dateOptions = {
			'year-format': "'yy'",
			'starting-day': 1
		};

		$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
		$scope.format = $scope.formats[0];

		$scope.delete_modal = function(id) {
            var modalInstance2;
            modalInstance2 = $modal.open({
                templateUrl: "delete.html",
                controller: 'ModalInstanceDeleteUsersCtrl',
                resolve: {
                    items: function() {
						return [id];
					}
                }
            });
            modalInstance2.result.then((function(id) {
				$http.post("/pub/del_user/", {id: id[0]}).success(function(data, status, headers, config) {
					var users = logger.check(data);
					$scope.reprint_users(users);
				});
            }), function() {
                console.log("Modal dismissed at: " + new Date());
            });
        };
		
		$scope.change_trial = function() {
			$http.post("/pub/change_trial/", {id: $scope.id}).success(function(data, status, headers, config) {
				logger.check(data);
			});
		};
    };
	
	function ModalInstanceChangeAccountCtrl($scope, $modalInstance, $modal, $http, logger, items) {
		$scope.user = items;
		$scope.user.fake_type = $scope.user.organization == '1' ? '2' : $scope.user.account_type;
 		
		$scope.id = $scope.user.id;
		$scope.type = $scope.user.account;
		$scope.stop = $scope.user.admin_stop;
		$scope.user.list = [];
		$scope.child = [];
		$scope.child[0] = 0;
		
		$scope.date = {};
		$scope.date.activation = new Date($scope.user.activation * 1000);
		$scope.date.suspension = new Date($scope.user.suspension * 1000);
		$scope.date.trial_end = new Date($scope.user.trial_end * 1000);
		
		$http.post("/pub/users/").success(function(data, status, headers, config) {
			$scope.user.list = logger.check(data);
		});
		
		$http.post("/pub/child/", {'id' : $scope.id}).success(function(data, status, headers, config) {
			$scope.child = logger.check(data);
		});
		
		$scope.fake_type_change = function() {
			$scope.user.organization = ($scope.user.fake_type == '2' ? '1' : '0');
			$scope.user.account_type = ($scope.user.fake_type == '2' ? '1' : $scope.user.fake_type);
		};
		
		$scope.check_exist = function(id, index) {
			for (var i in $scope.child)
			{
				if (id == $scope.child[i] && i != index)
				{
					return false;
				}
			}
			return true;
		}
		
		$scope.child_user_add = function(index) {
			if ($scope.child[index] == "0")
			{
				$scope.remove_child(index);
			}

			if ( ! $scope.check_child())
			{
				$scope.child.push("0");
			}
		};
		
		$scope.check_child = function() {
			
			for(var i in $scope.child)
			{
				if ($scope.child[i] == "0")
				{
					return true;
				}				
			}
			return false;
		};
		
		$scope.remove_child = function(index) {
			
			if ($scope.child[index] == 0)
			{
				return false;
			}
			
			var new_mass = [];
			for (var i in $scope.child)
			{
				if (i != index)
				{
					new_mass.push($scope.child[i]);
				}				
			}
			$scope.child = new_mass;
		};
		
		$scope.organization_change = function() {
			$scope.user.fake_type = ($scope.user.organization == '1' ? '2' : $scope.user.account_type);
		};

        $scope.ok = function() {
			$scope.user.activation = $scope.date.activation;
			$scope.user.suspension = $scope.date.suspension;
			$scope.user.trial_end = $scope.date.trial_end;
			$scope.user.child = $scope.child;
			
            $modalInstance.close({user: $scope.user});
        };

		$scope.remove = function() {
            $modalInstance.close([$scope.id, 1]);
        };
		
		$scope.activate = function() {
            $modalInstance.close([$scope.id, 0]);
        };

		$scope.reprint_users = function(users) {
            $modalInstance.close({users: users});
        };

        $scope.cancel = function() {
            $modalInstance.dismiss("cancel");
        };

		$scope.today = function(type) {
			return $scope[type] = new Date();
		};

		$scope.showWeeks = true;
		$scope.clear = function(type) {
			$scope[type] = null;
		};

		$scope.disabled = function(date, mode) {
			mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
		};

		$scope.open_date = function($event, type) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope['opened_' + type] = true;
		};

		$scope.dateOptions = {
			'year-format': "'yy'",
			'starting-day': 1
		};

		$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
		$scope.format = $scope.formats[0];

		$scope.delete_modal = function(id) {
            var modalInstance2;
            modalInstance2 = $modal.open({
                templateUrl: "delete.html",
                controller: 'ModalInstanceDeleteUsersCtrl',
                resolve: {
                    items: function() {
						return [id];
					}
                }
            });
            modalInstance2.result.then((function(id) {
				$http.post("/pub/del_user/", {id: id[0]}).success(function(data, status, headers, config) {
					var users = logger.check(data);
					$scope.reprint_users(users);
				});
            }), function() {
                console.log("Modal dismissed at: " + new Date());
            });
        };
		
		$scope.change_trial = function() {
			$http.post("/pub/change_trial/", {id: $scope.id}).success(function(data, status, headers, config) {
				logger.check(data);
			});
		};
    };

	function ModalInstanceDeleteUsersCtrl($scope, $modalInstance, items) {
		$scope.id = items[0];

		$scope.del = function() {
            $modalInstance.close([$scope.id]);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss("cancel");
        };
    };

	function ModalInstanceFeedbackCtrl($scope, $modalInstance, $http, logger, items) {
        $scope.items = items;
		$scope.loader = false;
		
		$scope.feedback = '';
		$scope.feedback_1 = '';
		$scope.feedback_2 = '';
		$scope.feedback_3 = false;

        $scope.send = function() {
			$scope.loader = true;
            $http.post("/pub/send_feedback/", {first: $scope.feedback_1, second: $scope.feedback_2, text: $scope.feedback, third: $scope.feedback_3}).success(function(data, status, headers, config) {
				$scope.loader = false;
				if (logger.check(data))
				{
					$modalInstance.close();
				}
			});
        };

        $scope.cancel = function() {
            $modalInstance.dismiss("cancel");
        };
    };
	
	function ModalInstanceSuspendedCtrl($scope, $modalInstance, $http, $location, logger, items) {
        $scope.items = items;
		$scope.loader = false;

        $scope.renew = function() {
			$location.url("pages/subscription");
			$modalInstance.close();
        };

        $scope.cancel = function() {
            $modalInstance.dismiss("cancel");
        };
    };
	
	function ModalInstanceUpdatesCtrl($scope, $modalInstance, $http, $location, logger, items) {
        $scope.items = items;

		$scope.slide_step = 0;
		$scope.change_step = function(step)
		{
			console.log(step);
			$scope.slide_step = step;
		};
		
		$scope.next = function()
		{
			$scope.slide_step = $scope.slide_step + 1;
		};
		
		$scope.cancel = function() {
            $modalInstance.dismiss("cancel");
        };
		
		$scope.send_feedback = function() {
			$modalInstance.close("feedback");
		};
    };
	
	function ModalInstanceOnlineCtrl($scope, $modalInstance, $http, $window, $timeout, $location, logger, items) {
        $scope.data = items.data;
		$scope.system = items.system;
		$scope.m = {};
		$scope.m.url = $scope.data[$scope.system];
		$scope.m.url_scrap = $scope.data[$scope.system + "_scrap"] || "";
		$scope.m.name = $scope.data[$scope.system + "_name"] || "";
		$scope.name_limit = 50;
		$scope.show_well = false;
		$scope.valid = "none";

		$scope.fb_login = function()
		{
			if ( ! $scope.data.fb_logged_in)
			{
				$window['fb_callback'] = $scope.fb_modal_callback;
				$window.open($scope.data.fb_link, "Facebook Login", "height=300,width=500");
			}
		};
		
		$scope.fb_modal_callback = function()
		{
			$timeout(function() {
				$scope.data.fb_logged_in = '1';
			});
		};
		
		$scope.cancel = function() {
			$modalInstance.close({data: $scope.data, system: $scope.system});
        };
		
		$scope.save = function() {
			if ($scope.validate())
			{
				if ($scope.system == "facebook")
				{
					if ($scope.data.fb_logged_in == '1')
					{
						$scope.data[$scope.system] = $scope.m.url;
						if ($scope.system == "own")
						{
							$scope.data[$scope.system + "_name"] = $scope.m.name;
						}
						
						if ($scope.system == "independer")
						{
							$scope.data[$scope.system + "_scrap"] = $scope.m.url_scrap;
						}
						$modalInstance.close({data: $scope.data, system: $scope.system});
					}
					else
					{
						logger.logError("U dient bij Facebook in te loggen om dit profiel te kunnen gebruiken.");
					}
				}
				else
				{
					$scope.data[$scope.system] = $scope.m.url;
					if ($scope.system == "own")
					{
						$scope.data[$scope.system + "_name"] = $scope.m.name;
					}
					
					if ($scope.system == "independer")
					{
						$scope.data[$scope.system + "_scrap"] = $scope.m.url_scrap;
					}
					$modalInstance.close({data: $scope.data, system: $scope.system});
				}
			}
		};
		
		$scope.validate = function() {
			$scope.valid = "none";
			$scope.check = true;
			console.log($scope.m.url);
			if ($scope.system == "google")
			{
				if (($scope.m.url.indexOf("://places.google.com/") + 1) || ($scope.m.url.indexOf("://www.places.google.com/") + 1) || ($scope.m.url.indexOf("://plus.google.com/") + 1) || ($scope.m.url.indexOf("://www.plus.google.com/") + 1) || ($scope.m.url.indexOf("://google") + 1) || ($scope.m.url.indexOf("://www.google") + 1) || ($scope.m.url.indexOf("://plus.google") + 1) || ($scope.m.url.indexOf("://www.plus.google") + 1))
				{
					$scope.valid = "valid";
				}
				else
				{
					$scope.valid = "invalid";
				}
			}
			else if ($scope.system == "facebook")
			{
				if (($scope.m.url.indexOf("://www.facebook.com/") + 1) || ($scope.m.url.indexOf("://facebook.com/") + 1))
				{
					$scope.valid = "valid";
				}
				else
				{
					$scope.valid = "invalid";
				}
			}
			else if ($scope.system == "zorgkaart")
			{
				if (($scope.m.url.indexOf("://www.zorgkaartnederland.nl/zorgverlener/") + 1) || ($scope.m.url.indexOf("://www.zorgkaartnederland.nl/zorginstelling/") + 1) || ($scope.m.url.indexOf("://zorgkaartnederland.nl/zorgverlener/") + 1) || ($scope.m.url.indexOf("://zorgkaartnederland.nl/zorginstelling/") + 1))
				{
					$scope.valid = "valid";
				}
				else
				{
					$scope.valid = "invalid";
				}
			}
			else if ($scope.system == "independer")
			{
				if ($scope.m.url_scrap.indexOf("independer.nl") + 1)
				{
					$scope.valid = "valid";
				}
				else
				{
					$scope.valid = "invalid";
				}
			}
			else if ($scope.system == "telefoonboek")
			{
				if ($scope.m.url.indexOf("://www.telefoonboek.nl/bedrijven/") + 1)
				{
					$scope.valid = "valid";
				}
				else
				{
					$scope.valid = "invalid";
				}
			}
			else if ($scope.system == "vergelijkmondzorg")
			{
				if (($scope.m.url.indexOf("://vergelijkmondzorg.nl/praktijken/") + 1) || ($scope.m.url.indexOf("://www.vergelijkmondzorg.nl/praktijken/") + 1))
				{
					$scope.valid = "valid";
				}
				else
				{
					$scope.valid = "invalid";
				}
			}
			else if ($scope.system == "kliniekoverzicht")
			{
				if (($scope.m.url.indexOf("://www.kliniekoverzicht.nl/clinic/") + 1) || ($scope.m.url.indexOf("://kliniekoverzicht.nl/clinic/") + 1))
				{
					$scope.valid = "valid";
				}
				else
				{
					$scope.valid = "invalid";
				}
			}
			else if ($scope.system == "own")
			{
				if (($scope.m.url.indexOf("http://") + 1) || ($scope.m.url.indexOf("https://") + 1))
				{
					$scope.valid = "valid";
				}
				else
				{
					$scope.valid = "invalid";
				}
				
				if ($scope.m.name.length > $scope.name_limit)
				{
					$scope.check = false;
					logger.logError("De titel mag maximaal " + $scope.name_limit + " aantal tekens bevatten.");
				}
			}
			
			return $scope.check && ($scope.valid == "valid" || $scope.valid == "none");
		};
    };
	
	function ModalInstanceEmailsEditCtrl($scope, $modalInstance, $http, $location, logger, items) {
        $scope.value = items.value;
		$scope.type = items.type;
		$scope.user = items.user;
		$scope.froalaOptions = {
			height: 250,
			language: 'nl',
			imageUploadURL: '/pub/editor_upload/',
			imageManagerLoadURL: '/pub/editor_get/',
			imageManagerDeleteURL: '/pub/editor_delete/',
			toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|', 'color', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', 'insertHR', '-', 'insertLink', 'insertImage', 'insertTable', 'undo', 'redo', 'clearFormatting', 'selectAll', 'html']
		};
		
		$scope.set_var = function(variable) {
			$scope.froalaOptions.froalaEditor('html.insert', '{{' + variable + '}}');
		};
		
		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
        };
		
		$scope.save = function() {
			$modalInstance.close({value: $scope.value, type: $scope.type});
		};
    };
	
	function ModalEmailsRemoveQuestionsCtrl($scope, $modalInstance, $http, $location, logger, items) {
		$scope.undo = function() {
			$modalInstance.dismiss("cancel");
        };
		
		$scope.proceed = function() {
			$modalInstance.close();
		};
    };
	
	function ModalInstanceWidgetEditCtrl($scope, $modalInstance, $http, $location, logger, items) {
        $scope.value = items.value;
		$scope.type = items.type;
		$scope.color = [];
		$scope.color[0] = items.color;
		
		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
        };
		
		$scope.save = function() {
			$modalInstance.close({value: $scope.value, type: $scope.type, color: $scope.color[0]});
		};
    };
	
	function ModalInstanceWidgetSaveCtrl($scope, $modalInstance, $http, $location, logger, items) {
		$scope.code = items.code;
		$scope.widget = items.widget;
		
		$scope.iframe = "<iframe";
		if ($scope.widget.widgets_type == "0")
		{
			$scope.iframe += " style='width: 100%; height: 82px; border: 0;' ";
		}
		else
		{
			$scope.iframe += " style='width: 100%; height: 302px; border: 0;' ";
		}
		$scope.iframe += "src='http://app.patientenreview.nl/widget/" + $scope.code + "/'></iframe>";
		
		$scope.save = function() {
			$modalInstance.close("save");
		};
    };
	
	function ModalInstanceProfileSaveCtrl($scope, $modalInstance, $http, $location, logger, items) {
		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
        };
		
		$scope.discard_profile = function() {
			$modalInstance.close("discard_profile");
		};
		
		$scope.save_profile = function() {
			$modalInstance.close("save_profile");
		};
    };
	
	function ModalInstanceConfirmSuspendionCtrl($scope, $modalInstance, $http, $location, logger, items) {
		$scope.items = items;
		
		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
        };
		
		$scope.confirm = function() {
			$modalInstance.close("confirm");
		};
    };
	
	function ModalInstanceSuspendAccountCtrl($scope, $modalInstance, $http, $location, logger, items) {
		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
        };
		
		$scope.suspend = function() {
			$modalInstance.close("suspend");
		};
    };
	
	function ModalInstanceRemoveDoctorCtrl($scope, $modalInstance, $http, $location, logger, items) {
		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
        };
		
		$scope.remove = function() {
			$modalInstance.close("remove");
		};
    };
	
	function ModalInstanceRemoveLocationCtrl($scope, $modalInstance, $http, $location, logger, items) {
		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
        };
		
		$scope.remove = function() {
			$modalInstance.close("remove");
		};
    };
	
	function ModalInstanceAccessLocationCtrl($scope, $modalInstance, $http, $location, logger, items) {
		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
        };
    };
	
	function ModalInstanceRemoveTreatmentCtrl($scope, $modalInstance, $http, $location, logger, items) {
		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
        };
		
		$scope.remove = function() {
			$modalInstance.close("remove");
		};
    };
	
	function ModalInstanceSuspendPopupCtrl($scope, $modalInstance, $http, $location, logger, items) {
		$scope.ok = function() {
			$modalInstance.dismiss("cancel");
        };
    };
	
	function ModalInstanceTestEmailCtrl($scope, $modalInstance, $http, $location, logger, items) {
		$scope.items = items[0];
		$scope.user = items[1];
		$scope.test = {};
		$scope.test.email = $scope.user.email;
		$scope.test.doctors_avatar = '';
		
		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
        };
		
		$scope.submit = function() {
			var error = false;
			for (var key in $scope.items)
			{
				if ( ! $scope.test[key] || $scope.test[key] == "")
				{
					error = true;
				}
			}
			
			if ( ! $scope.test.email || $scope.test.email == "")
			{
				error = true;
			}
			
			if (error)
			{
				logger.logError("Alle velden zijn verplicht");
			}
			else
			{
				$modalInstance.close($scope.test);
			}
        };
		
		$scope.onAvatar = function(response)
		{
			var temp = window.location.href.split('/');
			var base_url = temp[0] + "//" + temp[2];
			
			var data = response.data;
			$scope.test.doctors_avatar = logger.check(data);
			if ($scope.test.doctors_avatar)
			{
				$scope.test.doctors_avatar = base_url + '/avatars/tmp/' + $scope.test.doctors_avatar;
			}
		};
		
		$scope.remove_avatar = function()
		{
			$scope.test.doctors_avatar = '';
		};
    };
	
	function ModalInstanceStarsEditCtrl($scope, $modalInstance, $http, $location, logger, items) {
		$scope.type = items[0];
		$scope.text = [];
		$scope.text[0] = items[1] || "Klik hier om te beoordelen";
		
		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
        };
		
		$scope.save = function() {
			$modalInstance.close([$scope.type, $scope.text[0]]);
        };
    };
	
	function ModalInstanceIntroCtrl($scope, $modalInstance, $http, $window, $location, $timeout, logger, items) {
		$scope.user_intro = items.user;
		$scope.username = items.user.username;
		$scope.step = {};
		$scope.step.n = items.step;
		$scope.step.btn = items.step;
		$scope.step.online = items.online_step;
		$scope.intro = items.intro;
		$scope.intro_class = [];
		$scope.intro_class[0] = "intro-popup-show";
		
		$scope.valid = "none";
		$scope.name_limit = 50;

		$scope.fb_login = function()
		{
			if ($scope.user_intro['facebook'] != "" && $scope.user_intro.fb_logged_in == '0')
			{
				$window['fb_callback'] = $scope.fb_intro_callback;
				$window.open($scope.user_intro.fb_link, "Facebook Login", "height=300,width=500");
			}
		};
		
		$scope.fb_intro_callback = function()
		{
			$timeout(function() {
				$scope.user_intro.fb_logged_in = '1';
			});
		};
		
		$scope.online = ['google', 'facebook', 'zorgkaart', 'independer'];
		if ($scope.user_intro.account == '2' || $scope.user_intro.account_type == '1')
		{
			$scope.online = ['google', 'facebook', 'zorgkaart', 'independer', 'telefoonboek', 'vergelijkmondzorg', 'kliniekoverzicht', 'own'];
		}
		$scope.online_names = {'google': 'Google', 'facebook': 'Facebook', 'zorgkaart': 'Zorgkaart', 'independer': 'Independer', 'telefoonboek': 'Telefoonboek', 'vergelijkmondzorg': 'Vergelijk Mondzorg', 'kliniekoverzicht': 'Kliniekoverzicht', 'own': ($scope.user_intro.own_name || 'Aangepaste doorverwijzing')};
		
		$scope.test = {};
		$scope.test.email = $scope.user_intro.email;
		$scope.emails = {};
		var existing_tags = {};
		var tags = {title: '[AANHEF PATIËNT]',
					name: '[VOORNAAM PATIËNT]',
					sname: '[ACHTERNAAM PATIËNT]',
					doctors_title: '[AANHEF ZORGVERLENER]',
					doctors_name: '[VOORNAAM ZORGVERLENER]',
					doctors_sname: '[ACHTERNAAM ZORGVERLENER]'};

		var fields = ['subject', 'header', 'text1', 'promo', 'text2', 'footer'];
		$http.get("/pub/get_test_email/").success(function(data, status, headers, config) {
			var result = logger.check(data);
			$scope.emails = result;
			for (var i in fields)
			{
				for (var key in tags)
				{
					if ($scope.emails[fields[i]].indexOf(tags[key]) + 1)
					{
						existing_tags[key] = true;
					}
				}
			}
		});

		$scope.send_test_email = function() {
			$http.post("/pub/send_test_email/", {emails: $scope.emails, values: $scope.test, user: $scope.user_intro}).success(function(data, status, headers, config) {
				logger.check(data);
			});
		};
		
		$scope.next = function($event) {
			$scope.intro_class[0] = "intro-popup-hide";
			$timeout(function() {
				if ($scope.step.n == 3)
				{
					var next = false;
					for (var i = $scope.step.online, count = $scope.online.length; i <= count; i++)
					{
						if ($scope.user_intro[$scope.online[i - 1] + '_checked'] == 1 && ! next && $scope.step.online != i)
						{
							next = i;
						}
					}
					
					if (next)
					{
						$scope.step.online = next;
					}
					else
					{
						$scope.step.n++;
						$scope.step.btn = $scope.step.n;
					}
				}
				else
				{
					if ($scope.step.n == 2)
					{
						var step = 0;
						for (var i = 0, count = $scope.online.length; i < count; i++)
						{
							if ($scope.user_intro[$scope.online[i] + '_checked'] == 1 && ! step)
							{
								step = i + 1;
							}
						}
						
						$scope.step.online = step;
						if ($scope.step.online)
						{
							$scope.step.n++;
						}
						else
						{
							$scope.step.n += 2;
						}
						$scope.step.btn = $scope.step.n;
					}
					else
					{
						$scope.step.n++;
						$scope.step.btn = $scope.step.n;
					}
				}
				
				if ($scope.step.n == 1)
				{
					$location.url("/dashboard");
				}
				
				if ($scope.step.n == 2 || $scope.step.n == 3)
				{
					$location.url("/pages/online");
				}
				
				if ($scope.step.n >= 4)
				{
					$location.url("/mail/compose");
				}
				
				$http.post("/pub/intro_step/", {step: $scope.step.n, online_step: $scope.step.online, user: $scope.user_intro}).success(function(data, status, headers, config) {
					logger.check(data);
				});
				
				$scope.intro_class[0] = "intro-popup-show";
			}, 300);
        };
		
		$scope.prev = function() {
			$scope.intro_class[0] = "intro-popup-hide";
			$timeout(function() {
				if ($scope.step.n == 3)
				{
					var prev = false;
					for (var i = $scope.step.online, count = 0; i > count; i--)
					{
						if ($scope.user_intro[$scope.online[i - 1] + '_checked'] == 1 && ! prev && $scope.step.online != i)
						{
							prev = i;
						}
					}
					
					if (prev)
					{
						$scope.step.online = prev;
					}
					else
					{
						$scope.step.n--;
						$scope.step.btn = $scope.step.n;
					}
				}
				else
				{
					if ($scope.step.n == 4)
					{
						var step = 0;
						for (var i = $scope.online.length - 1, count = 0; i >= count; i--)
						{
							if ($scope.user_intro[$scope.online[i] + '_checked'] == 1 && ! step)
							{
								step = i + 1;
							}
						}
						
						$scope.step.online = step;
						if ($scope.step.online)
						{
							$scope.step.n--;
						}
						else
						{
							$scope.step.n -= 2;
						}
						$scope.step.btn = $scope.step.n;
					}
					else
					{
						$scope.step.n--;
						$scope.step.btn = $scope.step.n;
					}
				}
				
				if ($scope.step.n == 1)
				{
					$location.url("/dashboard");
				}
				
				if ($scope.step.n == 2 || $scope.step.n == 3)
				{
					$location.url("/pages/online");
				}
				
				if ($scope.step.n >= 4)
				{
					$location.url("/mail/compose");
				}
				
				$http.post("/pub/intro_step/", {step: $scope.step.n, online_step: $scope.step.online, user: $scope.user_intro}).success(function(data, status, headers, config) {
					logger.check(data);
				});
				$scope.intro_class[0] = "intro-popup-show";
			}, 300);
        };
		
		$scope.pre_close = function() {
			$scope.intro_class[0] = "intro-popup-hide";
			$timeout(function() {
				$scope.step.n = 0;
				$scope.step.btn = $scope.step.n;
				$scope.intro_class[0] = "intro-popup-show";
			}, 300);
		};
		
		$scope.settings = function() {
			$location.url("/pages/profile");
			$scope.close();
        };

		$scope.close = function() {
			$modalInstance.close({user: $scope.user_intro});
        };
    };
	
	function ModalExampleCtrl($scope, $modalInstance, $http, logger, items) {
        $scope.email = items[0];

        $scope.ok = function() {
            $modalInstance.close();
        };

        $scope.cancel = function() {
            $modalInstance.dismiss("cancel");
        };
    };
	
	function ModalExampleInvCtrl($scope, $modalInstance, $http, logger, items) {
        $scope.cancel = function() {
            $modalInstance.dismiss("cancel");
        };
    };
	
	function ModalExampleNegativeCtrl($scope, $modalInstance, $http, logger, items) {
		$scope.vote = items;
		
        $scope.cancel = function() {
            $modalInstance.close("zero");
        };
		
		$scope.close = function() {
            $modalInstance.close("vote");
        };
    };
	
	function ModalInstanceBulkCtrl($scope, $modalInstance, $http, logger, items) {
		$scope.bulk_user = items.user;
		$scope.online = ['google', 'facebook', 'zorgkaart', 'independer'];
		if ($scope.bulk_user.account == '2' || $scope.bulk_user.account_type == '1')
		{
			$scope.online = ['google', 'facebook', 'zorgkaart', 'telefoonboek', 'vergelijkmondzorg', 'independer', 'kliniekoverzicht', 'own'];
		}
		
		$scope.online_tags = [];
		for (var key in $scope.online)
		{
			if ($scope.bulk_user[$scope.online[key] + "_checked"] && $scope.bulk_user[$scope.online[key]] != "")
			{
				$scope.online_tags.push("[" + ($scope.online[key] == "own" ? "Aangepaste doorverwijzing" : $scope.online[key]).toUpperCase() + " PROFIEL]"); 
			}
		}

		$scope.online_tags_str = $scope.online_tags.join(", ");
		$scope.letter_text = "Geachte [AANHEF PATIËNT] [ACHTERNAAM PATIËNT],\n\nWe willen u bij deze hartelijk bedanken voor uw beoordeling.\n\nAls u deze beoordeling nog niet op internet heeft gedeeld, zou u dat dan alsnog willen doen? U zou ons er erg mee helpen. U kunt ons beoordelen op: " + $scope.online_tags_str + ".\n\nMet vriendelijke groet,\n\n[NAAM PRAKTIJK]";
		$scope.first_text = "Geachte heer/mevrouw,";
		$scope.subject_text = "Bedankt voor uw feedback!";
		
        $scope.send = function() {
            $modalInstance.close({letter: $scope.letter_text, first: $scope.first_text, subject: $scope.subject_text});
        };
		
		$scope.close = function() {
            $modalInstance.dismiss("cancel");
        };
    };
	
	function ModalInstanceExportInboxCtrl($scope, $modalInstance, $http, $window, $interval, logger, items) {
		$scope.export_done = '0';
		$scope.export_percent = 0;
		$scope.export_link = '';
		var timer = $interval(function() {
			if ($scope.export_percent < 90)
			{
				$scope.export_percent += 10;
			}
			else
			{
				$interval.cancel(timer);
			}
		}, 300);
		
		$http.post("/pub/export_inbox/", {filter: items.filter}).success(function(data, status, headers, config) {
			$scope.export_link = logger.check(data);
			$interval.cancel(timer);
			$scope.export_percent = 100;
			$scope.export_done = '1';
		});
			
		$scope.cancel = function() {
            $modalInstance.dismiss("cancel");
        };
		
		$scope.download = function() {
			$window.location.href = $scope.export_link;
			$modalInstance.dismiss("cancel");
        };
    };
	
	function ModalUnsubscribeCtrl($scope, $modalInstance, $http, logger, items) {
		$scope.cancel = function() {
            $modalInstance.dismiss("cancel");
        };
		
		$scope.undo = function() {
            $modalInstance.close("undo");
        };
    };
	
	function ModalUndoCtrl($scope, $modalInstance, $http, logger, items) {
		$scope.cancel = function() {
            $modalInstance.close();
        };
    };
	
	function ModalInstanceHelpCtrl($scope, $modalInstance, $http, logger, items) {
		$scope.cancel = function() {
            $modalInstance.dismiss("cancel");
        };
		
		$scope.confirm = function() {
            $modalInstance.close("confirm");
        };
    };
	
	function ModalFirstUploadCtrl($scope, $modalInstance, $http, logger, items) {
		$scope.cancel = function() {
            $modalInstance.dismiss("cancel");
        };
		
		$scope.confirm = function() {
            $modalInstance.close("confirm");
        };
		
		$scope.ignore = function() {
            $modalInstance.close("ignore");
        };
    };
	
	function ModalDefineDoctorsCtrl($scope, $modalInstance, $http, logger, items) {
		$scope.doctors = items[0];
		$scope.unknown = items[1];
		$scope.add_doctor_var = false;
		$scope.doctor = {};
		
		$scope.selected = {};
		for (var k in $scope.unknown)
		{
			$scope.selected[$scope.unknown[k]] = '';
		}
		
		$scope.user = {};
		$http.post("/pub/user/", {}).success(function(data, status, headers, config) {
			$scope.user = logger.check(data);
		});

		$scope.cancel = function() {
            $modalInstance.dismiss("cancel");
        };
		
		$scope.save = function() {
            $modalInstance.close($scope.selected);
        };
		
		$scope.add = function() {
			$scope.add_doctor_var = true;
        };
		
		$scope.cancel_doctor = function() {
			$scope.add_doctor_var = false;
		};
		
		$scope.add_doctor = function() {
			var error = 1;
			if ( ! $scope.doctor.title)
			{
				logger.logError("Vergeet niet de Aanhef in te vullen!");
				error = 0;
			}
			
			if ( ! $scope.doctor.firstname)
			{
				logger.logError("Vergeet niet de Voornaam in te vullen!");
				error = 0;
			}
			
			if ( ! $scope.doctor.lastname)
			{
				logger.logError("Vergeet niet de Achternaam in te vullen!");
				error = 0;
			}
			
			if ( ! $scope.doctor.name)
			{
				logger.logError("Vergeet niet de Waarde in Excel-bestand in te vullen!");
				error = 0;
			}
			
			if (error)
			{
				$scope.id = 0;
				$http.post("/pub/save_doctor/", $scope.doctor).success(function(data, status, headers, config) {
					if ($scope.id = logger.check(data))
					{
						$http.post("/pub/get_doctors/", {}).success(function(data, status, headers, config) {
							$scope.doctors = logger.check(data);
							for (var k in $scope.doctors)
							{
								if ($scope.doctors[k].id == $scope.id)
								{
									$scope.selected[$scope.doctor.name] = $scope.doctors[k];
								}
							}
							$scope.add_doctor_var = false;
						});
					}
				});
			}
		};
		
    };
	
	function ModalDefineLocationsCtrl($scope, $modalInstance, $http, logger, items) {
		$scope.locations = items[0];
		$scope.unknown = items[1];
		$scope.add_location_var = false;
		$scope.location = {};
		
		$scope.selected = {};
		for (var k in $scope.unknown)
		{
			$scope.selected[$scope.unknown[k]] = '';
		}
		
		$scope.user = {};
		$http.post("/pub/user/", {}).success(function(data, status, headers, config) {
			$scope.user = logger.check(data);
		});

		$scope.cancel = function() {
            $modalInstance.dismiss("cancel");
        };
		
		$scope.save = function() {
            $modalInstance.close($scope.selected);
        };
		
		$scope.add = function() {
			$scope.add_location_var = true;
        };

		$scope.cancel_location = function() {
			$scope.add_location_var = false;
		};
		
		$scope.add_location = function() {
			var error = 1;
			if ( ! $scope.location.title)
			{
				logger.logError("Vergeet niet de Locatie in te vullen!");
				error = 0;
			}
			
			if ( ! $scope.location.address)
			{
				logger.logError("Vergeet niet de Adres in te vullen!");
				error = 0;
			}
			
			if ( ! $scope.location.postcode)
			{
				logger.logError("Vergeet niet de Postcode in te vullen!");
				error = 0;
			}
			
			if ( ! $scope.location.city)
			{
				logger.logError("Vergeet niet de Stad in te vullen!");
				error = 0;
			}
			
			if ( ! $scope.location.name)
			{
				logger.logError("Vergeet niet de Waarde in Excel-bestand in te vullen!");
				error = 0;
			}
			
			if (error)
			{
				$scope.id = 0;
				$http.post("/pub/save_location/", $scope.location).success(function(data, status, headers, config) {
					if ($scope.id = logger.check(data))
					{
						$http.post("/pub/get_locations/", {}).success(function(data, status, headers, config) {
							$scope.locations = logger.check(data);
							for (var k in $scope.locations)
							{
								if ($scope.locations[k].id == $scope.id)
								{
									$scope.selected[$scope.location.name] = $scope.locations[k];
								}
							}
							$scope.add_location_var = false;
						});
					}
				});
			}
		};
		
    };
	
	function ModalDefineTreatmentsCtrl($scope, $modalInstance, $http, logger, items) {
		$scope.treatments = items[0];
		$scope.unknown = items[1];
		$scope.add_treatment_var = false;
		$scope.treatment = {};
		
		$scope.selected = {};
		for (var k in $scope.unknown)
		{
			$scope.selected[$scope.unknown[k]] = '';
		}
		
		$scope.user = {};
		$http.post("/pub/user/", {}).success(function(data, status, headers, config) {
			$scope.user = logger.check(data);
		});

		$scope.cancel = function() {
            $modalInstance.dismiss("cancel");
        };
		
		$scope.save = function() {
            $modalInstance.close($scope.selected);
        };
		
		$scope.add = function() {
			$scope.add_treatment_var = true;
        };

		$scope.cancel_location = function() {
			$scope.add_treatment_var = false;
		};
		
		$scope.add_treatment = function() {
			var error = 1;
			if ( ! $scope.treatment.name)
			{
				logger.logError("Vergeet niet de Behandelingen in te vullen!");
				error = 0;
			}
			
			if (error)
			{
				$scope.id = 0;
				$http.post("/pub/save_treatment/", $scope.treatment).success(function(data, status, headers, config) {
					if ($scope.id = logger.check(data))
					{
						$http.post("/pub/get_treatments/", {}).success(function(data, status, headers, config) {
							$scope.treatments = logger.check(data);
							for (var k in $scope.treatments)
							{
								if ($scope.treatments[k].id == $scope.id)
								{
									$scope.selected[$scope.treatment.name] = $scope.treatments[k];
								}
							}
							$scope.add_treatment_var = false;
						});
					}
				});
			}
		};
		
    };
	
	function ModalQuestionsBasicCtrl($scope, $modalInstance, $http, logger, items) {
		$scope.cancel = function() {
            $modalInstance.dismiss("cancel");
        };
		
		$scope.ok = function() {
            $modalInstance.close();
        };
    };
	
	function ModalQuestionsConfirmCtrl($scope, $modalInstance, $http, logger, items) {
		$scope.cancel = function() {
            $modalInstance.close(false);
        };
		
		$scope.ok = function() {
            $modalInstance.close(true);
        };
    };

    function PaginationDemoCtrl($scope) {
        $scope.totalItems = 64;

        $scope.currentPage = 4;

        $scope.setPage = function(pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.maxSize = 5;

        $scope.bigTotalItems = 175;

        $scope.bigCurrentPage = 1;
    };

    function TabsDemoCtrl($scope) {
        $scope.tabs = [
            {
                title: "Dynamic Title 1",
                content: "Dynamic content 1.  Consectetur adipisicing elit. Nihil, quidem, officiis, et ex laudantium sed cupiditate voluptatum libero nobis sit illum voluptates beatae ab. Ad, repellendus non sequi et at."
            }, {
                title: "Disabled",
                content: "Dynamic content 2.  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil, quidem, officiis, et ex laudantium sed cupiditate voluptatum libero nobis sit illum voluptates beatae ab. Ad, repellendus non sequi et at.",
                disabled: true
            }
        ];

        $scope.navType = "pills";
    }

    function TreeDemoCtrl($scope) {
        $scope.list = [
            {
                id: 1,
                title: "Item 1",
                items: []
            }, {
                id: 2,
                title: "Item 2",
                items: [
                    {
                        id: 21,
                        title: "Item 2.1",
                        items: [
                            {
                                id: 211,
                                title: "Item 2.1.1",
                                items: []
                            }, {
                                id: 212,
                                title: "Item 2.1.2",
                                items: []
                            }
                        ]
                    }, {
                        id: 22,
                        title: "Item 2.2",
                        items: [
                            {
                                id: 221,
                                title: "Item 2.2.1",
                                items: []
                            }, {
                                id: 222,
                                title: "Item 2.2.2",
                                items: []
                            }
                        ]
                    }
                ]
            }, {
                id: 3,
                title: "Item 3",
                items: []
            }, {
                id: 4,
                title: "Item 4",
                items: [
                    {
                        id: 41,
                        title: "Item 4.1",
                        items: []
                    }
                ]
            }, {
                id: 5,
                title: "Item 5",
                items: []
            }, {
                id: 6,
                title: "Item 6",
                items: []
            }, {
                id: 7,
                title: "Item 7",
                items: []
            }
        ];

        $scope.selectedItem = {};

        $scope.options = {};

        $scope.remove = function(scope) {
            scope.remove();
        };

        $scope.toggle = function(scope) {
            scope.toggle();
        };

        $scope.newSubItem = function(scope) {
            var nodeData;
            nodeData = scope.$modelValue;
            nodeData.items.push({
                id: nodeData.id * 10 + nodeData.items.length,
                title: nodeData.title + "." + (nodeData.items.length + 1),
                items: []
            });
        };

    }

    function MapDemoCtrl($scope, $http, $interval) {
        var i, markers;

        markers = [];

        i = 0;

        while (i < 8) {
            markers[i] = new google.maps.Marker({
                title: "Marker: " + i
            });
            i++;
        }

        $scope.GenerateMapMarkers = function() {
            var d, lat, lng, loc, numMarkers;
            d = new Date();
            $scope.date = d.toLocaleString();
            numMarkers = Math.floor(Math.random() * 4) + 4;
            i = 0;
            while (i < numMarkers) {
                lat = 43.6600000 + (Math.random() / 100);
                lng = -79.4103000 + (Math.random() / 100);
                loc = new google.maps.LatLng(lat, lng);
                markers[i].setPosition(loc);
                markers[i].setMap($scope.map);
                i++;
            }
        };

        $interval($scope.GenerateMapMarkers, 2000);

    }

})();
;
(function () {
    'use strict';

    angular.module('app.ui')
        .directive('uiTime', uiTime)
        .directive('uiNotCloseOnClick', uiNotCloseOnClick)
        .directive('slimScroll', slimScroll)
        .directive('imgHolder', imgHolder);

    function uiTime() {
        var directive = {
            restrict: 'A',
            link: link
        };

        return directive;

        function link(scope, ele) {
            var checkTime, startTime;

            startTime = function() {
                var h, m, s, t, time, today;
                today = new Date();
                h = today.getHours();
                m = today.getMinutes();
                s = today.getSeconds();
                m = checkTime(m);
                s = checkTime(s);
                time = h + ":" + m + ":" + s;
                ele.html(time);
                return t = setTimeout(startTime, 500);
            };

            checkTime = function(i) {
                if (i < 10) {
                    i = "0" + i;
                }
                return i;
            };

            startTime();
        }
    }

    function uiNotCloseOnClick() {
        return {
            restrict: 'A',
            compile: function(ele, attrs) {
                return ele.on('click', function(event) {
                    return event.stopPropagation();
                });
            }
        };
    }

    function slimScroll() {
        return {
            restrict: 'A',
            link: function(scope, ele, attrs) {
                return ele.slimScroll({
                    height: attrs.scrollHeight || '100%'
                });
            }
        };
    }

    function imgHolder() {
        return {
            restrict: 'A',
            link: function(scope, ele, attrs) {
                return Holder.run({
                    images: ele[0]
                });
            }
        };
    }

})();
;
(function () {
    'use strict';

    angular.module('app.ui')
        .factory('logger', logger)

    function logger() {

        var logIt;

        // toastr setting.
        toastr.options = {
            "closeButton": true,
            "positionClass": "toast-bottom-right",
            "timeOut": "3000"
        };

        logIt = function(message, type) {
            return toastr[type](message);
        };

        return {
            log: function(message) {
                logIt(message, 'info');
            },
            logWarning: function(message) {
                logIt(message, 'warning');
            },
            logSuccess: function(message) {
                logIt(message, 'success');
            },
            logError: function(message) {
                logIt(message, 'error');
            },
			check: function(data) {
                if (data.errors)
				{
					for (var key in data.errors)
					{
						for (var type in data.errors[key])
						{
							if (data.errors[key][type])
							{
								this['log' + ((type != 0) ? type : "Error")](data.errors[key][type]);
							}
						}
					}
				}

				if (data.result)
				{
					return data.result;
				}
				else
				{
					return false;
				}
            }
        };

    }

})();
;
(function () {
    'use strict';

    angular.module('app.ui.map', []);

})();
;
(function () {
    'use strict';

    angular.module('app.ui.map')
        .controller('jvectormapCtrl', ['$scope', jvectormapCtrl]);

    function jvectormapCtrl($scope) {
        var marker_data;

        marker_data = [
            {
                "latLng": [40.71, -74.00],
                "name": "New York"
            }, {
                "latLng": [39.90, 116.40],
                "name": "Beijing"
            }, {
                "latLng": [31.23, 121.47],
                "name": "Shanghai"
            }, {
                "latLng": [-33.86, 151.20],
                "name": "Sydney"
            }, {
                "latLng": [-37.81, 144.96],
                "name": "Melboune"
            }, {
                "latLng": [37.33, -121.89],
                "name": "San Jose"
            }, {
                "latLng": [1.3, 103.8],
                "name": "Singapore"
            }, {
                "latLng": [47.60, -122.33],
                "name": "Seattle"
            }, {
                "latLng": [41.87, -87.62],
                "name": "Chicago"
            }, {
                "latLng": [37.77, -122.41],
                "name": "San Francisco"
            }, {
                "latLng": [32.71, -117.16],
                "name": "San Diego"
            }, {
                "latLng": [51.50, -0.12],
                "name": "London"
            }, {
                "latLng": [48.85, 2.35],
                "name": "Paris"
            }, {
                "latLng": [52.52, 13.40],
                "name": "Berlin"
            }, {
                "latLng": [-26.20, 28.04],
                "name": "Johannesburg"
            }, {
                "latLng": [35.68, 139.69],
                "name": "Tokyo"
            }, {
                "latLng": [13.72, 100.52],
                "name": "Bangkok"
            }, {
                "latLng": [37.56, 126.97],
                "name": "Seoul"
            }, {
                "latLng": [41.87, 12.48],
                "name": "Roma"
            }, {
                "latLng": [45.42, -75.69],
                "name": "Ottawa"
            }, {
                "latLng": [55.75, 37.61],
                "name": "Moscow"
            }, {
                "latLng": [-22.90, -43.19],
                "name": "Rio de Janeiro"
            }
        ];

        $scope.worldMap = {
            map: 'world_mill_en',
            markers: marker_data,
            normalizeFunction: 'polynomial',
            backgroundColor: null,
            zoomOnScroll: false,
            regionStyle: {
                initial: {
                    fill: '#EEEFF3'
                },
                hover: {
                    fill: $scope.color.primary
                }
            },
            markerStyle: {
                initial: {
                    fill: '#BF616A',
                    stroke: 'rgba(191,97,106,.8)',
                    "fill-opacity": 1,
                    "stroke-width": 9,
                    "stroke-opacity": 0.5
                },
                hover: {
                    stroke: 'black',
                    "stroke-width": 2
                }
            }
        };

    }



})();
;
(function () {
    'use strict';

    angular.module('app.ui.map')
        .directive('uiJvectormap', uiJvectormap);

    function uiJvectormap() {
        return {
            restrict: 'A',
            scope: {
                options: '='
            },
            link: function(scope, ele, attrs) {
                var options;

                options = scope.options;
                ele.vectorMap(options);
            }
        }
    }

})();