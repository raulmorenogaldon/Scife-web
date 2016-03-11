var app = angular.module('Experiments');


app.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: "experiments/views/index.html",
			controller: "IndexCtrl"
		})
		.when('/overview/:experimentId', {
			controller: "OverviewCtrl",
			templateUrl: "experiments/views/overview.html"
		})
		.when('/labels/:experimentId', {
			controller: "LabelsCtrl",
			templateUrl: "experiments/views/labels.html"
		})
		.when('/inputdata/:experimentId', {
			controller: "InputdataCtrl",
			templateUrl: "experiments/views/inputdata.html"
		})
		.when('/sources/:experimentId', {
			controller: "SourcesCtrl",
			templateUrl: "experiments/views/sources.html"
		})
		.when('/newexperiment', {
			templateUrl: "experiments/views/newexperiment.html",
			controller: "NewExperimentCtrl"
		})
		.otherwise({
			redirectTo: '/'
      });
});