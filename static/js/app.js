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
    	$scope.modifyWalletAmount = function(amount, isRemove) {
    		$scope.walletContents.entries.push({
    			amount: isRemove ? -amount : amount,
    			date: Date.now()
    		});
    	};
    }]);angular.module("directives", []);

angular.module("directives")
    .directive('wallet', function() {
        return {
            restrict: 'E',
            scope: {
            	contents: "=",
                onAction: "&"
            },
            template: 
	            "<div ng-repeat='entry in contents.entries'>" +
	            "<span ng-bind='contents.currency'></span><span ng-bind='entry.amount'></span> | <span ng-bind='entry.date'></span>" +
	            "</div>" + 
	            "<b>Total: <span>{{totalAmount}}</span></b>" +
	            "<hr/>" +
	            "Enter quantity: <input type='text' title='Enter Quantity' ng-model='newAmount'/> " + 
	            "<button type='button' ng-click='addValue()'>Add</button> <button type='button' ng-click='subtractValue()'>Remove</button>",
	            
            controller: function($scope) {

            	$scope.reset = function() {
            	    $scope.newAmount = 0;
            	    console.log('resetting')
            	    $scope.totalAmount = _.reduce($scope.contents.entries, function(memo, entry) { return memo + parseFloat(entry.amount) || 0;}, 0)
            	}
            	$scope.addValue = function(){
            		$scope.onAction({'amount': $scope.newAmount, 'isRemove': false});
            		$scope.reset();
            	}
            	$scope.subtractValue = function(){
            		$scope.onAction({'amount': $scope.newAmount, 'isRemove': true});
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