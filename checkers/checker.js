class Checker{

    constructor(){
        this.height = this.width = 800;
        this.rows = 8;
        this.grid_width = this.width / this.rows;

        this.board = [];

    }


    Initialize(){

        for(let i = 0; i < this.rows;i++){
            this.board[i] = [];
            for(let j = 0; j < this.rows;j++){
                if((j < 3)&&((i+j)%2==0)){
                    this.board[i][j] = new Pieces(this,1,this.grid_width,i,j);
                }else if((j>=5)&&((i+j)%2==0)){
                    this.board[i][j] = new Pieces(this,0,this.grid_width,i,j);
                }else{
                    this.board[i][j] = null;
                }
            }
        }
    }


    Play(CurrentMove){

        let piece = new Pieces(
            this,
            this.selectedPiece.team,
            this.selectedPiece.width,
            this.selectedPiece.hover,
            this.selectedPiece.selected,
            CurrentMove.to[0],CurrentMove.to[1]
        );

        piece.i = CurrentMove.to[0];
        piece.j = CurrentMove.to[1];


        this.board[CurrentMove.origin[0]][CurrentMove.origin[1]] = null;
        this.board[CurrentMove.to[0]][CurrentMove.to[1]] = piece;
        this.selectedPiece = piece;


        if(CurrentMove.hasOwnProperty("middle_piece")){
            this.board[CurrentMove.middle_piece[0]][CurrentMove.middle_piece[1]] = null;
        }

        if(CurrentMove.child !== null){
            this.Play(CurrentMove.child);
        }

        

    }

    PlayMove(){
        //find mouse position
        let mi = Math.floor(mouseX / this.grid_width);
        let mj = Math.floor(mouseY / this.grid_width);

        let move_id = mi+"_"+mj;
        if(this.moves.hasOwnProperty(move_id)){
            this.Play(this.moves[move_id]);
        }
        
    }

    CheckMove(target,possibilities){
        let valide = false;
        possibilities.forEach(p =>{
            if((p[0] === target[0])&&(p[1]===target[1])){
                valide = true;
            }
        })

        return valide;
    }

    SelectPieces(){
        for(let i = 0; i < this.rows;i++){
            for(let j = 0; j < this.rows;j++){

                if(this.selectedPiece){
                    this.selectedPiece.selected = false;
                }

                if(this.board[i][j]){
                    if(this.board[i][j].CheckHover(i,j)){
  
                        if(this.board[i][j].selected === false){
                            this.board[i][j].selected = true;
                            this.selectedPiece = this.board[i][j];
                            this.GetMove(this.board[i][j]);
                            return this.board[i][j];
                        }
                    }
                }

            }
        }

        return -1
    }


    GetMoves(PathTable,team,position,dir,currentPath = null){
        //check that we don't go out of the table
        if(((position[1]+dir) < 8) && ((position[1]+dir) > -1)){
            
            //Get the neighbour position
            let nPos = this.GetNeighbourPos(position,dir);

            for(let i = 0; i < nPos.length;i++){

                let p = [nPos[i][0],nPos[i][1]];

                //check if it's free or not
                if(this.board[p[0]][p[1]]){  //it's an pieces

                    if(this.board[p[0]][p[1]].team !== team){
                        
                        let di = p[0] - position[0];
                        let dj = p[1] - position[1];

                        let ni = p[0] + di;
                        let nj = p[1] + dj;

                        if(this.board[ni][nj]===null){

                            let nPath = {
                                origin:position,
                                to:[ni,nj],
                                middle_piece:p,
                                child:null
                            };

                            if(currentPath!== null){
                                this.AddToPath(nPath,currentPath);
                                this.GetMoves(PathTable,team,[ni,nj],dir,currentPath);
                            }else{
                                this.GetMoves(PathTable,team,[ni,nj],dir,nPath);
                            }

                            //add to path and recursive
                        }

                    }

                }else{  //it's free

                    let nPath = {
                        origin:position,
                        to:p,
                        child:null
                    }

                    //we need to add to the new path
                    if(currentPath === null){
                        
                        PathTable[nPath.to[0]+"_"+nPath.to[1]] = nPath;
                        //currentPath.child = nPath;  
                    }else{
                        this.AddToPath(nPath,currentPath);
                        PathTable[currentPath.to[0]+"_"+currentPath.to[1]] = currentPath;
                    }


                }
            }



            return PathTable;


        }

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

    GetMove(piece){

        let moves = [];

        if(piece){
            let dir = 0;
            switch(this.selectedPiece.team){
                case 0:
                    dir = -1
                    break;
                case 1:
                    dir = 1
                    break;
            }


            this.moves = this.GetMoves([],piece.team,[piece.i,piece.j],dir);
            console.log(this.moves);
        }
    }

    AddToPath(nPath,currentPath){

        if(currentPath.child !== null){
            currentPath.child = nPath;
        }else{
            this.AddToPath(nPath,currentPath);
        }
    }

    DisplayMove(){
        let moves = [];
        if((this.selectedPiece)&&(this.selectedPiece.selected === true)){
            moves = this.moves;
        }

        if(moves.length > 0){
            moves.forEach(m =>{
                fill(0,255,0,100);
                rectMode(CORNER);
                rect(m[0]*this.grid_width, m[1]*this.grid_width, this.grid_width, this.grid_width);
            });
        }
    }

    Display(){
        noStroke();
        
        for(let i = 0; i < this.rows;i++){
            for(let j = 0; j < this.rows;j++){
                fill(grid_2);
                if(((i+j)%2 == 0)){
                    fill(grid_1);
                }
                rectMode(CORNER);
                rect(i*this.grid_width, j*this.grid_width, this.grid_width, this.grid_width);

                if(this.board[i][j] !== null){
                    this.board[i][j].Display();
                }
            }
        }

        this.DisplayMove();
    }
}