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
		'colorpicker.module'
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
                'charts/charts',
                'pages/404', 'pages/500', 'pages/forgot-password', 'pages/new-password/:hash', 'pages/lock-screen', 'pages/signin', 'pages/signup',
				'pages/profile', 'pages/subscription', 'pages/advanced', 'pages/doctors_add', 'pages/doctors_edit/:id', 'pages/locations_add', 'pages/locations_add/:id', 'pages/online', 'pages/activate/:id', 'pages/invoice/:id', 
                'mail/compose', 'mail/inbox', 'mail/single/:id', 'mail/reply/:id',
				'manage/add', 'manage/view', 'charts/acharts', 'charts/stat'
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
		
		$scope.login_as_user = function(users_id) {
			$http.post("/pub/login_as_user/", {id: users_id}).success(function(data, status, headers, config) {
				if (logger.check(data))
				{
					$window.location.reload();
				}
			});
		};
		
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
					$scope.stat.average = ($scope.stat.average_online * 1).toFixed(1);
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
		$scope.ultimate_class = {};
        $scope.ultimate_over = function(name)
        {
            $scope.ultimate_class[name] = 'over';
        };
        
        $scope.ultimate_out = function(name)
        {
            $scope.ultimate_class[name] = '';
        }
		
		$scope.type = 'email';
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
		
		$scope.change_type = function(type)
		{
			if (type != $scope.type)
			{
				$scope.type = type;
				$scope.get();
			}
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
									emphasis: {label: {show: true, position: "center", textStyle: {fontSize: "30", fontWeight: "bold"}}}},
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
		$scope.get_email = function() {
			$http.post("/pub/stat_chart2/", {'filter': $scope.stat_filter_list}).success(function(data, status, headers, config) {
				$scope.data = logger.check(data);
				$scope.color = $scope.user.color || '#0F75BC';
				$scope.color_a = $scope.hex_to_rgba($scope.color, 50);
				
				var is_filter = false;
				for (var k in $scope.stat_filter_list)
				{
					is_filter = true;
				}

				if ($scope.data.for_user >= 30 || (is_filter && $scope.data.for_user > 0))
				{
					$scope.less_30 = false;
					$scope.empty_filter = false;

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
						for (var m in $scope.data.average_all_month)
						{
							data.push($scope.data.average_all_month[m]);
						}
						series.push({type: 'line', name: 'Landelijk gemiddelde', data: data});
						
						data = [];
						for (var m in $scope.data.average_my_month)
						{
							data.push($scope.data.average_my_month[m]);
						}
						series.push({type: 'line', name: 'Beoordeling van uw praktijk', data: data, itemStyle: {normal: {color: $scope.color, borderColor: $scope.color, lineStyle: {color: $scope.color}, areaStyle: {color: $scope.color_a}}}});
						
						$scope.area_averages.setOption({xAxis: [{data: $scope.data.average_month_x}],
														yAxis: [{min: 0, max: max}],
														series: series});
					}
					
					if ($scope.data && $scope.data.average_month)
					{
						var series = [];
						var max = 0;
						var max_num = {};
						for (var i = 5; i > 0; i--)
						{
							var data = [];
							for (var m in $scope.data.average_month[i])
							{
								data.push($scope.data.average_month[i][m]);
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

						for (var m in $scope.data.nps_all_month)
						{
							data.push($scope.data.nps_all_month[m]);
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
							data.push($scope.data.nps_my_month[m]);
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
					}
					
					if ($scope.data && $scope.data.history_nps)
					{
						var series = [];
						var data = [];
						var max = 0;
						var max_num = {};
						for (var m in $scope.data.history_nps['45'])
						{
							data.push($scope.data.history_nps['45'][m]);
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
							data.push($scope.data.history_nps['3'][m]);
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
							data.push($scope.data.history_nps['12'][m]);
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
		$scope.tags = ['[VRAAGSTELLING]', '[Formulering van de vraagstelling]', '[AANHEF PATIËNT]', '[VOORNAAM PATIËNT]', '[ACHTERNAAM PATIËNT]', '[AANHEF ZORGVERLENER]', '[VOORNAAM ZORGVERLENER]', '[ACHTERNAAM ZORGVERLENER]', '[ONDERWERP VAN E-MAIL]', '[NAAM PRAKTIJK]'];
		
		$scope.find_tags = function(text, key) {
			if (text)
			{
				for (var k in $scope.tags)
				{
					text = text.replace($scope.tags[k], "<span class='tag-box'>" + $scope.tags[k].replace("[", "").replace("]", "") + "<a href='javascript:void(0);' class='tag-remove' rel='" + key + "|" + $scope.tags[k] + "'>×</a></span>");
				}
			}
			
			return text;
		};

		$scope.emails_edit = function(type, $event) {
			if ($event.target.className == "tag-remove")
			{
				var rel = $event.target.getAttribute("rel");
				var part = rel.split("|");
				if (part[1].toLowerCase() == '[vraagstelling]' || part[1].toLowerCase() == '[formulering van de vraagstelling]')
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
					resolve: {
						items: function() {
							return {value: $scope.user.emails[type], type: type};
						}
					}
				});
				
				modalInstance.result.then((function(items) {
					if (items.type == 'header_mq' && ! (items.value.toLowerCase().indexOf('[vraagstelling]') + 1) || items.type == 'text1_mq' && ! (items.value.toLowerCase().indexOf('[formulering van de vraagstelling]') + 1))
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
			var tags = {title: '[AANHEF PATIËNT]',
						name: '[VOORNAAM PATIËNT]',
						sname: '[ACHTERNAAM PATIËNT]',
						doctors_title: '[AANHEF ZORGVERLENER]',
						doctors_name: '[VOORNAAM ZORGVERLENER]',
						doctors_sname: '[ACHTERNAAM ZORGVERLENER]'};
						
			var fields = ['subject', 'header', 'text1', 'promo', 'text2', 'footer'];
			for (var i in fields)
			{
				for (var key in tags)
				{
					if ($scope.user.emails[fields[i]].indexOf(tags[key]) + 1)
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
						return existing_tags;
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
			if ($scope.user.account_type == 0 && $scope.user.organization == 0)
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
		$scope.new_question = '';
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
				$scope.edit_questions[item.id].name = item;
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
			if ($scope.new_question && $scope.new_question.id)
			{
				$http.post("/pub/questions_save/", {questions_id: $scope.new_question.id}).success(function(data, status, headers, config) {
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
		
		$scope.edit_questions = function(questions_id)
		{
			$scope.edit_question[questions_id] = 1;
		};
		
		$scope.change_edit_question = function(questions_id)
		{
			$scope.edit_questions[questions_id].desc = $scope.edit_questions[questions_id].name['question_description'];
		};
		
		$scope.save_questions = function(questions_id)
		{
			$http.post("/pub/questions_edit/", {questions_id: questions_id, new_id: $scope.edit_questions[questions_id].name.id}).success(function(data, status, headers, config) {
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
						if (k == 0 && $scope.user.mobile[k] != '+')
						{
							logger.logError("Het telefoonnummer moet beginnen met een landcode");
							mobile_check = false;
						}
						
						if (k > 0 && ! ( ! isNaN(parseFloat($scope.user.mobile[k])) && isFinite($scope.user.mobile[k])))
						{
							numeric = false;
						}
					}
					
					if ( ! numeric)
					{
						logger.logError("Het telefoonnummer kan enkel nummers bevatten");
						mobile_check = false;
					}
					
					if ($scope.user.mobile.length < 12 || $scope.user.mobile.length > 13)
					{
						logger.logError("Het telefoonnummer moet tussen de 11 en 12 tekens bevatten");
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
        .controller('SubscriptionCtrl', [ '$scope', '$rootScope', '$window', '$http', '$location', '$modal', 'logger', SubscriptionCtrl]); // overall control

    function SubscriptionCtrl($scope, $rootScope, $window, $http, $location, $modal, logger) {
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
			
			if ($scope.info.account != $scope.user.account || $scope.info.account_type != $scope.user.account_type)
			{
				$window.location.reload();
			}
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
		
		$scope.next_step = function()
		{
			$scope.step = 2;
			$scope.info = {};
			$http.post("/pub/invoice_info/", {id: $scope.user.id, type: $scope.type[0]}).success(function(data, status, headers, config) {
				$scope.info = logger.check(data);
				for (var k in $scope.info.doctors)
				{
					$scope.doctors.push($scope.info.doctors[k]);
				}
				
				$scope.info.price = ($scope.type[0] == 0 ? $scope.info.base_amount : $scope.info.pro_amount);
				$scope.info.amount = $scope.info.amount == 0 ? ($scope.info.price + $scope.info.doctors_amount) : $scope.info.amount;
			});
		};
    }

})();
;
(function () {
    'use strict';

    angular.module('app')
        .controller('OnlineCtrl', [ '$scope', '$rootScope', '$window', '$http', '$location', '$modal', 'logger', OnlineCtrl]); // overall control

    function OnlineCtrl($scope, $rootScope, $window, $http, $location, $modal, logger) {
		$scope.online = ['google', 'facebook', 'zorgkaart', 'independer'];
		if ($scope.user.account == '2' || $scope.user.account_type == '1')
		{
			$scope.online = ['google', 'facebook', 'zorgkaart', 'telefoonboek', 'vergelijkmondzorg', 'independer', 'kliniekoverzicht', 'own'];
		}
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
		}
		
		if ($location.path() == "/pages/doctors_add")
		{
			$scope.amount = {};
			$http.get("/pub/get_amount/").success(function(data, status, headers, config) {
				var result;
				if (result = logger.check(data))
				{
					for (var key in result)
					{
						$scope.amount[key] = result[key];
					}
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
					if ( ! $scope.doctor.zorgkaart)
					{
						logger.logError("Vergeet niet het Zorgkaart profiel in te vullen!");
						error = 0;
					}
					
					if (error)
					{
						$http.get("/pub/get_doctors_price/").success(function(data, status, headers, config) {
							var result = logger.check(data);
							$scope.amount.doctor_amount = result.price.price;
							$scope.amount.doctor_days = result.price.days;
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
		
		if ($location.path().indexOf("/pages/doctors_edit") + 1)
		{
			var id = $location.path().split("/").pop();
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

		$scope.check_link = function(type)
		{
			type = type || 'doctor';
			$scope.zorgkaart = "none";
			if ($scope[type].zorgkaart && $scope[type].zorgkaart != '')
			{
				if ( ! ($scope[type].zorgkaart.indexOf("https://www.zorgkaartnederland.nl/zorgverlener/") + 1) && ! ($scope[type].zorgkaart.indexOf("http://www.zorgkaartnederland.nl/zorgverlener/") + 1) &&  ! ($scope[type].zorgkaart.indexOf("https://zorgkaartnederland.nl/zorgverlener/") + 1) && ! ($scope[type].zorgkaart.indexOf("http://zorgkaartnederland.nl/zorgverlener/") + 1))
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
			$scope.check_link();
			if ($scope.zorgkaart == "valid")
			{
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
			}
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
        .controller('InvitationCtrl', [ '$scope', '$rootScope', '$window', '$http', '$location', '$modal', 'logger', InvitationCtrl]); // overall control

    function InvitationCtrl($scope, $rootScope, $window, $http, $location, $modal, logger) {
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

		$scope.init = function()
		{
			var segments = $window.location.pathname.split('/');
			$http.post("/pub/rating_page_get/", {segments: segments}).success(function(data, status, headers, config) {
				$scope.i = logger.check(data);
				if ($scope.i)
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
					$scope.ex = $scope.i.info ? $scope.i.info.ex : $scope.ex;
					$scope.limit = $scope.i.info ? $scope.i.info.limit : $scope.limit;
					$scope.errors = $scope.i.info ? $scope.i.info.errors : $scope.errors;
					
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
				
				$scope.apps.title =  ! $scope.i.user.username ? "Oeps..." : ("Beoordeel " + $scope.i.user.username + " - Patiëntenreview");
				$scope.apps.ready = true;
			});
		};
		
		$scope.init();
		
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
		
		$scope.set_doctor = function() {
			$scope.doctors_id = $scope.doc.id;
			$http.post("/pub/vote_doc/", {id: $scope.id, users_id: $scope.users_id, doctors_id: $scope.doctors_id}).success(function(data, status, headers, config) {
				var result = logger.check(data);
				if (result.doctor)
				{
					$scope.i.doctor = result.doctor;
				}
				$scope.rebuild_onlines();
			});
		};
		
		$scope.set_location = function() {
			$scope.locations_id = $scope.loc.id;
			$http.post("/pub/vote_loc/", {id: $scope.id, users_id: $scope.users_id, locations_id: $scope.locations_id}).success(function(data, status, headers, config) {
				var result = logger.check(data);
				if (result.location)
				{
					$scope.i.location = result.location;
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
		
		$scope.undo = function() {
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
					console.log(result);
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

		$scope.click = function(type, url)
		{
			if ( ! $scope.ex)
			{
				type = type || false;
				if (type)
				{
					$http.post("/pub/click/", {id: $scope.id, users_id: $scope.users_id, doctors_id: $scope.doctors_id, type: type}).success(function(data, status, headers, config) {
						$scope.id = logger.check(data);
						$window.location.href = url;
					});
				}
			}
			else
			{
				$window.location.href = url;
			}
		};
    }

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

			$http.post("/pub/inbox/", {filter: filter}).success(function(data, status, headers, config) {
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
			$scope.reprint();
		};
		
		
		
		var init;
        $scope.searchKeywords = '';
        $scope.filteredStores = [];
        $scope.row = '-date';

        $scope.select = function(page) {
            var end, start;
            start = (page - 1) * $scope.numPerPage;
            end = start + $scope.numPerPage;
            return $scope.currentPageStores = $scope.filteredStores.slice(start, end);
        };

        $scope.onFilterChange = function() {
            $scope.select(1);
            $scope.currentPage = 1;
            return $scope.row = '-date';
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
            $scope.filteredStores = $filter('filter')($scope.letters, $scope.searchKeywords);
            return $scope.onFilterChange();
        };

        $scope.order = function(rowName) {
            /*if ($scope.row === rowName && ! reprint) {
                return;
            }*/
            $scope.row = rowName;
            $scope.filteredStores = $filter('orderBy')($scope.letters, rowName);
            return $scope.onOrderChange();
        };

        $scope.numPerPageOpt = [10, 20, 30, 50];
        $scope.numPerPage = $scope.numPerPageOpt[2];
        $scope.currentPage = 1;
        $scope.currentPageStores = [];

        init = function() {
			$scope.order($scope.row);
            return $scope.select($scope.currentPage);
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

			$scope.keys = Object.keys($scope.headers);
			if ($scope.all_data && $scope.all_data.length)
			{
				$scope.reprint_rows();
			}
		};
		
		$scope.rows_shown = 0;
		$scope.rows_all = 0;
		$scope.doctors = [];
		$scope.unknown_doctors = [];
		$scope.locations = [];
		$scope.unknown_locations = [];
		$scope.reprint_rows = function()
		{
			$scope.unknown_doctors = [];
			$scope.unknown_locations = [];
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

			modalInstance.result.then((function(ids) {
				$http.post("/pub/upload_help/", {file: $scope.file}).success(function(data, status, headers, config) {
					logger.check(data);
					$location.url("/dashboard");
				});
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
					}
				});
			};
			
			$scope.code_resend = function() {
				$scope.code_wait = true;
				$http.post("/pub/code_resend/", {}).success(function(data, status, headers, config) {
					$scope.code_wait = false;
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
						logger.logError("Passwords don't match");
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
		.controller('ModalInstanceSuspendPopupCtrl', ['$scope', '$modalInstance', '$http', '$location', 'logger', 'items', ModalInstanceSuspendPopupCtrl])
		.controller('ModalInstanceTestEmailCtrl', ['$scope', '$modalInstance', '$http', '$location', 'logger', 'items', ModalInstanceTestEmailCtrl])
		.controller('ModalInstanceStarsEditCtrl', ['$scope', '$modalInstance', '$http', '$location', 'logger', 'items', ModalInstanceStarsEditCtrl])
		.controller('ModalInstanceIntroCtrl', ['$scope', '$modalInstance', '$http', '$window', '$location', '$timeout', 'logger', 'items', ModalInstanceIntroCtrl])
		.controller('ModalExampleCtrl', ['$scope', '$modalInstance', '$http', 'logger', 'items', ModalExampleCtrl])
		.controller('ModalExampleInvCtrl', ['$scope', '$modalInstance', '$http', 'logger', 'items', ModalExampleInvCtrl])
		.controller('ModalExampleNegativeCtrl', ['$scope', '$modalInstance', '$http', 'logger', 'items', ModalExampleNegativeCtrl])
		.controller('ModalInstanceBulkCtrl', ['$scope', '$modalInstance', '$http', 'logger', 'items', ModalInstanceBulkCtrl])
		.controller('ModalUnsubscribeCtrl', ['$scope', '$modalInstance', '$http', 'logger', 'items', ModalUnsubscribeCtrl])
		.controller('ModalUndoCtrl', ['$scope', '$modalInstance', '$http', 'logger', 'items', ModalUndoCtrl])
		.controller('ModalInstanceHelpCtrl', ['$scope', '$modalInstance', '$http', 'logger', 'items', ModalInstanceHelpCtrl])
		.controller('ModalDefineDoctorsCtrl', ['$scope', '$modalInstance', '$http', 'logger', 'items', ModalDefineDoctorsCtrl])
		.controller('ModalFirstUploadCtrl', ['$scope', '$modalInstance', '$http', 'logger', 'items', ModalFirstUploadCtrl])
		.controller('ModalDefineLocationsCtrl', ['$scope', '$modalInstance', '$http', 'logger', 'items', ModalDefineLocationsCtrl])
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

		$scope.date = {};
		$scope.date.activation = new Date($scope.user.activation * 1000);
		$scope.date.suspension = new Date($scope.user.suspension * 1000);
		$scope.date.trial_end = new Date($scope.user.trial_end * 1000);
		
		$scope.fake_type_change = function() {
			$scope.user.organization = ($scope.user.fake_type == '2' ? '1' : '0');
			$scope.user.account_type = ($scope.user.fake_type == '2' ? '1' : $scope.user.fake_type);
		};
		
		$scope.organization_change = function() {
			$scope.user.fake_type = ($scope.user.organization == '1' ? '2' : $scope.user.account_type);
		};

        $scope.ok = function() {
			$scope.user.activation = $scope.date.activation;
			$scope.user.suspension = $scope.date.suspension;
			$scope.user.trial_end = $scope.date.trial_end;
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
        $scope.value = items.value.replace(/<br \/>/g, "\n");
		$scope.type = items.type;
		
		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
        };
		
		$scope.save = function() {
			$modalInstance.close({value: $scope.value.replace(/\n/g, "<br />"), type: $scope.type});
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
	
	function ModalInstanceSuspendPopupCtrl($scope, $modalInstance, $http, $location, logger, items) {
		$scope.ok = function() {
			$modalInstance.dismiss("cancel");
        };
    };
	
	function ModalInstanceTestEmailCtrl($scope, $modalInstance, $http, $location, logger, items) {
		$scope.items = items;
		$scope.test = {};
		
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
				logger.logError("All fields are required");
			}
			else
			{
				$modalInstance.close($scope.test);
			}
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
            $modalInstance.dismiss("cancel");
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