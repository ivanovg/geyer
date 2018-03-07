(function () {
    'use strict';

    app.controller('customerAdministrationController', ['$scope', '$location', '$window', '$uibModal',
    function ($scope, $location, $window, $uibModal) {
        $scope.sortType     = 'lastname'; 
        $scope.sortReverse  = false;  
        $scope.searchCustomer   = ''; 
        $scope.sendMailSelectionOn = false;

        $scope.setSelection = function (customer) {
            customer.isSelected = !customer.isSelected;
            $scope.toggleSelection();
        }

        $scope.deselectAll = function (){
            $scope.customers.forEach(x=>x.isSelected = false);
            $scope.toggleSelection();
        }

        $scope.toggleSelection = function (){
            if ($scope.customers.filter(x=>x.isSelected ===true).length === 0){
                $scope.sendMailSelectionOn = false;
            }
            else {
                $scope.sendMailSelectionOn = true;
            }
        }

        $scope.openAuctionEmailModal = function() {

            var modalInstance = $uibModal.open({
                templateUrl: 'templates/AdminAuctionEmailModal.html',
                controller: 'adminAuctionEmailModalController',
                size: 'lg'
            });
            modalInstance.result.then(function(){}, function(){});
        }

        $scope.openCustomerModal = function() {

          var modalInstance = $uibModal.open({
            templateUrl: 'templates/AdminCustomerModal.html',
            controller: 'adminCustomerModalController',
            size: 'lg'
          });
          modalInstance.result.then(function(){}, function(){});
        }



        $scope.sendMail = function() {
            var mailToAddresses = $scope.customers.filter(x=>x.isSelected).map(x=>x.mail).join(",");
            var link = "mailto:mustermail@aabbbdd.eara"
                     + "?bcc=" + mailToAddresses
                     + "&subject=" + escape("This is my subject")
                     + "&body=Hallo"
            ;
            window.open(link);
        }

        $scope.customers = [
            {firstname: 'Max',      lastname: 'Mustermann', age: 33, mail: "mustermann@max.maximal",    glasses:"G6 Brechungsindex 1,74",           isSelected: false},
            {firstname: 'Mini',     lastname: 'Musterfrau', age: 25, mail: "musterfrau@mini.maximal",   glasses:"RAUMGLÄSER1 Brechungsindex 1,67",  isSelected: false},
            {firstname: 'Der',      lastname: 'Maus',       age: 19, mail: "maus1@mini.maximal",        glasses:"ASPHÄRISCH Brechungsindex 1,74",   isSelected: false},
            {firstname: 'Ernst',    lastname: 'Inn',        age: 56, mail: "maus2@mini.maximal",        glasses:"TOP EINSTIEG Brechungsindex 1,67", isSelected: false},
            {firstname: 'Hubert',   lastname: 'Dachs',      age: 81, mail: "maus3@mini.maximal",        glasses:"TOP PRODUCT1 Brechungsindex 1,60", isSelected: false},
            {firstname: 'Gustav',   lastname: 'Igel',       age: 34, mail: "maus4@mini.maximal",        glasses:"G4 Brechungsindex 1,67",           isSelected: false},            
            {firstname: 'Manfred',  lastname: 'Schwalbe',   age: 27, mail: "maus5@mini.maximal",        glasses:"G2 Brechungsindex 1,60",           isSelected: false},
            {firstname: 'Silke',    lastname: 'Marder',     age: 43, mail: "maus6@mini.maximal",        glasses:"ASPHÄRISCH Brechungsindex 1,74",   isSelected: false},            
            {firstname: 'Anna',     lastname: 'Delfin',     age: 18, mail: "maus7@mini.maximal",        glasses:"G6 Brechungsindex 1,50",           isSelected: false},
            {firstname: 'Frederike',lastname: 'Ponny',      age: 52, mail: "maus8@mini.maximal",        glasses:"PREMIUM Brechungsindex 1,74",      isSelected: false},
            {firstname: 'Jessica',  lastname: 'Wolf',       age: 49, mail: "maus9@mini.maximal",        glasses:"SIMPLE OFFICE Brechungsindex 1,50",isSelected: false}            
        ]
    }]);
}());