function generate_user_list() {
    let list_elem = document.querySelector('#users-list');

    db.gun.get('users').map().once(user=>{

        //if(user.pub != db.user.is.pub){

            let line = document.createElement('tr');

            let pub_col = document.createElement('td');
            pub_col.textContent = user.pub.slice(0,5);

            let name_col = document.createElement('td');
            name_col.textContent = user.alias

            


            let disc_col = document.createElement('td');
            let discuss_btn = document.createElement('button');
            discuss_btn.classList.add("btn");
            discuss_btn.classList.add("btn-outline-secondary");
            discuss_btn.textContent = "Start conversation";
            discuss_btn.addEventListener('click', (e) => {
                window.conversations.openConversationWith(user.pub);
            });

            disc_col.appendChild(discuss_btn);

            let play_col = document.createElement('td');
            let play_btn = document.createElement('button');
            play_btn.classList.add("btn");
            play_btn.classList.add("btn-outline-primary");
            play_btn.textContent = "Start new game";
            play_btn.addEventListener('click', (e) => {
                CreateGame(user.pub)
            });
            play_col.appendChild(play_btn);

            line.appendChild(pub_col);
            line.appendChild(name_col);
            line.appendChild(disc_col);
            line.appendChild(play_col);

            list_elem.appendChild(line);
        //}
    });
}

window.addEventListener('load', ()=>{generate_user_list()});