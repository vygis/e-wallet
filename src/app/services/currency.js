angular.module("services")
	.factory('CurrencyService', function() {
		var currencies = ['USD', 'GBP'],
			defaultCurrency = 'GBP'
		return {
			getDefaultCurrency: function() {
				return defaultCurrency;
			}
		}
	});