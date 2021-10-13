class Messages{
    constructor() {
        this.levels = {
            ERROR: 'error',
            WARNING: 'warning',
            SUCCESS: 'success',
            INFO: 'info'
        };
        this.messages = new Set();
        this.current_index = 0;
        this.place = document.querySelector('#messages');
    }

    addMessage(msg_text, level, dismissable=true) {
        const index = this.current_index++;
        let msg_element = document.createElement('p');
        msg_element.appendChild(document.createTextNode(msg_text));
        msg_element.id = 'message-'+index;
        msg_element.classList.add('message');
        msg_element.classList.add(level);

        if (dismissable) {
            msg_element.addEventListener('click', ()=>{
                msg.messages.delete(index);
                msg_element.remove();
            });
        }

        this.place.appendChild(msg_element);

        this.messages.add(index);
    }

    dismissAll() {
        for (const key of this.messages) {
            document.querySelector('#message-'+key).remove();
        }
        this.messages.clear();
    }
}

window.msg = new Messages();
