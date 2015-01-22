angular.module("app")
    .controller("mainCtrl", ['$scope', '$timeout', 'WalletService', function ($scope, $timeout, WalletService) {
    	WalletService.get().then(function(response){
            $scope.walletContents = response;
        });
    	$scope.resetWallet = function() {
    		WalletService.reset().then(function(response){
               $scope.walletContents = response; 
            });
    	}
    	$scope.addWalletEntry = function(amount) {
    		WalletService.addEntry(amount).then(function(response){
                $scope.walletContents = response;
            });
    	};
    	$scope.displayErrorMessage = function(message) {
    		alert(message);
    	};
    	$scope.changeWalletCurrency = function(currency) {
    		WalletService.changeCurrency(currency).then(function(response){
                $scope.walletContents = response;
            });
    	}
    }]);
