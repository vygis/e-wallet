
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
	            "<hr/>" +
	            "Enter quantity: <input type='text' title='Enter Quantity' ng-model='newValue'/> " + 
	            "<button type='button' ng-click='addValue()'>Add</button> <button type='button' ng-click='subtractValue()'>Remove</button>",
            controller: function($scope) {
            	$scope.reset = function() {
            	    $scope.newValue = 0;
            	}
            	$scope.addValue = function(){
            		$scope.onAction({'amount': $scope.newValue, 'isRemove': false});
            		$scope.reset();
            	}
            	$scope.subtractValue = function(){
            		$scope.onAction({'amount': $scope.newValue, 'isRemove': true});
            		$scope.reset();
            	}
            	$scope.reset();
            }
        }
    });

/*
    
*/