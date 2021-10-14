let color_background;
let grid_1;
let grid_2;


let gameId = getUrlVars()["p"]


function load(){
    db.gun.get("gamelist").get(gameId).once(game=>{

        if(!checker){
            let game_checker = JSON.parse(game.checker)
            checker = Checker.Recreate(game_checker);
        }else{
            if(!checker.selectedPiece){
                let game_checker = JSON.parse(game.checker)
                checker = Checker.Recreate(game_checker);
            }
        }

        
        
    });
}   
load()
setInterval(load,1000)



var checker = {
    Initialized  : false,
    dummy        : true
};

function setup() {
    let canvas = createCanvas(800, 800);
    canvas.parent("gameArea");

    color_background = color(67, 80, 96);
    grid_1 = color_background;
    grid_2 = color(220);

}
  
function draw() {
    background(color_background);

    if(checker){
        if(checker.Initialized){
            checker.Display();

        }else{
            if(!checker.hasOwnProperty("dummy")){
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
            }else{
                checker.SelectPieces()
            }
            
        }else{
            checker.SelectPieces()
        }
        
    }

}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}