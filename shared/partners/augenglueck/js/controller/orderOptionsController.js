(function () {
    'use strict';

    app.controller('orderOptionsController', ['$scope', '$location', '$timeout', '$rootScope',
        function ($scope, $location, $timeout, $rootScope) {
            var init = function () {
                $timeout(function () {
                    var myEl = undefined;
                    while (!myEl) {
                        augenglueck_renderCalculationTable();
                        augenglueck_renderExtraTable();
                        var myEl = angular.element(document.querySelector('#calculation'));
                        myEl.addClass('col-sm-6 pull-right');

                        // NEW CODE
                        $scope.total = document.getElementsByClassName('calculate_final')[0].lastElementChild.innerHTML;
                        var index = $scope.total.indexOf(',');
                        $scope.total = $scope.total.substring(0, index);
                        $scope.total = parseInt($scope.total);
                        $scope.originalPrice = document.getElementsByTagName("strike")[0].textContent;
                        var first = $scope.originalPrice.indexOf(" ");
                        var second = $scope.originalPrice.indexOf(",");
                        $scope.originalPrice = $scope.originalPrice.substring(first + 1, second);

                        $scope.originalDiscountedPrice = document.getElementsByTagName('strike')[0].parentElement.textContent;
                        var index1 = $scope.originalDiscountedPrice.indexOf('€');
                        var index2 = $scope.originalDiscountedPrice.lastIndexOf(',');
                        $scope.originalDiscountedPrice = $scope.originalDiscountedPrice.substring(index1 + 1, index2);

                        $scope.initialDiscount = $scope.originalPrice - $scope.originalDiscountedPrice;
                    }
                }, 500);
            }

            init();
            
            
            // ============== NEW CODE ==============================

            // back to consultation
            $scope.goToConsultation = function () {
                $location.url("/fieldOfUse");
                $rootScope.consultation = false;
            }

            // frame
            $scope.frameOptions = [
                {name: "Ray Ban", price: 89},
                {name: "Ray Ban Light Ray Premium Selection", price: 112},
                {name: "Gucci", price: 134},
                {name: "Marc Jacobs", price: 193},
                {name: "Ferrary", price: 22},
                {name: "Burberry", price: 133},
                {name: "Guess", price: 88},
                {name: "Mont Blanc", price: 139},
                {name: "Tom Ford", price: 89},
                {name: "Swarovski Grazia", price: 129},
                {name: "Swarovski Dara", price: 150},
                {name: "Porsche Design", price: 99}
            ];

            $scope.isFrame = false;
            $rootScope.frameSelected = false;

            $scope.showFrames = function () {
                var el = document.getElementById("extras");
                el.remove();
                $scope.isFrame = true;
            }

            $scope.selectFrame = function (frameSelection) {
                $rootScope.selectedFrame = frameSelection;
                var myEl = angular.element(document.querySelector('#calculation'));
                myEl.remove();
                init();
                $timeout(function () {
                    var el = document.getElementById("extras");
                    el.remove();
                    $rootScope.frameSelected = true;
                    $rootScope.totalAfterFrame = frameSelection.price + $scope.total;
                    var frames = document.getElementsByClassName("frames");
                    for (var i = 0; i < frames.length; i++) {
                        frames[i].style.background = "white";
                        frames[i].style.color = "black";
                    }
                    var frame = document.getElementById(frameSelection.name);
                    frame.style.background = "#e46c0b";
                    frame.style.color = "white";
                }, 500)
            }

            // discount
            $rootScope.isDiscount = false;
            $rootScope.discountAmount = null;
            
            $scope.discount = function () {
                var myEl = angular.element(document.querySelector('#calculation'));
                myEl.remove();
                init()
                $timeout(function () {
                    var el = document.getElementById("extras");
                    el.remove();
                    $rootScope.totalAfterDiscount = $scope.total + $rootScope.selectedFrame.price;
                    $rootScope.discountAmount = $scope.initialDiscount;
                    $rootScope.isDiscount = !$rootScope.isDiscount;
                },500)

            }

            $scope.calculateTotal = function () {
                $rootScope.totalAfterDiscount = $scope.total - $rootScope.discountAmount + $scope.initialDiscount + $rootScope.selectedFrame.price;
            }

            // funding
            $rootScope.isFunding = false;
            $scope.fundingOptions = [6, 12, 18, 24];

            $scope.funding = function (value) {
                var el = document.getElementById("funding")
                el.remove();
                var myEl = angular.element(document.querySelector('#calculation'));
                myEl.remove();
                init()
                $timeout(function () {
                    var el = document.getElementById("extras");
                    el.remove();
                    $rootScope.fundingMounts = value;
                    $rootScope.fundingAmount = ($rootScope.isDiscount ? $rootScope.totalAfterFrame / value : $rootScope.totalAfterDiscount / value).toFixed(2);
                    $rootScope.isFunding = true;

                },500);
            }
        }]);
}());