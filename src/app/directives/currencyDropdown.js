angular.module("directives")
    .directive('currencyDropdown', ['CurrencyService', function(CurrencyService) {
        return {
            restrict: 'E',
            scope: {
            	currentCurrency: "@",
                onChange: "&"
            },
            templateUrl: 'currency-dropdown.tpl.html',
            controller: function($scope) {
                $scope.currencies = CurrencyService.getCurrencyList();
            }
        }
    }]);