angular.module('Experiments')
/**
 * This directive manages the error and info messages:
 * If you want show an error messages, you only have to asign to the $scope.error an array (ej. $scope.error = [{'code':25,'msg':'error message'}]).
 * If you want show an info message, you only have to asign an string to the $scope.message (ej. $scope.message = "This is an info message").
 * When you close the messages (errors or info messages) the $scope.errors and $scope.message will be asigned to null, depending of the message type (error or info).
 */
	.directive('alertMessages', function ($compile) {
		return {
			restrict: 'E',
			transclude: true,
			template: '<div class="alert alert-danger col-md-10 col-md-offset-1" role="alert" ng-show="errors.length">' +
			'<button type="button" class="close" data-ng-click="clearErrorMessages()" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
			'<p class="text-justify" ng-repeat="err in errors"><strong>Error {{err.code}}:</strong> {{err.message}}</p>' +
			'</div> <div class="alert alert-success text-justify col-md-10 col-md-offset-1" role="alert" ng-show="message">' +
			'<button type="button" class="close" ng-click="clearMessage()"><span aria-hidden="true">&times;</span></button>' +
			'<p class="text-center">{{message}}</p></div>',
			link: function (scope) {
				scope.clearMessage = function () {
					scope.message = null;
				};
				scope.clearErrorMessages = function () {
					scope.errors = null;
				};
			}
		};
	});