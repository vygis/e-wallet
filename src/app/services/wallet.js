angular.module("services")
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
    }]);