




  ///////////////////////////////////
 ///////    Context Tree      //////
///////////////////////////////////

function CtxTree( beta, max_depth){


      ///////////////////////////////////
     ///////    Helper Classes   ///////
    ///////////////////////////////////
    this.TreeNode= function(depth){
        // This class represents a single node in the context tree
        this.son= [null,null];
        this.wt = [1,1];
        this.end_wt = 1;
        this.sum_wt= 1;
        this.depth = depth;
    };

    this.add_bit= function(b){
        // This creates a list of bits, stored in some weird recursive class structure
        // bit == 1 if guessed wrong, otherwise equals 0
        this.ex= {bit:b, nextBit:this.ex}
    };


      ///////////////////////////////
     //   Initialize Values
    ///////////////////////////////
    {
    this.root = new this.TreeNode(1);
    this.ex = null;
    this.beta= beta;
    this.max_depth = max_depth;
    //console.log("max depth: "+this.max_depth) //<-- DEBUGGING: print maximum depth of tree
    }


      //////////////////////////////////////////////
     ///////    Return Node Sum of Weights   //////
    //////////////////////////////////////////////
    this.get_sum_wt= function(treeNode=this.root){
          if( treeNode == null){ return 1
          }else{ return treeNode.sum_wt}
    };


      //////////////////////////////////////////////
     ///////    Get some Weigt? (recursive)  //////
    //////////////////////////////////////////////
    this.get_pred_wt= function(ex=this.ex, treeNode=this.root){
        if(treeNode.depth >= this.max_depth ){
            return 0.5* treeNode.wt[1]
        }

        if( ex == null ){
            return 0.25 * (treeNode.wt[1] + this.get_sum_wt(treeNode.son[0]) * this.get_sum_wt(treeNode.son[1]));
        }else{
            var b = ex.bit;
            if (treeNode.son[b] == null){
                treeNode.son[b] = new this.TreeNode(treeNode.depth+1);
                //console.log("new node created!")
            }
            return 0.25 * treeNode.wt[1] +
                0.5 * this.get_sum_wt(treeNode.son[1-b]) * this.get_pred_wt(ex.nextBit, treeNode.son[b]) * treeNode.end_wt;
        }
    };




      //////////////////////////////////////////////
     ///////    Update Weights (recursive)  //////
    //////////////////////////////////////////////
    this.update_wt= function(y, ex=this.ex, treeNode=this.root) {
        treeNode.wt[1 - y] *= this.beta;

        if( treeNode.depth >= this.max_depth ){
            treeNode.sum_wt = (treeNode.wt[0] + treeNode.wt[1])*.5 ;
            return
        }

        if (ex == null ){ //||   treeNode.depth >= this.max_depth ) {
            treeNode.end_wt = 0.5 * (1 + this.beta)
        } else {
            this.update_wt(y, ex.nextBit, treeNode.son[ex.bit] );
        }
        treeNode.sum_wt= 0.25*(treeNode.wt[0] + treeNode.wt[1]) +
            0.5 * this.get_sum_wt(treeNode.son[0]) * this.get_sum_wt(treeNode.son[1]) * treeNode.end_wt
    }

};





