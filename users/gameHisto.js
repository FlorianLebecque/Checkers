function GetGameList() {

    let list_elem = document.querySelector('#games-list');
    db.gun.get('gamelist').map().once(game=>{
        

        if((game.id)&&(game.current)){
            let table_row = document.createElement('tr');

            let name_col = document.createElement("td");


            if(game.user_1 == "empty"){
                //add btn
            }


            let end = "";
            if(game.is_ended){
                end = "ended"
            }

            let turn = ""
            let btn_txt = "Play"
            if(game.current == db.user.is.pub){
                turn = "It's not your turn "
                
            }else{

                if((game.user_0 == db.user.is.pub)||(game.user_1==db.user.is.pub)){
                    turn = "It's your turn "

                }else{
                    turn = "spectate"
                    btn_txt = "Spectate"
                }
                
            }
        

            if(game.user_0 == db.user.is.pub){
                db.gun.user(game.user_1).once((u) => {
                    name_col.textContent = u.alias + ' ' + u.pub.slice(0, 5) + " | "+game.id.slice(0,5)
                });
            }else{
                db.gun.user(game.user_0).once((u) => {
                    name_col.textContent = u.alias + ' ' + u.pub.slice(0, 5) + " | "+game.id.slice(0,5)
                });
            }

            let info_col = document.createElement("td");
            info_col.textContent = turn+end;

            let play_col = document.createElement("td");
            let discuss_btn = document.createElement('button');
            discuss_btn.classList.add("btn");
            discuss_btn.classList.add("btn-outline-primary");

            discuss_btn.textContent = btn_txt;
            discuss_btn.addEventListener('click', (e) => {
                document.location.href = "game.html?p="+game.id;
            });
            play_col.appendChild(discuss_btn);


            table_row.appendChild(name_col);
            table_row.appendChild(info_col);
            table_row.appendChild(play_col);
            list_elem.appendChild(table_row);
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