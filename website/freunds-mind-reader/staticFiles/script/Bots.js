






  ///////////////////////////////
 //   Confirm a Decision
///////////////////////////////
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







  ///////////////////////////////
 //         Bots Page
///////////////////////////////
function Bots() {


      ///////////////////////////////
     //      Initialize Stuff
    ///////////////////////////////
    //this.currentBot = "None";
    this.starter = true;
    this.anonymous = document.getElementById('anonymous_old').value ;
    this.speed= null; this.difficulty= null; this.bet=null;

      ///////////////////////////////
     //    Create Submission Form
    ///////////////////////////////
    this.htmlCreator= function(){
        $("body").append(
            '<form id="startForm"  role="form" method="post"> \
                <input  type="hidden" name="userID" value="" class="form-control" id="userID"> \
                <input  type="hidden" name="speed" value="" class="form-control" id="speed"> \
                <input  type="hidden" name="difficulty" value="" class="form-control" id="difficulty"> \
                <input  type="hidden" name="bet" value="" class="form-control" id="bet"> \
                <input  type="hidden" name="anonymous" value="" class="form-control" id="anonymous"> \
                <input  type="hidden" name="result" value="" class="form-control" id="result"> \
            </form>'
        );
    };
    // <input  type="hidden" name="speed" value="" class="form-control" id="speed"> \
    // <input  type="hidden" name="difficulty" value="" class="form-control" id="difficulty"> \


      ///////////////////////////////
     //    Display Bot info When Clicked
    ///////////////////////////////
    this.botClicked = function( difficulty, speed, bet ){
        if( this.starter ){
            this.starter= false;
            document.getElementById('starter').className = "hidden";
            document.getElementById('gameSettings').className = "";
        }
        document.getElementById('td_difficulty').innerHTML = difficulty;
        document.getElementById('td_speed').innerHTML = speed;
        document.getElementById('td_bet').innerHTML = bet+" points";
        document.getElementById('startButton').className = "btn btn-lg btn-success";

        this.difficulty=difficulty; this.speed=speed; this.bet=bet;

        //console.log(difficulty) //console.log(speed)
    };

      ///////////////////////////////
     //    Display Bot info When Clicked *** for GREY SQUARE ***
    ///////////////////////////////
    this.greyClicked = function( difficulty, speed, bet ){
        if( this.starter ){
            this.starter= false;
            document.getElementById('starter').className = "hidden";
            document.getElementById('gameSettings').className = "";
        }
        document.getElementById('td_difficulty').innerHTML = difficulty;
        document.getElementById('td_speed').innerHTML = speed;
        document.getElementById('td_bet').innerHTML = bet+" points";
        document.getElementById('startButton').className = "hidden";

        this.difficulty=difficulty; this.speed=speed; this.bet=bet;

        //console.log(difficulty) //console.log(speed)
    };


      ///////////////////////////////
     //    Submit Start Game Form
    ///////////////////////////////
    this.startClicked= function() {
        var thisBot=this;
        this.htmlCreator();
        // If user has an account we secretly record their info
        FB.api('/me?fields=id,name,link,picture,friends,friendlists', function (response) {
            if (response && !response.error && response.name != undefined) {
                //thisMain.htmlCreator();
                //console.log("below is the response class for user")  // console.log(response)
                document.getElementById('userID').value = response.id;
                document.getElementById("result").value = "Game";
                document.getElementById("speed").value = thisBot.speed;
                document.getElementById("difficulty").value = thisBot.difficulty;
                document.getElementById("bet").value = thisBot.bet;
                document.getElementById("anonymous").value = thisBot.anonymous;
                document.getElementById("startForm").submit();
            }
        });
        document.getElementById('userID').value = "anonymous";
        document.getElementById("anonymous").value = thisBot.anonymous;

        // CHANGED FOR DEBUGGING ONLY  //
        // document.getElementById('userID').value = "anonymous";
        //document.getElementById("anonymous").value = "false";

        document.getElementById("result").value = "Game";
        document.getElementById("speed").value = thisBot.speed;
        document.getElementById("difficulty").value = thisBot.difficulty;
        document.getElementById("bet").value = thisBot.bet;
        document.getElementById("startForm").submit();
    };

}













