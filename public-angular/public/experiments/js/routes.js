'use strict';
var app = angular.module('Experiments');

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/");

	$stateProvider.state('index',{
			url: '/',
			views: {
				'content': {
					templateUrl: "experiments/views/index.html",
					controller: "IndexCtrl"
				}
			}
		});

	$stateProvider.state('overview',{
			url: '/overview/:experimentId',
			views: {
				'content': {
					templateUrl: "experiments/views/overview.html",
					controller: "OverviewCtrl"
				},
				'sidebar': {
					controller: "SidebarCtrl",
					templateUrl: "experiments/views/sidebar.html"
				}
			}
		});

	$stateProvider.state('create',{
			url: '/create',
			views: {
				'content': {
					templateUrl: "experiments/views/create.html",
					controller: "CreateCtrl"
				}
			}
		});
		
		$stateProvider.state('labels',{
			url: '/labels/:experimentId',
			views: {
				'content': {
					templateUrl: "experiments/views/labels.html",
					controller: "LabelsCtrl"
				},
				'sidebar': {
					controller: "SidebarCtrl",
					templateUrl: "experiments/views/sidebar.html"
				}
			}
		});
		
		$stateProvider.state('sources',{
			url: '/sources/:experimentId',
			views: {
				'content': {
					templateUrl: "experiments/views/sources.html",
					controller: "SourcesCtrl"
				},
				'sidebar': {
					controller: "SidebarCtrl",
					templateUrl: "experiments/views/sidebar.html"
				}
			}
		});
}]);