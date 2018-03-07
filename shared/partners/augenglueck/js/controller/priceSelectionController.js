(function () {
    'use strict';

    app.controller('priceSelectionController', ['$scope', '$location', '$timeout', '$q', '$rootScope',
    function ($scope, $location, $timeout, $q, $rootScope) {
        $scope.optionIndex = 0;
        $scope.arbeitMatrix = [
            [true, true, true, false, false], 
            [false, false, true, false, false], 
            [true, true, false, false, true]
        ];
        $scope.gleitsichtMatrix = [
            [true, true, true, false, false], 
            [true, true, false, false, false], 
            [true, true, false, true, false], 
            [true, true, false, false, true]
        ];
        $scope.einstaerkenMatrix = [
            [true, false, false, false, false], 
            [false, true, false, false, false], 
            [false, false, false, true, false], 
            [false, false, false, false, true], 
            [true, false, false, true, false], 
            [true, false, false, false, true]
        ];

        var init = function(){
            $scope.selectedMatrix = [$rootScope.ferne, $rootScope.naehe, $rootScope.computer, $rootScope.sport, $rootScope.hobby];
            $scope.isArbeitsplatz = $scope.selectedMatrix.every((v,i) => ((v === $scope.arbeitMatrix[0][i])) ||
                                    $scope.selectedMatrix.every((v,i) => (v === $scope.arbeitMatrix[1][i])) || 
                                    $scope.selectedMatrix.every((v,i) => (v === $scope.arbeitMatrix[2][i])));
            $scope.isGleitsicht = $scope.selectedMatrix.every((v,i) => ((v === $scope.gleitsichtMatrix[0][i])) ||
                                    $scope.selectedMatrix.every((v,i) => (v === $scope.gleitsichtMatrix[1][i])) || 
                                    $scope.selectedMatrix.every((v,i) => (v === $scope.gleitsichtMatrix[2][i])) || 
                                    $scope.selectedMatrix.every((v,i) => (v === $scope.gleitsichtMatrix[3][i])));
            $scope.isEinstaerken = $scope.selectedMatrix.every((v,i) => ((v === $scope.einstaerkenMatrix[0][i])) || 
                                    $scope.selectedMatrix.every((v,i) => (v === $scope.einstaerkenMatrix[1][i])) || 
                                    $scope.selectedMatrix.every((v,i) => (v === $scope.einstaerkenMatrix[2][i])) || 
                                    $scope.selectedMatrix.every((v,i) => (v === $scope.einstaerkenMatrix[3[i]])) || 
                                    $scope.selectedMatrix.every((v,i) => (v === $scope.einstaerkenMatrix[4][i])) || 
                                    $scope.selectedMatrix.every((v,i) => (v === $scope.einstaerkenMatrix[5][i])));

            if($scope.isArbeitsplatz){
                $scope.update(0);
            }
            else if($scope.isEinstaerken){
                $scope.update(1);
            }
            else if($scope.isGleitsicht){
                $scope.update(2);
            }
            else {
                $scope.isArbeitsplatz = true;
                $scope.isEinstaerken = true;
                $scope.isGleitsicht = true;
                $scope.update(0);
            }
        }

        $scope.update = function(index){
            augenglueck_refresh(index);
            $scope.optionIndex = index;
        }
        
        $scope.nextStep = function(){
            if(!($scope.isArbeitsplatz && $scope.isGleitsicht) || !($scope.isEinstaerken && $scope.isArbeitsplatz) || !($scope.isEinstaerken && $scope.isGleitsicht)){
                return;
            }
            for(let i = 0; i < 3; i++){
                let temp = $scope.optionIndex+i;
                if(temp >= 3){
                    temp = temp - 3;
                }
                $scope.iterations = 0;
                if((temp % 3 == 0) && $scope.isArbeitsplatz){
                    $scope.update(0);
                    $scope.optionIndex = 0;
                    break;
                }
                else if((temp % 3 == 1) && $scope.isEinstaerken){
                    $scope.update(1);
                    $scope.optionIndex = 1;
                    break;
                }
                else if((temp % 3 == 2) && $scope.isGleitsicht){
                    $scope.update(2);
                    $scope.optionIndex = 2;
                    break;
                }
            }
        }

        $rootScope.buy = function(){
            console.log("yeah!");
        }

        $scope.previousStep = function(){
            if(!($scope.isArbeitsplatz && $scope.isGleitsicht) || !($scope.isEinstaerken && $scope.isArbeitsplatz) || !($scope.isEinstaerken && $scope.isGleitsicht)){
                return;
            }
            for(let i = 0; i < 3; i++){
                let temp = $scope.optionIndex-i;
                if(temp < 0){
                    temp = temp + 3;
                }
                $scope.iterations = 0;
                if((temp % 3 === 0) && $scope.isArbeitsplatz){
                    $scope.update(0);
                    $scope.optionIndex = 0;
                    break;
                }
                else if((temp % 3 === 1) && $scope.isEinstaerken){
                    $scope.update(1);
                    $scope.optionIndex = 1;
                    break;
                }
                else if((temp % 3 === 2) && $scope.isGleitsicht){
                    $scope.update(2);
                    $scope.optionIndex = 2;
                    break;
                }
            }
        }

        $scope.navSubClass = function (index) {
            return index === $scope.optionIndex ? 'priceSelected' : '';
        };

        $scope.table_selectCell = function(tableId, iRow, iCol){
            table_selectCell(tableId, iRow, iCol);
        }  

        $scope.$on('$routeChangeSuccess', function(next, current) { 
            $timeout(function () {
                init();
            }, 500);	
        });

        //  NEW CODE
        $rootScope.auction = false;
    }]);
}());