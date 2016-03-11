var app = angular.module('Experiments');


app.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			controller: "IndexCtrl",
			templateUrl: "experiments/views/index.html"
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
			controller: "NewExperimentCtrl",
			templateUrl: "experiments/views/newexperiment.html"
		})
		.otherwise({
			redirectTo: '/'
      });
});