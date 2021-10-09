function generate_user_list() {
    let list_elem = document.querySelector('#users-list');

    db.gun.get('users').map().once(user=>{
        let line = document.createElement('li');
        line.title = user.pub;
        line.textContent = user.alias + " " + user.pub.slice(0, 5);
        list_elem.appendChild(line);
    });
}

window.addEventListener('load', ()=>{generate_user_list()});
