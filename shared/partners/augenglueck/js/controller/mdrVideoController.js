(function () {
    'use strict';

    app.controller('mdrVideoController', ['$scope', '$location', '$document', '$rootScope',
    function ($scope, $location, $document, $rootScope) {
        document.getElementsByTagName('video')[0].addEventListener('ended',function(){
            $rootScope.videoPlaying = !$rootScope.videoPlaying;
            $rootScope.$digest();
          }, false);

        $rootScope.removeBackground = function(){
            $rootScope.videoPlaying = false;
        }

        $rootScope.videoControl = function(){
            var stream = document.getElementsByTagName('video')[0];
            if(!stream.paused){
                stream.pause();
                $rootScope.videoPlaying = false;
            }
            else{
                stream.play();
                $rootScope.videoPlaying = true;
            }
        }
    }]);
}());