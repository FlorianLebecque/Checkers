class Checker{

    constructor(pub_key1,pub_key2){
        this.height = this.width = 800;
        this.rows = 8;
        this.grid_width = this.width / this.rows;
        this.board = [];

        const uuid = (a) => a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);

        this.user     = [pub_key1,pub_key2];
        this.current  = pub_key2;
        this.move     = []
        this.id       = uuid();
        this.is_ended = false;
        this.Initialized = false;
    }

    static Recreate(game){
        let c = new Checker(game.user[0],game.user[1])

        c.height = c.width = game.width;
        c.rows = game.rows;
        c.grid_width = c.width / c.rows;

        let b = [];

        game.board.forEach(r=>{
            let nr = []

            r.forEach(p =>{

                if(p){
                    let np = new Pieces(p.team,p.width,p.i,p.j);
                    nr.push(np)
                }else{
                    nr.push(null)
                }


            });

            b.push(nr);
        });

        c.board = b;

        
        c.user     = game.user
        c.current  = game.current;
        c.move     = game.move;
        c.id       = game.id;//uuid();
        c.is_ended = game.is_ended;
        c.Initialized = game.Initialized;

        return c
    }
    

    Initialize(){
        this.Initialized = true;
        for(let i = 0; i < this.rows;i++){
            this.board[i] = [];
            for(let j = 0; j < this.rows;j++){
                if((j < 3)&&((i+j)%2==0)){
                    this.board[i][j] = new Pieces(this.user[0],this.grid_width,i,j);
                }else if((j>=5)&&((i+j)%2==0)){
                    this.board[i][j] = new Pieces(this.user[1],this.grid_width,i,j);
                }else{
                    this.board[i][j] = null;
                }
            }
        }
    }


    Play(CurrentMove){

        let piece = new Pieces(
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
            piece.queen = (piece.j === 0 && piece.dir(this.user) === -1) || (piece.j === 7 && piece.dir(this.user) === 1);
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

        this.selectedPiece.selected = false
        this.selectedPiece = null;
        return PathArray;
    }

    FindMove(target){

        let moves = this.selectedPiece.GetPath(this.board,this.user);

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
            moves = this.selectedPiece.GetPath(this.board,this.user);
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
                    this.board[i][j].Display(this.user);
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
            user_1  : this.user[1],
            id      : this.id,
            current : this.current
        }

        db.gun.get('gamelist').get(this.id).put(game);
        db.user.get('gamelist').get(this.id).put(game);
    }

}