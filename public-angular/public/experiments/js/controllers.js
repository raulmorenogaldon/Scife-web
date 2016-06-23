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
		url: "/sources/" + $stateParams.experimentId
	}, {
		name: "Logs",
		url: "/logs/" + $stateParams.experimentId
	}];

	$scope.isActive = function(route) {
		return route === $location.path();
	};

}])

.controller('IndexCtrl', ['$scope', '$http', 'PanelColors',
	function($scope, $http, PanelColors) {
		function getList() {
			jQuery('#loadingModal').modal('show');
			$http.get('/experiments/list/')
				.then(function(response) {
					$scope.experiments = response.data;
					$http.get('/applications/list/')
						.then(function(data) {
							$scope.experiments.forEach(function(exp) {
								exp.app = angular.copy(data.data.find(function(app) {
									return app.id === exp.app_id;
								}));
								jQuery('#loadingModal').modal('hide');
							});
						}, function(response) {
							$scope.errors = response.data.errors;
							jQuery('#loadingModal').modal('hide');
						});
				}, function(response) {
					$scope.errors = response.data.errors;
					jQuery('#loadingModal').modal('hide');
				});
		}
		getList();

		$scope.selectExpToDelete = function(exp) {
			$scope.deleteExpSelect = exp;
		};

		$scope.deleteSubmit = function() {
			$http.delete('/experiments/' + $scope.deleteExpSelect.id)
				.then(function(response) {
					getList();
					$scope.message = "Experiment " + $scope.deleteExpSelect.name + " delete successfuly.";
				}, function(response) {
					$scope.errors = "There is an error in the request";
				});
			jQuery('#deleteModal').modal('hide');
		};

		$scope.panelColors = PanelColors;
	}
])

.controller('OverviewCtrl', ['$scope', '$http', '$stateParams', '$location', 'PanelColors', function($scope, $http, $stateParams, $location, PanelColors) {
	var interval;

	function activateInterval() {
		interval = setInterval(function() {
			$scope.refreshStatus();
			if ($scope.experiment.status == 'failed_compilation' || $scope.experiment.status == 'faile_execution' || $scope.experiment.status == 'done') {
				clearInterval(interval);
			}
		}, 5000);
	}

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
		});


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
		activateInterval();
	};

	$scope.reset = function() {
		$http.post('/experiments/reset/' + $scope.experiment.id, $scope.launchData)
			.then(function(response) {
				$scope.message = response.data.message;
				$scope.refreshStatus();
			}, function(response) {
				$scope.errors = response.data.errors;
			});
	};

	$scope.deleteSubmit = function() {
		$http.delete('/experiments/' + $scope.experiment.id)
			.then(function(response) {
					jQuery('#deleteModal').modal('hide');
					setTimeout(function() {
						$location.path('/');
					}, 500);
				},
				function(response) {
					$scope.errors = "There is an error in the request";
				});
	};

	$scope.downloadResults = function(id) {
		window.open('/experiments/downloadresults/' + id);
	};
	$scope.panelColors = PanelColors;
}])

.controller('LabelsCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {
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
		for (var i in $scope.experiment.labels) {
			if ($scope.experiment.labels[i] === "" || $scope.experiment.labels[i] === null) {
				delete $scope.experiment.labels[i];
			}
		}
		$http.put('/experiments/' + $scope.experiment.id, {
			labels: $scope.experiment.labels
		}).then(function(response) {
			$scope.message = "Experiment " + $scope.experiment.name + " updated successfully.";
			$scope.showForm = false;
			$scope.oldLabels = angular.copy($scope.experiment.labels);
		}, function(response) {
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
		jQuery('#loadingModal').modal('show');
		$http.post('/experiments/create', $scope.experiment)
			.then(function(response) {
				(jQuery('#loadingModal').modal('hide')).then(
					setInterval(function() {
						$location.path('overview/' + response.data.experimentId);
					}, 400)
				);
			}, function(response) {
				$scope.errors = response.data.errors;
			});
	};
}])

.controller('InputDataCtrl', ['$scope', '$http', '$stateParams', 'TreeViewFunctions', function($scope, $http, $stateParams, TreeViewFunctions) {
	$http.get('/experiments/' + $stateParams.experimentId + "/input_tree")
		.then(function(response) {
			$scope.experiment = response.data;
			TreeViewFunctions.addCollapsedProperty($scope.experiment.input_tree);
		}, function(response) {
			$scope.errors = response.data.errors;
		});
}])

.controller('SourcesCtrl', ['$scope', '$http', '$stateParams', 'TreeViewFunctions', function($scope, $http, $stateParams, TreeViewFunctions) {

	$scope.btnSaveChanges = true;
	$scope.folderModal = '';

	function getTree() {
		$http.get('/experiments/' + $stateParams.experimentId + "/src_tree")
			.then(function(response) {
				$scope.experiment = response.data;
				TreeViewFunctions.addCollapsedProperty($scope.experiment.src_tree);
			}, function(response) {
				$scope.errors = response.data.errors;
			});
	}
	getTree();

	$scope.select = function(node) {
		if (node.children.length === 0) {
			$http.get('/experiments/' + $scope.experiment.id + "/file?fileId=" + node.id)
				.then(function(response) {
					$scope.selectedNode = node;
					editor.setValue(response.data, -1);
					editor.getSession().setMode(modelist.getModeForPath(node.label).mode);
				}, function(response) {
					$scope.errors = response.data.errors;
				});
		}
	};

	$scope.selectModal = function(selected) {
		if (selected.children.length > 0) {
			$scope.folderModal = selected.id;
		} else if (selected.children.length === 0) {
			$scope.folderModal = '';
		}
	};

	$scope.saveFile = function(node) {
		if ($scope.btnSaveChanges) {
			$http.post('/experiments/' + $scope.experiment.id + "/file?fileId=" + node.id,
					editor.getValue(), {
						headers: {
							'content-type': 'text/plain'
						}
					})
				.then(function(response) {
					$scope.message = 'File saved succesfully';
				}, function(response) {
					$scope.errors = response.data.errors;
				});
		}
	};


	$scope.saveNewFile = function() {
		if ($scope.newFileName !== null) {
			var url;
			if ($scope.folderModal && $scope.folderModal !== '') {
				url = '/experiments/' + $scope.experiment.id + "/file?fileId=" + $scope.folderModal + '/' + $scope.newFileName;
			} else {
				url = '/experiments/' + $scope.experiment.id + "/file?fileId=" + $scope.newFileName;
			}
			$http.post(url, '', {
					headers: {
						'content-type': 'text/plain'
					}
				})
				.then(function(response) {
					console.log('response '+response.data);
					jQuery('#newFileModal').modal('hide');
					getTree();
				}, function(response) {
					jQuery('#newFileModal').modal('hide');
					$scope.errors = response.data.errors;
					console.log('Error:');
					console.log(response.data);
				});
		}
	};

	$scope.keyboardList = [{
		'id': 'hash_handler',
		'name': 'Ace'
	}, {
		'id': 'vim',
		'name': 'vim'
	}, {
		'id': 'emacs',
		'name': 'Emacs'
	}];
	$scope.keyboard = $scope.keyboardList[0];

	var editor = ace.edit("editor");
	var modelist = ace.require("ace/ext/modelist");
	editor.setTheme("ace/theme/monokai");
	editor.getSession().setMode("ace/mode/plain_text");
	editor.getSession().setTabSize(2);
	editor.getSession().setUseSoftTabs(true);
	editor.getSession().setUseWrapMode(true);
	editor.setShowPrintMargin(false);
	editor.setHighlightActiveLine(true);

	$scope.setKeyboardHandler = function() {
		editor.setKeyboardHandler('ace/keyboard/' + $scope.keyboard.id);
	};
}])

.controller('LogsCtrl', ['$scope', '$http', '$stateParams', '$location', function($scope, $http, $stateParams, $location) {

	$scope.getLog = function() {
		$http.get('/experiments/logs/' + $stateParams.experimentId)
			.then(function(response) {
				$scope.logs = response.data;
				if (response.data.length > 0 && typeof $scope.selected == 'undefined') {
					$scope.select(0);
				}
			}, function(response) {
				$scope.errors = response.data.errors;
			});
	};
	$scope.getLog();

	$scope.select = function(index) {
		$scope.selected = index;
	};

	/*
	var interval = setInterval(function() {
		getLog();
		if (($location.path()).indexOf("/logs/") < 0) {
			clearInterval(interval);
		}
	}, 5000);
	*/
}]);