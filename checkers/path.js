class Path{
    constructor(origin_,to_){
        this.origin = origin_;
        this.to = to_;
        this.child = [];
        this.middle = null;
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


    AddChild(nPath){
        this.child.push(nPath);
    }
}