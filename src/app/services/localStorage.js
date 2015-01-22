angular.module("services")
	.factory('LocalStorageService', ['$window', '$q', function($window, $q) {
		var localStorage = $window.localStorage,
			JSON = $window.JSON;
		return {
			get: function(namespace) {
				var deferred = $q.defer();
				deferred.resolve(JSON.parse(localStorage.getItem(namespace)))
				return deferred.promise;
			},
			set: function(namespace, payload) {
				var deferred = $q.defer();
				localStorage.setItem(namespace, JSON.stringify(payload))
				deferred.resolve(payload);
				return deferred.promise;
			}
		}
	}]);