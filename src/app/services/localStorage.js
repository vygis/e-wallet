angular.module("services")
	.factory('LocalStorageService', ['$window', function($window) {
		var localStorage = $window.localStorage,
			JSON = $window.JSON;
		return {
			get: function(namespace) {
				return JSON.parse(localStorage.getItem(namespace));
			},
			set: function(namespace, payload) {
				localStorage.setItem(namespace, JSON.stringify(payload));
			}


		}
	}]);