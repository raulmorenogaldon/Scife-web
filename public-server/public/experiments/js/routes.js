var app = angular.module('Experiments')
	.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/");

		//Defines the html template and the controller when te user acces to the root route /. Return the index html and its controller.
		$stateProvider.state('index', {
			url: '/',
			views: {
				'content': {
					templateUrl: "/experiments/views/index.html",
					controller: "IndexCtrl"
				}
			}
		});

		//Defines the html templates and the controller when te user acces to the overview route /overview. Return the overview and sidebar htmls, and their controllers.
		$stateProvider.state('overview', {
			url: '/overview/:experimentId',
			views: {
				'content': {
					templateUrl: "/experiments/views/overview.html",
					controller: "OverviewCtrl"
				},
				'sidebar': {
					controller: "SidebarCtrl",
					templateUrl: "/experiments/views/sidebar.html"
				}
			}
		});

		//Defines the html templates and the controller when te user acces to the create route /create. Return the create and its controller
		$stateProvider.state('create', {
			url: '/create',
			views: {
				'content': {
					templateUrl: "/experiments/views/create.html",
					controller: "CreateCtrl"
				}
			}
		});

		//Defines the html templates and the controller when te user acces to the labels route /labels. Return the labels and the sidebar htmls, and their controllers
		$stateProvider.state('labels', {
			url: '/labels/:experimentId',
			views: {
				'content': {
					templateUrl: "/experiments/views/labels.html",
					controller: "LabelsCtrl"
				},
				'sidebar': {
					controller: "SidebarCtrl",
					templateUrl: "/experiments/views/sidebar.html"
				}
			}
		});

		//Defines the html templates and the controller when te user acces to the inputData route /inputData. Return the inputdata and the sidebar htmls, and their controllers
		$stateProvider.state('inputData', {
			url: '/inputdata/:experimentId',
			views: {
				'content': {
					templateUrl: "/experiments/views/inputdata.html",
					controller: "InputDataCtrl"
				},
				'sidebar': {
					controller: "SidebarCtrl",
					templateUrl: "/experiments/views/sidebar.html"
				}
			}
		});

		//Defines the html templates and the controller when te user acces to the sources route /sources. Return the sources and the sidebar htmls, and their controllers
		$stateProvider.state('sources', {
			url: '/sources/:experimentId',
			views: {
				'content': {
					templateUrl: "/experiments/views/sources.html",
					controller: "SourcesCtrl"
				},
				'sidebar': {
					controller: "SidebarCtrl",
					templateUrl: "/experiments/views/sidebar.html"
				}
			}
		});

		//Defines the html templates and the controller when te user acces to the logs route /logs. Return the log and the sidebar htmls, and their controllers
		$stateProvider.state('logs', {
			url: '/logs/:experimentId',
			views: {
				'content': {
					templateUrl: "/experiments/views/logs.html",
					controller: "LogsCtrl"
				},
				'sidebar': {
					controller: "SidebarCtrl",
					templateUrl: "/experiments/views/sidebar.html"
				}
			}
		});

		//Defines the html templates and the controller when te user acces to the map route /map. Return the map and the sidebar htmls, and their controllers
		$stateProvider.state('map', {
			url: '/map/:experimentId',
			views: {
				'content': {
					templateUrl: "/experiments/views/map.html",
					controller: "MapCtrl"
				},
				'sidebar': {
					controller: "SidebarCtrl",
					templateUrl: "/experiments/views/sidebar.html"
				}
			}
		});
	}]);