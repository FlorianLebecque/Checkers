class Path{
    constructor(origin_,to_){
        this.origin = origin_;
        this.to = to_;
        this.child = [];
        this.middle = null;
    }

    toString(){
        return this.origin + " -> " + this.to + " | " + this.child.length+" | "+this.middle;
    }

    Display(grid_width){
        rectMode(CORNER);

        for(let i = 0 ; i < this.child.length ; i++){
            this.child[i].Display(grid_width);
        }
    
        if(this.child.length > 0){
            fill(100,0,0,100);
        }else{
            fill(0,255,0,100);
            
        }
        
        let m = this.to;
        rect(m[0] * grid_width, m[1]* grid_width, grid_width, grid_width);

    }

    length(){
        let count = this.child.length;

        if(this.middle !== null){
            count+=1;
        }

        for(let i = 0; i < this.child.length;i++){

            count += this.child[i].length();
        }
        return count;
    }

    /**
     * Keep only the longest path
     */
    Filter(){
        let KeepPath = [];
        let Max = 0;

       
        for(let i = 0; i < this.child.length;i++){
            this.child[i].Filter();
            let score = this.child[i].length();

            if(score > Max){
                KeepPath = [this.child[i]];
                Max = score;
            }else if (score === Max){
                KeepPath.push(this.child[i]);
            }

            
        }

        this.child = KeepPath;

    }

    GetPathToTarget(target){

        let pathWay = []

        for(let i = 0; i < this.child.length;i++){

            let test = this.child[i].GetPathToTarget(target);

            if(test  !== null){
                pathWay.push(this);
                pathWay = pathWay.concat(test);
                return pathWay;
            }

        }

        if((this.to[0]  === target[0])&&(this.to[1]===target[1])){
            pathWay.push(this);
            return pathWay;
        }else{
            return null;
        }

    }

}