<!doctype html>
<!--[if lt IE 8]><html class="no-js lt-ie8"> <![endif]-->
<!--[if gt IE 8]><!--><html><!--<![endif]-->
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title >Patiëntenreview</title>
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1" />

        <!-- Needs images, font... therefore can not be part of main.css -->
        <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Open+Sans:300italic,600italic,400,600,300,700" type="text/css" />
        <link rel="stylesheet" href="/application/views/fonts/themify-icons/themify-icons.min.css" />
        <link rel="stylesheet" href="/application/views/bower_components/font-awesome/css/font-awesome.min.css" />
        <link rel="stylesheet" href="/application/views/bower_components/weather-icons/css/weather-icons.min.css" />
		<link rel="stylesheet" href="/application/views/styles/ng-sortable.min.css" />
		<link rel="stylesheet" href="/application/views/styles/colorpicker.min.css" />
        <!-- end Needs images -->

		<link rel="stylesheet" href="/application/views/styles/main.css">
    </head>

    <body class="app ng-scope body-wide body-err">
        <!--[if lt IE 9]>
            <div class="lt-ie9-bg">
                <p class="browsehappy">Je gebruikt een <strong>verouderde</strong> internetbrowser.</p>
                <p><a href="http://browsehappy.com/">Download hier</a> een nieuwe browser voor een optimale gebruikerservaring.</p>
            </div>
        <![endif]-->

		<header data-ng-include="'pub/page/header'" id="header" class="header-container header-fixed bg-white">
			<header class="top-header clearfix">
				<!-- Logo -->
				<div class="logo bg-white">
					<a href="#/">
						<img src="<?php echo ( ! empty($user['logo']) ? str_replace('./', '/', $user['logo']) : '/application/views/images/logo_full.png'); ?>" alt="{{main.brand}}" />
					</a>
				</div>
				

				<!-- needs to be put after logo to make it work -->
				<div class="menu-button" toggle-off-canvas>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</div>

				<div class="top-nav">
					<ul class="nav-left list-unstyled">
						<li>
							<a href="#/" data-toggle-nav-collapsed-min class="toggle-min"><i class="ti-menu"></i></a>
						</li>
					</ul>

					<ul class="nav-right pull-right list-unstyled">
						<li class="dropdown text-normal nav-profile">
							<a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown">
								<span>
									<span data-i18n="<?php echo @$user['username']; ?>"></span>
								</span>
							</a>
							<ul class="dropdown-menu with-arrow pull-right">
								<li>
									<a href="#/pages/lock-screen">
										<i class="ti-lock"></i>
										<span data-i18n="Vergrendel"></span>
									</a>
								</li>
								<li>
									<a href="javascript:void(0);" ng-click="logout()">
										<i class="ti-export"></i>
										<span data-i18n="Log uit"></span>
									</a>
								</li>
							</ul>
						</li>
					</ul>
					
					<?php if ( ! empty($user['trial_end']) && $user['account'] == 2) { ?>
					<ul class="nav-right pull-right list-unstyled">
						<li>
							<?php if ($user['trial_end'] <= 5) { ?>
							<a href="#/pages/subscription" class="top-label-link">
							<?php } else { ?>
							<a href="javascript:void(0);" class="top-label-link" ng-click="renew_modal()">
							<?php } ?>
								<span class="top-label<?php echo $user['trial_end'] <= 5 ? " red" : ""; ?>">
									<span data-i18n="Nog <?php echo $user['trial_end']; ?> dagen"></span>
								</span>
							</a>
						</li>
					</ul> 
					<?php } ?>
					
					<ul class="nav-right pull-right list-unstyled" ng-if="user.admin_id && user.id != user.admin_id">
						<li class="users_list">
							<select class="form-control" ng-model="users_list" ng-change="login_as_user(users_list)">
								<option value="">&nbsp;</option>
								<option ng-repeat="u in users_select" value="{{u.id}}" ng-selected="u.id == user.id">{{u.username}}</option>
							</select>
						</li>
						<li>
							<a href="javascript:void(0);" class="top-label-link" ng-click="logout_as_user()">
								<span class="top-label">
									Log uit
								</span>
							</a>
						</li>
					</ul> 
				</div>
			</header>
		</header>
		<!-- CHANGED -->

        <div class="main-container" data-ng-class="{ 'app-nav-horizontal': admin.menu === 'horizontal' }">
            <aside id="nav-container" class="nav-container" data-ng-class="{ 'nav-fixed': admin.fixedSidebar,
                                    'nav-horizontal': admin.menu === 'horizontal',
                                    'nav-vertical': admin.menu === 'vertical',
                                    'bg-white': ['31','32','33','34','35','36'].indexOf(admin.skin) >= 0,
                                    'bg-dark': ['31','32','33','34','35','36'].indexOf(admin.skin) < 0
                   }">
            </aside>

            <div id="content" class="content-container">
               <div class="page-err">
					<div class="err-container text-center">
						<div class="err">
							<h1>404</h1>
							<h2>Sorry. We kunnen de opgevraagde pagina niet vinden.</h2>
						</div>

						<div class="err-body">
							<a href="/#/" class="btn btn-lg btn-goback">
								<span class="ti-home"></span>
								<span class="space"></span>
								Ga naar de inlogpagina
							</a>
						</div>
					</div>
				</div>
            </div>

            <footer data-ng-include="'pub/page/footer'" id="footer" class="app-footer">
				<a href="javascript:void(0);" class="pull-right" ng-click="send_feedback()">Feedback</a>
				<a href="javascript:void(0);" class="pull-right start_intro" ng-if="user.login_count <= 10" ng-click="start_intro()">Herstart introductie</a>
				&copy; <?php echo date("Y"); ?> Patiëntenreview • Alle rechten voorbehouden.
            </footer>
        </div>

        <script src="http://maps.google.com/maps/api/js?sensor=false"></script>
        <script src="application/views/scripts/vendor.js"></script>
        <script src="application/views/scripts/ui.js"></script>
		<script src="application/views/scripts/angular-upload.min.js"></script>
		<script src="application/views/scripts/ng-sortable.min.js"></script>
		<script src="application/views/scripts/bootstrap-colorpicker-module.min.js"></script>
		<script src="application/views/scripts/app.js"></script>
    </body>
</html>