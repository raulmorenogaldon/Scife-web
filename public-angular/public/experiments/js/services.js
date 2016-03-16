'use strict';

var app = angular.module('Experiments');

app.service('ExpDataService', function () {
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
});

app.service('AppDataService', function () {
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
});