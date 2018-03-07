(function () {
    'use strict';

    app.controller('customerInputController', ['$scope', '$location',
    function ($scope, $location) {
        $scope.formData = {firstName: "Default", lastName: "Default", city: "Default-Stadt", houseNumber: "123", street: "Default", postcode: "123456", email: "max.mustermann@example.com"};

    }]);
}());    