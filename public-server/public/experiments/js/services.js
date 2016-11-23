angular.module('Experiments')

	//This service defines some global functions.
	.service('GlobalFunctions', function ($location) {
		//This function handle the errors received by angularjs in the $http module
		function handleErrors(response, $scope) {
			switch (response.status) {
				case 401:
					window.location.href = window.location.pathname && window.location.hash ? "/login?url=" + window.location.pathname + window.location.hash : "/login";
					break;
				default:
					$scope.errors = response.data.errors;
					break;
			}
		}
		return {
			handleErrors: handleErrors
		}
	})

	//This service defines the colors of the bootstrap depending of the status of the experiment
	.service('PanelColors', function () {
		return {
			getColorClass: function (status) {
				if (/^failed.*/.test(status)) {
					return 'panel-danger';
				}
				switch (status) {
					case 'done':
						return 'panel-success';
					case 'launched':
					case 'compiling':
					case 'executing':
					case 'deployed':
					case 'resetting':
					case 'compiled':
					case 'executed':
						return 'panel-warning';
					//case 'failed_compilation':
					//case 'failed_execution':
					//	return 'panel-danger';
					case 'created':
						return 'panel-info';
					default:
						return 'panel-info';
				}
			}
		};
	})

	.service('TreeViewFunctions', function () {
		function addCollapse(obj) {
			obj.forEach(function (o) {
				if (o.children.length > 0) {
					o.collapsed = true;
					addCollapse(o.children);
				}
			});
		}

		function getFolderFromPathFunction(path) {
			var folders = path.substring(0, path.length - 1).split('/');
			return folders[folders.length - 1];
		}

		return {
			addCollapsedProperty: addCollapse,
			getFolderFromPath: getFolderFromPathFunction
		};
	})

	.directive('fileModel', ['$parse', function ($parse) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				var model = $parse(attrs.fileModel);
				var modelSetter = model.assign;

				element.bind('change', function () {
					scope.$apply(function () {
						modelSetter(scope, element[0].files[0]);
					});
				});
			}
		};
	}]);