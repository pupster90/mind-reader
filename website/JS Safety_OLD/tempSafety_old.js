
//var debugArray = [1,0,1,1,1,0,0,1,0,1,1]



    ////////////////////////////////////////////
   ////////////////////////////////////////////
  ///        Prediction Equation          ////
 ////////////////////////////////////////////
////////////////////////////////////////////







  ////////////////////////////////////
 ///////    Initialization     //////
////////////////////////////////////



    var NUM_TRIALS_TO_WIN = 100
    var num_trials = 2*NUM_TRIALS_TO_WIN-1;
    var your_guess
    var my_guess
    var expPred   // double p; in C Schapire

var cbeta
var gamm
var beta



var loss = 0.0;


var BETATree = .55
var cbetaTree= -1
FTree= function(r) {
    if (cbetaTree < 0) {
        if (BETATree == 1) { cbetaTree = .5
        } else { cbetaTree = (1. + BETATree) * Math.log(2. / (1. + BETATree)) / (2. * (1. - BETATree)) }
    }

    if (r <= 0.5 - cbetaTree) { return 0
    } else if (r <= 0.5 + cbetaTree) { return .5 - (1 - 2 * r) / (4 * cbetaTree)
    } else { return 1 }
}







  ///////////////////////////
 ///////    Tree      //////
///////////////////////////


function add_bit(b,s){
    // ** FOR DEBUGGING
    //print("inside add_bit, b=" + b + " s="+ s)
    this.bit= b
    this.nextBit= s
    // ** FOR DEBUGGING
    //print("add_bit function complete")
    return
}


function TreeNode(){
    // ** FOR DEBUGGING
    //print( "New Tree Node"  )

    this.son= [null,null];
    this.wt = [1,1];
    this.end_wt = 1;
    this.sum_wt= 1;
}


function get_sum_wt(treeNode){
    if( treeNode == null){ return 1
    }else{ return treeNode.sum_wt}
}


function update_wt(treeNode,ex,y,beta) {
    //print("inside update_wt")
    //console.log("tree update/ex: start values")
    //console.log(treeNode)
    //console.log(ex)

    treeNode.wt[1 - y] *= beta

    if (ex == null) {
        treeNode.end_wt = 0.5 * (1 + beta)
    } else {
        update_wt(treeNode.son[ex.bit], ex.nextBit, y, beta);
    }

    treeNode.sum_wt= 0.25*(treeNode.wt[0] + treeNode.wt[1]) +
        0.5 * get_sum_wt(treeNode.son[0]) * get_sum_wt(treeNode.son[1]) * treeNode.end_wt
    //print("leaving update_wt")
}


function get_pred_wt(treeNode, ex){
    // ** debugging
    //print("inside get_pred_wt")
    if( ex==null){
        //print("ex=null")
        return 0.25 * (treeNode.wt[1] + get_sum_wt(treeNode.son[0]) * get_sum_wt(treeNode.son[1]));
    }else{
        var b = ex.bit;
        // ** debbuging
        //print("current ex.bit="+b)
        if (treeNode.son[b] == null){
            //print("adding tree node")
            treeNode.son[b] = new TreeNode();
        }
        //print("doing recursion on "+treeNode.son[b]+" "+ex.nextBit)

        //print("out of recursion")

        return 0.25 * treeNode.wt[1] +
            0.5 * get_sum_wt(treeNode.son[1-b]) * get_pred_wt(treeNode.son[b], ex.nextBit) * treeNode.end_wt;
        // ** debugging
        //console.log("result of get_pred_wt")
        //console.log(treeNode)
    }
    //console.log("treeNode.prediction=")
    //console.log(treeNode.prediction)
}











  /////////////////////////////////////////////////
 ///////    EXPERT: var_tree_exp_sym_py     //////
/////////////////////////////////////////////////


function EXPERT_var_tree_exp_sym_py() {

    this.tree = new TreeNode();
    this.ex = null;
    this.last_y = -1;
    this.y = null; this.dy = null; this.p = null; this.win = null;
    this.name = "varTreePY"

    this.NUMBER = function () {
        return 1
    }



    this.PREDICTION = function () {
        //print( "PREDICT exp_PY"  )
        //console.log("PREDICT exp_PY")
        //console.log("old tree")
        //console.log(this.tree)

        var thisPred
        if (this.last_y == -1) {
            thisPred =  0.5;
        } else {

            //print("get_pred_wt="+get_pred_wt(this.tree, this.ex))
            //print("get_sum_wt="+get_sum_wt(this.tree))

            thisPred = Math.abs(this.last_y - FTree( get_pred_wt(this.tree, this.ex) / get_sum_wt(this.tree)))
            //print("prediction="+(Math.abs(this.last_y - FTree(get_pred_wt(this.tree, this.ex) / get_sum_wt(this.tree)))))
            //console.log(this.ex)

        }
        //console.log("new tree")
        //console.log(this.tree)
        //console.log(this.ex)
        return thisPred;
    }



// Parm is 2*comp_guess + human_guess
    this.UPDATE = function(parm) {
        // ** FOR DEBUGGING
        //print( "Updating exp_PY"  )
        //console.log("UPDATE exp_PY")
        //print("Value inside UPDATE param: "+parm )
        //print("last_y="+ this.last_y)

        this.p = parm >> 1
        this.y = parm & 1
        this.win = (this.p == this.y)? 1:0

        // ** FOR DEBUGGING
        //print(" parm="+parm+" last_y="+this.last_y)
        //print(" p="+this.p+" y="+this.y+" win="+this.win)

        if (this.last_y != -1) {
            this.dy = (this.y != this.last_y)? 1:0;
            //print("dy="+this.dy)
            // ** FOR DEBUGGING
            //print("about to Update tree weights")
            update_wt(this.tree, this.ex, this.dy, BETATree);
            //print(this.tree)
            //print("tree weights updated")
            //print("adding "+this.dy)
            this.ex = new add_bit(this.dy, this.ex);
        }
        // ** FOR DEBUGGING
        //print("about to update add_bit ")
        //print("adding "+this.win)
        this.ex = new add_bit(this.win, this.ex)
        // ** FOR DEBUGGING
        //print("outside of add_bit function");
        //print("ex.Bit changed to " + this.ex.bit)
        //print("nextBit changed to: "+ this.ex.nextBit)
        //console.log(this.ex)

        // ** FOR DEBUGGING
        //console.log(this.ex)

        this.last_y = this.y

        //console.log("new ex:")
        //console.log(this.ex)
        return 0
    }
}












  /////////////////////////////////////////////////
 ///////    EXPERT: var_tree_exp_sym_y     //////
/////////////////////////////////////////////////


function EXPERT_var_tree_exp_sym_y() {


    this.tree = new TreeNode();
    this.ex = null;
    this.last_y = -1;
    this.y = null; this.dy = null;
    this.name = "varTreeY"

    this.NUMBER = function () {
        return 1
    }

    this.PREDICTION = function () {
        // ** FOR DEBUGGING
        //print( "Predicting exp_Y"  )
        //console.log("PREDICT exp_Y")

        var thisPred
        if (this.last_y == -1) {
            thisPred =  0.5;
        } else {

            //print("get_pred_wt="+get_pred_wt(this.tree, this.ex))
            //print("get_sum_wt="+get_sum_wt(this.tree))

            thisPred = Math.abs(this.last_y - FTree( get_pred_wt(this.tree, this.ex) / get_sum_wt(this.tree)))
            //print("prediction="+(Math.abs(this.last_y - FTree(get_pred_wt(this.tree, this.ex) / get_sum_wt(this.tree)))))
            //console.log(this.ex)

        }
        //console.log("new tree")
        //console.log(this.tree)
        //console.log(this.ex)
        return thisPred;

        //if (this.last_y == -1) {
        //    return 0.5;
        //} else {
        //    return Math.abs(this.last_y - FTree( get_pred_wt(this.tree, this.ex) / get_sum_wt(this.tree)));
        //}
    }



    this.UPDATE = function(parm) {
        // ** FOR DEBUGGING
        //console.log("UPDATE exp_Y")
        //print( "Updating exp_Y"  )

        this.y = parm & 1
        if (this.last_y != -1) {
            this.dy = (this.y != this.last_y)? 1:0;
            update_wt(this.tree, this.ex, this.dy, BETATree);
            this.ex = new add_bit(this.dy, this.ex);
        }
        // this.ex = add_bit(this.win, this.ex)    <-- *IS THIS REALLY NOT SUPPOSED TO BE THERE???
        this.last_y = this.y
        return 0
    }

}










  ////////////////////////////
 ///////   MAIN FILE   //////
////////////////////////////




/************
** functions F, U are taken directly from "experts" paper.
** function ginv(x) is equal to g(1/x) given in "experts" paper.
** compute_beta computes the values of beta, gamm and cbeta to be used.
************/





function ginv(x){
    return 1 + 2*x - 2*Math.sqrt(x*x + x);
}

function F(r){
    if( r <= 0.5-cbeta ){ return 0
    }else if( r <= 0.5+cbeta ){ return .5-  (1-2*r)/ (4*cbeta)
    }else{ return 1 }
}

function U(q){
    return 1-(1-beta)*q
}



function compute_beta(){
    beta = ginv(2 * Math.log( num_experts)/num_trials);
    gamm = 1.0;
    cbeta = (beta == 1.0 ? 0.5 : (1.+beta)*Math.log(2./(1.+beta)) / (2.*(1.-beta)));
}




    function random_bit(p){

        //return (p < 0.5 ? 0.0 : 1.0);
        if( Math.random()>p ){ return 0
        }else{ return 1}
    }



    function get_experts_pred(){

        // ** FOR DEBUGGING
        //print("")
        //print( "Inside prediciton function"  )

        var sw = 0
        var pw = 0

        for( i=0; i< expert.length; i++){
            for(j=0; j<expert[i].NUMBER(); j++){
                gweight[i][j] = Math.pow(weight[i][j], gamm);

                // ** FOR DEBUGGING
                //print("")
                print( "new gweight["+i+"]["+j+"]="+(gweight[i][j])  )

                sw += gweight[i][j]
                pred[i][j] = expert[i].PREDICTION()
                pw += gweight[i][j] * pred[i][j];
            }
        }
        var r = pw/sw;

        // ** FOR DEBUGGING
        print("next CompGuess Prob:   "+F(r))
        //print("cBETATree: "+cbetaTree)


        return F(r);
    }




    function update_experts(p,y){

        // ** FOR DEBUGGING
        //print("")
        //print( "Inside Update function"  )

        var q;
        for (i = 0; i < expert.length; i++) {

            // ** FOR DEBUGGING
            //print("")

            expert[i].UPDATE(2*p+y);
            for (j = 0; j < expert[i].NUMBER(); j++) {
                q = Math.abs(pred[i][j] - y);
                exp_loss[i][j] += q;
                weight[i][j] = gweight[i][j] * U(q);
            }
        }
    }
















  ///////////////////////////////////////
 ///////   Code that DOES stuff   //////
///////////////////////////////////////


    var gweight = new Array()
    var pred = new Array()

    var expert = new Array()
    expert[0] = new EXPERT_var_tree_exp_sym_py()
    expert[1] = new EXPERT_var_tree_exp_sym_y()

    var experts=""
    for(i=0; i<expert.length;i++)
        experts+=" "+expert[i].name

    var weight = new Array()
    var exp_loss= new Array()
    var num_experts=0
    for( i=0;i<expert.length;i++ ) {
        num_experts += expert[i].NUMBER()
        weight[i]= new Array()
        exp_loss[i]= new Array()
        gweight[i]= new Array()
        pred[i]= new Array()
        for (j = 0; j < expert[i].NUMBER(); j++) {
            weight[i][j] = 1.0
            exp_loss[i][j] = 0.0
        }
    }

    compute_beta()





makeGuess= function(humanGuess){
    expPred = get_experts_pred();
    my_guess = random_bit(expPred);
    your_guess = humanGuess;

    loss += Math.abs(expPred - your_guess);
    update_experts(my_guess,your_guess);

}










  ///////////////////////////
 ///////   Interface   /////
///////////////////////////

function compGuess(compGuess,humanGuess){
    // ** FOR DEBUGGING
    //print( "Inside CompGuess function"  )

    var num
    update_experts(compGuess,humanGuess);
    num = random_bit(get_experts_pred())
    /*
    num = Math.random()
    if( num < .5){
        num = 0
    }else{
        num = 1
    }
    */
    return num
}


function compguess(compGuess,humanGuess){
    // ** FOR DEBUGGING
    //print( "Inside CompGuess function"  )
    var num = compGuess +humanGuess
    var get_experts__pred=.5
    num = random_bit(get_experts__pred)
    /*
    num = Math.random()
    if( num < .5){
        num = 0
    }else{
        num = 1
    }
    */
    return num
}





function messageBoxClicked(){
    //beta=0.845711
    //var test= U(5)
    //test= weight.length
    //var test2= weight[0][0]
    //var test3= beta
    //document.getElementById('messageBox').innerHTML = ' *weight.length: '+test+
    //    '\n *weight[0][0] : '+test2+ '\n *beta: '+test3
    //document.getElementById('messageBox').innerHTML = ' comp guess: '+ guess
    document.getElementById('messageBox').innerHTML =  debugArray.length

    //for(i=0; i<6; i++){
    //    print( debugArray[i] )
    //    numberClicked( debugArray[i] )
    //}
}


function print(words){
    document.getElementById('console').innerHTML += '<br>'+words
}
































































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
        youSpotX= centerX+centerX/20
        youSpotY= centerY+centerY/20-centerY/12+offset1
        ctx.fillText("You:     ",youSpotX,youSpotY);
        ctx.textAlign = "center"
        ctx.fillText("0",youSpotX,youSpotY);
        compSpotX= centerX+centerX/20
        compSpotY=centerY+centerY/20+centerY/12+offset1
        ctx.fillStyle = "blue";
        ctx.textAlign = "right";
        ctx.fillText("Computer:     ",compSpotX,compSpotY);
        ctx.textAlign = "center"
        ctx.fillText("0",compSpotX,compSpotY);

















  /////////////////////////////////
 ///      Create Racers       ////
/////////////////////////////////


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
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");


        ctx.beginPath();
        ctx.arc(blueX[blueCount],blueY[blueCount],radRacer +1,0,Math.PI*2);
        ctx.fillStyle = 'white';
        ctx.fill();

        if( blueCount==0){
            ctx.beginPath();
            ctx.strokeStyle="#00FF00";
            ctx.lineWidth= 1;
            ctx.moveTo(centerX-circOffset,centerY-radBig);
            ctx.lineTo(centerX-circOffset,centerY-radSmall);
            ctx.stroke();
            if(redCount==0){
                ctx.beginPath();
                ctx.arc(redX[redCount],redY[redCount],radRacer,0,Math.PI*2);
                ctx.fillStyle = 'red';
                ctx.fill();
            }
        }


        blueCount += 1

        ctx.beginPath();
        ctx.arc(blueX[blueCount],blueY[blueCount],radRacer,0,Math.PI*2);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.lineWidth = 0.01;
        ctx.stroke();

        ctx.beginPath();
        ctx.rect(compSpotX-centerX/10,compSpotY-centerY/7,2*centerX/11,2*centerY/10);
        ctx.fillStyle="white";
        ctx.fill();

        ctx.textAlign = "center";
        ctx.font = "40px Helvetica Neue";
        ctx.fillStyle = "blue";
        ctx.fillText(blueCount,compSpotX,compSpotY);
    }



    function moveRedCar() {
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");

        ctx.beginPath();
        ctx.arc(redX[redCount],redY[redCount],radRacer +1,0,Math.PI*2);
        ctx.fillStyle = 'white';
        ctx.fill();

        if( redCount==0){
            ctx.beginPath();
            ctx.strokeStyle="#00FF00";
            ctx.lineWidth= 1;
            ctx.moveTo(centerX-circOffset,centerY-radBig);
            ctx.lineTo(centerX-circOffset,centerY-radSmall);
            ctx.stroke();
            if(blueCount==0){
                ctx.beginPath();
                ctx.arc(blueX[blueCount],blueY[blueCount],radRacer,0,Math.PI*2);
                ctx.fillStyle = 'blue';
                ctx.fill();
            }
        }



        redCount += 1

        ctx.beginPath();
        ctx.arc(redX[redCount],redY[redCount],radRacer,0,Math.PI*2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.lineWidth = 0.01;
        ctx.stroke();

        ctx.beginPath();
        ctx.rect(youSpotX-centerX/10,youSpotY-centerY/7,2*centerX/11,2*centerY/13);
        ctx.fillStyle="white";
        ctx.fill();

        ctx.textAlign = "center";
        ctx.font = "40px Helvetica Neue";
        ctx.fillStyle = "red";
        ctx.fillText(redCount,youSpotX,youSpotY);

    }












  /////////////////////////////////
 ///        Map Keys          ////
/////////////////////////////////



$("#button1").mouseup(function(){
    $(this).blur();
})
$("#button0").mouseup(function(){
    $(this).blur();
})
$("#cheatButton").mouseup(function(){
    $(this).blur();
})


/*


$(document).on('click', '.panel-heading span.clickable', function (e) {
    var $this = $(this);
    if (!$this.hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideUp();
        $this.addClass('panel-collapsed');
    } else {
        $this.parents('.panel').find('.panel-body').slideDown();
        $this.removeClass('panel-collapsed');
    }
});
$(document).on('click', '.panel div.clickable', function (e) {
    var $this = $(this);
    if (!$this.hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideUp();
        $this.addClass('panel-collapsed');
    } else {
        $this.parents('.panel').find('.panel-body').slideDown();
        $this.removeClass('panel-collapsed');
    }
});
$(document).ready(function () {
    $('.panel-heading span.clickable').click();
    $('.panel div.clickable').click();
});
*/


//$("#button1").on("touchstart", function(){
//    //message.alert("hello")
//    $(this).removeClass("mobileHoverFix");
//});


//$("#button1").on("touchend", function(){
//    $(this).addClass("mobileHoverFix");
//});







  //////////////////////////////////
 ///        Game Over          ////
//////////////////////////////////


function post(params) {
    if(redCount >= gameLen ){
        ctx.beginPath();
        ctx.arc(redX[0],redY[0],radRacer,0,Math.PI*2);
        ctx.lineWidth = .01
        ctx.fillStyle = 'red';
        ctx.fill();

        if( didCheat === 1){
            document.getElementById('gameResult').value = "Cheater"
        }else{
            document.getElementById('gameResult').value = "Winner"
        }
    }else{
        ctx.beginPath();
        ctx.arc(blueX[0],blueY[0],radRacer,0,Math.PI*2);
        ctx.lineWidth = .01
        ctx.fillStyle = 'blue';
        ctx.fill();

        document.getElementById('gameResult').value = "Loser"
    }

    document.getElementById('mode').value = "original"
    document.getElementById('username').value =  document.getElementById('usernameBox').value
    document.getElementById('youHistory').value = youPastMoves
    document.getElementById('compHistory').value = compPastMoves
    document.getElementById("blueScoreFinal").value = blueCount
    document.getElementById("expertNames").value = experts
    document.getElementById("myForm").submit();
}











  //////////////////////////////////////
 ///        Button Clicks          ////
//////////////////////////////////////

var youPastMoves = []
var compPastMoves = []
var pastWins = []
var x59c2 = random_bit(get_experts_pred());
var q72l4 = random_bit(get_experts_pred());
var u47o9 = random_bit(get_experts_pred());
var n49b3 = random_bit(get_experts_pred());
var i86r1 = random_bit(get_experts_pred());
var k39h4 = random_bit(get_experts_pred());
var m58f2 = random_bit(get_experts_pred());
var w44p7 = random_bit(get_experts_pred());
var o06d8 = random_bit(get_experts_pred());
var didCheat = 0






function numberClicked(num){
    // ** FOR DEBUGGING
    print("")
    print("")
    print("*** TRIAL  " + (redCount+blueCount+2)+"  ***" )


    if( redCount >= gameLen  || blueCount >= gameLen ){
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
    document.getElementById('compGuess').innerHTML = 'Computer Will Guess:'
    document.getElementById('compGuessM').innerHTML = 'Comp Will Guess: '
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
}





function cheatClicked(){
    didCheat = 1
    document.getElementById('compGuess').innerHTML = 'Computer Will Guess: '+x59c2
    document.getElementById('compGuessM').innerHTML = 'Comp Will Guess:  '+x59c2
    document.getElementById("cheatMessage").style.visibility = "visible";
    document.getElementById("cheatMessageM").style.visibility = "visible";
     q72l4 = u47o9
     n49b3 = x59c2
     k39h4  = i86r1
     k39h4 =q72l4
     m58f2 =k39h4
     w44p7 = o06d8
}


function restartClicked(){
    document.getElementById('gameResult').value = "Restart"
    if( youPastMoves.length == 0){
        youPastMoves.push(3)
        compPastMoves.push(3)

        var date = new Date();
        var currentTime = date.getTime();
        document.getElementById('times').value += ' '+currentTime
    }
    document.getElementById('mode').value = "original"
    document.getElementById('username').value =  document.getElementById('usernameBox').value
    document.getElementById('youHistory').value = youPastMoves
    document.getElementById('compHistory').value = compPastMoves
    document.getElementById("blueScoreFinal").value = blueCount
    document.getElementById("expertNames").value = experts
    document.getElementById("myForm").submit();
}



function startClicked(){
    document.getElementById("welcomeScreen").className = "hidden";
    //document.getElementById("welcomeScreenM").className = "hidden";
    document.getElementById("controlConsole").className = "col-xs-12 col-md-4";
    document.getElementById("controlConsoleM").className = "container-fluid hidden-md hidden-lg";

    $(function() {
   $(document).keydown(function(e) {
    switch(e.which) {
        case 48: // "0"
            $("#button0").trigger("click")
            break;
        case 49: // "1"
            $("#button1").trigger("click")
            break;
    } }); });

}















