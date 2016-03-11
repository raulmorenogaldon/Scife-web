angular.module('Experiments', ['ngRoute'])
	.controller('ExperimentsIndexCtrl', ['$scope', '$http',
		function ($scope, $http) {

			(function () {
				$http.get('/experiments/getexperiments/')
					.then(function (response) {
						$scope.experiments = response.data;
					}, function (response) {
						$scope.errors = response.data.errors;
					});
			})();

		}])
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				controller: "ExperimentsIndexCtrl",
				templateUrl: "experiments/views/index.html"
			});
			});
