let color_background;
let grid_1;
let grid_2;

let checker = new Checker();

function setup() {
    let canvas = createCanvas(800, 800);
    canvas.parent("gameArea");

    color_background = color(67, 80, 96);
    grid_1 = color_background;
    grid_2 = color(220);

   //frameRate(5);

    checker.Initialize();

}
  
function draw() {
    background(color_background);
    checker.Display();


    /*
    stroke(0)
    strokeWeight(5);
    point(mouseX,mouseY);

    noStroke();
    text(mouseX + "-" +mouseY,mouseX,mouseY);
*/
}

function mouseClicked() {
    
    
    if(checker.current == 0){
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