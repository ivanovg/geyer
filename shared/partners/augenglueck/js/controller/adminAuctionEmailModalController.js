(function () {
    'use strict';

    app.controller('adminAuctionEmailModalController', ['$scope', '$location', '$uibModalInstance',
        function ($scope, $location, $uibModalInstance) {
            $scope.close = function () {
                $uibModalInstance.dismiss();
            }

            // ---------------------------------------
            // NEW CODE
            // ---------------------------------------

            $scope.customers = [
                {firstname: 'Max',      lastname: 'Mustermann', age: 33, mail: "mustermann@max.maximal",    glasses:"Gleitsichtbrille",       isSelected: true, totalSalesVolume: 1000,  lastPurchaseDate: new Date(2017, 6, 15)},
                {firstname: 'Mini',     lastname: 'Musterfrau', age: 25, mail: "musterfrau@mini.maximal",   glasses:"Ferne / Nähe",           isSelected: true, totalSalesVolume: 2000,  lastPurchaseDate: new Date(2016, 9, 19)},
                {firstname: 'Der',      lastname: 'Maus',       age: 19, mail: "maus1@mini.maximal",        glasses:"Ferne / Nähe",           isSelected: true, totalSalesVolume: 1500,  lastPurchaseDate: new Date(2017,11, 8)},
                {firstname: 'Ernst',    lastname: 'Inn',        age: 56, mail: "maus2@mini.maximal",        glasses:"Sportbrille",            isSelected: true, totalSalesVolume: 1200,  lastPurchaseDate: new Date(2018, 0, 24)},
                {firstname: 'Hubert',   lastname: 'Dachs',      age: 81, mail: "maus3@mini.maximal",        glasses:"Gleitsichtbrille",       isSelected: true, totalSalesVolume: 3500,  lastPurchaseDate: new Date(2017, 4, 10)},
                {firstname: 'Gustav',   lastname: 'Igel',       age: 34, mail: "maus4@mini.maximal",        glasses:"Gleitsichtbrille",       isSelected: true, totalSalesVolume: 14500, lastPurchaseDate: new Date(2016, 9, 30)},
                {firstname: 'Manfred',  lastname: 'Schwalbe',   age: 27, mail: "maus5@mini.maximal",        glasses:"Sportbrille",            isSelected: true, totalSalesVolume: 5000,  lastPurchaseDate: new Date(2017, 7, 8)},
                {firstname: 'Silke',    lastname: 'Marder',     age: 43, mail: "maus6@mini.maximal",        glasses:"Sportbrille",            isSelected: true, totalSalesVolume: 6700,  lastPurchaseDate: new Date(2016, 8, 4)},
                {firstname: 'Anna',     lastname: 'Delfin',     age: 18, mail: "maus7@mini.maximal",        glasses:"Sonnenbrille",           isSelected: true, totalSalesVolume: 4500,  lastPurchaseDate: new Date(2017, 2, 27)},
                {firstname: 'Frederike',lastname: 'Ponny',      age: 52, mail: "maus8@mini.maximal",        glasses:"Gleitsichtbrille",       isSelected: true, totalSalesVolume: 8700,  lastPurchaseDate: new Date(2015, 8, 22)},
                {firstname: 'Jessica',  lastname: 'Wolf',       age: 49, mail: "maus9@mini.maximal",        glasses:"Lesebrille",             isSelected: true, totalSalesVolume: 12300, lastPurchaseDate: new Date(2017, 7, 12)}
            ];

            $scope.customersSelected = true;
            var filterApplied = false;

            $scope.customerSelection = {dateOfBirth: null, lastPurchaseDate: null, totalSalesVolume: null, totalSalesInYear: null};

            $scope.glassesTypes = [
                {type: 'Gleitsichtbrille', value: true},
                {type: 'Ferne / Nähe', value: true},
                {type: 'Sportbrille', value: true},
                {type: 'Sonnenbrille', value: true},
                {type: 'Lesebrille', value: true},
                {type: 'Brille', value: true}
            ];

            var glassesChecked = function () {
                $scope.glassesTypes.forEach(function (glasses) {
                    if (glasses.value === true) {
                        return true;
                    }
                });
                return false;
            };

            var customerGlassesSelected = function (glasses) {
                for (var i = 0; i < $scope.glassesTypes.length; i++) {
                    if ($scope.glassesTypes[i].type === glasses && $scope.glassesTypes[i].value === true)
                        return true;
                }
                return false;
            }

            
            $scope.applyDateOfBirth = function () {
                $scope.customers.forEach(function (customer) {
                    if ($scope.today.getFullYear() - $scope.customerSelection.dateOfBirth.getFullYear() < customer.age)
                        customer.isSelected = true;
                    else
                        customer.isSelected = false;
                })
            }

            $scope.applyLastPurchaseDate = function() {
                $scope.customers.forEach(function (customer) {
                    if ($scope.customerSelection.lastPurchaseDate > customer.lastPurchaseDate)
                        customer.isSelected = true;
                    else
                        customer.isSelected = false;
                })
            }

            $scope.applyTotalSalesVolume = function () {
                $scope.customers.forEach(function (customer) {
                    if ($scope.customerSelection.totalSalesVolume > customer.totalSalesVolume)
                        customer.isSelected = false;
                    else
                        customer.isSelected = true;
                })
            }

            $scope.applyTotalSalesInYear = function () {

            }

            $scope.applyTypeOfGlasses = function (type) {
                $scope.customers.forEach(function (customer) {
                    if (type === customer.glasses)
                        customer.isSelected = !customer.isSelected;
                })
            }

            $scope.selectedCustomers = [];

            $scope.today = new Date();

            $scope.sendAuction = function () {
                $scope.customersSelected = true;
                $uibModalInstance.dismiss();
            }

            $scope.back = function () {
                $scope.customersSelected = true;
            }

            $scope.removeFromList = function (customer) {
                customer.isSelected = false;
            }
        }]);
}());