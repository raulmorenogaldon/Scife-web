angular.module("users", []).controller("UserController", ['$scope', '$http', function ($scope, $http) {
	$scope.user = {};

	$scope.create = function (user) {
		$http.post('/users/create', user)
			.success(function (data) {
				$scope.msg = data.msg;
			})
			.error(function (data) {
				$scope.err = data.err;
			});
	}
}]);