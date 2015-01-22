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
	}]);angular.module("services")
	.constant('WALLET_SERVICE_NAMESPACE', 'wallet')
    .service('WalletService', ['$window', 'LocalStorageService', 'CurrencyService', 'WALLET_SERVICE_NAMESPACE', function ($window, LocalStorageService, CurrencyService, WALLET_SERVICE_NAMESPACE) {
        this.modifyAmount = function(amount){
        	this.contents.entries.push({
        		amount: amount,
        		date: Date.now() 
        	});
        	LocalStorageService.set(WALLET_SERVICE_NAMESPACE, this.contents);
        	return angular.copy(this.contents);
        }

        this.reset = function() {
         	this.contents = {
        		entries: [],
        		currency: CurrencyService.getDefaultCurrency()
        	};
        	LocalStorageService.set(WALLET_SERVICE_NAMESPACE, this.contents);
        	return angular.copy(this.contents);     	
        };

        this.get = function() {
        	return angular.copy(this.contents);
        }

        this.changeCurrency = function(currency) {
        	var oldCurrency = this.contents.currency;
        	this.contents.currency = currency;
        	_.each(this.contents.entries, function(entry){
        		entry.amount = CurrencyService.convert(entry.amount, oldCurrency, currency);
        	});
        	LocalStorageService.set(WALLET_SERVICE_NAMESPACE, this.contents);
        	return angular.copy(this.contents);
        }
    	this.contents = LocalStorageService.get(WALLET_SERVICE_NAMESPACE);
        if(this.contents === null) {
        	this.reset();
        }        
    }]);angular.module("app", ["app.templates", "services", "directives"]);
angular.module("app")
    .controller("mainCtrl", ['$scope', '$timeout', 'WalletService', function ($scope, $timeout, WalletService) {
    	$scope.walletContents = WalletService.get();
    	$scope.resetWallet = function() {
    		$scope.walletContents = WalletService.reset();
    	}
    	$scope.modifyWalletAmount = function(amount) {
    		$scope.walletContents = WalletService.modifyAmount(amount);
    	};
    	$scope.displayErrorMessage = function(message) {
    		alert(message);
    	};
    	$scope.changeWalletCurrency = function(currency) {
    		$scope.walletContents = WalletService.changeCurrency(currency);
    	}
    }]);angular.module("directives", []);
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
            	$scope.$watchCollection('contents.entries', function() {
            		$scope.reset();
            	})
            }
        }
    }]);