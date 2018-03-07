(function () {
    'use strict';
//http://www.chartjs.org/
    app.controller('adminStatisticsController', ['$scope', '$location',
    function ($scope, $location) {
        var gleitsicht = {
            label: "Gleitsicht",
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [],
        };
        var indoor = {
            label: "Indoor",
            backgroundColor: 'rgb(54, 162, 235)',
            borderColor: 'rgb(54, 162, 235)',
            data: [],
        };
        var ferne = {
            label: "Ferne",
            backgroundColor: 'rgb(255, 206, 86)',
            borderColor: 'rgb(255, 206, 86)',
            data: [],
        };
        var naehe = {
            label: "Nähe",
            backgroundColor: 'rgb(75, 192, 192)',
            borderColor: 'rgb(75, 192, 192)',
            data: [],
        };
        var sport = {
            label: "Sport",
            backgroundColor: 'rgb(153, 102, 255)',
            borderColor: 'rgb(153, 102, 255)',
            data: [],
        };
        var hobby = {
            label: "Hobby",
            backgroundColor: 'rgb(255, 159, 64)',
            borderColor: 'rgb(255, 159, 64)',
            data: [],
        };

        var setDataSets = function (){
            for (var i = 0; i < 12; i++){
                var rnd = Math.floor((Math.random() * 100) + 1);
                gleitsicht.data.push(rnd);
                rnd = Math.floor((Math.random() * 100) + 1);
                indoor.data.push(rnd);
                rnd = Math.floor((Math.random() * 100) + 1);                
                ferne.data.push(rnd);
                rnd = Math.floor((Math.random() * 100) + 1);        
                naehe.data.push(rnd);
                rnd = Math.floor((Math.random() * 100) + 1);            
                sport.data.push(rnd);
                rnd = Math.floor((Math.random() * 100) + 1);                
                hobby.data.push(rnd);
            }
        }

        var setChart = function(){
            var ctx = document.getElementById('myChart').getContext('2d');
            var chart = new Chart(ctx, {
                // The type of chart we want to create
                type: 'bar',
            
                // The data for our dataset
                data: {
                    labels: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
                    datasets: selectedDatasets
                },
                // Configuration options go here
                options: {}
            });
        }

        $scope.gleitsichtSelected = true;
        $scope.indoorSelected = false;
        $scope.ferneSelected = true;
        $scope.naeheSelected = false;
        $scope.sportSelected = false;
        $scope.hobbySelected = false;
        var selectedDatasets = [];
        
        $scope.setSelectDatasets = function (){
            selectedDatasets = [];
            $scope.gleitsichtSelected ? selectedDatasets.push(gleitsicht): null;
            $scope.indoorSelected ? selectedDatasets.push(indoor): null;
            $scope.ferneSelected ? selectedDatasets.push(ferne): null;
            $scope.naeheSelected ? selectedDatasets.push(naehe): null;
            $scope.sportSelected ? selectedDatasets.push(sport): null;
            $scope.hobbySelected ? selectedDatasets.push(hobby): null;
            setChart();
        }

        setDataSets();
        $scope.setSelectDatasets();

    }]);
}());