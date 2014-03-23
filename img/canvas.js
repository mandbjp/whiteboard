
// canvas ----------------------------------------------------------
var stage;
var shape;
var oldX, oldY;
var mouseClicked;
var drawColor = '#000';
var drawSize = 1;

var strokes = null;

function initCanvas() {
    stage = new createjs.Stage("demoCanvas");

    var circle = new createjs.Shape();
    circle.graphics.beginFill("gray").drawCircle(0, 0, 3);
    circle.graphics.beginFill("white").drawCircle(0.25, 0.25, 1);

    shape = new createjs.Shape();
    stage.addChild(shape);
    stage.addChild(circle);

    mouseClicked = false;
    // add handler for stage mouse events:
    function mouseDown(event){
        mouseClicked = true;
        oldX = event.stageX;
        oldY = event.stageY;

        strokes = new Array();
        strokes.push({x:oldX, y:oldY});
    }
    function mouseUp(event){
        mouseClicked = false;
        drawStroke(strokes, drawColor, drawSize, /* send = */ true);
        strokes = null;
        stage.update();
    }
    function mouseMove(event){
        if (mouseClicked) {
            drawLine(oldX, oldY, event.stageX, event.stageY, drawColor, drawSize);
            stage.update();
            strokes.push({x:event.stageX, y:event.stageY});

            if (strokes.length > 10){
                drawStroke(strokes, drawColor, drawSize, /* send = */ true);
                strokes = new Array();
                strokes.push({x:event.stageX, y:event.stageY});
                stage.update();
            }

        }

        circle.x = event.stageX;
        circle.y = event.stageY;
        stage.update();

        oldX = event.stageX;
        oldY = event.stageY;
        // console.log(""+event.stageX+", "+event.stageY);
    }

    stage.on("stagemousedown", mouseDown);
    stage.on("stagemouseup",   mouseUp  );
    stage.on("stagemousemove", mouseMove);

    {
        // add touch events
        var demoCanvas = document.getElementById('demoCanvas');
        var offset = $('#demoCanvas').offset();
        demoCanvas.addEventListener('touchmove', function(event) {
            event.preventDefault();
            var param = {
                stageX: event.changedTouches[0].pageX - offset.left,
                stageY: event.changedTouches[0].pageY - offset.top,
            };
            mouseMove(param);
        });
        demoCanvas.addEventListener('touchstart', function(event) {
            event.preventDefault();
            var param = {
                stageX: event.changedTouches[0].pageX - offset.left,
                stageY: event.changedTouches[0].pageY - offset.top,
            };
            mouseDown(param);
        });
        demoCanvas.addEventListener('touchend', function(event) {
            event.preventDefault();
            var param = {
                stageX: 0,
                stageY: 0,
            };
            mouseUp(param);
        });
    }

}
$(function(){
    initCanvas();
    $(".colorBtn").click(function(){
        drawColor = $(this).css("background-color");

        $(".colorBtn").removeClass("colorBtnActive");
        $(this).addClass("colorBtnActive");
    });
    $(".sizeBtn").click(function(){
        drawSize = $(this).html();

        $(".sizeBtn").removeClass("sizeBtnActive");
        $(this).addClass("sizeBtnActive");
    });
    $(".clearBtn").click(function(){
        clearScreen(/* send = */ true);
    });
    $(".actUndo").click(function(){
        undoDraw(/* send = */ true);
    });
    $("body").bind('selectstart', function() {
        //HTML全体の選択を禁止する
        return false;
    });
    $(window).resize(onResize);

    function onResize(){
        // 画面いっぱいにキャンバスを広げる
        /*
        var offset = $('#demoCanvas').offset();
        $('#demoCanvas').width ( $(window).width() - offset.left*2 );
        $('#demoCanvas').height( $(window).height() - offset.top*2 );
        */
    }
    onResize();
});
function drawLine(fromX, fromY, toX, toY, color, size){
    // var shape = ...;
    shape.graphics.beginStroke(color)
        .setStrokeStyle(size, "round")
        .moveTo(fromX, fromY)
        .lineTo(toX, toY);
}

/**
* @val stroke array
**/
function drawStroke (strokes, color, size, send) {
    if ((strokes == null) || (strokes.length == 0)){
        console.log("stroke is empty");
        return;
    }

    var stroke = shape.graphics.beginStroke(color)
        .setStrokeStyle(size, "round");

    stroke.moveTo(strokes[0]['x'], strokes[0]['y']);
    for(var i=1; i<strokes.length; i++){
        stroke.lineTo(strokes[i]['x'], strokes[i]['y']);
    }
    if (send == true){
        sendStroke(ws, strokes, color, size);
    }

}
function clearScreen (send){
    stage.removeChild(shape);

    //shape 再作成
    shape = new createjs.Shape();
    stage.addChild(shape);
    stage.update();

    if (send == true){
        sendClearScreen(ws);
    }
}
function undoDraw (send){
    if (send == true){
        sendUndoDraw(ws);
    }
}



// WebSocket----------------------------------------------------
var host = location.host;
if (host == "") host = "localhost:8888";
var ws = new WebSocket("ws:" + host + "/websocket");

var animInterval = 250;
var pingInterval = 30 * 100;
var pingCount = 0;

ws.onopen = function(){
    var data = {
        command: "RETRIVE_HISTORY",
    };
    ws.send(JSON.stringify(data) );
    setTimeout(tickPingpong, animInterval);

    var data = {
        command: "MYINFO",
    };
    ws.send(JSON.stringify(data) );

}

ws.onmessage = function(evt){
    var data = JSON.parse(evt.data);
    var command = data.command;

    switch(command){
        case "DRAW_STROKES":
            drawStroke(data.strokes, data.color, data.size);
            stage.update();
            break;
            
        case "CLEAR_SCREEN":
            clearScreen();
            stage.update();
            break;
            
        case "PONG":
            setTimeout(tickPingpong, animInterval);
            console.log('PONG');
            break;

        case "MYINFO":
            var ngScope = angular.element('#ngPlayerList').scope();
            ngScope.myInfo = data.info;
            ngScope.$apply();
            console.log('this is me : ');
            console.log(data.info);
            break;

        default:
            console.log('unknown command: ' + command);
            console.log(data);
            break;
    }
}
ws.onclose = function(){
    //alert('disconnected.');
}

function sendPing(ws){
    animPingpong()
    var data = {
        command: "PING",
    };
    ws.send(JSON.stringify(data) );
}
function sendStroke(ws, strokes, color, size){
    var data = {
        command: "DRAW_STROKES",
        strokes: strokes,
        color:   color,
        size:    size,
    };
    ws.send(JSON.stringify(data) );
}
function sendClearScreen(ws){
    var data = {
        command: "CLEAR_SCREEN",
    };
    ws.send(JSON.stringify(data) );
}

function sendUndoDraw(ws){
    var data = {
        command: "UNDO_DRAW",
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
