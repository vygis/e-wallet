angular.module("directives")
    .directive('wallet', function() {
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
    });