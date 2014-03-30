'use strict';

var canvasAppControllers = angular.module('canvasAppControllers', []);

/* CavasCtrl */
canvasAppControllers.controller('CanvasCtrl',
  function($scope, $log, CanvasService) {
    $log.info('===============CanvasCtrl===============');

    $scope.name="joh!";

    $scope.$watch('windowWidth',  function(newValue, oldValue){
      $scope.resizeCanvas();
    });
    $scope.$watch('windowHeight', function(newValue, oldValue){
      $scope.resizeCanvas();
    });

    $scope.resizeCanvas = function(){
      $scope.canvasWidth  = $scope.windowWidth  - $('#toggleExample').offset().left - 30;
      $scope.canvasHeight =  $('.navbar-absolute-bottom').offset().top - $('#toggleExample').offset().top - 30;
    };

    $scope.canvasInstance = new CanvasClass();
    $scope.canvasInstance.initialize('demoCanvas', $scope, $log.info);

    $scope.canvasSocket = new CanvasSocket();

    CanvasService.canvasInstance = $scope.canvasInstance;
    CanvasService.canvasSocket = $scope.canvasSocket;

    //CanvasService.init('demoCanvas');
    $scope.$watch('$viewContentLoaded', function(){
      $scope.canvasInstance.onCanvasShow();
      $scope.canvasSocket.initialize($scope.canvasInstance, "", $scope, $log.info);

      //CanvasService.onCavasShow($scope);
    });
/*
    $scope.canvasMouseUp   = function(event){
      CanvasService.mouseUp(event, $scope);
    }
    $scope.canvasMouseDown = function(event){
      CanvasService.mouseDown(event, $scope);
    }
    $scope.canvasMouseMove = function(event){
      CanvasService.mouseMove(event, $scope);
    }
    */
  }
);

/* SidebarCtrl */
canvasAppControllers.controller('SidebarCtrl',
  function($scope, $log, CanvasService) {
    $log.info('===============SidebarCtrl===============');

    $scope.colorList = [
        {color: '#000000'},
        {color: '#555555'},
        {color: '#AAAAAA'},
        {color: '#FFFFFF'},
        {color: '#E60012'},
        {color: '#F39800'},
        {color: '#FFF100'},
        {color: '#009944'},
        {color: '#0068B7'},
        {color: '#1D2088'},
        {color: '#920783'},
    ];
    $scope.penSizeList = [
        {penSize:  1 },
        {penSize:  3 },
        {penSize:  5 },
        {penSize:  8 },
        {penSize: 16 },
        {penSize: 24 },
        {penSize: 36 },
        {penSize: 48 },
        {penSize: 72 },
    ];

    $scope.colorBtnClick = function(color){
        CanvasService.canvasInstance.drawColor = color;
    }
    $scope.sizeBtnClick = function(size){
        CanvasService.canvasInstance.drawSize = size;
    }
    $scope.clearBtnClick = function(){
        if (confirm('The content will be cleared. This action can not be Undo. Are you sure to clear it?')){
          CanvasService.canvasInstance.clearScreen( CanvasService.canvasInstance.shape, /* send = */ true );

        }
    }
  }
);

/* BottomToolbar */
canvasAppControllers.controller('BottomToolbarCtrl',
  function($scope, $log, CanvasService) {
    $log.info('===============BottomToolbarCtrl===============');

    $scope.undoBtnClick = function(){
        CanvasService.canvasInstance.undoDraw(/* send = */true);
    }

  }
);