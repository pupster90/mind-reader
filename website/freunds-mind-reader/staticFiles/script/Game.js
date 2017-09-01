
// REQUIRED FILES:
// RaceTrack.js, CtxTree, TreeExperts, Hedge, AI
// FB.js <-- ?is it?




// Class that controls video game

function Game() {

      ///////////////////////////////
     //   Initialize Constants
    ///////////////////////////////
    {
        //   create objects
        var track = new RaceTrack();
        var ai    = new AI();
        this.millis = parseInt(document.getElementById('millis').value);
        //console.log("inside AI class");
        //console.log("millis");
        //console.log(this.millis);

        //   Map Keys       <-- ** I don't know what this does....
        $("#button1").mouseup(function(){ $(this).blur();     });
        $("#button0").mouseup(function(){  $(this).blur();    });
        $("#cheatButton").mouseup(function(){ $(this).blur(); });
        window.addEventListener("keydown", function(e) {   //<-- space and arrow keys
        if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) { e.preventDefault();  }  }, false);

        // Load Constants
        this.time= 21; this.timeOut= false;
        this.youPastMoves = []; this.compPastMoves = [];
        this.gameLen=100; this.compScore=0; this.playerScore=0;
        this.compMove = ai.start();
        this.didCheat = 0 ;    //<-- 0 means didn't cheat
    };



      ///////////////////////////////
     //     Code That Starts Game
    ///////////////////////////////
    this.start= function(){
        setTimeout(function(){ track.introWord("Ready?")}, 500);
        setTimeout(function(){
            document.getElementById("controlConsole").className = "col-xs-12 col-md-4";
            track.introWord("Set...")}, 1500);
        setTimeout(function(){track.introWord("Go!")}, 2500);

        var that= this; setTimeout(function(){
            track.drawTrack();
            track.updateTimer(that.time, that.playerScore);

            $(function() { $(document).keydown(function(e) {
                switch(e.which) {
                    case 37: // left arrow
                        $("#button1").trigger("click"); break;
                    case 39: // right arrow
                        $("#button0").trigger("click"); break;
                    case 67: // "C"
                        $("#cheatButton").trigger("click"); break;
                } }); });

            var myVar = setInterval( function(){
                if(that.timeOut){return}
                if(that.time<1){
                    that.timeOut=true;
                    that.post();
                }
                that.time -= 1;
                track.updateTimer(that.time, that.playerScore);
            }, that.millis);
        }, 3500);
    };



      ///////////////////////////////
     //   Cheat Clicked
    ///////////////////////////////
    this.cheatClicked= function(){
        if(this.compMove==1){
            document.getElementById('compGuess').innerHTML = 'Bot Will Guess:    '+
                '<span class="glyphicon glyphicon-triangle-right" style="font-size: 19px;"></span>';

        }else{
            document.getElementById('compGuess').innerHTML = 'Bot Will Guess:    '+
                '<span class="glyphicon glyphicon-triangle-left" style="font-size: 19px;"></span>';
        }
        this.didCheat = 1
        document.getElementById("cheatMessage").style.visibility = "visible";
    };



      ///////////////////////////////
     //    Player Chooses Move
    ///////////////////////////////
    this.numberClicked= function(num){

        if( this.playerScore >= this.gameLen || this.compScore >= this.gameLen || this.timeOut ){ return } //<-- stop user from moving after end of game

        var date = new Date();
        var currentTime = date.getTime();
        document.getElementById('times').value += ' '+currentTime;
        this.youPastMoves.push(num);
        this.compPastMoves.push(this.compMove);

        if(this.compMove === num){
            track.moveCar(this.playerScore,this.compScore, "blue");
            this.compScore += 1;
        }else{
            track.moveCar(this.playerScore,this.compScore, "red");
            this.playerScore += 1;
        }
        document.getElementById('compGuess').innerHTML = 'Bot Will Guess:';
        if( this.playerScore >= this.gameLen  || this.compScore >= this.gameLen ){
            this.post()
        }

        this.compMove = ai.predict(this.compMove,num);
        if(this.time<31){this.time+=1}
    };



      ///////////////////////////////
     //     Post Results of Finished Game
    ///////////////////////////////
    this.post= function() {
        // Create Form to that will be posted
        $("body").append( '<form id="myForm"  role="form" method="post"> \
            <input type="hidden"  name="gameID" id="gameID" value="{{gameID}}"> \
            <input  type="hidden" name="blueScoreFinal" value="12" class="form-control" id="blueScoreFinal"> \
            <input  type="hidden" name="result" value="Error" class="form-control" id="result"> \
            <input  type="hidden" name="times_new" value="" class="form-control" id="times_new"> \
            <input  type="hidden" name="youHistory" value="" class="form-control" id="youHistory"> \
            <input  type="hidden" name="compHistory" value="" class="form-control" id="compHistory"> \
        </form>');
        // <input  type="hidden" name="seed" value="" class="form-control" id="seed"> \

        document.getElementById('gameID').value  = document.getElementById('gameID_old').value;
        document.getElementById('times_new').value  = document.getElementById('times').value;

        if( this.youPastMoves.length == 0){
            this.youPastMoves.push(3);
            this.compPastMoves.push(3);
            var date = new Date();
            var currentTime = date.getTime();
            document.getElementById('times_new').value += ' '+currentTime
        }
        if(this.time<1){
            document.getElementById('result').value = "TimeOut"
        }else if(this.playerScore >= this.gameLen ){
            track.moveFinal("red")
            if( this.didCheat === 1){
                document.getElementById('result').value = "Cheater"
            }else{
                document.getElementById('result').value = "Winner"
            }
        }else{
            track.moveFinal("blue")
            if( this.didCheat === 1){
                document.getElementById('result').value = "Cheater"
            }else{
                document.getElementById('result').value = "Loser"
            }
        }

        // console.log("inside post:  2")

        document.getElementById('youHistory').value = this.youPastMoves;
        document.getElementById('compHistory').value = this.compPastMoves;
        document.getElementById("blueScoreFinal").value = this.compScore;
        document.getElementById("myForm").submit();
    }



}














