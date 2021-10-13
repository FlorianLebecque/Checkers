class LoginManager {
    constructor(){
        this.login_form = document.querySelector('#login-form');
        this.login_form.addEventListener('submit', (e) => this.onFormSubmit(e));

        const signUpBtn = document.querySelector('#sign-up');
        signUpBtn.addEventListener('click', (e) => this.onSignupSubmit(e));
    }

    getCreds() {
        let username_field = document.querySelector('#username');
        let password_field = document.querySelector('#password');

        const username = username_field.value;
        const password = password_field.value;
        password_field.value = "";

        let creds = {
            username: username,
            password: password,
            valid: true,
        };

        msg.dismissAll();

        if (!username.length) {
            msg.addMessage("Username must not be empty", 'error');
            creds.valid = false;
        }
        if (!password.length) {
            msg.addMessage("Password must not be empty", 'error');
            creds.valid = false;
        }

        return creds;
    }

    onFormSubmit(e) {
        e.preventDefault();

        const creds = this.getCreds();

        if (creds.valid) {
            db.login(creds.username, creds.password, (ack) => {
                if (ack.err) {
                    msg.addMessage(ack.err, 'error');
                } else {
                    console.log("You are now logged-in");
                    // no need for a user-facing message, it's handled by the default login handler
                }
            });
        }

        return false;
    }

    onSignupSubmit() {
        const creds = this.getCreds();
        if (creds.valid) {
            db.sign_up(creds.username, creds.password, (ack) => {
                if (ack.err) {
                    msg.addMessage(ack.err, 'error');
                } else {
                    db.login(creds.username, creds.password, (ack) => {
                        if (ack.err) {
                            msg.addMessage(ack.err, 'error');
                        } else {
                            msg.addMessage("Account creation successful, you are now logged-in", 'success');
                        }
                    });
                }
            });
        }
    }
}



window.addEventListener('load', ()=>{
    window.loginManager = new LoginManager();
});
