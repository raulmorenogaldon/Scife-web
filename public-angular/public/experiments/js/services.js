angular.module('Experiments')
	.service('ExpDataService', function() {
		var exp;
		return {
			get: function() {
				return exp;
			},
			set: function(newExp) {
				exp = newExp;
			},
			clean: function() {
				exp = {};
			}
		};
	})
	.service('AppDataService', function() {
		var app;
		return {
			get: function() {
				return app;
			},
			set: function(newApp) {
				app = newApp;
			},
			clean: function() {
				app = {};
			}
		};
	})

.service('PanelColors', function() {
	return {
		getColorClass: function(status) {
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
});