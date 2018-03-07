(function () {
    'use strict';

    app.controller('customerEyeCalculationController', ['$scope', '$location', '$rootScope',
    function ($scope, $location, $rootScope) {
        $rootScope.naehe = false;
        $rootScope.ferne = false;
        $rootScope.computer = true;
        $rootScope.sport = false;
        $rootScope.hobby = false;

        $scope.refraction = [
            {sph: -1.00, cyl: -1.25, achse: 164, add: -2.0, vcc: 1.0, vcc_binokular: 1.0},
            {sph: -1.25, cyl: -1.25, achse: 171, add: -2.5, vcc: 0.3, vcc_binokular: 1.3}
        ]
    }]);
}());