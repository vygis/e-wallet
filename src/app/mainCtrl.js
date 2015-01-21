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
    }]);