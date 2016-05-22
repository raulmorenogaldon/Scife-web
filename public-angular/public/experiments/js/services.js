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

	.service('BgColors', function () {
		return {
			getColorClass: function (status) {
				switch (status) {
					case 'done':
						return 'bg-success';
					case 'failed':
						return 'bg-danger';
					default:
						return 'bg-info';
				}
			}
		};
	});