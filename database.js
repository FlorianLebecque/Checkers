class Database {
    constructor() {
        this.on_login = [];
        this.gun = Gun(['bachelay.eu:8764/gun']);
    }

    init() {
        this.gun.on('auth', (v) => this.onLogin(v));
        this.user = this.gun.user();
        this.user.recall({sessionStorage: true});
    }

    onLogin(ack) {
        const login_form = document.querySelector('#login-form');
        if (login_form)
            login_form.classList.add('hidden');

        this.gun.get(ack.get).once(user => {
            msg.addMessage('Logged in as ' + user.alias + ' ' + user.pub.slice(0, 5), 'info');
        });

        let login_link = document.querySelector('nav .login');
        login_link.textContent = "Logout"

        // logout
        login_link.addEventListener('click', (e) => {
            while (db.user._.sea)
                db.user.leave();

            window.location.reload();
        }, {once: true});

        for (let i = this.on_login.length-1; i>=0; i--) {
            this.on_login[i](ack);
        }
    }

    sign_up(username, password, cb) {
        this.user.create(username, password, (ack) => {
            if (ack.pub) {
                let in_list = this.gun.get('users').set({
                    alias: username,
                    pub: ack.pub
                });
                this.user.get('in-list').put(in_list);
            }
            cb(ack);
        });
    }

    login(username, password, cb) {
        this.user.auth(username, password, cb);
    }
}

window.db = new Database();

window.addEventListener('load', ()=>{
    db.init();
});
