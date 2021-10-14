function generate_user_list() {
    let list_elem = document.querySelector('#users-list');

    db.gun.get('users').map().once(user=>{
        let line = document.createElement('li');
        line.title = user.pub;
        line.textContent = user.alias + " " + user.pub.slice(0, 5);
        list_elem.appendChild(line);

        let discuss_btn = document.createElement('button');
        discuss_btn.textContent = "Start conversation";
        discuss_btn.addEventListener('click', (e) => {
            window.conversations.openConversationWith(user.pub);
        });
        list_elem.appendChild(discuss_btn);
    });
}

window.addEventListener('load', ()=>{generate_user_list()});