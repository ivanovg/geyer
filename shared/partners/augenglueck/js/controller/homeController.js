(function () {
    'use strict';

    app.controller('homeController', ['$scope', '$location', '$rootScope',
    function ($scope, $location, $rootScope) {

        // NEW CODE
        $scope.goToPriceTable = function () {
            $rootScope.naehe = true;
            $rootScope.ferne = true;
            $rootScope.computer = true;
            $rootScope.sport = true;
            $rootScope.hobby = true;

            $location.url('fieldOfUse');
        }
    }]);
}());