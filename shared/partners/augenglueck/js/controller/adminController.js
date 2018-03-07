(function () {
    'use strict';

    app.controller('adminController', ['$scope', '$location',
    function ($scope, $location) {
        $scope.customers =[
            {firstname: 'Max',      lastname: 'Mustermann',  time: "09:00"},
            {firstname: 'Mini',     lastname: 'Musterfrau',  time: "10:00"},
            {firstname: 'Der',      lastname: 'Maus',        time: "11:00"},
            {firstname: 'Ernst',    lastname: 'Inn',         time: "12:00"},
            {firstname: 'Hubert',   lastname: 'Dachs',       time: "13:00"},
            {firstname: 'Gustav',   lastname: 'Igel',        time: "14:00"},
            {firstname: 'Manfred',  lastname: 'Schwalbe',    time: "15:00"},
            {firstname: 'Silke',    lastname: 'Marder',      time: "16:00"},
            {firstname: 'Anna',     lastname: 'Delfin',      time: "17:00"}
        ]

        $scope.calendarView = 'month';


    }]);
}());