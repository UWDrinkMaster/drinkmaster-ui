import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import {Message} from "element-ui";

export const WebSocketJS = {
  connect(vm) {
    this.socket = new SockJS(process.env.VUE_APP_URL + process.env.VUE_APP_PORT + "/websocket");
    this.stompClient = Stomp.over(this.socket);
    this.stompClient.connect({}, frame => {
      //console.log(frame);
      this.stompClient.subscribe('/topic/order-complete', message => {
        //console.log('Received message:', message.body);
       // console.log('Received message:', message.body);
        const data = JSON.parse(message.body);
        // this.message = message.body;
//console.log(data)
        console.log(vm.$store.getters.getUser.id)
        if (data.status === "COMPLETED" && data.user_id ===vm.$store.getters.getUser.id ) {
          //Open the dialog when a message is received
          const h = vm.$createElement;
          vm.$notify({
            title: 'Your Order is Ready :)',
            message: h('div', [

              h('p', { style: 'font-weight: bold; color: #7bb95c; white-space: break-spaces;' }, 'Enjoy your drink!')
            ]),
            duration: 0
          });

          // this.handleMixing();
        }
        if (data.status === "CANCELED" && data.user_id ===vm.$store.getters.getUser.id ) {
          // Open the dialog when a message is received
          const h = vm.$createElement;
          vm.$notify({
            title: 'Your Order is Canceled :(',
            message: h('div', [
              h('p', { style: 'margin-bottom: 10px;white-space: nowrap;' }, 'Sorry, please contact us for further assistance.'),
              h('p', { style: 'font-weight: bold; color: #f56c6c; white-space: break-spaces;' }, 'You can check your order status in Order History.')
            ]),
            duration: 0
          });
        }
      })
    }, error => {
      console.log(error);
    });
  },

  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
  },


}


