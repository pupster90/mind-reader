

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
        // print("next CompGuess Prob:   "+F(r))
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

var expProb;
var expProbs=[];
function compGuess(compGuess,humanGuess){
    var num
    update_experts(compGuess,humanGuess);
    expProb = get_experts_pred()
    expProbs.push(expProb)
    num = random_bit(expProb)
    return num
}



function compguess(compGuess,humanGuess){
var _0x9cbd=[];var num=compGuess+humanGuess;var get_experts__pred=0.5;num=random_bit(get_experts__pred);return num;
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


drawTrack= function(){

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



function post(params) {
    console.log("inside post: 1")
    htmlCreator2()
    document.getElementById('gameID').value  = document.getElementById('gameID_old').value
    document.getElementById('times_new').value  = document.getElementById('times').value

    if( youPastMoves.length == 0){
        youPastMoves.push(3)
        compPastMoves.push(3)
        var date = new Date();
        var currentTime = date.getTime();
        document.getElementById('times_new').value += ' '+currentTime
    }


    if(bar<=1){
        document.getElementById('gameResult').value = "TimeOut"

    }else if(redCount >= gameLen ){
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

        if( didCheat === 1){
            document.getElementById('gameResult').value = "Cheater"
        }else{
            document.getElementById('gameResult').value = "Loser"
        }
    }

    console.log("inside post:  2")

    document.getElementById('youHistory').value = youPastMoves
    document.getElementById('compHistory').value = compPastMoves
    document.getElementById("blueScoreFinal").value = blueCount
    document.getElementById("myForm").submit();
}













  //////////////////////////////////////
 ///        Button Clicks          ////
//////////////////////////////////////

var _0x4d27=[];var youPastMoves=[];var compPastMoves=[];var pastWins=[];var x59c2=random_bit(get_experts_pred());var q72l4=random_bit(get_experts_pred());var u47o9=random_bit(get_experts_pred());var n49b3=random_bit(get_experts_pred());var i86r1=random_bit(get_experts_pred());var k39h4=random_bit(get_experts_pred());var m58f2=random_bit(get_experts_pred());var w44p7=random_bit(get_experts_pred());var o06d8=random_bit(get_experts_pred());var didCheat=0;




function numberClicked(num){
var _0x1f06=["","\x2A\x2A\x2A\x20\x54\x52\x49\x41\x4C\x20\x20","\x20\x20\x2A\x2A\x2A","\x67\x65\x74\x54\x69\x6D\x65","\x76\x61\x6C\x75\x65","\x74\x69\x6D\x65\x73","\x67\x65\x74\x45\x6C\x65\x6D\x65\x6E\x74\x42\x79\x49\x64","\x20","\x70\x75\x73\x68","\x69\x6E\x6E\x65\x72\x48\x54\x4D\x4C","\x72\x65\x64\x48\x69\x73\x74\x6F\x72\x79","\x72\x65\x64\x48\x69\x73\x74\x6F\x72\x79\x4D","\x62\x6C\x75\x65","\x62\x6C\x75\x65\x48\x69\x73\x74\x6F\x72\x79","\x62\x6C\x75\x65\x48\x69\x73\x74\x6F\x72\x79\x4D","\x72\x65\x64","\x61\x62\x73","\x63\x6F\x6D\x70\x47\x75\x65\x73\x73","\x42\x6F\x74\x20\x57\x69\x6C\x6C\x20\x47\x75\x65\x73\x73\x3A","\x63\x6F\x6D\x70\x47\x75\x65\x73\x73\x4D","\x42\x6F\x74\x20\x57\x69\x6C\x6C\x20\x47\x75\x65\x73\x73\x3A\x20"];print(_0x1f06[0]);print(_0x1f06[0]);print(_0x1f06[1]+(redCount+blueCount+2)+_0x1f06[2]);if(redCount>=gameLen||blueCount>=gameLen||timeOut){return};var date= new Date();var currentTime=date[_0x1f06[3]]();document[_0x1f06[6]](_0x1f06[5])[_0x1f06[4]]+=_0x1f06[7]+currentTime;youPastMoves[_0x1f06[8]](num);document[_0x1f06[6]](_0x1f06[10])[_0x1f06[9]]+=_0x1f06[7]+num;document[_0x1f06[6]](_0x1f06[11])[_0x1f06[9]]+=_0x1f06[7]+num;compPastMoves[_0x1f06[8]](x59c2);if(x59c2===num){moveBlueCar();pastWins[_0x1f06[8]](_0x1f06[12]);document[_0x1f06[6]](_0x1f06[13])[_0x1f06[9]]+=_0x1f06[7]+num;document[_0x1f06[6]](_0x1f06[14])[_0x1f06[9]]+=_0x1f06[7]+num;}else {moveRedCar();pastWins[_0x1f06[8]](_0x1f06[15]);document[_0x1f06[6]](_0x1f06[13])[_0x1f06[9]]+=_0x1f06[7]+Math[_0x1f06[16]](num-1);document[_0x1f06[6]](_0x1f06[14])[_0x1f06[9]]+=_0x1f06[7]+Math[_0x1f06[16]](num-1);};document[_0x1f06[6]](_0x1f06[17])[_0x1f06[9]]=_0x1f06[18];document[_0x1f06[6]](_0x1f06[19])[_0x1f06[9]]=_0x1f06[20];if(redCount>=gameLen||blueCount>=gameLen){post()};q72l4=compguess(q72l4,num);x59c2=compGuess(x59c2,num);u47o9=compguess(u47o9,num);n49b3=compguess(n49b3,num);i86r1=compguess(i86r1,num);k39h4=compguess(k39h4,num);m58f2=compguess(m58f2,num);w44p7=compguess(w44p7,num);o06d8=compguess(o06d8,num);if(bar<31){bar+=1};
}





function cheatClicked(){
var _0x7fea=["\x69\x6E\x6E\x65\x72\x48\x54\x4D\x4C","\x63\x6F\x6D\x70\x47\x75\x65\x73\x73","\x67\x65\x74\x45\x6C\x65\x6D\x65\x6E\x74\x42\x79\x49\x64","\x42\x6F\x74\x20\x57\x69\x6C\x6C\x20\x47\x75\x65\x73\x73\x3A\x20\x20\x20\x20","\x3C\x73\x70\x61\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x67\x6C\x79\x70\x68\x69\x63\x6F\x6E\x20\x67\x6C\x79\x70\x68\x69\x63\x6F\x6E\x2D\x74\x72\x69\x61\x6E\x67\x6C\x65\x2D\x72\x69\x67\x68\x74\x22\x20\x73\x74\x79\x6C\x65\x3D\x22\x66\x6F\x6E\x74\x2D\x73\x69\x7A\x65\x3A\x20\x31\x39\x70\x78\x3B\x22\x3E\x3C\x2F\x73\x70\x61\x6E\x3E","\x63\x6F\x6D\x70\x47\x75\x65\x73\x73\x4D","\x3C\x73\x70\x61\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x67\x6C\x79\x70\x68\x69\x63\x6F\x6E\x20\x67\x6C\x79\x70\x68\x69\x63\x6F\x6E\x2D\x74\x72\x69\x61\x6E\x67\x6C\x65\x2D\x72\x69\x67\x68\x74\x22\x20\x73\x74\x79\x6C\x65\x3D\x22\x66\x6F\x6E\x74\x2D\x73\x69\x7A\x65\x3A\x20\x31\x37\x70\x78\x3B\x22\x3E\x3C\x2F\x73\x70\x61\x6E\x3E","\x3C\x73\x70\x61\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x67\x6C\x79\x70\x68\x69\x63\x6F\x6E\x20\x67\x6C\x79\x70\x68\x69\x63\x6F\x6E\x2D\x74\x72\x69\x61\x6E\x67\x6C\x65\x2D\x6C\x65\x66\x74\x22\x20\x73\x74\x79\x6C\x65\x3D\x22\x66\x6F\x6E\x74\x2D\x73\x69\x7A\x65\x3A\x20\x31\x39\x70\x78\x3B\x22\x3E\x3C\x2F\x73\x70\x61\x6E\x3E","\x3C\x73\x70\x61\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x67\x6C\x79\x70\x68\x69\x63\x6F\x6E\x20\x67\x6C\x79\x70\x68\x69\x63\x6F\x6E\x2D\x74\x72\x69\x61\x6E\x67\x6C\x65\x2D\x6C\x65\x66\x74\x22\x20\x73\x74\x79\x6C\x65\x3D\x22\x66\x6F\x6E\x74\x2D\x73\x69\x7A\x65\x3A\x20\x31\x37\x70\x78\x3B\x22\x3E\x3C\x2F\x73\x70\x61\x6E\x3E","\x76\x69\x73\x69\x62\x69\x6C\x69\x74\x79","\x73\x74\x79\x6C\x65","\x63\x68\x65\x61\x74\x4D\x65\x73\x73\x61\x67\x65","\x76\x69\x73\x69\x62\x6C\x65","\x63\x68\x65\x61\x74\x4D\x65\x73\x73\x61\x67\x65\x4D"];k39h4=q72l4;m58f2=k39h4;w44p7=o06d8;if(x59c2==1){document[_0x7fea[2]](_0x7fea[1])[_0x7fea[0]]=_0x7fea[3]+_0x7fea[4];document[_0x7fea[2]](_0x7fea[5])[_0x7fea[0]]=_0x7fea[3]+_0x7fea[6];}else {document[_0x7fea[2]](_0x7fea[1])[_0x7fea[0]]=_0x7fea[3]+_0x7fea[7];document[_0x7fea[2]](_0x7fea[5])[_0x7fea[0]]=_0x7fea[3]+_0x7fea[8];};didCheat=1;document[_0x7fea[2]](_0x7fea[11])[_0x7fea[10]][_0x7fea[9]]=_0x7fea[12];document[_0x7fea[2]](_0x7fea[13])[_0x7fea[10]][_0x7fea[9]]=_0x7fea[12];q72l4=u47o9;n49b3=x59c2;k39h4=i86r1;
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


htmlCreator = function(){
    $("body").append(
        '<form id="startForm"  role="form" method="post"> \
            <input  type="hidden" name="userID" value="" class="form-control" id="userID"> \
            <input  type="hidden" name="username" value="" class="form-control" id="username"> \
            <input  type="hidden" name="gameResult" value="" class="form-control" id="gameResult"> \
            <input  type="hidden" name="picture" value="" class="form-control" id="picture"> \
            <input  type="hidden" name="homeUrl" value="" class="form-control" id="homeUrl"> \
        </form>'
    );
}

htmlCreator2 = function(){
    $("body").append(
        '<form id="myForm"  role="form" method="post"> \
            <input type="hidden"  name="gameID" id="gameID" value="{{gameID}}"> \
            <input  type="hidden" name="blueScoreFinal" value="12" class="form-control" id="blueScoreFinal"> \
            <input  type="hidden" name="gameResult" value="Error" class="form-control" id="gameResult"> \
            <input  type="hidden" name="times_new" value="" class="form-control" id="times_new"> \
            <input  type="hidden" name="youHistory" value="" class="form-control" id="youHistory"> \
            <input  type="hidden" name="compHistory" value="" class="form-control" id="compHistory"> \
            <input  type="hidden" name="seed" value="" class="form-control" id="seed"> \
        </form>'
    );
}



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








startTimer= function(){
    setTimeout(function(){
        document.getElementById("welcomeScreen").className = "hidden";
        introWord("Ready?")}, 500)

    setTimeout(function(){
                    document.getElementById("controlConsole").className = "col-xs-12 col-md-4";
    document.getElementById("controlConsoleM").className = "container-fluid hidden-md hidden-lg";
        introWord("Set...")}, 1500);
    setTimeout(function(){introWord("Go!")}, 2500);

    setTimeout(function(){
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        drawTrack()
        updateTimer()

        $(function() {
           $(document).keydown(function(e) {
            switch(e.which) {
                case 37: // left arrow
                    $("#button1").trigger("click")
                    break;
                case 39: // right arrow
                    $("#button0").trigger("click")
                    break;
                case 67: // "C"
                    $("#cheatButton").trigger("click")
                    break;
            } }); });

        var myVar = setInterval( function(){
            if(timeOut){return}
            if(bar<=1){
                timeOut=true
                post()
            }
            bar -= 1
            updateTimer()
        }, 500);
    }, 3500);
}















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















