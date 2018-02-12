// Required Imports:
// CtxTree


// When upgrading to newer javascript, consolidate space by creating subclasses of a larger class




  /////////////////////////////////////////////////
 ///////    EXPERT: var_tree_exp_sym_py     //////
/////////////////////////////////////////////////

function TreeExpert_OG(max_depth) {
    this.BETATree= .55; this.cbetaTree= (1+this.BETATree) * Math.log(2/ (1+this.BETATree))  / (2*(1-this.BETATree)) ;
    this.tree = new CtxTree(this.BETATree, max_depth);
    this.last_y = -1; this.y = null; this.dy = null; this.p = null; this.win = null;

    // A mathy Helper function
    this.FTree= function(r) {
        if (r <= 0.5 - this.cbetaTree) { return 0
        } else if (r <= 0.5 + this.cbetaTree) { return .5 - (1 - 2 * r) / (4 * this.cbetaTree)
        } else { return 1 }
    };

    this.PREDICTION = function () {
        if (this.last_y == -1) {
            return 0.5;
        } else {
            return Math.abs(this.last_y - this.FTree( this.tree.get_pred_wt() / this.tree.get_sum_wt() ))
        }
    };
    

    // I added the "freezeWeights" parameter to schapire's code for testing stuff in the the "data analysis" section
    this.UPDATE = function(parm, freezeWeights=false) {
        this.p = parm >> 1;   //<-- Parm is 2*comp_guess + human_guess
        this.y = parm & 1;
        this.win = (this.p==this.y)? 1:0;

        if (this.last_y != -1) {
            this.dy = (this.y != this.last_y)? 1:0;
            
            if( !freezeWeights ){  //<-- by default we update the weights
                this.tree.update_wt( this.dy);
            };
            this.tree.add_bit(this.dy);
        }
        this.tree.add_bit(this.win);
        this.last_y = this.y;
        return 0
    }
    

    
    
}




  /////////////////////////////////////////////////
 ///////    EXPERT: var_tree_exp_sym_y     //////
/////////////////////////////////////////////////

function TreeExpert_Diffs(max_depth) {
    this.BETATree= .55; this.cbetaTree= (1+this.BETATree) * Math.log(2/ (1+this.BETATree))  / (2*(1-this.BETATree)) ;
    this.tree = new CtxTree(this.BETATree, max_depth);
    this.last_y = -1; this.y = null; this.dy = null;

    // A mathy Helper function
    this.FTree= function(r) {
        if (r <= 0.5 - this.cbetaTree) { return 0
        } else if (r <= 0.5 + this.cbetaTree) { return .5 - (1 - 2 * r) / (4 * this.cbetaTree)
        } else { return 1 }
    };

    this.PREDICTION = function () {
        if (this.last_y == -1) {
            return  0.5;
        } else {
            return Math.abs(this.last_y - this.FTree( this.tree.get_pred_wt() / this.tree.get_sum_wt() ))
        }
    };

    this.UPDATE = function(parm) {
        this.y = parm & 1;       //<-- Parm is 2*comp_guess + human_guess
        if (this.last_y != -1) {
            this.dy = (this.y != this.last_y)? 1:0;
            this.tree.update_wt(this.dy);
            this.tree.add_bit(this.dy);
        }
        this.last_y = this.y;
        return 0
    }
}





