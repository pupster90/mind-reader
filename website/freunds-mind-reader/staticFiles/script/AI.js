// Required Imports:
// CtxTree, Hedge, TreeExperts



    ////////////////////////////////////////////
   ////////////////////////////////////////////
  ///        Prediction Equations         ////
 ////////////////////////////////////////////
////////////////////////////////////////////


AI = function( max_depth=0 ){
    // This if statement is necessary because sometimes the function is called by the website by "AI()" ,
    // and other times it is called on the backend for game simulations with "AI(200)"
    if (max_depth == 0) {
        this.max_depth = parseInt(document.getElementById('depth').value);
    } else {
        this.max_depth = max_depth;
    };
    
    
    //console.log("inside AI class");
    //console.log("max depth:");
    //console.log(this.max_depth);

    this.expert = new TreeExpert_OG(this.max_depth);
    this.expProbs=  [];

    this.start= function(){
        var expProb = this.expert.PREDICTION();
        this.expProbs.push(expProb);      //loss += Math.abs(expPred - human_guess)
        return (Math.random()>expProb)? 0:1; //<-- condensed if/else.  Returns computers binary guess of players move
    };

    this.predict= function(compGuess,humanGuess, freezeWeights=false ){
        this.expert.UPDATE(2*compGuess+humanGuess, freezeWeights);
        var expProb = this.expert.PREDICTION();
        //console.log(expProb)                       //<-- DEBUGGING: prints probability of selecting 1
        this.expProbs.push(expProb);      //loss += Math.abs(expPred - human_guess)

        return (.5>expProb)? 0:1;   //<-- DEBUGGING: remove the randomness from the prediction
        // return (Math.random()>expProb)? 0:1; //<-- condensed if/else.  Returns computers binary guess of players move
    };
};






















