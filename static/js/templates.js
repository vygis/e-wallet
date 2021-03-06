angular.module('app.templates', ['currency-dropdown.tpl.html', 'wallet.tpl.html']);

angular.module("currency-dropdown.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("currency-dropdown.tpl.html",
    "<select ng-options=\"currency for currency in currencies\" ng-model=\"currentCurrency\" ng-change=\"onChange({'currency': currentCurrency})\">\n" +
    "</select>");
}]);

angular.module("wallet.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("wallet.tpl.html",
    "<div ng-repeat='entry in contents.entries'>\n" +
    "	<span ng-bind='entry.amount | currency : CurrencyService.getCurrencySymbol(contents.currency) : 2'></span> | <span ng-bind='entry.date | date : \"yyyy-MM-dd HH:mm:ss\"'></span>\n" +
    "</div>\n" +
    "<b>Total: <i class=\"fa fa-{{contents.currency | lowercase}}\"></i><span ng-bind=\"totalAmount | currency : '' : 2\"></span></b>\n" +
    "<hr/>\n" +
    "Enter quantity: <input type='text' title='Enter Quantity' ng-model='newAmount'/>\n" +
    "<button type='button' ng-click='modifyAmount(false)'>Add</button> <button type='button' ng-click='modifyAmount(true)'>Remove</button><br/>\n" +
    "Select currency: <currency-dropdown current-currency='{{contents.currency}}' on-change='changeCurrency(currency)'></currency-dropdown>");
}]);
