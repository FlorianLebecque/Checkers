function GetGameList() {
    let list_elem = document.querySelector('#GameList');

    db.gun.get('gamelist').map().once(game_str=>{
        let game = JSON.parse(game_str)

        let line = document.createElement('li');
        line.title = game.user_0 + " - "+ game.user_1;


        if(game.user_1 == "empty"){
            //add btn
        }

        //line.textContent = user.alias + " " + user.pub.slice(0, 5);
        list_elem.appendChild(line);
        /*
        let discuss_btn = document.createElement('button');
        discuss_btn.textContent = "Play";
        discuss_btn.addEventListener('click', (e) => {
            window.conversations.openConversationWith(user.pub);
        });
        list_elem.appendChild(discuss_btn);
        */
    });
}

window.addEventListener('load', ()=>{GetGameList()});