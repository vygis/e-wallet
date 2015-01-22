angular.module("services", []);
angular.module("services")
	.factory('CurrencyService', function() {
		var currencies = ['USD', 'GBP', 'EUR'],
			defaultCurrency = 'GBP',
			defaultCurrencyRatios = {
				'USD': 1.51,
				'EUR': 1.31,
				'GBP': 1
			},
			currencySymbols = {
				'USD': '$',
				'EUR': '€',
				'GBP': '£'
			}
		return {
			getDefaultCurrency: function() {
				return defaultCurrency;
			},
			getCurrencyList: function() {
				return angular.copy(currencies);
			},
			getCurrencySymbol: function(currencyString) {
				return currencySymbols[currencyString] || false;
			},
			convert: function(amount, from, to) {
				if(isNaN(parseFloat(amount)) || !~currencies.indexOf(from) || !~currencies.indexOf(to)){
					return false;
				};
				return amount / defaultCurrencyRatios[from] * defaultCurrencyRatios[to];
			}
		}
	});angular.module("services")
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
	}]);angular.module("services")
    .constant('WALLET_SERVICE_NAMESPACE', 'wallet')
    .factory('WalletService', ['$window', '$q', '$timeout', 'LocalStorageService', 'CurrencyService', 'WALLET_SERVICE_NAMESPACE', function ($window, $q, $timeout, LocalStorageService, CurrencyService, WALLET_SERVICE_NAMESPACE) {

        var _cachedResponse = null;

        function _get(){
            var deferred = $q.defer();
            if(_cachedResponse){
                deferred.resolve(_cachedResponse);
            }
            else {
                LocalStorageService.get(WALLET_SERVICE_NAMESPACE).then(function(response){
                    if(response === null) { //initialising if localStorage slot is empty
                        _reset().then(function(response){
                            _cachedResponse = response;
                            deferred.resolve(response);
                        });
                    }
                    else {
                        cachedResponse = response;
                        deferred.resolve(response);
                    }
                });               
            }
            return deferred.promise;
        }

        function _set(payload) {
            _cachedResponse = payload;
            return LocalStorageService.set(WALLET_SERVICE_NAMESPACE, payload);
        }

        function _reset() {
            var emptyContents = {
                    entries: [],
                    currency: CurrencyService.getDefaultCurrency()
                },
                promise = _set(emptyContents);

            promise.then(function(response){
                return response;
            })
            return promise;
        }

        function _addEntry(amount) {
            var deferred = $q.defer();
            _get().then(function(response){
                response.entries.push({
                    amount: amount,
                    date: Date.now() 
                });
                _set(response).then(function(response){
                    deferred.resolve(angular.copy(response));
                });
            });
            return deferred.promise;
        }

        function _changeCurrency(currency) {
             var deferred = $q.defer();
            _get().then(function(response){
                var oldCurrency = response.currency;
                response.currency = currency;
                _.each(response.entries, function(entry){
                    entry.amount = CurrencyService.convert(entry.amount, oldCurrency, currency);
                });
                _set(response).then(function(response){
                    deferred.resolve(angular.copy(response));
                });
            });
            return deferred.promise;           
        }

        return {
            get: _get,
            reset: _reset,
            addEntry: _addEntry,
            changeCurrency: _changeCurrency
        }
    }]);angular.module("app", ["app.templates", "services", "directives"]);
angular.module("app")
    .controller("mainCtrl", ['$scope', '$timeout', 'WalletService', function ($scope, $timeout, WalletService) {
    	WalletService.get().then(function(response){
            $scope.walletContents = response;
        });
    	$scope.resetWallet = function() {
    		WalletService.reset().then(function(response){
               $scope.walletContents = response; 
            });
    	}
    	$scope.addWalletEntry = function(amount) {
    		WalletService.addEntry(amount).then(function(response){
                $scope.walletContents = response;
            });
    	};
    	$scope.displayErrorMessage = function(message) {
    		alert(message);
    	};
    	$scope.changeWalletCurrency = function(currency) {
    		WalletService.changeCurrency(currency).then(function(response){
                $scope.walletContents = response;
            });
    	}
    }]);
angular.module("directives", []);
angular.module("directives")
    .directive('currencyDropdown', ['CurrencyService', function(CurrencyService) {
        return {
            restrict: 'E',
            scope: {
            	currentCurrency: "@",
                onChange: "&"
            },
            templateUrl: 'currency-dropdown.tpl.html',
            controller: function($scope) {
                $scope.currencies = CurrencyService.getCurrencyList();
            }
        }
    }]);angular.module("directives")
    .directive('wallet', ['$filter', 'CurrencyService', function($filter, CurrencyService) {
        return {
            restrict: 'E',
            scope: {
            	contents: "=",
                onEntry: "&",
                onCurrencyChange: "&",
                onInvalid: "&"
            },
            templateUrl: 'wallet.tpl.html',
            controller: function($scope) {
            	var validationStatus;
            	function getValidationStatus(amount, total, isRemove) {
            		if (!amount.toString().match(/^-?\d*(\.\d+)?$/)) {
            			return 'Please enter a valid amount';
            		}
            		var castAmount = parseFloat(amount);
            		if(castAmount <= 0) {
            			return 'Please enter an amount that is larger than 0';
            		}
            		if(isRemove && (parseFloat(total) - castAmount < 0)) {
            			return 'Cannot remove more than the current total inside the wallet';
            		}
            		return 'OK';
            	}

                $scope.CurrencyService = CurrencyService;

                $scope.changeCurrency = function(currency) {
                    $scope.onCurrencyChange({'currency': currency})
                    $scope.reset();
                }

            	$scope.reset = function() {
            	    $scope.newAmount = 0;
            	    $scope.totalAmount = _.reduce($scope.contents.entries, function(memo, entry) { return memo + parseFloat(entry.amount) || 0;}, 0)
            	}
            	$scope.modifyAmount = function(isRemove){
            		validationStatus = getValidationStatus($scope.newAmount, $scope.totalAmount, isRemove);
            		if(validationStatus === 'OK') {
            			$scope.onEntry({'amount': isRemove ? -$scope.newAmount : $scope.newAmount});
            		}
            		else {
            			$scope.onInvalid({'message': validationStatus})
            		}
            		$scope.reset();
            	}
            	$scope.$watchCollection('contents.entries', function(entries) {
                    if(entries){
                        $scope.reset();
                    }
            	})
            }
        }
    }]);