class Checker{

    constructor(pub_key1,pub_key2){
        this.height = this.width = 800;
        this.rows = 8;
        this.grid_width = this.width / this.rows;


        this.board = [];

        this.user    = [pub_key1,pub_key2];
        this.current = pub_key1;
        this.move    = []
        this.id      = crypto.randomUUID();
        this.is_ended = false;
    }


    Initialize(){

        for(let i = 0; i < this.rows;i++){
            this.board[i] = [];
            for(let j = 0; j < this.rows;j++){
                if((j < 3)&&((i+j)%2==0)){
                    this.board[i][j] = new Pieces(this,this.user[0],this.grid_width,i,j);
                }else if((j>=5)&&((i+j)%2==0)){
                    this.board[i][j] = new Pieces(this,this.user[1],this.grid_width,i,j);
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


        piece.queen = this.selectedPiece.queen;
        if(!piece.queen){
            piece.queen = (piece.j === 0 && piece.dir() === -1) || (piece.j === 7 && piece.dir() === 1);
        }
        

        this.board[CurrentMove.origin[0]][CurrentMove.origin[1]] = null;
        this.board[CurrentMove.to[0]][CurrentMove.to[1]] = piece;
        this.selectedPiece = piece;

        
        if(CurrentMove.middle){
            this.board[CurrentMove.middle[0]][CurrentMove.middle[1]] = null;
        }

    }

    PlayMove(){
        //find mouse position
        let mi = Math.floor(mouseX / this.grid_width);
        let mj = Math.floor(mouseY / this.grid_width);
        let target = [mi,mj];

        let PathArray = this.FindMove(target);

        if(PathArray){
            for(let i = 0 ; i < PathArray.length;i++){
                this.Play(PathArray[i]);
            }

            this.current = db.user.is.pub;
            this.move.push(PathArray)
            this.Save()
        }



        return PathArray;
    }

    FindMove(target){

        let moves = this.selectedPiece.GetPath();

        for(let i = 0; i < moves.length;i++){
            let pathArray = moves[i].GetPathToTarget(target);

            if(pathArray){
                return pathArray;
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

                            if(this.board[i][j].team == db.user.is.pub){
                                this.board[i][j].selected = true;
                                this.selectedPiece = this.board[i][j];
                                return this.board[i][j];
                            }
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

    DisplayMove(){
        let moves = [];
        if((this.selectedPiece)&&(this.selectedPiece.selected === true)){
            moves = this.selectedPiece.GetPath();
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

    Save(){

        let game = {
            checker : JSON.stringify(this),
            ended   : this.is_ended,
            user_0  : this.user[0],
            user_1  : this.user[1]
        }

        db.gun.get('gamelist').get(this.id).put(game);
        db.user.get('gamelist').get(this.id).put(game);
    }

    Join(){

    }



}