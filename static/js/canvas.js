
// canvas ----------------------------------------------------------
var CanvasClass = function(){
    this.stage = null;
    this.circle = null;
    this.shape = null;

    this.elementId = null;
    this.oldX = 0;
    this.oldY = 0;
    this.mouseClicked = false;
    this.initialized = false;
    this.myInstance = this;
    this.socketInstance = null;

    this.drawColor = '#000';
    this.drawSize = 1;
    this.strokes = null;

    this.logger = defaultLogger;
    this.$scope = null;

    this.initialize = function(elementId, $scope, $log){
        if (isset($log)){
            this.logger = $log;
        }
        this.$scope = $scope;
        this.logger('===============CanvasClass:init===============');

        this.elementId = elementId;

        var stage = this.stage = new createjs.Stage(elementId);

        var circle = this.circle = new createjs.Shape();
        circle.graphics.beginFill("gray").drawCircle(0, 0, 3);
        circle.graphics.beginFill("white").drawCircle(0.25, 0.25, 1);

        var shape = this.shape = new createjs.Shape();
        stage.addChild(shape);
        stage.addChild(circle);

        this.mouseClicked = false;
        // add handler for stage mouse events:


        stage.on("stagemousedown", this.mouseDown);
        stage.on("stagemouseup",   this.mouseUp  );
        stage.on("stagemousemove", this.mouseMove);

        this.initialized = true;
    }

    this.onCanvasShow = function(){
        this.logger('===============CanvasClass:onCavasShow===============');
        // add touch events
        var demoCanvas = document.getElementById(this.elementId);
        var offset = $('#'+this.elementId).offset();
        demoCanvas.addEventListener('touchmove', function(event) {
            event.preventDefault();
            var param = {
                stageX: event.changedTouches[0].pageX - offset.left,
                stageY: event.changedTouches[0].pageY - offset.top,
            };

            // TODO: thisが使えない！！
            myInstance = angular.element('#ngView').scope().canvasInstance.myInstance;
            if (!myInstance.initialized){ return; }
            myInstance.mouseMove(param);
        });
        demoCanvas.addEventListener('touchstart', function(event) {
            event.preventDefault();
            var param = {
                stageX: event.changedTouches[0].pageX - offset.left,
                stageY: event.changedTouches[0].pageY - offset.top,
            };
            
            // TODO: thisが使えない！！
            myInstance = angular.element('#ngView').scope().canvasInstance.myInstance;
            if (!myInstance.initialized){ return; }
            myInstance.mouseDown(param);
        });
        demoCanvas.addEventListener('touchend', function(event) {
            event.preventDefault();
            var param = {
                stageX: 0,
                stageY: 0,
            };
            // TODO: thisが使えない！！
            myInstance = angular.element('#ngView').scope().canvasInstance.myInstance;
            if (!myInstance.initialized){ return; }
            myInstance.mouseUp(param);
        });
    }


    this.mouseDown = function(event){
        // TODO: thisが使えない！！
        myInstance = angular.element('#ngView').scope().canvasInstance.myInstance;
        if (!myInstance.initialized){ return; }

        myInstance.mouseClicked = true;
        myInstance.oldX = event.stageX;
        myInstance.oldY = event.stageY;

        myInstance.strokes = new Array();
        myInstance.strokes.push({x:this.oldX, y:this.oldY});
    }
    this.mouseUp = function(event){
        // TODO: thisが使えない！！
        myInstance = angular.element('#ngView').scope().canvasInstance.myInstance;
        if (!myInstance.initialized){ return; }

        myInstance.mouseClicked = false;
        myInstance.drawStroke(myInstance.shape, myInstance.strokes, myInstance.drawColor, myInstance.drawSize, /* send = */ true);
        myInstance.strokes = null;
        myInstance.stage.update();
    }
    this.mouseMove = function(event){
        // TODO: thisが使えない！！
        myInstance = angular.element('#ngView').scope().canvasInstance.myInstance;
        if (!myInstance.initialized){ return; }

        myInstance.circle.x = event.stageX;
        myInstance.circle.y = event.stageY;

        if (myInstance.mouseClicked) {
            myInstance.drawLine(myInstance.shape, myInstance.oldX, myInstance.oldY, event.stageX, event.stageY, myInstance.drawColor, myInstance.drawSize);
            myInstance.strokes.push({x:event.stageX, y:event.stageY});

            if (myInstance.strokes.length > 10){
                myInstance.drawStroke(myInstance.shape, myInstance.strokes, myInstance.drawColor, myInstance.drawSize, /* send = */ true);
                myInstance.strokes = new Array();
                myInstance.strokes.push({x:event.stageX, y:event.stageY});
            }

        }

        myInstance.stage.update();

        myInstance.oldX = event.stageX;
        myInstance.oldY = event.stageY;
        // console.log(""+event.stageX+", "+event.stageY);
    }


    this.drawLine   = function(shape, fromX, fromY, toX, toY, color, size){
        // var shape = ...;
        shape.graphics.beginStroke(color)
            .setStrokeStyle(size, "round")
            .moveTo(fromX, fromY)
            .lineTo(toX, toY);
    }

    /**
    * @val stroke array
    **/
    this.drawStroke = function(shape, strokes, color, size, send) {
        if ((strokes == null) || (strokes.length == 0)){
            console.log("stroke is empty");
            return;
        }

        var shapeStroke = shape.graphics.beginStroke(color)
            .setStrokeStyle(size, "round");

        shapeStroke.moveTo(strokes[0]['x'], strokes[0]['y']);
        for(var i=1; i<strokes.length; i++){
            shapeStroke.lineTo(strokes[i]['x'], strokes[i]['y']);
        }
        if (send == true){
            // TODO: thisが使えない！！
            myInstance = angular.element('#ngView').scope().canvasInstance.myInstance;
            if (!myInstance.initialized){ return; }
            myInstance.socketInstance.sendStroke(strokes, color, size);
        }

    }

    this.clearScreen = function(shape, send){
        // TODO: thisが使えない！！
        myInstance = angular.element('#ngView').scope().canvasInstance.myInstance;
        if (!myInstance.initialized){ return; }

        myInstance.stage.removeChild(shape);
        myInstance.stage.removeChild(myInstance.circle);

        //shape 再作成
        myInstance.shape = new createjs.Shape();
        myInstance.stage.addChild(myInstance.shape);
        myInstance.stage.addChild(myInstance.circle);
        myInstance.stage.update();

        if (send == true){
            myInstance.socketInstance.sendClearScreen();
        }
    }
    this.updateStage = function(){
        // TODO: thisが使えない！！
        myInstance = angular.element('#ngView').scope().canvasInstance.myInstance;
        if (!myInstance.initialized){ return; }

        myInstance.stage.update();
    }
    
    this.undoDraw = function(send){
        // TODO: thisが使えない！！
        myInstance = angular.element('#ngView').scope().canvasInstance.myInstance;
        if (!myInstance.initialized){ return; }

        if (send == true){
            myInstance.socketInstance.sendUndoDraw();
        }
    }

}

function isset( data ){
    return ( typeof( data ) != 'undefined' );
}
function defaultLogger(obj){
    console.log(obj);
}

var CanvasSocket = function(){
    this.ws = null;
    this.canvasInstance = null;
    this.myInstance = this;

    this.logger = defaultLogger;
    this.$scope = null;

    this.myInfo = {}; // サーバー上のＩＤ等、自分の情報

    this.initialize = function(canvasInstance, host, $scope, logger){
        this.canvasInstance = canvasInstance;
        canvasInstance.socketInstance = this;

        this.$scope = $scope;
        if (isset(logger)){ this.logger = logger; }

        this.logger('===============CanvasSocket:initialize===============');

        var host = location.host;
        if (host == "") host = "localhost:8888";
        var ws = this.ws = new WebSocket("ws:" + host + "/websocket");
        ws.onopen = this.socketOnOpen;
        ws.onmessage = this.socketOnMessage;
        //ws.onerror = function(){};
        ws.onclose = this.socketOnClose;
    }

    this.socketOnOpen = function(){
        // TODO: thisが使えない！！
        myInstance = angular.element('#ngView').scope().canvasSocket.myInstance;
        myInstance.logger('===============CanvasSocket:socketOnOpen===============');

        var data = {
            command: "MYINFO",
        };
        this.send(JSON.stringify(data) );
        var data = {
            command: "RETRIVE_HISTORY",
        };
        this.send(JSON.stringify(data) );

    }

    this.socketOnMessage = function(event){
        // TODO: thisが使えない！！
        myInstance = angular.element('#ngView').scope().canvasSocket.myInstance;
        // myInstance.logger('===============CanvasSocket:socketOnMessage===============');

        var data = JSON.parse(event.data);
        var command = data.command;
        var canvasInstance = myInstance.canvasInstance;

        switch(command){
            case "DRAW_STROKES":
                canvasInstance.drawStroke(canvasInstance.shape, data.strokes, data.color, data.size);
                canvasInstance.stage.update();
                break;
                
            case "CLEAR_SCREEN":
                canvasInstance.clearScreen(canvasInstance.shape);
                canvasInstance.stage.update();
                break;
                
            case "PONG":
                setTimeout(tickPingpong, animInterval);
                console.log('PONG');
                break;

            case "MYINFO":
                try{
                    // old Canvas用
                    var ngScope = angular.element('#ngPlayerList').scope();
                    ngScope.myInfo = data.info;
                    ngScope.$apply();
                    console.log('this is me : ');
                    console.log(data.info);
                }catch(e){
                    console.log(e);
                }
                myInstance.myInfo = data.info;
                break;

            case "PEN_UPDATE":
                if (myInstance.myInfo.id !== data.targetId){
                    console.log('wrong target : '+data.targetId);
                }
                if (isset(data.color)){
                    console.log('updated color: ' + data.color);
                    canvasInstance.drawColor = data.color;
                }
                if (isset(data.size)){
                    console.log('updated size: ' + data.size);
                    canvasInstance.drawSize = data.size;
                }
                break;

            default:
                console.log('unknown command: ' + command);
                console.log(data);
                break;
        }
    }
    this.socketOnClose = function(){
        // TODO: thisが使えない！！
        myInstance = angular.element('#ngView').scope().canvasSocket.myInstance;
        myInstance.logger('===============CanvasSocket:socketOnClose===============');

    }

    this.sendStroke = function(strokes, color, size){
        var data = {
            command: "DRAW_STROKES",
            strokes: strokes,
            color:   color,
            size:    size,
        };
        this.ws.send(JSON.stringify(data) );
    }
    this.sendClearScreen = function(){
        var data = {
            command: "CLEAR_SCREEN",
        };
        this.ws.send(JSON.stringify(data) );
    }

    this.sendUndoDraw = function(){
        var data = {
            command: "UNDO_DRAW",
        };
        this.ws.send(JSON.stringify(data) );
    }

    this.sendPenUpdate = function(targetId, color, size){
        var data = {
            command : "PEN_UPDATE",
            targetId: targetId,
        };
        if (color !== null){ data['color'] = color; }
        if (size  !== null){ data['size' ] = size;  }
        this.ws.send(JSON.stringify(data) );
    }
}
/*

// WebSocket----------------------------------------------------
var host = location.host;
if (host == "") host = "localhost:8888";
var ws = new WebSocket("ws:" + host + "/websocket");

var animInterval = 250;
var pingInterval = 30 * 1000;
var pingCount = 0;


function sendPing(ws){
    animPingpong()
    var data = {
        command: "PING",
    };
    ws.send(JSON.stringify(data) );
}

function tickPingpong(){
    pingCount = (pingCount + 1);
    if ( (pingCount % (pingInterval / animInterval) ) == 0) {
        sendPing(ws);
    }else{
        setTimeout(tickPingpong, animInterval);
    }
    animPingpong();
}

function animPingpong(){
    var pingpongNo = (pingCount % 4) + 1;
    $(".pingpong").css({display: 'none'});
    $(".pingpong-" + pingpongNo).css({display : 'block'});
}

*/