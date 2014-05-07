'use strict';

var canvasAppServices = angular.module('canvasAppServices', []);

/* LocalStorageService */
canvasAppServices.service('LocalStorageService',
  function($cacheFactory) {
/////////////
    /* 検索履歴ストレージ */
    this.getSearchConditionHistory = function() {
      var data = localStorage['SearchConditionHistory'];
      if (data !== undefined) {
        return JSON.parse(localStorage['SearchConditionHistory']);
      }
    };
    this.addSearchConditionHistory = function(data) {

      // 新しい検索条件を取得
      var histories = new Array();
      histories.push(data);

      // ローカルヒストリーに保存されている検索履歴を取得
      var befHistory = this.getSearchConditionHistory();
      
    };
  }
);

canvasAppServices.service('ResizeService',
  function() {
    this.width = this.height = 0;
    this.onResizeFunc = new Array();

    this.getWidth  = function(){ return this.width;  };
    this.getHeight = function(){ return this.height; };
    this.setSize = function(width, height){
      this.width  = width;
      this.height = height;
    };
    this.addOnResize = function(f){
      this.onResizeFunc.push(f);
    };
    this.removeOnResize = function(f){
      //this.onResizeFunc.splice(start, count);
    }; // TODO

    this.runOnResizeFunc = function(){
      this.onResizeFunc.forEach(function(element, index, array){
        element();
      });
    }

  }
);


canvasAppServices.service('CanvasService',
  function($log) {

      // $log.info('!!CanvasService:init!!');
    this.canvasIntance = null;
    this.canvasSocket = null;
    return;

  }
);


canvasAppServices.service('PlayerListService',
  function($log, $http, $interval) {
    var _this = this;
    this.autoUpdate = false;
    this.updateInterval = 3000;
    this.players = [];

    this.updatePlayers = function(){
      $http.get('/players').success(function(data, status, headers, config){
        _this.setPlayers(data.players);
        // console.log(data.players);
        console.log($scope);

      });
    }
    this.setPlayers = function(value){
      this.players = value;
    }
    this.getPlayers = function(){
      return this.players;
    }

    $interval(function(){
      if (_this.autoUpdate){
        _this.updatePlayers();
      }
    }, this.updateInterval);

  }
);

