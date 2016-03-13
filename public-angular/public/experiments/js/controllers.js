var app = angular.module('Experiments', ['ui.router']);

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


app.controller('SidebarCtrl', ['$scope', '$location', '$stateParams', function ($scope, $location, $stateParams) {
	$scope.links = [
		{ name: "Overview", url: "/overview/" + $stateParams.experimentId },
		{ name: "Labels", url: "/labels/" + $stateParams.experimentId },
		{ name: "Input Data", url: "/inputdata/" + $stateParams.experimentId },
		{ name: "Sources", url: "/sources/" + $stateParams.experimentId }
	];

	$scope.isActive = function (route) {
		return route === $location.path();
	};

}]);

app.controller('OverviewCtrl', ['$scope', '$http', '$stateParams', 'ExperimentData', function ($scope, $http, $stateParams, ExperimentData) {

	$scope.experiment = ExperimentData.getExperiment();
	if (!$scope.experiment) {
		$http.get('/experiments/details/' + $stateParams.experimentId)
			.then(function (response) {
				$scope.experiment = response.data[0];
			}, function (response) {
				$scope.error = response.data.errors;
			});
	}
}]);

app.controller('LabelsCtrl', ['$scope', '$http', '$stateParams', 'ExperimentData', function ($scope, $http, $stateParams, ExperimentData) {
	$scope.experiment = ExperimentData.getExperiment();
	if (!$scope.experiment) {
		$http.get('/experiments/details/' + $stateParams.experimentId)
			.then(function (response) {
				$scope.experiment = response.data[0];
			}, function (response) {
				$scope.error = response.data.errors;
			});
	}
	
	$scope.editLabels = function(){
		$scope.allLabels = [];
		$http.get('/applications/details/'+$scope.experiment.app_id)
			.then(function(response){
				console.log(response.data);
			}, function (response){
				console.log(response.data);
			});
	};
}]);

app.controller('CreateCtrl', ['$scope', '$http', function ($scope, $http) {

	(function () {
		$http.get('/applications/getjson/')
			.then(function (response) {
				$scope.applications = response.data;
			}, function (response) {
				$scope.errors = response.data.errors;
			});
	})();

	$scope.submit = function () {
		console.log($scope.experiment);
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