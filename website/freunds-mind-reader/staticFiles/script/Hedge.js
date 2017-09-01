

  ////////////////////////////////////
 ///////    Hedge Equation     //////
////////////////////////////////////


Hedge = function(experts) {

    ////////////////////////////////////////////
    ///////    Mathy Helper functions     //////
    ////////////////////////////////////////////
    {
    //functions F, U are taken directly from "experts" paper.
    this.U= function(q) { return 1 - (1 - this.beta) * q };

    this.F= function(r) {
        if (r <= 0.5 - this.cbeta) {
            return 0
        } else if (r <= 0.5 + this.cbeta) {
            return .5 - (1 - 2 * r) / (4 * this.cbeta)
        } else {
            return 1
        }
    };
    // function ginv(x) is equal to g(1/x) given in "experts" paper.
    this.ginv= function (x){  return 1 + 2 * x - 2 * Math.sqrt(x * x + x);   };

    // compute_beta computes the values of beta, gamm and cbeta to be used.
    //      *NOTE: this statement is NOT TRUE anymore, the function just computes/returns cbeta. The other values were constants
    this.compute_beta= function (beta) { return (beta == 1.0)? 0.5: (1. + beta) * Math.log(2. / (1. + beta)) / (2. * (1. - beta));  };
    }


      ////////////////////////////////////////////
     ///////    Initialize Stuff           //////
    ////////////////////////////////////////////
    {
    // WE initialize the mathy parameters here
    this.experts= experts;
    this.gamm=1.0; this.gameLen=100; this.num_trials= 2*this.gameLen-1;     // var loss = 0.0;
    this.beta = this.ginv(2 * Math.log( this.experts.length)/this.num_trials);
    this.cbeta= this.compute_beta(this.beta);

    // We initialize arrays that store weights, loss, and the like
    this.weight=[]; this.exp_loss=[]; this.gweight=[]; this.pred=[];
    for( i=0; i<this.experts.length; i++ ) {
        this.weight[i] = 1.0; this.exp_loss[i] = 0.0;
    }
    console.log("initial weight: "); console.log(this.weight);
    }


      //////////////////////////////////////////////////////////
     ///////    Return Predicted as Probability          //////
    //////////////////////////////////////////////////////////
    this.get_experts_pred= function(){
        var sw = 0; var pw = 0;
        for( i=0; i< this.experts.length; i++){
            this.gweight[i]= Math.pow(this.weight[i], this.gamm);  //print( "new gweight["+i+"]["+j+"]="+(gweight[i][j])  )
            sw += this.gweight[i];
            this.pred[i]= this.experts[i].PREDICTION();
            pw += this.gweight[i] * this.pred[i];
        }
        //console.log( [pw,sw,this.F(pw/sw)] );
        //onsole.log("weight: "); console.log(this.weight);
        //console.log("gweight: ");console.log(this.gweight);
        //console.log("pred: ");   console.log(this.pred);
        return this.F(pw/sw);
    };


      ////////////////////////////////////////
     ///////   Update Experts          //////
    /////////////////////////////////////////
    this.update_experts= function (p,y){
        var q;
        for (i = 0; i < this.experts.length; i++) {
            this.experts[i].UPDATE(2*p+y);
            q = Math.abs(this.pred[i] - y);
            this.exp_loss[i] += q;
            this.weight[i] = this.gweight[i] * this.U(q);
        }
    };

};