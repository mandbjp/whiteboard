'use strict';

var canvasAppControllers = angular.module('canvasAppControllers', []);

/* CavasCtrl */
canvasAppControllers.controller('CanvasCtrl',
  function($scope, $log, CanvasService, $timeout) {
    $log.info('===============CanvasCtrl===============');

    $scope.$watch('windowWidth',  function(newValue, oldValue){
      $scope.resizeCanvas();
    });
    $scope.$watch('windowHeight', function(newValue, oldValue){
      $scope.resizeCanvas();
    });

    $scope.resizeCanvas = function(){
      $scope.canvasWidth  = $scope.windowWidth - $('#toggleExample').offset().left - 30;
      $scope.canvasHeight = $('.navbar-absolute-bottom').offset().top - $('#toggleExample').offset().top - 30;
      $timeout(function(){
        $scope.canvasInstance.updateStage();
      }, 500);
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


/* PlayerListCtrl */
canvasAppControllers.controller('PlayerListCtrl',
  function($scope, $log, CanvasService, $http, $interval) {
    $log.info('===============PlayerListCtrl===============');

    // $timeout()
    // $http.get('/players').success(function(data, status, headers, config){
    //   $scope.players = data.players;
    // // });
    // PlayerListService.autoUpdate = true;
    // PlayerListService.updatePlayers();
    // $scope.players = PlayerListService.getPlayers();

    $scope.updatePlayers = function(){
      $http.get('/players').success(function(data, status, headers, config){
        $scope.players = data.players;
        // console.log(data.players);
      });
    }
    $interval(function(){
        $scope.updatePlayers();
    }, 3000);

    // $scope.players = [{id: 7, name: "Artist007"}, {id: 25, name: "Artist025"}];
    $scope.playerClicked = function(id){
      $log.info("clicked: " + id);
    };
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



/* ColorPickerCtrl */
canvasAppControllers.controller('ColorPickerCtrl',
  function($scope, $log, CanvasService, $location, $http) {
    $log.info('===============ColorPickerCtrl===============');

    // 以下バグ回避, TODO: fix this?
    $scope.canvasInstance = {
      myInstance : {
        initialize: false
      }
    };

    if (CanvasService.canvasSocket == null){
      // ソケットが作成されていない場合は、キャンバスにリダイレクト
      $log.info('socket is not ready. redirecting...');
      $location.path('/');
      $scope.$apply();
    }
    $http.get('/players').success(function(data, status, headers, config){
      $scope.players = data.players;
    });

    $scope.canvasSocket = CanvasService.canvasSocket;

    $scope.penSize = 8;
    $scope.targetId = 0;
    $scope.pickedColor = "#445566";

    $scope.$watch('pickedColor',  function(newValue, oldValue){
      $log.debug(newValue);
      var color = newValue;
      var size = null;
      $scope.canvasSocket.sendPenUpdate($scope.targetId, color, size);
    });

    $scope.$watch('penSize',  function(newValue, oldValue){
      $log.debug(newValue);
      var color = null;
      var size = newValue;
      $scope.canvasSocket.sendPenUpdate($scope.targetId, color, size);
    });

    $scope.playerClicked = function(id){
      $log.info(id);
      $scope.targetId = id;
    }
  }
);


