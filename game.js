let color_background;
let grid_1;
let grid_2;

let checker = {
    Initialized : false
};

function setup() {
    let canvas = createCanvas(800, 800);
    canvas.parent("gameArea");

    color_background = color(67, 80, 96);
    grid_1 = color_background;
    grid_2 = color(220);

   //frameRate(5);

    

}
  
function draw() {
    background(color_background);

    if(checker){


        if(checker.Initialized){
            checker.Display();
        }else{
            if(checker.hasOwnProperty("Initialize")){
                checker.Initialize();
            }
        }
    }
}

function mouseClicked() {
    
    if(checker.current  !=  db.user.is.pub){
        if(checker.selectedPiece){
            if(checker.selectedPiece.selected){
                checker.PlayMove();
                checker.selectedPiece.selected = false;
            }else{
                checker.SelectPieces()
            }
            
        }else{
            checker.SelectPieces()
        }
    }

}