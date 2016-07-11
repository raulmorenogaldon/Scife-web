angular.module('Experiments')
	.service('ExpDataService', function () {
		var exp;
		return {
			get: function () {
				return exp;
			},
			set: function (newExp) {
				exp = newExp;
			},
			clean: function () {
				exp = {};
			}
		};
	})
	.service('AppDataService', function () {
		var app;
		return {
			get: function () {
				return app;
			},
			set: function (newApp) {
				app = newApp;
			},
			clean: function () {
				app = {};
			}
		};
	})

	.service('PanelColors', function () {
		return {
			getColorClass: function (status) {
				switch (status) {
					case 'done':
						return 'panel-success';
					case 'launched':
					case 'compiling':
					case 'executing':
						return 'panel-warning';
					case 'failed_compilation':
					case 'failed_execution':
						return 'panel-danger';
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
			var folders = path.substring(0, path.length -1).split('/');
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
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);