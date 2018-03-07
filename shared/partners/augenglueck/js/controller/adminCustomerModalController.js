(function () {
    'use strict';

    app.controller('adminCustomerModalController', ['$scope', '$location', '$uibModal', '$uibModalInstance', '$rootScope',
    function ($scope, $location, $uibModal, $uibModalInstance, $rootScope) {
        $scope.close = function () {
            $uibModalInstance.dismiss();
        }
        $scope.formData = {firstName: "Max", lastName: "Mustermann", city: "Musterstadt", houseNumber: "11", street: "Die-Straße", postcode: "12345", email: "max.mustermann@example.com"};
        $scope.editCustomerData = false;

        $scope.exampleDeliveredText = "Offen";
        $scope.tempData = {};

        $scope.setExampleText = function (){
            var dateObj = new Date(Date.now());
            var month = dateObj.getMonth() + 1; //months from 1-12
            var day = dateObj.getDate();
            var year = dateObj.getFullYear();
            
            $scope.exampleDeliveredText = day + "." + month + "." + year;
        }

        $scope.editCustomer = function(){
            $scope.editCustomerData = true;
            $scope.copyData($scope.formData, $scope.tempData);
        }

        $scope.copyData = function(from, to){
            to.firstName = from.firstName;
            to.lastName = from.lastName;
            to.city = from.city;
            to.houseNumber = from.houseNumber;
            to.street = from.street;
            to.postcode = from.postcode;
            to.email = from.email;
        }

        $scope.cancelEdit = function(){
            $scope.editCustomerData = false;
            $scope.copyData($scope.tempData, $scope.formData);            
        }

        $scope.saveCustomerData = function(){
            $scope.editCustomerData = false;
        }


        // NEW CODE

        $scope.goToConsultation = function () {
            $rootScope.consultation = true;
            table_selectCell(1, 3, 1);
            $location.url('orderOptions');
            $uibModalInstance.dismiss();
        }

        $scope.refraction = [
            {sph: -1.00, cyl: -1.25, achse: 164, add: -2.0, vcc: 1.0, vcc_binokular: 1.0},
            {sph: -1.25, cyl: -1.25, achse: 171, add: -2.5, vcc: 0.3, vcc_binokular: 1.3}
        ]
    }]);
}());