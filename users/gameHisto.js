function GetGameList() {
    let list_elem = document.querySelector('#GameList');
    list_elem.innerHTML = "<h2>Game List</h2>"
    db.gun.get('gamelist').map().once(game=>{
        

        if((game.id)&&(game.current)){
            let line = document.createElement('li');
            line.title = game.user_0 + " - "+ game.user_1;


            if(game.user_1 == "empty"){
                //add btn
            }


            let end = "";
            if(game.is_ended){
                end = " | ended"
            }


            let turn = ""
            let btn_txt = "Play"
            if(game.current == db.user.is.pub){
                turn = " | It's not your turn "
                
            }else{

                if((game.user_0 == db.user.is.pub)||(game.user_1==db.user.is.pub)){
                    turn = " | It's your turn "

                }else{
                    turn = " | spectate"
                    btn_txt = "Spectate"
                }
                
            }
        

            if(game.user_0 == db.user.is.pub){
                db.gun.user(game.user_1).once((u) => {
                    line.textContent = u.alias + ' ' + u.pub.slice(0, 5) + " | "+game.id.slice(0,5)+turn+end;
                });
            }else{
                db.gun.user(game.user_0).once((u) => {
                    line.textContent = u.alias + ' ' + u.pub.slice(0, 5) + " | "+game.id.slice(0,5)+turn+end;
                });
            }

            

    
            list_elem.appendChild(line);
            
            let discuss_btn = document.createElement('button');
            discuss_btn.textContent = btn_txt;
            discuss_btn.addEventListener('click', (e) => {
                document.location.href = "game.html?p="+game.id;
            });
            list_elem.appendChild(discuss_btn);
        }

        
        
    });
}

window.addEventListener('load', ()=>{GetGameList()});

//setInterval(GetGameList,1000)

function CreateGame(player_1_key){
    let checker = new Checker(db.user.is.pub,player_1_key);

    let game = {
        checker : JSON.stringify(checker),
        ended   : checker.is_ended,
        user_0  : checker.user[0],
        user_1  : checker.user[1],
        id      : checker.id,
        current : checker.current
    }

    db.gun.get('gamelist').get(checker.id).put(game,()=>{
        document.location.href = "game.html?p="+checker.id;
    });

    
}




//db.user.get('conversations').get(this.with_pub).map().on((m, i) => this.receiveMessage(m, i));