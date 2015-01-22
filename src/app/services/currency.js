angular.module("services")
	.factory('CurrencyService', function() {
		var currencies = ['USD', 'GBP', 'EUR'],
			defaultCurrency = 'GBP',
			defaultCurrencyRatios = {
				'USD': 1.51,
				'EUR': 1.31,
				'GBP': 1
			},
			currencySymbols = {
				'USD': '$',
				'EUR': '€',
				'GBP': '£'
			}
		return {
			getDefaultCurrency: function() {
				return defaultCurrency;
			},
			getCurrencyList: function() {
				return angular.copy(currencies);
			},
			getCurrencySymbol: function(currencyString) {
				return currencySymbols[currencyString] || false;
			},
			convert: function(amount, from, to) {
				if(isNaN(parseFloat(amount)) || !~currencies.indexOf(from) || !~currencies.indexOf(to)){
					return false;
				};
				return amount / defaultCurrencyRatios[from] * defaultCurrencyRatios[to];
			}
		}
	});