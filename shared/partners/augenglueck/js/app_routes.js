app.config(['$routeProvider', 'BASE_URL', function ($routeProvider, BASE_URL) {
    $routeProvider
    .when('/home', {
        templateUrl: BASE_URL + 'templates/Home.html'
    }).when('/fieldOfUse', {
        templateUrl: BASE_URL + 'templates/FieldOfUse.html'
    }).when('/visualAreas', {
        templateUrl: BASE_URL + 'templates/VisualAreas.html'
    }).when('/matrixComparison', {
        templateUrl: BASE_URL + 'MatrixComparison.sstpl'
    }).when('/calculationIndex', {
        templateUrl: BASE_URL + 'templates/CalculationIndex.html'
    }).when('/coating', {
        templateUrl: BASE_URL + 'templates/Coating.html'
    }).when('/priceSelection', {
        templateUrl: BASE_URL + 'templates/PriceSelection.html'
    }).when('/enterCustomerInformation', {
        templateUrl: BASE_URL + 'templates/CustomerInput.html'
    }).when('/orderOverview', {
        templateUrl: BASE_URL + 'templates/Orderoverview.html'
    }).when('/orderOptions', {
        templateUrl: BASE_URL + 'templates/OrderOptions.html'
    }).when('/admin', {
        templateUrl: BASE_URL + 'templates/Admin.html'
    }).when('/customerAdministration', {
        templateUrl: BASE_URL + 'templates/CustomerAdministration.html'
    }).when('/pricingTableAdministration', {
        templateUrl: BASE_URL + 'templates/PricingTableAdministration.html'
    }).when('/customerEyeCalculation', {
        templateUrl: BASE_URL + 'templates/CustomerEyeCalculation.html'
    }).when('/mdrVideo', {
        templateUrl: BASE_URL + 'templates/MDRVideo.html'
    }).when('/statisticsAdministration', {
        templateUrl: BASE_URL + 'templates/AdminStatistics.html'
    })
    .otherwise('/home'); 
}]);