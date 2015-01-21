angular.module("services", []);
angular.module("app", ["app.templates", "services", "directives"]);
angular.module("app")
    .controller("mainCtrl", ['$scope', '$timeout', function ($scope, $timeout) {
    	$scope.walletContents = {
    		entries: [
    			{
    				amount: 10.5,
    				date: Date.now()
    			}
    		],
    		currency: ['GBP']
    	};
    	$scope.resetWallet = function () {
    		$scope.walletContents.entries = [];
    	}
    	$scope.modifyWalletAmount = function(amount) {
    		$scope.walletContents.entries.push({
    			amount: amount,
    			date: Date.now()
    		});
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