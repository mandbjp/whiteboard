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

    // this.stage = null;
    // this.shape = null;
    // this.circle = null;

    // this.oldX = 0;
    // this.oldY = 0;
    // this.strokes = null;
    // this.canvasElementId = null;

    // this.drawColor = '#000';
    // this.drawSize  = 1;
    // this.mouseClicked = false;
    // this.initialized = false;

    // this.init = function(elementId){
    //   $log.info('===============CanvasService:init===============');

    //   this.mouseClicked = false;
    //   this.canvasElementId = elementId;

    //   var stage = this.stage = new createjs.Stage(this.canvasElementId);

    //   var circle = this.circle = new createjs.Shape();
    //   circle.graphics.beginFill("gray").drawCircle(0, 0, 3);
    //   circle.graphics.beginFill("white").drawCircle(0.25, 0.25, 1);

    //   // function mouseDown(event){
    //   //     this.mouseClicked = true;
    //   //     this.oldX = event.stageX;
    //   //     this.oldY = event.stageY;

    //   //     this.strokes = new Array();
    //   //     this.strokes.push({x:this.oldX, y:this.oldY});
    //   // }
    //   // function mouseUp(event){
    //   //     this.mouseClicked = false;
    //   //     this.drawStroke(this.strokes, this.drawColor, this.drawSize, /* send = */ true);
    //   //     this.strokes = null;
    //   //     stage.update();
    //   // }
    //   // function mouseMove(event){
    //   //     if (this.mouseClicked) {
    //   //         this.drawLine(this.oldX, this.oldY, event.stageX, event.stageY, this.drawColor, this.drawSize);
    //   //         stage.update();
    //   //         this.strokes.push({x:event.stageX, y:event.stageY});

    //   //         if (this.strokes.length > 10){
    //   //             this.drawStroke(this.strokes, this.drawColor, this.drawSize, /* send = */ true);
    //   //             this.strokes = new Array();
    //   //             this.strokes.push({x:event.stageX, y:event.stageY});
    //   //             stage.update();
    //   //         }

    //   //     }

    //   //     circle.x = event.stageX;
    //   //     circle.y = event.stageY;
    //   //     stage.update();

    //   //     this.oldX = event.stageX;
    //   //     this.oldY = event.stageY;
    //   //     // console.log(""+event.stageX+", "+event.stageY);
    //   // }

    //   stage.on("stagemousedown", angular.element('#ngView').scope().canvasMouseDown);
    //   stage.on("stagemouseup",   angular.element('#ngView').scope().canvasMouseUp  );
    //   stage.on("stagemousemove", angular.element('#ngView').scope().canvasMouseMove);

    //   this.initialized = true;
    // }

    // this.onCavasShow = function(){
    //     $log.info('===============CanvasService:onCavasShow===============');
    //       // add touch events
    //     var demoCanvas = document.getElementById(this.canvasElementId);
    //     var offset = $('#'+this.canvasElementId).offset();
    //     demoCanvas.addEventListener('touchmove', function(event) {
    //         event.preventDefault();
    //         var param = {
    //             stageX: event.changedTouches[0].pageX - offset.left,
    //             stageY: event.changedTouches[0].pageY - offset.top,
    //         };
    //         mouseMove(param);
    //     });
    //     demoCanvas.addEventListener('touchstart', function(event) {
    //         event.preventDefault();
    //         var param = {
    //             stageX: event.changedTouches[0].pageX - offset.left,
    //             stageY: event.changedTouches[0].pageY - offset.top,
    //         };
    //         mouseDown(param);
    //     });
    //     demoCanvas.addEventListener('touchend', function(event) {
    //         event.preventDefault();
    //         var param = {
    //             stageX: 0,
    //             stageY: 0,
    //         };
    //         mouseUp(param);
    //     });
    // };

    // this.mouseDown = function(event){
    //     this.mouseClicked = true;
    //     this.oldX = event.stageX;
    //     this.oldY = event.stageY;

    //     this.strokes = new Array();
    //     this.strokes.push({x:this.oldX, y:this.oldY});
    // }
    // this.mouseUp = function(event){
    //     this.mouseClicked = false;
    //     this.drawStroke(this.strokes, this.drawColor, this.drawSize, /* send = */ true);
    //     this.strokes = null;
    //     stage.update();
    // }
    // this.mouseMove = function(event){
    //     if (!this.initialized) { return; }
    //     if (this.mouseClicked) {
    //         this.drawLine(this.oldX, this.oldY, event.stageX, event.stageY, this.drawColor, this.drawSize);
    //         stage.update();
    //         this.strokes.push({x:event.stageX, y:event.stageY});

    //         if (this.strokes.length > 10){
    //             this.drawStroke(this.strokes, this.drawColor, this.drawSize, /* send = */ true);
    //             this.strokes = new Array();
    //             this.strokes.push({x:event.stageX, y:event.stageY});
    //             stage.update();
    //         }

    //     }

    //     this.circle.x = event.stageX;
    //     this.circle.y = event.stageY;
    //     stage.update();

    //     this.oldX = event.stageX;
    //     this.oldY = event.stageY;
    //     // console.log(""+event.stageX+", "+event.stageY);
    // }


    // this.drawLine = function(fromX, fromY, toX, toY, color, size){
    //     // var shape = ...;
    //     shape.graphics.beginStroke(color)
    //         .setStrokeStyle(size, "round")
    //         .moveTo(fromX, fromY)
    //         .lineTo(toX, toY);
    // }
    // /**
    // * @val stroke array
    // **/
    // this.drawStroke = function(strokes, color, size, send) {
    //     if ((strokes == null) || (strokes.length == 0)){
    //         console.log("stroke is empty");
    //         return;
    //     }

    //     var stroke = shape.graphics.beginStroke(color)
    //         .setStrokeStyle(size, "round");

    //     stroke.moveTo(strokes[0]['x'], strokes[0]['y']);
    //     for(var i=1; i<strokes.length; i++){
    //         stroke.lineTo(strokes[i]['x'], strokes[i]['y']);
    //     }
    //     if (send == true){
    //         sendStroke(ws, strokes, color, size);
    //     }
    // }
  }
);

