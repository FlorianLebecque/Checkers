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

        if(CurrentMove.child.length>0){
            this.Play(CurrentMove.child);
        }

        

    }

    PlayMove(){
        //find mouse position
        let mi = Math.floor(mouseX / this.grid_width);
        let mj = Math.floor(mouseY / this.grid_width);

        let CurrentMove = this.FindMove([this.selectedPiece.i,this.selectedPiece.j],[mi,mj]);
        
        if(CurrentMove){
            this.Play(CurrentMove);
        }
            
        
        
    }

    FindMove(position,target){

        let moves = this.selectedPiece.GetPath();

        for(let i = 0; i < moves.length;i++){
            if(moves[i].to[0] === target[0]&&(moves[i].to[1]===target[1])){
                return moves[i];
            }
        }
        return null;

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



    GetLastPosition(move){
        if(move.child !== null){
            return this.GetLastPosition(move.child);
        }else{
            return move.to;
        }
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


            this.moves = this.selectedPiece.GetPath()//this.GetMoves([],piece.team,[piece.i,piece.j],dir,false);
            console.log(this.moves);
        }
    }

    DisplayMove(){
        let moves = [];
        if((this.selectedPiece)&&(this.selectedPiece.selected === true)){
            moves = this.moves;
        }

        for(let i = 0 ; i < moves.length;i++){
            moves[i].Display(this.grid_width);
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