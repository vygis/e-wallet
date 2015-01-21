angular.module('app.templates', ['currency-dropdown.tpl.html']);

angular.module("currency-dropdown.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("currency-dropdown.tpl.html",
    "<select ng-options=\"currency for currency in currencies\" ng-model=\"currentCurrency\" ng-change=\"onChange({'currency': currentCurrency})\">\n" +
    "</select>");
}]);
