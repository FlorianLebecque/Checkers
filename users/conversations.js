class Conversation {
    constructor(other_pub_key, id) {
        this.with_pub = other_pub_key;
        this.with = db.gun.user(other_pub_key);
        this.id = id;

        this.element = this.buildBasics();
        conversations.conversations_div.appendChild(this.element);

        this.messages = new Map();

        this.with.get('conversations').get(db.user.is.pub).map().on((m, i) => this.receiveMessage(m, i));
        db.user.get('conversations').get(this.with_pub).map().on((m, i) => this.receiveMessage(m, i));
    }

    unfollow() {
        // do not follow this thread anymore
        let update = {};
        update[db.user.is.pub] = false;
        db.gun.get('conversations').get(this.id).put(update);
    }

    buildBasics() {
        // <article id="cnv-{{id}}">
        //     <h3>{{alias}} {{pub[:5]}}</h3>
        //     <div class="conversation">
        //         <p class="mine">Message by me</p>
        //         <p class="their">Message by Him</p>
        //     </div>
        //     <form>
        //         <input type="text" name="message"/>
        //         <input type="submit" value="Send"/>
        //     </form>
        // </article>
        let article = document.createElement('article');
        article.id = 'cnv-'+this.id;

        let h3 = document.createElement('h3');
        this.with.once((u) => {
            h3.textContent = u.alias + ' ' + u.pub.slice(0, 5);
        });
        article.appendChild(h3);

        let div = document.createElement('div');
        div.classList.add('conversation');
        article.appendChild(div);
        this.message_list = div;

        let form = document.createElement('form');

        let msg_input = document.createElement('input');
        msg_input.type = 'text';
        msg_input.name = 'message';
        form.appendChild(msg_input);

        let submit_btn = document.createElement('input');
        submit_btn.type = 'submit';
        submit_btn.value = 'Send';
        form.appendChild(submit_btn);

        form.addEventListener('submit', (e) => this.onFormSubmit(e));

        article.appendChild(form);

        return article;
    }

    onFormSubmit(e) {
        e.preventDefault();

        // check if msg is present and OK
        const message = e.target.elements.message.value;
        if (!message.length) return false;

        // send it
        this.sendMessage(message);

        // reset form for next messages
        e.target.reset();

        return false;
    }

    sendMessage(content) {
        const msg = {
            when: Gun.state(),
            who: db.user.is.pub,
            content: content,
        };


        db.user.get('conversations').get(this.with_pub).set(msg);
    }

    receiveMessage(msg, id) {
        if (!msg) return;
        console.log(msg, id);

        let whom = '';
        if (msg.who === db.user.is.pub) {
            whom = 'mine';
        } else {
            whom = 'their';
        }

        let p = this.messages.get(id);
        if (!p) {

            p = document.createElement('p');
            this.messages.set(id, p);

        }
        p.className = whom;
        p.dataset.when = msg.when;
        p.textContent = msg.content;

        //find the message just before this one
        let messages = this.message_list.querySelectorAll('p');
        const inserted_msgs = messages.length;
        let previous_message = undefined;
        for (let i = inserted_msgs - 1; i>=0; i--) {
            previous_message = messages[i];
            const message_time = parseFloat(previous_message.dataset.when);
            if (message_time < msg.when) break;
        }
        if (previous_message) {
            // insert p just after previous_message
            previous_message.insertAdjacentElement('afterend', p);
        } else {
            // received the last message of the conversation, insert at the end of message_list
            this.message_list.appendChild(p);
        }
        p.scrollIntoView();
    }

    remove() {
        // remove the HTML element
        this.element.remove();
    }
}

class Conversations {
    constructor() {
        this.conversations_div = document.querySelector("#conversations");
        db.on_login.push((v) => this.onLogin(v));
        this.open_conversations = new Map();
    }

    onLogin(u) {
        // list conversations we are a part of
        db.gun.get('conversations').map().on((conversation, id) => this.conversationUpdate(conversation, id))
    }

    conversationUpdate(conversation, id) {
        const user_pub = db.user.is.pub;
        // find out which side we are on, if that conversation is with us
        if (user_pub === conversation.from) {
            this.updateConversationWith(conversation.to, conversation[user_pub], id);
        } else if (user_pub === conversation.to) {
            this.updateConversationWith(conversation.from, conversation[user_pub], id);
        }
    }

    updateConversationWith(other_pub_key, open, id) {
        let conversation = this.open_conversations.get(other_pub_key);
        if (open) {
            // add conversation widget if it does not exist
            if (conversation === undefined) {
                this.open_conversations.set(other_pub_key, new Conversation(other_pub_key, id));
            }
        } else {
            // remove conversation widget if it exists
            if (conversation) {
                conversation.remove();
                this.open_conversations.delete(other_pub_key);
            }
        }
    }

    openConversationWith(other_pub_key) {
        const user_pub = db.user.is.pub;
        const id = user_pub + "/" + other_pub_key;
        // It does not matter if a conversation exists with the reversed id,
        // as messages are not associated with that id

        const conversation = {
            from: user_pub,
            to: other_pub_key,
        }
        conversation[user_pub] = true;
        conversation[other_pub_key] = true;

        db.gun.get('conversations').get(id).put(conversation);

        // Then, thanks to the listener registered at `onLogin`,
        // the conversation will appear on both sides, because both
        // user listening flags are true
    }
}

window.conversations = new Conversations();
