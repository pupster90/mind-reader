
















///////////////////////////////////
////    Create Race Track     ////
/////////////////////////////////




// Setup Variables

var gameLen = NUM_TRIALS_TO_WIN

var canvasWidth = 1000
var canvasHeight = canvasWidth/2
var centerX = canvasWidth/2
var centerY = canvasHeight/2
var circOffset = centerX/2

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var radBig = centerY/1.1
var radRed = centerY/1.2
var radBlue = centerY/1.42
var radSmall = centerY/1.6
var radRacer = centerY/18


export function drawTrack(){

        ctx.fillStyle = "black";
        ctx.strokeStyle="black";

        // Draw Track
        ctx.beginPath();
        ctx.lineWidth=2;
        ctx.arc(centerX+circOffset,centerY,radBig,-Math.PI/2,-Math.PI*1.5);
        ctx.arc(centerX-circOffset,centerY,radBig,Math.PI/2,Math.PI*1.5);
        ctx.arc(centerX+circOffset,centerY,radBig,-Math.PI/2,-Math.PI*1.5);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth=2;
        ctx.arc(centerX+circOffset,centerY,radSmall,-Math.PI/2,-Math.PI*1.5);
        ctx.arc(centerX-circOffset,centerY,radSmall,Math.PI/2,Math.PI*1.5);
        ctx.arc(centerX+circOffset,centerY,radSmall,-Math.PI/2,-Math.PI*1.5);
        ctx.stroke();


        offset1= centerY/10
        ctx.lineWidth=1;
        ctx.textAlign = "center";
        ctx.font = "69px Helvetica Neue";
        ctx.fillStyle = "rgb(50,50,50)";
        ctx.fillText("Score",centerX,centerY-centerY/4+offset1);


        ctx.beginPath();
        ctx.moveTo(centerX-centerX/5,centerY-centerY/4+centerY/40+offset1);
        ctx.lineTo(centerX+centerX/5,centerY-centerY/4+centerY/40+offset1);
        ctx.stroke();



        ctx.beginPath();
        ctx.strokeStyle="#00FF00";
        ctx.lineWidth= 1;
        ctx.moveTo(centerX-circOffset,centerY-radBig);
        ctx.lineTo(centerX-circOffset,centerY-radSmall);
        ctx.stroke();

        ctx.textAlign = "right";
        ctx.font = "40px Helvetica Neue";
        ctx.fillStyle = "red";
        youSpotX= centerX+centerX/20+30
        youSpotY= centerY+centerY/20-centerY/12+offset1
        ctx.fillText("You:     ",youSpotX,youSpotY);
        ctx.textAlign = "center"
        ctx.fillText("0",youSpotX,youSpotY);
        compSpotX= centerX+centerX/20+30
        compSpotY=centerY+centerY/20+centerY/12+offset1
        ctx.fillStyle = "blue";
        ctx.textAlign = "right";
        ctx.fillText("Bot:     ",compSpotX,compSpotY);
        ctx.textAlign = "center"
        ctx.fillText("0",compSpotX,compSpotY);



    // Draw Racers
        ctx.beginPath();
        ctx.arc(centerX-circOffset,centerY-radRed,radRacer, 0,Math.PI*2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.lineWidth = 0.01;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX-circOffset,centerY-radBlue,radRacer, 0,Math.PI*2);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.lineWidth = 0.01;
        ctx.stroke();


    // Timer Lines
    ctx.beginPath();
    ctx.lineWidth=2;
    ctx.strokeStyle="black";
    ctx.moveTo(centerX+156,centerY+centerY/3-10);
    ctx.lineTo(centerX+185,centerY+centerY/3-10);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX+156,centerY+centerY/3-175);
    ctx.lineTo(centerX+185,centerY+centerY/3-175);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX+150,centerY+centerY/3-180);
    ctx.lineTo(centerX+191,centerY+centerY/3-180);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX+150,centerY+centerY/3-5);
    ctx.lineTo(centerX+191,centerY+centerY/3-5);
    ctx.stroke();


    // Timer lines 2
    ctx.beginPath();
    ctx.moveTo(centerX-156,centerY+centerY/3-10);
    ctx.lineTo(centerX-185,centerY+centerY/3-10);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX-156,centerY+centerY/3-175);
    ctx.lineTo(centerX-185,centerY+centerY/3-175);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX-150,centerY+centerY/3-180);
    ctx.lineTo(centerX-191,centerY+centerY/3-180);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX-150,centerY+centerY/3-5);
    ctx.lineTo(centerX-191,centerY+centerY/3-5);
    ctx.stroke();

}


drawTrack()











  /////////////////////////////////
 ///      Create Racers       ////
/////////////////////////////////



    // Create racer lines
    var circumTrack = 2* Math.PI*radBig + 2* 2*circOffset
    var dragRatio = 2*circOffset / circumTrack
    var turnRatio = Math.PI*radBig / circumTrack
    var numDragSteps = Math.floor(gameLen *dragRatio)
    var numTurnSteps = Math.ceil(gameLen *turnRatio)

    var blueTopDragY = []
    var redTopDragY = []
    var blueBottomDragY = []
    var redBottomDragY = []
    for( i=0; i<numDragSteps; i++){
        blueTopDragY.push(centerY-radBlue)
        redTopDragY.push(centerY-radRed)
        blueBottomDragY.push(centerY+radBlue)
        redBottomDragY.push( centerY + radRed)
    }

    var dragStep =  2*circOffset /numDragSteps
    var blueTopDragX = []
    var redTopDragX = []
    var blueBottomDragX = []
    var redBottomDragX = []
    var dragStart = centerX- circOffset
    for( i=0; i<numDragSteps; i++){
        blueTopDragX.push(dragStart)
        redTopDragX.push(dragStart)
        redBottomDragX.unshift(dragStart + dragStep)
        blueBottomDragX.unshift(dragStart + dragStep)
        dragStart += dragStep
    }


    var turnStep = 2*Math.PI / (numTurnSteps*2)
    var redTurnX= []
    var redTurnY= []
    var blueTurnX = []
    var blueTurnY = []
    var turnStart = 0
    for( i=0; i<numTurnSteps*2; i++){
        redTurnX.push( centerX + radRed * Math.cos(turnStart-Math.PI/2) )
        redTurnY.push( centerY + radRed * Math.sin(turnStart-Math.PI/2) )
        blueTurnX.push( centerX + radBlue * Math.cos(turnStart-Math.PI/2) )
        blueTurnY.push( centerY + radBlue * Math.sin(turnStart-Math.PI/2) )
        turnStart += turnStep
    }
    redRightTurnX = redTurnX.splice(0,numTurnSteps)
    redLeftTurnX = redTurnX
    redRightTurnY = redTurnY.splice(0,numTurnSteps)
    redLeftTurnY = redTurnY
    blueRightTurnX = blueTurnX.splice(0,numTurnSteps)
    blueLeftTurnX = blueTurnX
    blueRightTurnY = blueTurnY.splice(0,numTurnSteps)
    blueLeftTurnY = blueTurnY
    for(i=0; i<numTurnSteps;i++ ){
        redLeftTurnX[i] -= circOffset
        redRightTurnX[i] += circOffset
        blueLeftTurnX[i] -= circOffset
        blueRightTurnX[i] += circOffset
    }

    var blueX = blueTopDragX.concat(blueRightTurnX,blueBottomDragX,blueLeftTurnX)
    var blueY = blueTopDragY.concat(blueRightTurnY,blueBottomDragY,blueLeftTurnY)
    var blueCount = 0

    redX = redTopDragX.concat(redRightTurnX,redBottomDragX,redLeftTurnX)
    redY = redTopDragY.concat(redRightTurnY,redBottomDragY,redLeftTurnY)
    var redCount = 0












  /////////////////////////////////
 ///       Move Cars          ////
/////////////////////////////////



    function moveBlueCar() {
var _0xbb59=["\x6D\x79\x43\x61\x6E\x76\x61\x73","\x67\x65\x74\x45\x6C\x65\x6D\x65\x6E\x74\x42\x79\x49\x64","\x32\x64","\x67\x65\x74\x43\x6F\x6E\x74\x65\x78\x74","\x62\x65\x67\x69\x6E\x50\x61\x74\x68","\x50\x49","\x61\x72\x63","\x66\x69\x6C\x6C\x53\x74\x79\x6C\x65","\x77\x68\x69\x74\x65","\x66\x69\x6C\x6C","\x73\x74\x72\x6F\x6B\x65\x53\x74\x79\x6C\x65","\x23\x30\x30\x46\x46\x30\x30","\x6C\x69\x6E\x65\x57\x69\x64\x74\x68","\x6D\x6F\x76\x65\x54\x6F","\x6C\x69\x6E\x65\x54\x6F","\x73\x74\x72\x6F\x6B\x65","\x72\x65\x64","\x62\x6C\x75\x65","\x72\x65\x63\x74","\x74\x65\x78\x74\x41\x6C\x69\x67\x6E","\x63\x65\x6E\x74\x65\x72","\x66\x6F\x6E\x74","\x34\x30\x70\x78\x20\x48\x65\x6C\x76\x65\x74\x69\x63\x61\x20\x4E\x65\x75\x65","\x66\x69\x6C\x6C\x54\x65\x78\x74"];var c=document[_0xbb59[1]](_0xbb59[0]);var ctx=c[_0xbb59[3]](_0xbb59[2]);ctx[_0xbb59[4]]();ctx[_0xbb59[6]](blueX[blueCount],blueY[blueCount],radRacer+1,0,Math[_0xbb59[5]]*2);ctx[_0xbb59[7]]=_0xbb59[8];ctx[_0xbb59[9]]();if(blueCount==0){ctx[_0xbb59[4]]();ctx[_0xbb59[10]]=_0xbb59[11];ctx[_0xbb59[12]]=1;ctx[_0xbb59[13]](centerX-circOffset,centerY-radBig);ctx[_0xbb59[14]](centerX-circOffset,centerY-radSmall);ctx[_0xbb59[15]]();if(redCount==0){ctx[_0xbb59[4]]();ctx[_0xbb59[6]](redX[redCount],redY[redCount],radRacer,0,Math[_0xbb59[5]]*2);ctx[_0xbb59[7]]=_0xbb59[16];ctx[_0xbb59[9]]();};};blueCount+=1;ctx[_0xbb59[4]]();ctx[_0xbb59[6]](blueX[blueCount],blueY[blueCount],radRacer,0,Math[_0xbb59[5]]*2);ctx[_0xbb59[7]]=_0xbb59[17];ctx[_0xbb59[9]]();ctx[_0xbb59[12]]=0.01;ctx[_0xbb59[15]]();ctx[_0xbb59[4]]();ctx[_0xbb59[18]](compSpotX-centerX/10,compSpotY-centerY/7,2*centerX/11,2*centerY/10);ctx[_0xbb59[7]]=_0xbb59[8];ctx[_0xbb59[9]]();ctx[_0xbb59[19]]=_0xbb59[20];ctx[_0xbb59[21]]=_0xbb59[22];ctx[_0xbb59[7]]=_0xbb59[17];ctx[_0xbb59[23]](blueCount,compSpotX,compSpotY);
    }



    function moveRedCar() {
var _0xd2ea=["\x6D\x79\x43\x61\x6E\x76\x61\x73","\x67\x65\x74\x45\x6C\x65\x6D\x65\x6E\x74\x42\x79\x49\x64","\x32\x64","\x67\x65\x74\x43\x6F\x6E\x74\x65\x78\x74","\x62\x65\x67\x69\x6E\x50\x61\x74\x68","\x50\x49","\x61\x72\x63","\x66\x69\x6C\x6C\x53\x74\x79\x6C\x65","\x77\x68\x69\x74\x65","\x66\x69\x6C\x6C","\x73\x74\x72\x6F\x6B\x65\x53\x74\x79\x6C\x65","\x23\x30\x30\x46\x46\x30\x30","\x6C\x69\x6E\x65\x57\x69\x64\x74\x68","\x6D\x6F\x76\x65\x54\x6F","\x6C\x69\x6E\x65\x54\x6F","\x73\x74\x72\x6F\x6B\x65","\x62\x6C\x75\x65","\x72\x65\x64","\x72\x65\x63\x74","\x74\x65\x78\x74\x41\x6C\x69\x67\x6E","\x63\x65\x6E\x74\x65\x72","\x66\x6F\x6E\x74","\x34\x30\x70\x78\x20\x48\x65\x6C\x76\x65\x74\x69\x63\x61\x20\x4E\x65\x75\x65","\x66\x69\x6C\x6C\x54\x65\x78\x74"];var c=document[_0xd2ea[1]](_0xd2ea[0]);var ctx=c[_0xd2ea[3]](_0xd2ea[2]);ctx[_0xd2ea[4]]();ctx[_0xd2ea[6]](redX[redCount],redY[redCount],radRacer+1,0,Math[_0xd2ea[5]]*2);ctx[_0xd2ea[7]]=_0xd2ea[8];ctx[_0xd2ea[9]]();if(redCount==0){ctx[_0xd2ea[4]]();ctx[_0xd2ea[10]]=_0xd2ea[11];ctx[_0xd2ea[12]]=1;ctx[_0xd2ea[13]](centerX-circOffset,centerY-radBig);ctx[_0xd2ea[14]](centerX-circOffset,centerY-radSmall);ctx[_0xd2ea[15]]();if(blueCount==0){ctx[_0xd2ea[4]]();ctx[_0xd2ea[6]](blueX[blueCount],blueY[blueCount],radRacer,0,Math[_0xd2ea[5]]*2);ctx[_0xd2ea[7]]=_0xd2ea[16];ctx[_0xd2ea[9]]();};};redCount+=1;ctx[_0xd2ea[4]]();ctx[_0xd2ea[6]](redX[redCount],redY[redCount],radRacer,0,Math[_0xd2ea[5]]*2);ctx[_0xd2ea[7]]=_0xd2ea[17];ctx[_0xd2ea[9]]();ctx[_0xd2ea[12]]=0.01;ctx[_0xd2ea[15]]();ctx[_0xd2ea[4]]();ctx[_0xd2ea[18]](youSpotX-centerX/10,youSpotY-centerY/7,2*centerX/11,2*centerY/13);ctx[_0xd2ea[7]]=_0xd2ea[8];ctx[_0xd2ea[9]]();ctx[_0xd2ea[19]]=_0xd2ea[20];ctx[_0xd2ea[21]]=_0xd2ea[22];ctx[_0xd2ea[7]]=_0xd2ea[17];ctx[_0xd2ea[23]](redCount,youSpotX,youSpotY);
    }












  /////////////////////////////////
 ///        Map Keys          ////
/////////////////////////////////

$("#button1").mouseup(function(){ $(this).blur();     })
$("#button0").mouseup(function(){  $(this).blur();    })
$("#cheatButton").mouseup(function(){ $(this).blur(); })
window.addEventListener("keydown", function(e) {
if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {   // space and arrow keys
    e.preventDefault();  }  }, false);









  //////////////////////////////////
 ///        Game Over          ////
//////////////////////////////////


var _0xa122=["\x69\x6E\x73\x69\x64\x65\x20\x70\x6F\x73\x74\x3A\x20\x31","\x6C\x6F\x67","\x76\x61\x6C\x75\x65","\x67\x61\x6D\x65\x49\x44","\x67\x65\x74\x45\x6C\x65\x6D\x65\x6E\x74\x42\x79\x49\x64","\x67\x61\x6D\x65\x49\x44\x5F\x6F\x6C\x64","\x74\x69\x6D\x65\x73\x5F\x6E\x65\x77","\x74\x69\x6D\x65\x73","\x6C\x65\x6E\x67\x74\x68","\x70\x75\x73\x68","\x67\x65\x74\x54\x69\x6D\x65","\x20","\x67\x61\x6D\x65\x52\x65\x73\x75\x6C\x74","\x54\x69\x6D\x65\x4F\x75\x74","\x62\x65\x67\x69\x6E\x50\x61\x74\x68","\x50\x49","\x61\x72\x63","\x6C\x69\x6E\x65\x57\x69\x64\x74\x68","\x66\x69\x6C\x6C\x53\x74\x79\x6C\x65","\x72\x65\x64","\x66\x69\x6C\x6C","\x43\x68\x65\x61\x74\x65\x72","\x57\x69\x6E\x6E\x65\x72","\x62\x6C\x75\x65","\x4C\x6F\x73\x65\x72","\x69\x6E\x73\x69\x64\x65\x20\x70\x6F\x73\x74\x3A\x20\x20\x32","\x79\x6F\x75\x48\x69\x73\x74\x6F\x72\x79","\x63\x6F\x6D\x70\x48\x69\x73\x74\x6F\x72\x79","\x62\x6C\x75\x65\x53\x63\x6F\x72\x65\x46\x69\x6E\x61\x6C","\x73\x75\x62\x6D\x69\x74","\x6D\x79\x46\x6F\x72\x6D"];function post(params){console[_0xa122[1]](_0xa122[0]);htmlCreator2();document[_0xa122[4]](_0xa122[3])[_0xa122[2]]= document[_0xa122[4]](_0xa122[5])[_0xa122[2]];document[_0xa122[4]](_0xa122[6])[_0xa122[2]]= document[_0xa122[4]](_0xa122[7])[_0xa122[2]];if(youPastMoves[_0xa122[8]]== 0){youPastMoves[_0xa122[9]](3);compPastMoves[_0xa122[9]](3);var date= new Date();var currentTime=date[_0xa122[10]]();document[_0xa122[4]](_0xa122[6])[_0xa122[2]]+= _0xa122[11]+ currentTime};if(bar<= 1){document[_0xa122[4]](_0xa122[12])[_0xa122[2]]= _0xa122[13]}else {if(redCount>= gameLen){ctx[_0xa122[14]]();ctx[_0xa122[16]](redX[0],redY[0],radRacer,0,Math[_0xa122[15]]* 2);ctx[_0xa122[17]]= 0.01;ctx[_0xa122[18]]= _0xa122[19];ctx[_0xa122[20]]();if(didCheat=== 1){document[_0xa122[4]](_0xa122[12])[_0xa122[2]]= _0xa122[21]}else {document[_0xa122[4]](_0xa122[12])[_0xa122[2]]= _0xa122[22]}}else {ctx[_0xa122[14]]();ctx[_0xa122[16]](blueX[0],blueY[0],radRacer,0,Math[_0xa122[15]]* 2);ctx[_0xa122[17]]= 0.01;ctx[_0xa122[18]]= _0xa122[23];ctx[_0xa122[20]]();if(didCheat=== 1){document[_0xa122[4]](_0xa122[12])[_0xa122[2]]= _0xa122[21]}else {document[_0xa122[4]](_0xa122[12])[_0xa122[2]]= _0xa122[24]}}};console[_0xa122[1]](_0xa122[25]);document[_0xa122[4]](_0xa122[26])[_0xa122[2]]= youPastMoves;document[_0xa122[4]](_0xa122[27])[_0xa122[2]]= compPastMoves;document[_0xa122[4]](_0xa122[28])[_0xa122[2]]= blueCount;document[_0xa122[4]](_0xa122[30])[_0xa122[29]]()}













  //////////////////////////////////////
 ///        Button Clicks          ////
//////////////////////////////////////

var _0x4d27=[];var youPastMoves=[];var compPastMoves=[];var pastWins=[];var x59c2=random_bit(get_experts_pred());var q72l4=random_bit(get_experts_pred());var u47o9=random_bit(get_experts_pred());var n49b3=random_bit(get_experts_pred());var i86r1=random_bit(get_experts_pred());var k39h4=random_bit(get_experts_pred());var m58f2=random_bit(get_experts_pred());var w44p7=random_bit(get_experts_pred());var o06d8=random_bit(get_experts_pred());var didCheat=0;




function numberClicked(num){


    if( redCount >= gameLen  || blueCount >= gameLen || timeOut ){
        return
    }

    var date = new Date();
    var currentTime = date.getTime();
    document.getElementById('times').value += ' '+currentTime


    youPastMoves.push(num)

    document.getElementById('redHistory').innerHTML += ' '+num
    document.getElementById('redHistoryM').innerHTML += ' '+num
    compPastMoves.push(x59c2)
    if(x59c2 === num){
        moveBlueCar()
        pastWins.push("blue")
        document.getElementById('blueHistory').innerHTML += ' '+num
        document.getElementById('blueHistoryM').innerHTML += ' '+num
    }else{
        moveRedCar()
        pastWins.push("red")
        document.getElementById('blueHistory').innerHTML += ' '+Math.abs(num-1)
        document.getElementById('blueHistoryM').innerHTML += ' '+Math.abs(num-1)
    }
    document.getElementById('compGuess').innerHTML = 'Bot Will Guess:'
    document.getElementById('compGuessM').innerHTML = 'Bot Will Guess: '
    if( redCount >= gameLen  || blueCount >= gameLen ){
        post()
    }
    q72l4 = compguess(q72l4,num);
    x59c2 = compGuess(x59c2,num);
    u47o9 = compguess(u47o9,num);
    n49b3 = compguess(n49b3,num);
    i86r1 = compguess(i86r1,num);
    k39h4 = compguess(k39h4,num);
    m58f2 = compguess(m58f2,num);
    w44p7 = compguess(w44p7,num);
    o06d8 = compguess(o06d8,num);

    if(bar<31){bar+=1}
}






function cheatClicked(){
     k39h4 =q72l4
     m58f2 =k39h4
     w44p7 = o06d8
    if(x59c2==1){
        document.getElementById('compGuess').innerHTML = 'Bot Will Guess:    '+ '<span class="glyphicon glyphicon-triangle-right" style="font-size: 19px;"></span>'
        document.getElementById('compGuessM').innerHTML = 'Bot Will Guess:    '+'<span class="glyphicon glyphicon-triangle-right" style="font-size: 17px;"></span>'

    }else{
        document.getElementById('compGuess').innerHTML = 'Bot Will Guess:    '+ '<span class="glyphicon glyphicon-triangle-left" style="font-size: 19px;"></span>'
        document.getElementById('compGuessM').innerHTML = 'Bot Will Guess:    '+'<span class="glyphicon glyphicon-triangle-left" style="font-size: 17px;"></span>'
    }

    didCheat = 1
    //document.getElementById('compGuess').innerHTML = 'Computer Will Guess: '+x59c2
    //document.getElementById('compGuessM').innerHTML = 'Comp Will Guess:  '+x59c2
    document.getElementById("cheatMessage").style.visibility = "visible";
    document.getElementById("cheatMessageM").style.visibility = "visible";
     q72l4 = u47o9
     n49b3 = x59c2
     k39h4  = i86r1

}





window.confirm = function(message1, message2, title, yes_label, callback) {
    $("#bootstrap-confirm-box-modal").data('confirm-yes', false);
    if($("#bootstrap-confirm-box-modal").length == 0) {
        $("body").append('<div id="bootstrap-confirm-box-modal" class="modal fade">\
            <div class="modal-dialog">\
                <div class="modal-content">\
                    <div class="modal-header" style="min-height:40px;">\
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
                        <h4 class="modal-title"></h4>\
                    </div>\
                    <div class="modal-body">\
                        <p class="p1"></p>  \
                        <p class="p2" style="font-size: 85%;color: #595d5d"></p>  \
                    </div>\
                    <div class="modal-footer">\
                        <a href="#" data-dismiss="modal" class="btn btn-default">Back</a>\
                        <a href="#" class="btn btn-primary">' + (yes_label || 'OK') + '</a>\
                    </div>\
                </div>\
            </div>\
        </div>');
        $("#bootstrap-confirm-box-modal .modal-footer .btn-primary").on('click', function () {
            $("#bootstrap-confirm-box-modal").data('confirm-yes', true);
            $("#bootstrap-confirm-box-modal").modal('hide');
            return false;
        });
        $("#bootstrap-confirm-box-modal").on('hide.bs.modal', function () {
            if(callback) callback($("#bootstrap-confirm-box-modal").data('confirm-yes'));
        });
    }
    $("#bootstrap-confirm-box-modal .modal-header h4").text(title || "");
    $("#bootstrap-confirm-box-modal .modal-body .p1").text(message1 || "");
    $("#bootstrap-confirm-box-modal .modal-body .p2").text(message2 || "");
    $("#bootstrap-confirm-box-modal").modal('show');
};

window.alert = function(message1, message2, title) {
    if($("#bootstrap-alert-box-modal").length == 0) {
        $("body").append('<div id="bootstrap-alert-box-modal" class="modal fade">\
            <div class="modal-dialog">\
                <div class="modal-content">\
                    <div class="modal-header" style="min-height:40px;">\
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
                        <h4 class="modal-title"></h4>\
                    </div>\
                    <div class="modal-body">\
                        <p class="p1"></p>  \
                        <p class="p2" style="font-size: 85%;color: #595d5d"></p>  \
                    </div>\
                    <div class="modal-footer">\
                        <a href="#" data-dismiss="modal" class="btn btn-default">Close</a>\
                    </div>\
                </div>\
            </div>\
        </div>');
    }
    $("#bootstrap-alert-box-modal .modal-header h4").text(title || "");
    $("#bootstrap-alert-box-modal .modal-body .p1").text(message1 || "");
    $("#bootstrap-alert-box-modal .modal-body .p2").text(message2 || "");
    $("#bootstrap-alert-box-modal").modal('show');
};




var _0xcde2=["\x3C\x66\x6F\x72\x6D\x20\x69\x64\x3D\x22\x73\x74\x61\x72\x74\x46\x6F\x72\x6D\x22\x20\x20\x72\x6F\x6C\x65\x3D\x22\x66\x6F\x72\x6D\x22\x20\x6D\x65\x74\x68\x6F\x64\x3D\x22\x70\x6F\x73\x74\x22\x3E\x20\x0D\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x3C\x69\x6E\x70\x75\x74\x20\x20\x74\x79\x70\x65\x3D\x22\x68\x69\x64\x64\x65\x6E\x22\x20\x6E\x61\x6D\x65\x3D\x22\x75\x73\x65\x72\x49\x44\x22\x20\x76\x61\x6C\x75\x65\x3D\x22\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x66\x6F\x72\x6D\x2D\x63\x6F\x6E\x74\x72\x6F\x6C\x22\x20\x69\x64\x3D\x22\x75\x73\x65\x72\x49\x44\x22\x3E\x20\x0D\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x3C\x69\x6E\x70\x75\x74\x20\x20\x74\x79\x70\x65\x3D\x22\x68\x69\x64\x64\x65\x6E\x22\x20\x6E\x61\x6D\x65\x3D\x22\x75\x73\x65\x72\x6E\x61\x6D\x65\x22\x20\x76\x61\x6C\x75\x65\x3D\x22\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x66\x6F\x72\x6D\x2D\x63\x6F\x6E\x74\x72\x6F\x6C\x22\x20\x69\x64\x3D\x22\x75\x73\x65\x72\x6E\x61\x6D\x65\x22\x3E\x20\x0D\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x3C\x69\x6E\x70\x75\x74\x20\x20\x74\x79\x70\x65\x3D\x22\x68\x69\x64\x64\x65\x6E\x22\x20\x6E\x61\x6D\x65\x3D\x22\x67\x61\x6D\x65\x52\x65\x73\x75\x6C\x74\x22\x20\x76\x61\x6C\x75\x65\x3D\x22\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x66\x6F\x72\x6D\x2D\x63\x6F\x6E\x74\x72\x6F\x6C\x22\x20\x69\x64\x3D\x22\x67\x61\x6D\x65\x52\x65\x73\x75\x6C\x74\x22\x3E\x20\x0D\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x3C\x69\x6E\x70\x75\x74\x20\x20\x74\x79\x70\x65\x3D\x22\x68\x69\x64\x64\x65\x6E\x22\x20\x6E\x61\x6D\x65\x3D\x22\x70\x69\x63\x74\x75\x72\x65\x22\x20\x76\x61\x6C\x75\x65\x3D\x22\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x66\x6F\x72\x6D\x2D\x63\x6F\x6E\x74\x72\x6F\x6C\x22\x20\x69\x64\x3D\x22\x70\x69\x63\x74\x75\x72\x65\x22\x3E\x20\x0D\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x3C\x69\x6E\x70\x75\x74\x20\x20\x74\x79\x70\x65\x3D\x22\x68\x69\x64\x64\x65\x6E\x22\x20\x6E\x61\x6D\x65\x3D\x22\x68\x6F\x6D\x65\x55\x72\x6C\x22\x20\x76\x61\x6C\x75\x65\x3D\x22\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x66\x6F\x72\x6D\x2D\x63\x6F\x6E\x74\x72\x6F\x6C\x22\x20\x69\x64\x3D\x22\x68\x6F\x6D\x65\x55\x72\x6C\x22\x3E\x20\x0D\x20\x20\x20\x20\x20\x20\x20\x20\x3C\x2F\x66\x6F\x72\x6D\x3E","\x61\x70\x70\x65\x6E\x64","\x62\x6F\x64\x79"];htmlCreator= function(){$(_0xcde2[2])[_0xcde2[1]](_0xcde2[0])}

var _0x578b=["\x3C\x66\x6F\x72\x6D\x20\x69\x64\x3D\x22\x6D\x79\x46\x6F\x72\x6D\x22\x20\x20\x72\x6F\x6C\x65\x3D\x22\x66\x6F\x72\x6D\x22\x20\x6D\x65\x74\x68\x6F\x64\x3D\x22\x70\x6F\x73\x74\x22\x3E\x20\x0D\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x3C\x69\x6E\x70\x75\x74\x20\x74\x79\x70\x65\x3D\x22\x68\x69\x64\x64\x65\x6E\x22\x20\x20\x6E\x61\x6D\x65\x3D\x22\x67\x61\x6D\x65\x49\x44\x22\x20\x69\x64\x3D\x22\x67\x61\x6D\x65\x49\x44\x22\x20\x76\x61\x6C\x75\x65\x3D\x22\x7B\x7B\x67\x61\x6D\x65\x49\x44\x7D\x7D\x22\x3E\x20\x0D\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x3C\x69\x6E\x70\x75\x74\x20\x20\x74\x79\x70\x65\x3D\x22\x68\x69\x64\x64\x65\x6E\x22\x20\x6E\x61\x6D\x65\x3D\x22\x62\x6C\x75\x65\x53\x63\x6F\x72\x65\x46\x69\x6E\x61\x6C\x22\x20\x76\x61\x6C\x75\x65\x3D\x22\x31\x32\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x66\x6F\x72\x6D\x2D\x63\x6F\x6E\x74\x72\x6F\x6C\x22\x20\x69\x64\x3D\x22\x62\x6C\x75\x65\x53\x63\x6F\x72\x65\x46\x69\x6E\x61\x6C\x22\x3E\x20\x0D\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x3C\x69\x6E\x70\x75\x74\x20\x20\x74\x79\x70\x65\x3D\x22\x68\x69\x64\x64\x65\x6E\x22\x20\x6E\x61\x6D\x65\x3D\x22\x67\x61\x6D\x65\x52\x65\x73\x75\x6C\x74\x22\x20\x76\x61\x6C\x75\x65\x3D\x22\x45\x72\x72\x6F\x72\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x66\x6F\x72\x6D\x2D\x63\x6F\x6E\x74\x72\x6F\x6C\x22\x20\x69\x64\x3D\x22\x67\x61\x6D\x65\x52\x65\x73\x75\x6C\x74\x22\x3E\x20\x0D\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x3C\x69\x6E\x70\x75\x74\x20\x20\x74\x79\x70\x65\x3D\x22\x68\x69\x64\x64\x65\x6E\x22\x20\x6E\x61\x6D\x65\x3D\x22\x74\x69\x6D\x65\x73\x5F\x6E\x65\x77\x22\x20\x76\x61\x6C\x75\x65\x3D\x22\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x66\x6F\x72\x6D\x2D\x63\x6F\x6E\x74\x72\x6F\x6C\x22\x20\x69\x64\x3D\x22\x74\x69\x6D\x65\x73\x5F\x6E\x65\x77\x22\x3E\x20\x0D\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x3C\x69\x6E\x70\x75\x74\x20\x20\x74\x79\x70\x65\x3D\x22\x68\x69\x64\x64\x65\x6E\x22\x20\x6E\x61\x6D\x65\x3D\x22\x79\x6F\x75\x48\x69\x73\x74\x6F\x72\x79\x22\x20\x76\x61\x6C\x75\x65\x3D\x22\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x66\x6F\x72\x6D\x2D\x63\x6F\x6E\x74\x72\x6F\x6C\x22\x20\x69\x64\x3D\x22\x79\x6F\x75\x48\x69\x73\x74\x6F\x72\x79\x22\x3E\x20\x0D\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x3C\x69\x6E\x70\x75\x74\x20\x20\x74\x79\x70\x65\x3D\x22\x68\x69\x64\x64\x65\x6E\x22\x20\x6E\x61\x6D\x65\x3D\x22\x63\x6F\x6D\x70\x48\x69\x73\x74\x6F\x72\x79\x22\x20\x76\x61\x6C\x75\x65\x3D\x22\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x66\x6F\x72\x6D\x2D\x63\x6F\x6E\x74\x72\x6F\x6C\x22\x20\x69\x64\x3D\x22\x63\x6F\x6D\x70\x48\x69\x73\x74\x6F\x72\x79\x22\x3E\x20\x0D\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x3C\x69\x6E\x70\x75\x74\x20\x20\x74\x79\x70\x65\x3D\x22\x68\x69\x64\x64\x65\x6E\x22\x20\x6E\x61\x6D\x65\x3D\x22\x73\x65\x65\x64\x22\x20\x76\x61\x6C\x75\x65\x3D\x22\x22\x20\x63\x6C\x61\x73\x73\x3D\x22\x66\x6F\x72\x6D\x2D\x63\x6F\x6E\x74\x72\x6F\x6C\x22\x20\x69\x64\x3D\x22\x73\x65\x65\x64\x22\x3E\x20\x0D\x20\x20\x20\x20\x20\x20\x20\x20\x3C\x2F\x66\x6F\x72\x6D\x3E","\x61\x70\x70\x65\x6E\x64","\x62\x6F\x64\x79"];htmlCreator2= function(){$(_0x578b[2])[_0x578b[1]](_0x578b[0])}

function startClicked(){
    FB.api('/me?fields=id,name,link,picture,friends,friendlists', function(response) {
      if( response && !response.error && response.name != undefined ){
          htmlCreator()
          //console.log("below is the response class for user")  // console.log(response)
          document.getElementById('username').value =  response.name
          document.getElementById('userID').value = response.id
          document.getElementById('picture').value = response.picture.data.url
          document.getElementById('homeUrl').value =  response.link
          document.getElementById("gameResult").value = "Game";
          //document.getElementById("startForm").submit();

      }else{
          message1 ="To have your game saved, you must login to Facebook."
          message2 ="Your info is kept confidential. We do NOT use it for marketing"
          modalTitle ="Please Login:"
          yes_label = "Continue"
          window.confirm(message1,message2,modalTitle,yes_label, function(shouldContinue){
              if( shouldContinue ){
                  // CHANGED FOR DEBUGGING ONLY  //
                  htmlCreator()
                  testUser = "the new guy"
                  document.getElementById('picture').value = "https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/13331103_10153683113203424_9058122044297857694_n.jpg?oh=9d21671021592f2302f1b18e8263d0fa&oe=58712BC0"
                  document.getElementById('homeUrl').value =  "https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/13331103_10153683113203424_9058122044297857694_n.jpg?oh=9d21671021592f2302f1b18e8263d0fa&oe=58712BC0"
                  document.getElementById('username').value = testUser
                  document.getElementById('userID').value = testUser
                  //document.getElementById('username').value =  "anonymous"
                  //document.getElementById('userID').value = "anonymous"
                  //document.getElementById('picture').value = "anonymous"
                  //document.getElementById('homeUrl').value = "anonymous"


                  document.getElementById("gameResult").value = "Game";
                  document.getElementById("startForm").submit();
              }
          })
      }
    });
    //setTimeout(function () {
    //  document.getElementById('startUsername').value =  "anonymous"
    //  document.getElementById('userID').value = "anonymous"
    //  document.getElementById('picture').value = "NA"
    //  document.getElementById("GameResult").value = "Game";
    //  console.log("time out function called. About to submit timeout form")
    //  document.getElementById("startForm").submit();
    //}, 2000);
}




function statsClicked(){
    FB.api('/me?fields=id,name,link,picture', function(response) {
      if( response && !response.error && response.name != undefined ){
          //$('#myModal').modal('show')
          userID = response.id
          window.location.href = "/stats/?num="+userID
      }else{
          // CHANGED FOR DEBUGGING ONLY  //
          //userID = Math.floor( (Math.random()*10) % 4)
          message1 = "To view your game statistics, you must login to Facebook."
          message2 = "Your info is kept confidential. We do NOT use it for marketing"
          window.alert(message1, message2, "Please Login:" )
      }

    });

    window.alert(message1, message2, "Please Login:" )
}














  /////////////////////////////////
 ///          Time            ////
/////////////////////////////////


var _0x8c44=["\x66\x6C\x6F\x6F\x72"];var barLength=-160;var barTotal=30;var barIncrem=barLength/barTotal;var bar=Math[_0x8c44[0]](barTotal*2/3)+1;timeOut=false;




updateTimer= function(){
var _0x4544=["\x6D\x79\x43\x61\x6E\x76\x61\x73","\x67\x65\x74\x45\x6C\x65\x6D\x65\x6E\x74\x42\x79\x49\x64","\x32\x64","\x67\x65\x74\x43\x6F\x6E\x74\x65\x78\x74","\x66\x69\x6C\x6C\x53\x74\x79\x6C\x65","\x77\x68\x69\x74\x65","\x66\x69\x6C\x6C\x52\x65\x63\x74","\x23\x30\x30\x46\x46\x30\x30","\x23\x66\x39\x66\x39\x30\x36","\x23\x66\x66\x35\x63\x33\x33","\x62\x65\x67\x69\x6E\x50\x61\x74\x68","\x50\x49","\x61\x72\x63","\x66\x69\x6C\x6C","\x72\x65\x64","\x6C\x69\x6E\x65\x57\x69\x64\x74\x68","\x73\x74\x72\x6F\x6B\x65"];var c=document[_0x4544[1]](_0x4544[0]);var ctx=c[_0x4544[3]](_0x4544[2]);ctx[_0x4544[4]]=_0x4544[5];ctx[_0x4544[6]](centerX+159,centerY+centerY/3-12,24,barLength-1);ctx[_0x4544[6]](centerX-159,centerY+centerY/3-12,-24,barLength-1);if(bar>barTotal*2/3){ctx[_0x4544[4]]=_0x4544[7]}else {if(bar>barTotal*1/3){ctx[_0x4544[4]]=_0x4544[8]}else {ctx[_0x4544[4]]=_0x4544[9]}};ctx[_0x4544[6]](centerX+160,centerY+centerY/3-12,22,bar*barIncrem);ctx[_0x4544[6]](centerX-159,centerY+centerY/3-12,-22,bar*barIncrem);if(bar<4){ctx[_0x4544[10]]();ctx[_0x4544[12]](redX[redCount],redY[redCount],radRacer+1,0,Math[_0x4544[11]]*2);ctx[_0x4544[4]]=_0x4544[5];ctx[_0x4544[13]]();setTimeout(function(){ctx[_0x4544[10]]();ctx[_0x4544[12]](redX[redCount],redY[redCount],radRacer,0,Math[_0x4544[11]]*2);ctx[_0x4544[4]]=_0x4544[14];ctx[_0x4544[13]]();ctx[_0x4544[15]]=0.01;ctx[_0x4544[16]]();},250);};
}

var _0xad71=["\x66\x6C\x6F\x6F\x72"];bar=barTotal;updateTimer();bar=Math[_0xad71[0]](barTotal*2/3)+1;

introWord= function(word){
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.lineWidth=1
    ctx.textAlign = "center";
    ctx.font = "70px Helvetica Neue";
    ctx.fillStyle = "rgb(50,50,50)";
    ctx.fillText(word,centerX,centerY);
}


var _0x4015=["\x63\x6C\x61\x73\x73\x4E\x61\x6D\x65","\x77\x65\x6C\x63\x6F\x6D\x65\x53\x63\x72\x65\x65\x6E","\x67\x65\x74\x45\x6C\x65\x6D\x65\x6E\x74\x42\x79\x49\x64","\x68\x69\x64\x64\x65\x6E","\x52\x65\x61\x64\x79\x3F","\x63\x6F\x6E\x74\x72\x6F\x6C\x43\x6F\x6E\x73\x6F\x6C\x65","\x63\x6F\x6C\x2D\x78\x73\x2D\x31\x32\x20\x63\x6F\x6C\x2D\x6D\x64\x2D\x34","\x63\x6F\x6E\x74\x72\x6F\x6C\x43\x6F\x6E\x73\x6F\x6C\x65\x4D","\x63\x6F\x6E\x74\x61\x69\x6E\x65\x72\x2D\x66\x6C\x75\x69\x64\x20\x68\x69\x64\x64\x65\x6E\x2D\x6D\x64\x20\x68\x69\x64\x64\x65\x6E\x2D\x6C\x67","\x53\x65\x74\x2E\x2E\x2E","\x47\x6F\x21","\x66\x69\x6C\x6C\x53\x74\x79\x6C\x65","\x77\x68\x69\x74\x65","\x66\x69\x6C\x6C\x52\x65\x63\x74","\x63\x6C\x69\x63\x6B","\x74\x72\x69\x67\x67\x65\x72","\x23\x62\x75\x74\x74\x6F\x6E\x31","\x23\x62\x75\x74\x74\x6F\x6E\x30","\x23\x63\x68\x65\x61\x74\x42\x75\x74\x74\x6F\x6E","\x77\x68\x69\x63\x68","\x6B\x65\x79\x64\x6F\x77\x6E"];startTimer= function(){setTimeout(function(){document[_0x4015[2]](_0x4015[1])[_0x4015[0]]= _0x4015[3];introWord(_0x4015[4])},500);setTimeout(function(){document[_0x4015[2]](_0x4015[5])[_0x4015[0]]= _0x4015[6];document[_0x4015[2]](_0x4015[7])[_0x4015[0]]= _0x4015[8];introWord(_0x4015[9])},1500);setTimeout(function(){introWord(_0x4015[10])},2500);setTimeout(function(){ctx[_0x4015[11]]= _0x4015[12];ctx[_0x4015[13]](0,0,canvasWidth,canvasHeight);drawTrack();updateTimer();$(function(){$(document)[_0x4015[20]](function(e){switch(e[_0x4015[19]]){case 37:$(_0x4015[16])[_0x4015[15]](_0x4015[14]);break;case 39:$(_0x4015[17])[_0x4015[15]](_0x4015[14]);break;case 67:$(_0x4015[18])[_0x4015[15]](_0x4015[14]);break}})});var myVar=setInterval(function(){if(timeOut){return};if(bar<= 1){timeOut= true;post()};bar-= 1;updateTimer()},500)},3500)}















  ///////////////////////////////////
 ///         Facebook           ////
///////////////////////////////////

// if not logged in: resposne.name == undefined


// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
console.log('statusChangeCallback');
console.log(response);
// The response object is returned with a status field that lets the
// app know the current login status of the person.
// Full docs on the response object can be found in the documentation
// for FB.getLoginStatus().
if (response.status === 'connected') {
  // Logged into your app and Facebook.
  testAPI();
} else if (response.status === 'not_authorized') {
  // The person is logged into Facebook, but not your app.
  document.getElementById('FB_Status').innerHTML = 'Please log into this app.';
} else {
  // The person is not logged into Facebook, so we're not sure if
  // they are logged into this app or not.
  document.getElementById('FB_Status').innerHTML = 'anonymous';
}
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
FB.getLoginStatus(function(response) {
  statusChangeCallback(response);
});
}

window.fbAsyncInit = function() {
FB.init({
appId      : '554159228102379',
cookie     : true,  // enable cookies to allow the server to access
                    // the session
xfbml      : true,  // parse social plugins on this page
version    : 'v2.5' // use graph api version 2.5
});

// Now that we've initialized the JavaScript SDK, we call
// FB.getLoginStatus().  This function gets the state of the
// person visiting this page and can return one of three states to
// the callback you provide.  They can be:
//
// 1. Logged into your app ('connected')
// 2. Logged into Facebook, but not your app ('not_authorized')
// 3. Not logged into Facebook and can't tell if they are logged into
//    your app or not.
//
// These three cases are handled in the callback function.

FB.getLoginStatus(function(response) {
statusChangeCallback(response);
});

};

// Load the SDK asynchronously
(function(d, s, id) {
var js, fjs = d.getElementsByTagName(s)[0];
if (d.getElementById(id)) return;
js = d.createElement(s); js.id = id;
js.src = "//connect.facebook.net/en_US/sdk.js";
fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function testAPI() {
console.log('Welcome!  Fetching your information.... ');
FB.api('/me', function(response) {
  console.log('Successful login for: ' + response.name);
  document.getElementById('FB_Status').innerHTML =  response.name + '!';
});
}













