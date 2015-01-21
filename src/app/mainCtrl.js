angular.module("app")
    .controller("mainCtrl", ['$scope', function ($scope) {
    	$scope.walletContents = {
    		entries: [
    			{
    				amount: 10.5,
    				date: Date.now()
    			}
    		],
    		currency: ['GBP']
    	};
    	$scope.modifyWalletAmount = function(amount, isRemove) {
    		$scope.walletContents.entries.push({
    			amount: isRemove ? -amount : amount,
    			date: Date.now()
    		});
    	};
    }]);