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
    }]);