<template>
  <div>
    <PopularDrinks></PopularDrinks>
    <CustomDrinks></CustomDrinks>
  </div>
</template>

<script>
  import PopularDrinks from "@/components/user/order/PopularDrinks";
import CustomDrinks from "./order/CustomDrinks.vue";
  import SockJS from "sockjs-client";
  import Stomp from "webstomp-client";
  export default {
    name: "Menu", components: {PopularDrinks, CustomDrinks}, data() {
      return {
        mqttForm: {
          id: '',
          machineId: '',
          transId: '',
          time: '',
          content: '',
          received_messages: [],
          send_message: null,
          connected: false
        }, connection: null,
      }
    }, created() {
    }, methods: {
     /* connect() {
        this.socket = new SockJS("http://localhost:8498/websocket");
        this.stompClient = Stomp.over(this.socket);
        this.stompClient.connect({}, frame => {
          this.connected = true;
          console.log(frame);
          this.stompClient.subscribe("/topic/order-complete", status => {
            console.log(status);
            this.received_messages.push(JSON.parse(status));
          });
        }, error => {
          console.log(error);
          this.connected = false;
        });
      }, disconnect() {
        if (this.stompClient) {
          this.stompClient.disconnect();
        }
        this.connected = false;
      }*/

    }, mounted() {
    }
  }
</script>
