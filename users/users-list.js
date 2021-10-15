function generate_user_list() {
    let list_elem = document.querySelector('#users-list');

    db.gun.get('users').map().once(user=>{

        //if(user.pub != db.user.is.pub){

            let line = document.createElement('li');
            line.title = user.pub;
            line.textContent = user.alias + " " + user.pub.slice(0, 5);
            list_elem.appendChild(line);

            let discuss_btn = document.createElement('button');
            discuss_btn.textContent = "Start conversation";
            discuss_btn.addEventListener('click', (e) => {
                window.conversations.openConversationWith(user.pub);
            });

            let play_btn = document.createElement('button');
            play_btn.textContent = "Start new game";
            play_btn.addEventListener('click', (e) => {
                CreateGame(user.pub)
            });

            list_elem.appendChild(play_btn);
            list_elem.appendChild(discuss_btn);
        //}
    });
}

window.addEventListener('load', ()=>{generate_user_list()});