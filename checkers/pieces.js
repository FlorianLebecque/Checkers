class Pieces{
    constructor(parent,int_team,width,i_,j_){
        this.parent = parent;
        this.team = int_team;
        this.width = width;
        this.hover = false;
        this.selected = false;
        this.i = i_;
        this.j = j_; 
    }

    x(){
        return this.i*this.width+(this.width/2);
    }
    y(){
        return this.j*this.width+(this.width/2);
    }

    dir(){
        switch(this.team){
            case 0:
                return -1;
            case 1:
                return 1;
        }
    }

    GetPath(){
        let path = this.FindSimplePath();
        path = path.concat(this.FindJumps([this.i,this.j],[]));

        for(let i = 0; i < path.length;i++){
            path[i].Filter();
        }

        let KeepPath = [];
        let Max = 0;
        for(let i = 0; i < path.length;i++){
            let score = path[i].length();

            if(score > Max){
                KeepPath = [path[i]];
                Max = score;
            }else if (score === Max){
                KeepPath.push(path[i]);
            }

            
        }

        return KeepPath;
    }


    FindSimplePath(){
        let path = [];
        let neighbour = this.GetAllNeighbour([this.i,this.j]);
        for(let i = 0 ; i < neighbour.length;i++){

            if(this.CheckPosition(neighbour[i]) === 0){ //simple path
                //must be in front
                if(neighbour[i][1]-this.j === this.dir()){
                    path.push(new Path([this.i,this.j],neighbour[i]));
                }
            }
        }
        return path;
    }

    /**
     * Return a path to a jump
     */
    FindJumps(position,checkedposition){

        if(this.In_array(position,checkedposition)){
            return [];
        }

        checkedposition.push(position);
        let neighbour = this.GetAllNeighbour(position);
        let jump = [];
        for(let i = 0; i < neighbour.length;i++){
            let np = neighbour[i];

            //test if a neighnour is in the checked list
            
                if(this.CheckPosition(np) === 2){    //check if it's a pieces
                    let n_pieces = this.parent.board[np[0]][np[1]];
                    let di = n_pieces.i - position[0];
                    let dj = n_pieces.j - position[1];
                    let ni = n_pieces.i+di;
                    let nj = n_pieces.j+dj;
    
                    if((this.In_array([ni,nj],checkedposition)===false)&&(this.CheckPosition([ni,nj])===0)){
                        let npath = new Path(position,[ni,nj]);
                        npath.middle = [n_pieces.i,n_pieces.j];
                        npath.child = this.FindJumps([ni,nj],[].concat(checkedposition));
                        jump.push(npath);
                    }
    
                }
            

        }

        return jump;
    }

    In_array(needle,haystack){
        for(let i = 0; i < haystack.length;i++){
            if((needle[0] === haystack[i][0])&&(needle[1]===haystack[i][1])){
                return true;
                
            }
        }
        return false;
    }


    /**
     * 
     * @param {Position (array [i,j]) of a pieces in the board} position 
     * @returns 0 if free, 1 is same team, 2 if opposed team, -1 out of board
     */
    CheckPosition(position){
        if((position[0] >=0)&&(position[0]<8)&&(position[1]>=0)&&(position[1]<8)){
            if(this.parent.board[position[0]][position[1]]===null){
                return 0;
            }else{
                if(this.parent.board[position[0]][position[1]].team === this.team){
                    return 1;
                }else{
                    return 2;
                }
            }
        }
        return -1
    }

    /**
     * @returns Position of a possible neightbour on the left or right
     * trans : left (-1) or right (+1) 
     */
     GetPossibleNeighbourPos(position,trans,dir){
        if((position[0]+trans >= 0)&&(position[0]+trans<8)){
            return [position[0]+trans,position[1] + dir];
        }
        return null;
    }
    /**
     * @returns Position of all the possible neightbour (array)
     */
    GetNeighbourPos(position,dir){
        let neighbourPos = [];
        let left    = this.GetPossibleNeighbourPos(position,-1,dir);
        let right   = this.GetPossibleNeighbourPos(position,1,dir);
        if(left){
            neighbourPos.push(left);
        }
        if(right){
            neighbourPos.push(right);
        }
        return neighbourPos;
    }

    GetAllNeighbour(position){
        let neighbour_1 = this.GetNeighbourPos(position,1);
        let neighbour_2 = this.GetNeighbourPos(position,-1);
        let neighbour = [];
        for(let i = 0 ; i < neighbour_1.length; i++){
            neighbour.push(neighbour_1[i]);
        }
        for(let i = 0 ; i < neighbour_2.length; i++){
            neighbour.push(neighbour_2[i]);
        }

        return neighbour;
    }

    GetLastPosition(move){
        if(move.child !== null){
            return this.GetLastPosition(move.child);
        }else{
            return move.to;
        }
    }

    CheckHover(){
        let radius = this.width*0.4;

        let dx = this.x()-mouseX;
        let dy = this.y()-mouseY;

        let dist = sqrt(
            (dx*dx)+(dy*dy)
        );

        this.hover = (dist <=radius);

        return this.hover;
    }

    Display(){

        this.CheckHover();
        switch(this.team){
            case 0:
                fill(210, 179, 162);
                break;
            case 1:
                fill(199, 138, 140);
                break;
        }     

        rectMode(RADIUS);
        rect(this.x(),this.y(),this.width*0.4,this.width*0.4,30)

        if(this.hover){
            fill(0,0,0,100);
            rect(this.x(),this.y(),this.width*0.4,this.width*0.4,30)
        }
        if(this.selected){
            fill(0,255,0,100);
            rect(this.x(),this.y(),this.width*0.4,this.width*0.4,30)
        }
    }
}