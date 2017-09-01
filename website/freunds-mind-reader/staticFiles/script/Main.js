
// REQUIRED FILES:
// main.html
// FB.js


// this file runs the code that occurs when a user clicks a buttons in main.html


// the window.confirm and window.alert are helper functions that exist outside of the class,
//      they create modal forms for hte user to see



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
 //     Alert User
///////////////////////////////
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





function Main() {

      ///////////////////////////////
     //    Create Submission Form
    ///////////////////////////////
    this.htmlCreator= function(){
        $("body").append(
            '<form id="startForm"  role="form" method="post"> \
                <input  type="hidden" name="userID" value="" class="form-control" id="userID"> \
                <input  type="hidden" name="username" value="" class="form-control" id="username"> \
                <input  type="hidden" name="result" value="" class="form-control" id="result"> \
                <input  type="hidden" name="picture" value="" class="form-control" id="picture"> \
                <input  type="hidden" name="homeUrl" value="" class="form-control" id="homeUrl"> \
                <input  type="hidden" name="anonymous" value="" class="form-control" id="anonymous"> \
            </form>'
        );
    };


      ///////////////////////////////
     //    Start Button Click
    ///////////////////////////////
    this.startClicked= function() {
        this.htmlCreator();
        var thisMain=this;
        FB.api('/me?fields=id,name,link,picture,friends,friendlists', function (response) {
            if (response && !response.error && response.name != undefined) {
                thisMain.htmlCreator();
                //console.log("below is the response class for user")  // console.log(response)
                document.getElementById('username').value = response.name;
                document.getElementById('userID').value = response.id;
                document.getElementById('picture').value = response.picture.data.url;
                document.getElementById('homeUrl').value = response.link;
                document.getElementById("result").value = "Bots";
                document.getElementById("anonymous").value = "false";
                document.getElementById("startForm").submit();
                return
            }
        });
        document.getElementById("anonymous").value = "true";
        document.getElementById('userID').value = "anonymous";
        document.getElementById('username').value =  "anonymous";
        // For Test and Debugging, Create fake user:
        //document.getElementById("anonymous").value = "false";
        //document.getElementById('userID').value = "billy";
        //document.getElementById('username').value =  "billy";
        document.getElementById('picture').value = "anonymous";
        document.getElementById('homeUrl').value = "anonymous";
        document.getElementById("result").value = "Bots";
        document.getElementById("startForm").submit();
    };




      ///////////////////////////////
     //    Beginner Button Click
    ///////////////////////////////
    this.beginnerClicked= function() {
        this.htmlCreator();

        document.getElementById("anonymous").value = "true";
        document.getElementById('userID').value = "anonymous";
        document.getElementById('username').value =  "anonymous";
        // For Test and Debugging, Create fake user:
        //document.getElementById("anonymous").value = "false";
        //document.getElementById('userID').value = "billy";
        //document.getElementById('username').value =  "billy";
        document.getElementById('picture').value = "anonymous";
        document.getElementById('homeUrl').value = "anonymous";
        document.getElementById("result").value = "Beginner";
        document.getElementById("startForm").submit();
    };


      ///////////////////////////////
     //    Already Pro Click
    ///////////////////////////////
    this.alreadyProClicked= function() {
        document.getElementById('beginnerButtons').className = "hidden";
        document.getElementById('canvasBox').className = "col-xs-12 col-md-8";
        document.getElementById('welcomeScreen').className = "col-xs-12 col-md-4";

    };

      ///////////////////////////////
     //    Start Anonymous Game
    ///////////////////////////////
    //  We have a boolean variable anonymous set to true. If the use is signed in, we still record their info for the backend
    this.anonymousClicked= function(){
        this.htmlCreator();
        // If user has an account we secretly record their info
        FB.api('/me?fields=id,name,link,picture,friends,friendlists', function (response) {
            if (response && !response.error && response.name != undefined) {
                thisMain.htmlCreator();
                //console.log("below is the response class for user")  // console.log(response)
                document.getElementById('username').value = response.name;
                document.getElementById('userID').value = response.id;
                document.getElementById('picture').value = response.picture.data.url;
                document.getElementById('homeUrl').value = response.link;
                document.getElementById("result").value = "Bots";
                document.getElementById("anonymous").value = "true";
                document.getElementById("startForm").submit();
            }
        });

        // Otherwise, we truly record them as an anonymous player
        document.getElementById("anonymous").value = "true";
        document.getElementById('userID').value = "anonymous";
        document.getElementById('username').value =  "anonymous";

        // For Test and Debugging, Create fake user:
        //document.getElementById("anonymous").value = "false";
        //document.getElementById('userID').value = "billy";
        //document.getElementById('username').value =  "billy";

        document.getElementById('picture').value = "anonymous";
        document.getElementById('homeUrl').value = "anonymous";
        document.getElementById("result").value = "Bots";
        document.getElementById("startForm").submit();
    };


      ///////////////////////////////
     //    Stats Button Click
    ///////////////////////////////
    this.statsClicked= function() {
        FB.api('/me?fields=id,name,link,picture', function (response) {
            if (response && !response.error && response.name != undefined) {
                //$('#myModal').modal('show')
                userID = response.id;
                window.location.href = "/stats/?num=" + userID;
                return
            }
        });
        var message1 = "To view your game statistics, you must login to Facebook.";
        var message2 = "Your info is kept confidential. We do NOT use it for marketing";
        window.alert(message1, message2, "Please Login:")
    };

}




