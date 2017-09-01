
// REQUIRED IMPORTS:
// * none required

// This class draws the physical track that the player sees when they play the game
// it also controls the movements of the racers (eg: moveRed)



function RaceTrack( gameLen=100,elementId="myCanvas",timeMax=30 ){


      ///////////////////////////////
     //   Initialize Constants
    ///////////////////////////////
    {
    // set constants for canvas settings
    this.gameLen = gameLen;
    this.c = document.getElementById(elementId);
    this.ctx = this.c.getContext("2d");

    // setup constants for elements on canvas
    this.canvasWidth = 1000; this.canvasHeight = this.canvasWidth/2;
    this.centerX = this.canvasWidth/2; this.centerY = this.canvasHeight/2; this.circOffset = this.centerX/2;
    this.radBig = this.centerY/1.1; this.radRed = this.centerY/1.2; this.radBlue = this.centerY/1.42;
    this.radSmall = this.centerY/1.6; this.radRacer = this.centerY/18;

    // Constants for time columns
    this.barLength= -160; this.barTotal=timeMax; this.barIncrem = this.barLength/this.barTotal;
    }



      ///////////////////////////////
     // Draw the initial race track
    ///////////////////////////////
    this.drawTrack= function(){
        // define ctx settings and remove any previous stuff from canvas
        this.ctx.fillStyle = "white"; this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.ctx.fillStyle = "black"; this.ctx.strokeStyle="black";

        // Draw ellipses that form inner and outer track boundary
        this.ctx.beginPath(); this.ctx.lineWidth=2;
        this.ctx.arc(this.centerX+this.circOffset,this.centerY,this.radBig,-Math.PI/2,-Math.PI*1.5);
        this.ctx.arc(this.centerX-this.circOffset,this.centerY,this.radBig,Math.PI/2,Math.PI*1.5);
        this.ctx.arc(this.centerX+this.circOffset,this.centerY,this.radBig,-Math.PI/2,-Math.PI*1.5);
        this.ctx.stroke();
        this.ctx.beginPath(); this.ctx.lineWidth=2;
        this.ctx.arc(this.centerX+this.circOffset,this.centerY,this.radSmall,-Math.PI/2,-Math.PI*1.5);
        this.ctx.arc(this.centerX-this.circOffset,this.centerY,this.radSmall,Math.PI/2,Math.PI*1.5);
        this.ctx.arc(this.centerX+this.circOffset,this.centerY,this.radSmall,-Math.PI/2,-Math.PI*1.5);
        this.ctx.stroke();

        // draw scoreboard
        this.offset1= this.centerY/10;
        this.ctx.lineWidth=1; this.ctx.textAlign = "center"; this.ctx.font = "69px Helvetica Neue"; this.ctx.fillStyle = "rgb(50,50,50)";
        this.ctx.fillText("Score",this.centerX,this.centerY-this.centerY/4+this.offset1);
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX-this.centerX/5,this.centerY-this.centerY/4+this.centerY/40+this.offset1);
        this.ctx.lineTo(this.centerX+this.centerX/5,this.centerY-this.centerY/4+this.centerY/40+this.offset1);
        this.ctx.stroke();

        // Draw scoreboard player scores
        this.ctx.textAlign = "right"; this.ctx.font = "40px Helvetica Neue"; this.ctx.fillStyle = "red";
        this.youSpotX= this.centerX+this.centerX/20+30;
        this.youSpotY= this.centerY+this.centerY/20-this.centerY/12+this.offset1;
        this.ctx.fillText("You:     ",this.youSpotX,this.youSpotY);
        this.ctx.textAlign = "center";
        this.ctx.fillText("0",this.youSpotX,this.youSpotY);
        this.compSpotX= this.centerX+this.centerX/20+30;
        this.compSpotY=this.centerY+this.centerY/20+this.centerY/12+this.offset1;
        this.ctx.fillStyle = "blue";
        this.ctx.textAlign = "right";
        this.ctx.fillText("Bot:     ",this.compSpotX,this.compSpotY);
        this.ctx.textAlign = "center";
        this.ctx.fillText("0",this.compSpotX,this.compSpotY);

        // Draw green start line
        this.ctx.beginPath(); this.ctx.strokeStyle="#00FF00"; this.ctx.lineWidth= 1;
        this.ctx.moveTo(this.centerX-this.circOffset,this.centerY-this.radBig);
        this.ctx.lineTo(this.centerX-this.circOffset,this.centerY-this.radSmall);
        this.ctx.stroke();

        // Draw Red Racer
        this.ctx.beginPath();
        this.ctx.arc(this.centerX-this.circOffset,this.centerY-this.radRed,this.radRacer, 0,Math.PI*2);
        this.ctx.fillStyle = 'red'; this.ctx.fill();
        this.ctx.lineWidth = 0.01;
        this.ctx.stroke();

        // Draw Blue Racer
        this.ctx.beginPath();
        this.ctx.arc(this.centerX-this.circOffset,this.centerY-this.radBlue,this.radRacer, 0,Math.PI*2);
        this.ctx.fillStyle = 'blue'; this.ctx.fill();
        this.ctx.lineWidth = 0.01;
        this.ctx.stroke();

        // Timer Lines on Right Side
        this.ctx.beginPath();
        this.ctx.lineWidth=2; this.ctx.strokeStyle="black";
        this.ctx.moveTo(this.centerX+156,this.centerY+this.centerY/3-10);
        this.ctx.lineTo(this.centerX+185,this.centerY+this.centerY/3-10);
        this.ctx.stroke(); this.ctx.beginPath();
        this.ctx.moveTo(this.centerX+156,this.centerY+this.centerY/3-175);
        this.ctx.lineTo(this.centerX+185,this.centerY+this.centerY/3-175);
        this.ctx.stroke(); this.ctx.beginPath();
        this.ctx.moveTo(this.centerX+150,this.centerY+this.centerY/3-180);
        this.ctx.lineTo(this.centerX+191,this.centerY+this.centerY/3-180);
        this.ctx.stroke(); this.ctx.beginPath();
        this.ctx.moveTo(this.centerX+150,this.centerY+this.centerY/3-5);
        this.ctx.lineTo(this.centerX+191,this.centerY+this.centerY/3-5);
        this.ctx.stroke();

        // Timer lines 2
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX-156,this.centerY+this.centerY/3-10);
        this.ctx.lineTo(this.centerX-185,this.centerY+this.centerY/3-10);
        this.ctx.stroke(); this.ctx.beginPath();
        this.ctx.moveTo(this.centerX-156,this.centerY+this.centerY/3-175);
        this.ctx.lineTo(this.centerX-185,this.centerY+this.centerY/3-175);
        this.ctx.stroke(); this.ctx.beginPath();
        this.ctx.moveTo(this.centerX-150,this.centerY+this.centerY/3-180);
        this.ctx.lineTo(this.centerX-191,this.centerY+this.centerY/3-180);
        this.ctx.stroke(); this.ctx.beginPath();
        this.ctx.moveTo(this.centerX-150,this.centerY+this.centerY/3-5);
        this.ctx.lineTo(this.centerX-191,this.centerY+this.centerY/3-5);
        this.ctx.stroke();

        // create green timer columns
        this.ctx.fillStyle = "#00FF00";
        this.ctx.fillRect(this.centerX+160,this.centerY+this.centerY/3-12,22 ,this.barTotal*this.barIncrem);
        this.ctx.fillRect(this.centerX-159,this.centerY+this.centerY/3-12,-22 ,this.barTotal*this.barIncrem);

        this.setupCars();  //<-- sets up car paths, Creates: blueX,blueY,blueCount,redX,redY,redCount
        };



      ///////////////////////////////////
     // Create the paths of the Racers  (note: this function is called within drawTrack)
    ///////////////////////////////////
    this.setupCars= function(){

        // setup initial parameters
        var circumTrack = 2* Math.PI*this.radBig + 2* 2*this.circOffset;
        var dragRatio = 2*this.circOffset / circumTrack;
        var turnRatio = Math.PI*this.radBig / circumTrack;
        var numDragSteps = Math.floor(this.gameLen *dragRatio);
        var numTurnSteps = Math.ceil(this.gameLen *turnRatio);

        // calculating the X & Y locations of the steps on the top drag of the track for both cars
        var blueTopDragY = []; var redTopDragY = []; var blueBottomDragY = []; var redBottomDragY = [];
        for( i=0; i<numDragSteps; i++){
            blueTopDragY.push(this.centerY-this.radBlue);
            redTopDragY.push(this.centerY-this.radRed);
            blueBottomDragY.push(this.centerY+this.radBlue);
            redBottomDragY.push( this.centerY + this.radRed);
        }
        // calculating the X & Y locations of the steps on the bottom drag of the track for both cars
        var dragStep =  2*this.circOffset /numDragSteps;
        var blueTopDragX = []; var redTopDragX = []; var blueBottomDragX = []; var redBottomDragX = [];
        var dragStart = this.centerX- this.circOffset;
        for( i=0; i<numDragSteps; i++){
            blueTopDragX.push(dragStart);
            redTopDragX.push(dragStart);
            redBottomDragX.unshift(dragStart + dragStep);
            blueBottomDragX.unshift(dragStart + dragStep);
            dragStart += dragStep;
        }

        // calculating the X & Y locations of the steps for the left and right turns of the track for both cars
        var turnStep = 2*Math.PI / (numTurnSteps*2); var redTurnX= []; var redTurnY= [];
        var blueTurnX = []; var blueTurnY = []; var turnStart = 0;
        for( i=0; i<numTurnSteps*2; i++){
            redTurnX.push( this.centerX + this.radRed * Math.cos(turnStart-Math.PI/2) );
            redTurnY.push( this.centerY + this.radRed * Math.sin(turnStart-Math.PI/2) );
            blueTurnX.push( this.centerX + this.radBlue * Math.cos(turnStart-Math.PI/2) );
            blueTurnY.push( this.centerY + this.radBlue * Math.sin(turnStart-Math.PI/2) )
            turnStart += turnStep
        }
        var redRightTurnX = redTurnX.splice(0,numTurnSteps);
        var redLeftTurnX = redTurnX;
        var redRightTurnY = redTurnY.splice(0,numTurnSteps);
        var redLeftTurnY = redTurnY;
        var blueRightTurnX = blueTurnX.splice(0,numTurnSteps);
        var blueLeftTurnX = blueTurnX;
        var blueRightTurnY = blueTurnY.splice(0,numTurnSteps);
        var blueLeftTurnY = blueTurnY;
        for(i=0; i<numTurnSteps;i++ ){
            redLeftTurnX[i] -= this.circOffset;
            redRightTurnX[i] += this.circOffset;
            blueLeftTurnX[i] -= this.circOffset;
            blueRightTurnX[i] += this.circOffset;
        }

        // We save the X & Y locations of both cars for all steps, we also create counts for the cars
        this.blueX = blueTopDragX.concat(blueRightTurnX,blueBottomDragX,blueLeftTurnX)
        this.blueY = blueTopDragY.concat(blueRightTurnY,blueBottomDragY,blueLeftTurnY)
        this.redX = redTopDragX.concat(redRightTurnX,redBottomDragX,redLeftTurnX)
        this.redY = redTopDragY.concat(redRightTurnY,redBottomDragY,redLeftTurnY)
    };


      ///////////////////////////////////
     //    Move A Car
    ///////////////////////////////////
    this.moveCar= function(redCount,blueCount, moveColor){
        // setup function for moving either red car or blue car
        if(moveColor=="red"){
            moveX=this.redX;  moveY=this.redY;  moveCount=redCount;  scoreX=this.youSpotX; scoreY=this.youSpotY;
            stayX=this.blueX; stayY=this.blueY; stayCount=blueCount; stayColor="blue"
        }else{
            moveX=this.blueX; moveY=this.blueY; moveCount=blueCount; scoreX=this.compSpotX; scoreY=this.compSpotY;
            stayX=this.redX;  stayY=this.redY;  stayCount=redCount;  stayColor="red"
        }
        // white out (aka: delete) old car location
        this.ctx.beginPath();
        this.ctx.arc(moveX[moveCount],moveY[moveCount],this.radRacer +1,0,Math.PI*2);   this.ctx.fillStyle= 'white';
        this.ctx.fill();

        // special case for when a car is still on green start line
        if(moveCount ==0){
            this.ctx.beginPath();
            this.ctx.strokeStyle="#00FF00"; this.ctx.lineWidth= 1;
            this.ctx.moveTo(this.centerX-this.circOffset,this.centerY-this.radBig);
            this.ctx.lineTo(this.centerX-this.circOffset,this.centerY-this.radSmall);
            this.ctx.stroke();
            if(stayCount==0){  //<-- if staying car is still on top of green line
                this.ctx.beginPath();
                this.ctx.arc(stayX[stayCount],stayY[stayCount],this.radRacer,0,Math.PI*2);
                this.ctx.fillStyle = stayColor;
                this.ctx.fill();
            }
        }
        moveCount += 1;

        // draw car at new location
        this.ctx.beginPath();
        this.ctx.arc(moveX[moveCount],moveY[moveCount],this.radRacer,0,Math.PI*2);
        this.ctx.fillStyle = moveColor; this.ctx.fill();
        this.ctx.lineWidth = 0.01; this.ctx.stroke();

        // white out (delete) old score on scoreboard. Then add new score to scoreboard.
        this.ctx.beginPath();
        this.ctx.rect(scoreX-this.centerX/10,scoreY-this.centerY/7,2*this.centerX/11,2*this.centerY/13);
        this.ctx.fillStyle="white"; this.ctx.fill();
        this.ctx.textAlign = "center"; this.ctx.font = "40px Helvetica Neue"; this.ctx.fillStyle = moveColor;
        this.ctx.fillText(moveCount,scoreX,scoreY);
    };


      ///////////////////////////
     //   Do Final Move
    ///////////////////////////
    this.moveFinal= function(color){
        if(color=="red"){
            X=this.redX[0]; Y=this.redY[0];
        }else{
            X=this.blueX[0]; Y=this.blueY[0]; }
        this.ctx.beginPath();
        this.ctx.arc(X,Y,this.radRacer,0,Math.PI*2);
        this.ctx.lineWidth = .01; this.ctx.fillStyle = color;
        this.ctx.fill();
    };


      ///////////////////////////
     // Update Timer Columns
    ///////////////////////////
    this.updateTimer= function(time, redCount){
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(this.centerX+159,this.centerY+this.centerY/3-12,24 ,this.barLength-1);
        this.ctx.fillRect(this.centerX-159,this.centerY+this.centerY/3-12, -24 ,this.barLength-1);

        if( time > this.barTotal*2/3){
            this.ctx.fillStyle = "#00FF00";
        }else if( time > this.barTotal*1/3){
            this.ctx.fillStyle = "#f9f906";
        }else{
            this.ctx.fillStyle = "#ff5c33";
        }

        this.ctx.fillRect(this.centerX+160,this.centerY+this.centerY/3-12,22 ,time*this.barIncrem);
        this.ctx.fillRect(this.centerX-159,this.centerY+this.centerY/3-12, -22 ,time*this.barIncrem);

        if(time < 4){   //<-- the following code makes the users car "flash" when time is low
            this.ctx.beginPath();
            this.ctx.arc(this.redX[redCount],this.redY[redCount],this.radRacer +1,0,Math.PI*2);
            this.ctx.fillStyle = 'white'; this.ctx.fill();

            var that=this; setTimeout(function(){
                that.ctx.beginPath();
                that.ctx.arc(that.redX[redCount],that.redY[redCount],that.radRacer,0,Math.PI*2);
                that.ctx.fillStyle = 'red'; that.ctx.fill();
                that.ctx.lineWidth = 0.01; that.ctx.stroke();
                }, 250)
        }
    };



      ///////////////////////////
     //   Write Large Message over Canvas
    ///////////////////////////
    this.introWord= function(word){
        this.ctx.fillStyle = "white";            this.ctx.fillRect(0,0, this.canvasWidth, this.canvasHeight);
        this.ctx.lineWidth=1;                    this.ctx.textAlign = "center";
        this.ctx.font = "70px Helvetica Neue";   this.ctx.fillStyle = "rgb(50,50,50)";
        this.ctx.fillText(word, this.centerX,this.centerY);
    };

}









