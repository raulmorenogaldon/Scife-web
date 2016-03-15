var app = angular.module('Experiments', ['ui.router','angularTreeview']);

app.controller('IndexCtrl', ['$scope', '$http', 'ExperimentData',
	function ($scope, $http, ExperimentData) {
		$http.get('/experiments/list/')
			.then(function (response) {
				$scope.experiments = response.data;
			}, function (response) {
				$scope.errors = response.data.errors;
			});
			
		$http.get('/applications/list/')
			.then(function (response) {
				$scope.applications = response.data;
			}, function (response) {
				$scope.errors = response.data.errors;
			});

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
				$scope.experiment = response.data;
			}, function (response) {
				$scope.error = response.data.errors;
			});
	}
}]);

app.controller('LabelsCtrl', ['$scope', '$http', '$stateParams', 'ExperimentData', function ($scope, $http, $stateParams, ExperimentData) {
	//$scope.experiment = ExperimentData.getExperiment();// Get the experiment from the service.
	$scope.showForm = false;

	$http.get('/experiments/details/' + $stateParams.experimentId)
		.then(function (response) {
			$scope.experiment = response.data;
			$scope.oldLabels = JSON.parse(JSON.stringify(response.data.labels));
			$http.get('/applications/details/' + $scope.experiment.app_id)
				.then(function (data) {
					$scope.application = data.data;
				}, function (data) {
					$scope.errors = response.data.errors;
				});
		}, function (response) {
			$scope.errors = response.data.errors;
		});

	$scope.editLabels = function () {
		$scope.showForm = true;
	};

	$scope.submit = function () {
		$http.put('/experiments/' + $scope.experiment.id, { labels: $scope.experiment.labels })
			.then(function (response) {
				$scope.message = response.data.message;
				$scope.showForm = false;
				$scope.oldLabels = JSON.parse(JSON.stringify($scope.experiment.labels));
			}, function (response) {
				console.log(response);
			});
	};

	$scope.cancel = function () {
		$scope.showForm = false;
		$scope.experiment.labels = $scope.oldLabels;
	};
}]);

app.controller('CreateCtrl', ['$scope', '$http', function ($scope, $http) {

		$http.get('/applications/list/')
			.then(function (response) {
				$scope.applications = response.data;
			}, function (response) {
				$scope.errors = response.data.errors;
			});

	$scope.submit = function () {
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

app.controller('SourcesCtrl', ['$scope','$http','$stateParams', function ($scope, $http, $stateParams) {
	
	$http.get('/experiments/details/'+$stateParams.experimentId)
			.then(function (response) {
				$scope.experiment = response.data;
				console.log($scope.experiment);
			}, function (response) {
				$scope.errors = response.data.errors;
			});
	
	$scope.treedata = [
    { "label" : "Grandes Exitos", "id" : "role1", "children" : [
        { "label" : "El Fari", "id" : "role11", "children" : [] },
        { "label" : "Mis preferidos", "id" : "role12", "children" : [
            { "label" : "Antiguos", "id" : "role121", "children" : [
                { "label" : "Pinpinela", "id" : "role1211", "children" : [] },
                { "label" : "Chayane", "id" : "role1212", "children" : [] }
            ]}
        ]}
    ]},
    { "label" : "Lista de la compra", "id" : "role2", "children" : [] },
    { "label" : "Calendario", "id" : "role3", "children" : [] }
];
}]);