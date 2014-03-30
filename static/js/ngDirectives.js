'use strict';

/* Directives */

var canvasAppDirectives = angular.module('canvasAppDirectives', []);

/* resize */
/* http://microblog.anthonyestebe.com/2013-11-30/window-resize-event-with-angular/ */
canvasAppDirectives.directive('resizable', function($window, ResizeService) {
  return function($scope) {
    $scope.initializeWindowSize = function() {
      $scope.windowHeight = $window.innerHeight;
      $scope.windowWidth  = $window.innerWidth;
      // ResizeService.width  = $window.innerWidth;
      // ResizeService.height = $window.innerHeight;
      return;
    };
    $scope.initializeWindowSize();
    return angular.element($window).bind('resize', function() {
      $scope.initializeWindowSize();
      $scope.$apply()
      // ResizeService.runOnResizeFunc();
      return;
    });
  };
});