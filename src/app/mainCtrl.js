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
    }]);