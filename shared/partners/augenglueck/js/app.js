var app = angular.module('augenglueckApp', [
    'ngRoute',
    'ngTouch',
    'ui.bootstrap',
    'ngAnimate'
]);

app.constant('BASE_URL', 'http://localhost:8000/partners/augenglueck/');

app.directive("myFiles", function($parse) {
    return function linkFn (scope, elem, attrs) {
      elem.on("change", function (e) { 
        scope.$eval(attrs.myFiles + "=$files", {$files: e.target.files});
        scope.$apply();
      });
    };
  });

app.value('auction', false);