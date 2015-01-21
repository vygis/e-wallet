angular.module("services", []);
angular.module("services")
	.factory('CurrencyService', function() {
		var currencies = ['USD', 'GBP', 'EUR'],
			defaultCurrency = 'GBP',
			defaultCurrencyRatios = {
				'USD': 1.51,
				'EUR': 1.31,
				'GBP': 1
			}
		return {
			getDefaultCurrency: function() {
				return defaultCurrency;
			},
			getCurrencyList: function() {
				return angular.copy(currencies);
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

    	this.contents = LocalStorageService.get(WALLET_SERVICE_NAMESPACE);
        if(this.contents === null) {
        	this.reset();
        }        
    }]);angular.module("app", ["app.templates", "services", "directives"]);
angular.module("app")
    .controller("mainCtrl", ['$scope', '$timeout', 'WalletService', function ($scope, $timeout, WalletService) {
    	$scope.walletContents = WalletService.get();
    	$scope.resetWallet = function () {
    		$scope.walletContents = WalletService.reset();
    	}
    	$scope.modifyWalletAmount = function(amount) {
    		$scope.walletContents = WalletService.modifyAmount(amount);
    	};
    	$scope.displayErrorMessage = function(message) {
    		alert(message);
    	};
    }]);angular.module("directives", []);

angular.module("directives")
    .directive('wallet', function() {
        return {
            restrict: 'E',
            scope: {
            	contents: "=",
                onAction: "&",
                onInvalid: "&"
            },
            template: 
	            "<div ng-repeat='entry in contents.entries'>" +
	            "<span ng-bind='contents.currency'></span><span ng-bind='entry.amount'></span> | <span ng-bind='entry.date'></span>" +
	            "</div>" + 
	            "<b>Total: <span>{{totalAmount}}</span></b>" +
	            "<hr/>" +
	            "Enter quantity: <input type='text' title='Enter Quantity' ng-model='newAmount'/> " + 
	            "<button type='button' ng-click='modifyAmount(false)'>Add</button> <button type='button' ng-click='modifyAmount(true)'>Remove</button>",
	            
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

            	$scope.reset = function() {
            	    $scope.newAmount = 0;
            	    $scope.totalAmount = _.reduce($scope.contents.entries, function(memo, entry) { return memo + parseFloat(entry.amount) || 0;}, 0)
            	}
            	$scope.modifyAmount = function(isRemove){

            		validationStatus = getValidationStatus($scope.newAmount, $scope.totalAmount, isRemove);
            		if(validationStatus === 'OK') {
            			$scope.onAction({'amount': isRemove ? -$scope.newAmount : $scope.newAmount});
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
    });

/*
    
*/