(function () {
    'use strict';

    app.controller('orderOverviewController', ['$scope', '$location', '$window', '$q', '$timeout',
    function ($scope, $location, $window, $q, $timeout) {
        $scope.formData = {firstName: "Default", lastName: "Default", city: "Default-Stadt", houseNumber: "123", street: "Default", postcode: "123456", email: "max.mustermann@example.com"};
        $scope.isBought = false;
        $scope.isSaved = false;
        augenglueck_renderCalculationTable();

        var myEl = angular.element( document.querySelector( '#calculation' ) );
        myEl.addClass('col-xs-12');

        $scope.orderLiable = function(){
            $scope.isBought = true;
        }

        $scope.print = function(){
            $timeout($window.print, 0);
        }


        // NEW CODE

        $scope.saveOrder = function () {
            $scope.isSaved = true;
        }
    }]);
}());