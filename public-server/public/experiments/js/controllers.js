var app = angular.module('Experiments', ['ui.router', 'angularTreeview'])

	/**
	 *This controler defines the sidebar options and for each option the url to access it. 
	 */
	.controller('SidebarCtrl', ['$scope', '$location', '$stateParams', function ($scope, $location, $stateParams) {
		$scope.links = [
			{
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
			}, {
				name: "Map",
				url: "/map/" + $stateParams.experimentId
			}];
		//This function allow the sidebar options know if they are selected.
		$scope.isActive = function (route) {
			return route === $location.path();
		};
	}])

	/**
	 * This is the controller executed in the index view.
	 */
	.controller('IndexCtrl', ['$scope', '$http', 'PanelColors',
		function ($scope, $http, PanelColors) {
			//Get the experiment list, then when the info es available, ask the applications info to add to each experiment the info of its application in the field "app".
			function getList() {
            jQuery('#loadingModal').modal('show');
            $http.get('/experiments/list')
					.then(function (response) {
						$scope.experiments = response.data;
						if (response.data.length) {
							$http.get('/applications/list/')
								.then(function (data) {
									$scope.experiments.forEach(function (exp) {
										exp.app = angular.copy(data.data.find(function (app) {
											return app.id === exp.app_id;
										}));
										jQuery('#loadingModal').modal('hide');
									});
								}, function (response) {
									$scope.errors = response.data.errors;
									jQuery('#loadingModal').modal('hide');
								});
						} else {
							jQuery('#loadingModal').modal('hide');
							$scope.message = "There is not experiments yet.";
						}
					}, function (response) {
						$scope.errors = response.data.errors;
						jQuery('#loadingModal').modal('hide');
					});
			}
			getList();

			$scope.selectExpToDelete = function (exp) {
            $scope.deleteExpSelect = exp;
			};

			//Asks the server delete an experiment identified by its ID
			$scope.deleteSubmit = function () {
            $http.delete('/experiments/' + $scope.deleteExpSelect.id)
					.then(function (response) {
						getList();
						$scope.message = "Experiment " + $scope.deleteExpSelect.name + " delete successfuly.";
					}, function (response) {
						$scope.errors = "There is an error in the request";
					});
            jQuery('#deleteModal').modal('hide');
			};

			$scope.panelColors = PanelColors;
		}
	])

	/**
	 *This controler is executed in the overview view. 
	 */
	.controller('OverviewCtrl', ['$scope', '$http', '$stateParams', '$location', 'PanelColors', function ($scope, $http, $stateParams, $location, PanelColors) {
		var interval;
		var defaultSizes = null;
		$scope.Math = window.Math;
		$scope.panelColors = PanelColors;

		//Get the experiment info and its application.
		$http.get('/experiments/details/' + $stateParams.experimentId)
			.then(function (response) {
            $scope.experiment = response.data;
            $http.get('/applications/details/' + response.data.app_id)
					.then(function (data) {
						$scope.experiment.app = data.data;
					}, function (data) {
						$scope.errors = data.data.errors;
					});
			}, function (response) {
            $scope.errors = response.data.errors;
			});

		//Get image and size list used when the user wants launch the experiment
		$http.get('/images/list')
			.then(function (response) {
				$scope.images = response.data;
				$scope.imageSelected = response.data[0];
				$http.get('/sizes/list')
					.then(function (response) {
						defaultSizes = response.data;
						$scope.getSizesOfImage();//Leaves only the sizes available for this image.
					}, function (response) {
						$scope.errors = response.data.err;
					});
			}, function (response) {
				$scope.errors = response.data.errors;
			});

		//This function starts the counter to run the function $scope.refreshStatus() each 5 seconds while the experiment status wouldn't be "failed_*", "done" or "created"
		function activateInterval() {
			interval = window.setInterval(function () {
            $scope.refreshStatus();
            if (/^failed.*/.test($scope.experiment.status) || $scope.experiment.status == 'done' || $scope.experiment.status == 'created') {
					window.clearInterval(interval);
            }
			}, 5000);
		}

		//Get the experiment info and updates its status
		$scope.refreshStatus = function () {
			$http.get('/experiments/details/' + $stateParams.experimentId)
            .then(function (response) {
					$scope.experiment.status = response.data.status;
            }, function (response) {
					$scope.errors = response.data.errors;
            });
		};

		//Fileter the sizes and leaves only the sizes compatible with the image selected
		$scope.getSizesOfImage = function () {
			$scope.coresWidth = ($scope.imageSelected.quotas.cores.in_use / $scope.imageSelected.quotas.cores.limit) * 100;
			$scope.ramWidth = ($scope.imageSelected.quotas.ram.in_use / $scope.imageSelected.quotas.ram.limit) * 100;
			$scope.instancesWidth = ($scope.imageSelected.quotas.instances.in_use / $scope.imageSelected.quotas.instances.limit) * 100;
			$scope.sizes = [];
			defaultSizes.forEach(function (size) {
				$scope.imageSelected.sizes_compatible.some(function (size_id) {
					if (size.id === size_id) {
						$scope.sizes.push(size);
						return true;
					}
				});
			});
			if ($scope.sizes.length > 0) {
				$scope.sizeSelected = $scope.sizes[0];
			}
			$scope.getLimitInstances();
		};

		//Sends the request to launch an experiment by its ID, the data required to launch the experiment (nodes, image and size) is passed in the body.
		$scope.launchSubmit = function () {
			$http.post('/experiments/launch/' + $scope.experiment.id, {
				'nodes': $scope.nodesSelected,
				'image_id': $scope.imageSelected.id,
				'size_id': $scope.sizeSelected.id
			})
            .then(function (response) {
					$scope.message = response.data.message;
					activateInterval();
            }, function (response) {
					$scope.errors = response.data.errors;
            });
			jQuery('#launchModal').modal('hide');
			activateInterval();
		};

		//Sends the request to reset the experiment whose ID is passed in the url
		$scope.reset = function () {
			$http.post('/experiments/reset/' + $scope.experiment.id)
            .then(function (response) {
					$scope.message = response.data.message;
					activateInterval();
            }, function (response) {
					$scope.errors = response.data.errors;
            });
		};

		//Request delete the experiment whose ID is passed in the url
		$scope.deleteSubmit = function () {
			$http.delete('/experiments/' + $scope.experiment.id)
            .then(function (response) {
					jQuery('#deleteModal').modal('hide');
					jQuery('#deleteModal').on('hidden.bs.modal', function () {
						$scope.$apply(function () { $location.path('/'); });
					});
				},
				function (response) {
					$scope.errors = "There is an error in the request";
				});
		};

		//Dowload the results of the experiment execution
		$scope.downloadResults = function (id) {
			window.open('/experiments/downloadresults/' + id);
		};

		$scope.getLimitInstances = function () {
			$scope.limitInstances = Math.min(($scope.imageSelected.quotas.instances.limit - $scope.imageSelected.quotas.instances.in_use), Math.floor(($scope.imageSelected.quotas.cores.limit - $scope.imageSelected.quotas.cores.in_use) / $scope.sizeSelected.cpus), Math.floor(($scope.imageSelected.quotas.ram.limit - $scope.imageSelected.quotas.ram.in_use) / $scope.sizeSelected.ram));
			console.log($scope.limitInstances);
		};
	}])

	/**
	 * This controler is executed in the labels view
	 */
	.controller('LabelsCtrl', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {
		$scope.showForm = false;
		//Get the experiment info and when the info is available gets the application info of the experiment
		$http.get('/experiments/details/' + $stateParams.experimentId)
			.then(function (response) {
				$scope.experiment = response.data;
				$scope.oldLabels = angular.copy(response.data.labels);//Backups the current labes before modifiying
				$http.get('/applications/details/' + $scope.experiment.app_id)
					.then(function (data) {
						$scope.experiment.app = data.data;
					}, function (data) {
						$scope.errors = response.data.errors;
					});
			}, function (response) {
				$scope.errors = response.data.errors;
			});

		//Submit the labels info to update the experiment.
		$scope.submit = function () {
			//Delete the labels whose contain is empty before sends the data
			for (var i in $scope.experiment.labels) {
            if ($scope.experiment.labels[i] === "" || $scope.experiment.labels[i] === null) {
					delete $scope.experiment.labels[i];
            }
			}
			$http.put('/experiments/' + $scope.experiment.id, {
            labels: $scope.experiment.labels
			}).then(function (response) {
            $scope.message = "Experiment " + $scope.experiment.name + " updated successfully.";
            $scope.showForm = false;
            $scope.oldLabels = angular.copy($scope.experiment.labels);
			}, function (response) {
            $scope.errors = "There is an error in the request.";
			});
		};

		//Restore the old labels containing the labels stored in the server
		$scope.cancel = function () {
			$scope.showForm = false;
			$scope.experiment.labels = $scope.oldLabels;
		};
	}])

	//This controler runs in the create view
	.controller('CreateCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
		$scope.experiment = {};
		//Get the application list available to create the experiment
		$http.get('/applications/list/')
			.then(function (response) {
            $scope.applications = response.data;
            $scope.experiment.app_id = response.data[0].id;
			}, function (response) {
            $scope.errors = response.data.errors;
			});

		//Send the data to create the new experiment
		$scope.submit = function () {
			jQuery('#loadingModal').modal('show');
			$http.post('/experiments/create', $scope.experiment)
            .then(function (response) {
					jQuery('#loadingModal').modal('hide');
					jQuery('#loadingModal').on('hidden.bs.modal', function () {
						$scope.$apply(function () {
							$location.path('/overview/' + response.data.experimentId);
						});
					});
            }, function (response) {
					jQuery('#loadingModal').modal('hide');
					$scope.errors = response.data.errors;
            });
		};
	}])

	//This controler runs in the input data view
	.controller('InputDataCtrl', ['$scope', '$http', '$stateParams', 'TreeViewFunctions', function ($scope, $http, $stateParams, TreeViewFunctions) {
		$scope.folderModal = '';
		$scope.currentPath = '/';
		$scope.currentFolder = '/';
		$scope.subFolder = false;
		var folderParentList = ['/'];
		$scope.clearMessage = function () {
			$scope.message = null;
		};
		$scope.clearErrorMessages = function () {
			$scope.errors = null;
		};

		//Get the input data tree
		function getTree() {
			$http.get('/experiments/' + $stateParams.experimentId + "/input_tree?depth=0")
            .then(function (response) {
					$scope.experiment = response.data;
					//TreeViewFunctions.addCollapsedProperty($scope.experiment.input_tree);
            }, function (response) {
					$scope.errors = response.data.errors;
            });
		}
		getTree();

		//This method is executed when the user wants to the parent folder when browsing in the input data tree, loads again the new tree and asigns the different variable their new values
		$scope.folderUp = function () {
			if (folderParentList.length > 1) {
            folderParentList.pop();
            $scope.currentPath = folderParentList[folderParentList.length - 1];
            if (folderParentList[folderParentList.length - 1] === '/') {
					getTree();
					$scope.subFolder = false;
					$scope.currentFolder = '/';
            } else {
					getFolderData(folderParentList[folderParentList.length - 1], 0);
					$scope.currentFolder = TreeViewFunctions.getFolderFromPath($scope.currentPath);
            }
			}
		};

		//Request the sub-tree of the a folder passed as argument
		function getFolderData(folder) {
			var url = folder == '/' ? '/experiments/' + $stateParams.experimentId + "/input_tree?depth=0" : '/experiments/' + $stateParams.experimentId + "/input_tree?folder=" + folder + '&depth=0';
			$http.get(url)
            .then(function (response) {
					$scope.experiment = response.data;
					//TreeViewFunctions.addCollapsedProperty($scope.experiment.input_tree);
            }, function (response) {
					$scope.errors = response.data.errors;
            });
		}

		//This function is executed when then user selects a file or folder in the input tree, if a folder is selected, the function load again the input tree and sets the vars values
		$scope.select = function (node) {
			if (node.children.length || node.id.slice(-1) == '/') {
            folderParentList.push(node.id);
            $scope.currentPath = node.id;
            $scope.currentFolder = node.label;
            TreeViewFunctions.getFolderFromPath(node.id);
            getFolderData(node.id);
            $scope.subFolder = true;
			}
		};

		//This funciton allow the user upload a new file in the current folder ($scope.currentPath)
		$scope.uploadFile = function () {
			var url = '';
			if ($scope.currentPath && $scope.currentPath == '/') {
				url = '/experiments/' + $stateParams.experimentId + "/input?file=" + $scope.fileName;
			} else if ($scope.currentPath && $scope.currentPath != '/') {
				url = '/experiments/' + $stateParams.experimentId + "/input?file=" + $scope.currentPath + $scope.fileName;
			} else {
				url = '/experiments/' + $stateParams.experimentId + "/input?file=" + $scope.fileName;
			}
			var fd = new FormData();
			jQuery('#loadingModal').modal('show');
			fd.append('inputFile', $scope.file);
			$http.post(url, fd, {
				transformRequest: angular.identity,
				headers: { 'Content-Type': undefined },
				uploadEventHandlers: {
					progress: function (e) {
						$scope.progressStatus = e.loaded * 100 / e.total;
						$scope.fileSize = e.total / 1024;
					}
				}
			}).then(function (response) {
				getFolderData($scope.currentPath);
				$scope.fileName = '';
				$('#file').val(null);
				$scope.message = "Your file " + $scope.fileName + ' has been saved succesfuly.';
				jQuery('#loadingModal').modal('hide');
			}, function (response) {
				$scope.errors = response.data.errors;
				jQuery('#loadingModal').modal('hide');
			});
		};

		$('#file').change(function () {
			if (!$('#fileName').val()) {
				$scope.fileName = $('#file').val().split('\\').pop();
			}
		});

		$scope.launchCreateFolderModal = function () {
			jQuery('#newFolderModal').modal('show');
		};

		//This function allow the user create a new folder.
		$scope.createNewFolder = function () {
			var url = $scope.currentPath == '/' ? '/experiments/' + $stateParams.experimentId + "/input?file=" + $scope.folderName + '/' : '/experiments/' + $stateParams.experimentId + "/input?file=" + $scope.currentPath + $scope.folderName + '/';

			$http.post(url).then(function (response) {
				jQuery('#newFolderModal').modal('hide');
				getFolderData($scope.currentPath);
				$scope.folderName = '';
				jQuery('#newFolderModal').on('hidden.bs.modal', function () {
					$scope.message = 'The folder ' + $scope.currentPath + $scope.folderName + ' has been created succesfully.';
				});
			}, function (response) {
				$scope.errors = response.data.errors;
				jQuery('#newFolderModal').modal('hide');
			});
		};

		$scope.deleteNodeConfirm = function () {
			$http.delete('/experiments/' + $scope.experiment.id + '/input?file=' + $scope.nodeDelete.id)
            .then(function (response) {
					jQuery('#deleteModal').modal('hide');
					jQuery('#deleteModal').on('hidden.bs.modal', function () {
						console.log(path.dirname(nodeDelete.id));
					});
				},
				function (response) {
					$scope.errors = "There is an error in the request";
				});
		}

	}])

	//This controller runs in the sources view
	.controller('SourcesCtrl', ['$scope', '$http', '$stateParams', 'TreeViewFunctions', function ($scope, $http, $stateParams, TreeViewFunctions) {
		$scope.btnSaveChanges = true;
		$scope.folderModal = '';
		$scope.currentPath = '/';
		$scope.currentFolder = '/';
		$scope.subFolder = false;
		var folderParentList = ['/'];

		//The next two method delete the error and info messages hidding the alerts
		$scope.clearMessage = function () {
			$scope.message = null;
		};
		$scope.clearErrorMessages = function () {
			$scope.errors = null;
		};

		//Gets the initial sources tree root
		function getTree() {
			$http.get('/experiments/' + $stateParams.experimentId + "/src_tree?depth=0")
            .then(function (response) {
					$scope.experiment = response.data;

					console.log($scope.experiment)
					//TreeViewFunctions.addCollapsedProperty($scope.experiment.src_tree);
            }, function (response) {
					$scope.errors = response.data.errors;
            });
		}
		getTree();

		//This function runs when the user selects an element (file or folder) in the sources tree. If selects a file, the function requests the file data to te server, if no (it's a folder) the function requests to te server the elements cotained in the folder selected.
		$scope.select = function (node) {
			if (!node.children.length && node.id.slice(-1) != '/') {
            $http.get('/experiments/' + $scope.experiment.id + "/code?fileId=" + node.id)
					.then(function (response) {
						$scope.selectedNode = node;
						editor.setSession(ace.createEditSession(response.data, modelist.getModeForPath(node.label).mode));
					}, function (response) {
						$scope.errors = response.data.errors;
					});
			} else {
            folderParentList.push(node.id);
            $scope.currentPath = node.id;
            $scope.currentFolder = node.label;
            TreeViewFunctions.getFolderFromPath(node.id);
            getFolderData(node.id);
            $scope.subFolder = true;
			}
		};

		//This function is executed when the user click the button saveFile, then the contain of the editor will be sent to the server to be saved
		$scope.saveFile = function (node) {
			if ($scope.btnSaveChanges) {
            $http.post('/experiments/' + $scope.experiment.id + "/code?fileId=" + node.id,
					editor.getValue(), {
						headers: {
							'content-type': 'text/plain'
						}
					})
					.then(function (response) {
						$scope.message = 'File saved succesfully';
					}, function (response) {
						$scope.errors = response.data.errors;
					});
			}
		};

		//This function runs when the user wants to create a new file, the file will be created with the info contained in the editor
		$scope.saveNewFile = function () {
			if ($scope.newFileName !== null) {
            var url = $scope.currentPath == '/' ? '/experiments/' + $scope.experiment.id + "/code?fileId=" + $scope.newFileName : '/experiments/' + $scope.experiment.id + "/code?fileId=" + $scope.currentPath + $scope.newFileName;

            $http.post(url, editor.getValue(), {
					headers: {
						'content-type': 'text/plain'
					}
				})
					.then(function (response) {
						jQuery('#newFileModal').modal('hide');
						getTree();
					}, function (response) {
						jQuery('#newFileModal').modal('hide');
						$scope.errors = response.data.errors;
					});
			}
		};

		//This funciton is executed when the user wants return to the parent folder in the sources tree. The function updates the different vars (currentFolder, currentPath, etc.)
		$scope.folderUp = function () {
			if (folderParentList.length > 1) {
            folderParentList.pop();
            $scope.currentPath = folderParentList[folderParentList.length - 1];
            if (folderParentList[folderParentList.length - 1] === '/') {
					getTree();
					$scope.subFolder = false;
					$scope.currentFolder = '/';
            } else {
					getFolderData(folderParentList[folderParentList.length - 1]);
					$scope.currentFolder = TreeViewFunctions.getFolderFromPath($scope.currentPath);
            }
			}
		};

		//Gets the file and folder contained in the folder passed as parameter
		function getFolderData(folder) {
			var url = folder == '/' ? '/experiments/' + $stateParams.experimentId + "/src_tree?depth=" + depth : '/experiments/' + $stateParams.experimentId + "/src_tree?folder=" + folder + '&depth=0';
			$http.get(url)
            .then(function (response) {
					$scope.experiment = response.data;
					//TreeViewFunctions.addCollapsedProperty($scope.experiment.src_tree);
            }, function (response) {
					$scope.errors = response.data.errors;
            });
		}

		$scope.launchModal = function () {
			$scope.folderModal = $scope.currentPath;
		};

		$scope.launchCreateFolderModal = function () {
			jQuery('#newFolderModal').modal('show');
		};

		//Runs when the user wants to create a new folder.
		$scope.createNewFolder = function () {
			var url = $scope.currentPath == '/' ? '/experiments/' + $stateParams.experimentId + "/code?fileId=" + $scope.folderName + '/' : '/experiments/' + $stateParams.experimentId + "/code?fileId=" + $scope.currentPath + $scope.folderName + '/';

			$http.post(url).then(function (response) {
				jQuery('#newFolderModal').modal('hide');
				getFolderData($scope.currentPath);
				$scope.folderName = '';
				jQuery('#newFolderModal').on('hidden.bs.modal', function () {
					$scope.$apply(function () {
						$scope.message = 'The folder ' + $scope.currentPath + $scope.folderName + ' has been created succesfully.';
					});
				});
			}, function (response) {
				$scope.errors = response.data.errors;
				jQuery('#newFolderModal').modal('hide');
			});
		};

		$scope.deleteNodeConfirm = function () {
			$http.delete('/experiments/' + $scope.experiment.id + '/code?file=' + $scope.nodeDelete.id)
            .then(function (response) {
					jQuery('#deleteModal').modal('hide');
					jQuery('#deleteModal').on('hidden.bs.modal', function () {
						console.log(path.dirname(nodeDelete.id));
					});
				},
				function (response) {
					$scope.errors = "There is an error in the request";
				});
		}

		//The next lines in this controller configure the editor
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

		var editor = ace.edit("editor");
		var EditSession = ace.require("ace/edit_session").EditSession;
		var modelist = ace.require("ace/ext/modelist");
		$scope.themeList = ace.require("ace/ext/themelist").themes;
		$scope.theme = $scope.themeList[24];
		$scope.keyboard = $scope.keyboardList[0];
		editor.setTheme($scope.theme.theme);
		editor.getSession().setMode("ace/mode/plain_text");
		editor.getSession().setTabSize(2);
		editor.getSession().setUseSoftTabs(true);
		editor.getSession().setUseWrapMode(true);
		editor.setShowPrintMargin(false);
		editor.setHighlightActiveLine(true);

		$scope.setKeyboardHandler = function () {
			editor.setKeyboardHandler('ace/keyboard/' + $scope.keyboard.id);
		};

		$scope.setTheme = function (theme) {
			editor.setTheme($scope.theme.theme);
		};

		$scope.undo = function () {
			editor.undo();
		};

		$scope.redo = function () {
			editor.redo();
		};
	}])

	//Runs in the logs view
	.controller('LogsCtrl', ['$scope', '$http', '$stateParams', '$location', function ($scope, $http, $stateParams, $location) {
		//Get the experiment info and its logs
		var selectedName;

		$scope.getLog = function () {
			selectedName = $scope.selected ? $scope.selected.name : null;
			$http.get('/experiments/logs/' + $stateParams.experimentId)
            .then(function (response) {
					$scope.experiment = response.data;
					if (response.data.logs) {
						if (selectedName) {
							$scope.selected = response.data.logs.find(function (log) {
								return log.name === selectedName;
							});
						}
						else {
							$scope.selected = response.data.logs[0];
						}
					}
            }, function (response) {
					$scope.errors = response.data.errors;
            });
		};
		$scope.getLog();
	}])

	//Runs in the logs view
	.controller('MapCtrl', ['$scope', '$http', '$stateParams', '$location', '$window', function ($scope, $http, $stateParams, $location, $window) {
		//Get the experiment info and its application.
		$http.get('/experiments/details/' + $stateParams.experimentId)
			.then(function (response) {
            $scope.experiment = response.data;
			}, function (response) {
            $scope.errors = response.data.errors;
			});

		$scope.latitude = 38.981;
		$scope.longitude = -1.856;

		$scope.height = 50;
		$scope.width = 50;

		$scope.submit = function () {
			console.log(
				$scope.latitude,
				$scope.longitude,

				$scope.height,
				$scope.width)
		}
	}]);