var app = angular.module('Experiments', ['ngRoute']);

app.controller('IndexCtrl', ['$scope', '$http', 'ExperimentData',
	function ($scope, $http, ExperimentData) {
		(function () {
			$http.get('/experiments/getexperiments/')
				.then(function (response) {
					$scope.experiments = response.data;
				}, function (response) {
					$scope.errors = response.data.errors;
				});
		})();

		$scope.saveExperiment = function (experiment) {
			ExperimentData.setExperiment(experiment);
		};
	}]);


app.controller('SidebarCtrl', ['$location', '$routeParams', function ($location, $routeParams) {
	this.links = [
		{ name: "Overview", url: "/overview/" + $routeParams.experimentId },
		{ name: "Labels", url: "/labels/" + $routeParams.experimentId },
		{ name: "Input Data", url: "/inputdata/" + $routeParams.experimentId },
		{ name: "Sources", url: "/sources/" + $routeParams.experimentId }
	];

	this.isActive = function (route) {
		return route === $location.path();
	};

}]);

app.controller('OverviewCtrl', ['$scope', '$http', '$routeParams', 'ExperimentData', function ($scope, $http, $routeParams, ExperimentData) {

	$scope.experiment = ExperimentData.getExperiment();
	if (!$scope.experiment) {
		$http.get('/experiments/details/' + $routeParams.experimentId)
			.then(function (response) {
				$scope.experiment = response.data[0];
			}, function (response) {
				$scope.error = response.data.errors;
			});
	}
}]);

app.controller('LabelsCtrl', ['$scope', '$http', '$routeParams', 'ExperimentData', function ($scope, $http, $routeParams, ExperimentData) {
	$scope.experiment = ExperimentData.getExperiment();
	if (!$scope.experiment) {
		$http.get('/experiments/details/' + $routeParams.experimentId)
			.then(function (response) {
				$scope.experiment = response.data[0];
			}, function (response) {
				$scope.error = response.data.errors;
			});
	}
}]);

app.controller('NewExperimentCtrl', ['$scope','$http', function ($scope, $http) {
	$scope.nombre = "hola";

	console.log($scope.nombre);
	$http.get('/applications/getjson/')
		.then(function (response) {
			$scope.applications = response.data;
		}, function (response) {
			$scope.errors = response.data.errors;
		});

			$scope.submitForm = function () {
		$scope.msg = null;
		$scope.errors = null;
		$http.post('/experiments/create', $scope.experiment)
			.then(function (response) {
				$scope.message = response.data.message;
			}, function (response) {
				$scope.errors = response.data.errors;
			});
			};
}]);

app.controller('InputDataCtrl', ['$scope', function ($scope) {

}]);

app.controller('SourcesData', ['$scope', function ($scope) {

}]);