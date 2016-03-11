var app = angular.module('Experiments');

app.service('ExperimentData', function () {
	var experiment;
	return {
		getExperiment: function () {
			return experiment;
		},
		setExperiment: function (newExperiment) {
			experiment = newExperiment;
		},
		cleanExperiment: function () {
			experiment = {};
		}
	};

});