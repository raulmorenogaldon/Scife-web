angular.module('Experiments')
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