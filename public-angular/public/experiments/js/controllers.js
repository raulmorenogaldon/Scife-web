var app = angular.module('Experiments', ['ui.router', 'angularTreeview'])

.controller('SidebarCtrl', ['$scope', '$location', '$stateParams', function($scope, $location, $stateParams) {
	$scope.links = [{
		name: "Overview",
		url: "/overview/" + $stateParams.experimentId
	}, {
		name: "Labels",
		url: "/labels/" + $stateParams.experimentId
	}, {
		name: "Input Data",
		url: "/inputdata/" + $stateParams.experimentId
	}, {
		name: "Sources",
		url: "/sources/" + $stateParams.experimentId,
		disabled: true
	}, {
		name: "Logs",
		url: "/logs/" + $stateParams.experimentId
	}];

	$scope.isActive = function(route) {
		return route === $location.path();
	};

}])

.controller('IndexCtrl', ['$scope', '$http', 'ExpDataService',
	function($scope, $http, ExpDataService) {
		function getList() {
			$http.get('/experiments/list/')
				.then(function(response) {
					$scope.experiments = response.data;
					$http.get('/applications/list/')
						.then(function(data) {
							$scope.experiments.forEach(function(exp) {
								exp.app = angular.copy(data.data.find(function(app) {
									return app.id === exp.app_id;
								}));
							});
						}, function(response) {
							$scope.errors = response.data.errors;
						});
				}, function(response) {
					$scope.errors = response.data.errors;
				});
		}
		getList();

		$scope.saveExp = function(exp) {
			ExpDataService.set(exp);
		};

		$scope.selectExpToDelete = function(exp) {
			$scope.deleteExpSelect = exp;
		};

		$scope.deleteSubmit = function() {
			$http.delete('/experiments/' + $scope.deleteExpSelect.id)
				.then(function(response) {
					getList();
					$scope.message = "Experiment " + $scope.deleteExpSelect.name + " delete successfuly.";
					ExpDataService.set(null);
				}, function(response) {
					$scope.errors = "There is an error in the request";
				});
			jQuery('#deleteModal').modal('hide');
		};
	}
])

.controller('OverviewCtrl', ['$scope', '$http', '$stateParams', 'ExpDataService', '$interval', '$location', function($scope, $http, $stateParams, ExpDataService, $interval, $location) {
	var timer;
	$scope.experiment = ExpDataService.get();
	if (!$scope.experiment) {
		$http.get('/experiments/details/' + $stateParams.experimentId)
			.then(function(response) {
				$scope.experiment = response.data;
				$http.get('/applications/details/' + $scope.experiment.app_id)
					.then(function(data) {
						$scope.experiment.app = data.data;
					}, function(data) {
						$scope.errors = data.data.errors;
					});
			}, function(response) {
				$scope.errors = response.data.errors;
				console.log($scope.errors);
			});
	}


	$scope.refreshStatus = function() {
		$http.get('/experiments/details/' + $stateParams.experimentId)
			.then(function(response) {
				$scope.experiment.status = response.data.status;
			}, function(response) {
				$scope.errors = response.data.errors;
			});
	};

	$scope.launchModal = function() {
		$scope.launchData = {};
		$http.get('/images/list')
			.then(function(response) {
				$scope.images = response.data;
				$scope.launchData.image_id = response.data[0].id;
			}, function(response) {
				$scope.errors = response.data.errors;
			});
		$http.get('/sizes/list')
			.then(function(response) {
				$scope.sizes = response.data;
				$scope.launchData.size_id = response.data[0].id;
			}, function(response) {
				$scope.errors = response.data.errors;
			});
	};

	$scope.launchSubmit = function() {
		$http.post('/experiments/launch/' + $scope.experiment.id, $scope.launchData)
			.then(function(response) {
				$scope.message = response.data.message;
				$scope.refreshStatus();
			}, function(response) {
				$scope.errors = response.data.errors;
			});
		jQuery('#launchModal').modal('hide');
		timer = $interval($scope.refreshStatus, 10000);
	};

	$scope.reset = function() {
		$http.post('/experiments/reset/' + $scope.experiment.id, $scope.launchData)
			.then(function(response) {
				$scope.message = response.data.message;
				$scope.refreshStatus();
			}, function(response) {
				$scope.errors = response.data.errors;
			});
		$interval.cancel(timer);
	};

	$scope.deleteSubmit = function() {
		$http.delete('/experiments/' + $scope.experiment.id)
			.then(function(response) {
					ExpDataService.set(null);
					jQuery('#deleteModal').modal('hide');
					$interval(function() {
						$location.path('/');
					}, 500, 1, true);
				},
				function(response) {
					$scope.errors = "There is an error in the request";
				});
		$interval.cancel(timer);
	};
	
	$scope.downloadResults = function (id) {
		$http.get('/experiments/downloadresults/'+id)
			.then(function(response) {
			}, function(response) {
			});
	};
}])

.controller('LabelsCtrl', ['$scope', '$http', '$stateParams', 'ExpDataService', function($scope, $http, $stateParams, ExpDataService) {
	$scope.experiment = ExpDataService.get(); // Get the experiment from the service.
	$scope.showForm = false;

	if (!$scope.experiment) {
		$http.get('/experiments/details/' + $stateParams.experimentId)
			.then(function(response) {
				$scope.experiment = response.data;
				$scope.oldLabels = angular.copy(response.data.labels);
				$http.get('/applications/details/' + $scope.experiment.app_id)
					.then(function(data) {
						$scope.experiment.app = data.data;
					}, function(data) {
						$scope.errors = response.data.errors;
					});
			}, function(response) {
				$scope.errors = response.data.errors;
			});
	} else {
		$scope.oldLabels = angular.copy($scope.experiment.labels);
	}

	$scope.submit = function() {
		console.log("Entra");
		$http.put('/experiments/' + $scope.experiment.id, {
			labels: $scope.experiment.labels
		}).then(function(response) {
			console.log(response);
			$scope.message = "Experiment " + $scope.experiment.name + " updated successfully.";
			$scope.showForm = false;
			$scope.oldLabels = angular.copy($scope.experiment.labels);
		}, function(response) {
			console.log(response);
			$scope.errors = "There is an error in the request.";
		});
	};

	$scope.cancel = function() {
		$scope.showForm = false;
		$scope.experiment.labels = $scope.oldLabels;
	};
}])

.controller('CreateCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
	$scope.experiment = {};
	$http.get('/applications/list/')
		.then(function(response) {
			$scope.applications = response.data;
			$scope.experiment.app_id = response.data[0].id;
		}, function(response) {
			$scope.errors = response.data.errors;
		});

	$scope.submit = function() {
		$http.post('/experiments/create', $scope.experiment)
			.then(function(response) {
				$location.path('overview/' + response.data.experimentId);
			}, function(response) {
				$scope.errors = response.data.errors;
			});
	};
}])

.controller('InputDataCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {
	$http.get('/experiments/details/' + $stateParams.experimentId)
		.then(function(response) {
			$scope.experiment = response.data;
		}, function(response) {
			$scope.errors = response.data.errors;
		});
}])

/* Unable because is not implemented yet
	.controller('SourcesCtrl', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {
		$http.get('/experiments/details/' + $stateParams.experimentId)
			.then(function (response) {
				$scope.experiment = response.data;
			}, function (response) {
				$scope.errors = response.data.errors;
			});
	}])
	*/

.controller('LogsCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {
	$http.get('/experiments/logs/' + $stateParams.experimentId)
		.then(function (response) {
			$scope.logs = response.data;
		}, function (response) {
			$scope.errors = response.data.errors;
		});
}]);