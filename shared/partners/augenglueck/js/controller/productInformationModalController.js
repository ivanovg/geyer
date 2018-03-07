(function () {
    'use strict';

    app.controller('productInformationModalController', ['$scope', '$location', '$uibModalInstance',
        function ($scope, $location, $uibModalInstance) {
            $scope.close = function () {
                $uibModalInstance.dismiss();
            }

            $scope.product = [
                {category: "Algemein", info: [
                        {key: "Addresse", value: "Heinrich-Hertz-Str. 17, 63225 Langen"},
                        {key: "Land", value: "Deutschland"},
                        {key: "Komentar", value: "Geyer"},
                        {key: "Hersteller", value: "optovision GmbH"},
                        {key: "Hersteller Code", value: "OPT"}
                    ]},
                {category: "Linse", info: [
                        {key: "Bezeichnung", value: "Hart polarisierend braun"},
                        {key: "Lieferbar ab", value: "01.01.2018"},
                        {key: "Lieferbar bis", value: "31.12.2018"},
                        {key: "Standard", value: "Eco"},
                        {key: "Material", value: "Trivex"}
                    ]},
                {category: "Preis", info: {Durchmesser: "7080", Sph_Gruppe: "99", Cyl_Gruppe: "99", Preis_1: "250,00", Preis_ab: "01.01.2018", Preis_bis: "31.12.2018"}},
                {category: "Optionen", info: {Hartschicht: "Superhart", Cleanschicht: "Super Clean", Endrandung: "in bestellter Lagerfassung", Abweichender_Durchmesser: "Nein"}},
                {category: "Information", info : {}}
            ]
        }]);
}());