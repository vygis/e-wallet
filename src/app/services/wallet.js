angular.module("services")
    .constant('WALLET_SERVICE_NAMESPACE', 'wallet')
    .factory('WalletService', ['$window', '$q', '$timeout', 'LocalStorageService', 'CurrencyService', 'WALLET_SERVICE_NAMESPACE', function ($window, $q, $timeout, LocalStorageService, CurrencyService, WALLET_SERVICE_NAMESPACE) {

        var _cachedResponse = null;

        function _get(){
            var deferred = $q.defer();
            if(_cachedResponse){
                deferred.resolve(_cachedResponse);
            }
            else {
                LocalStorageService.get(WALLET_SERVICE_NAMESPACE).then(function(response){
                    if(response === null) { //initialising if localStorage slot is empty
                        _reset().then(function(response){
                            _cachedResponse = response;
                            deferred.resolve(response);
                        });
                    }
                    else {
                        cachedResponse = response;
                        deferred.resolve(response);
                    }
                });               
            }
            return deferred.promise;
        }

        function _set(payload) {
            _cachedResponse = payload;
            return LocalStorageService.set(WALLET_SERVICE_NAMESPACE, payload);
        }

        function _reset() {
            var emptyContents = {
                    entries: [],
                    currency: CurrencyService.getDefaultCurrency()
                },
                promise = _set(emptyContents);

            promise.then(function(response){
                return response;
            })
            return promise;
        }

        function _addEntry(amount) {
            var deferred = $q.defer();
            _get().then(function(response){
                response.entries.push({
                    amount: amount,
                    date: Date.now() 
                });
                _set(response).then(function(response){
                    deferred.resolve(angular.copy(response));
                });
            });
            return deferred.promise;
        }

        function _changeCurrency(currency) {
             var deferred = $q.defer();
            _get().then(function(response){
                var oldCurrency = response.currency;
                response.currency = currency;
                _.each(response.entries, function(entry){
                    entry.amount = CurrencyService.convert(entry.amount, oldCurrency, currency);
                });
                _set(response).then(function(response){
                    deferred.resolve(angular.copy(response));
                });
            });
            return deferred.promise;           
        }

        return {
            get: _get,
            reset: _reset,
            addEntry: _addEntry,
            changeCurrency: _changeCurrency
        }
    }]);