
<template>
  <div>
    <TopBar></TopBar>
    <Menu></Menu>
    <Recommand></Recommand>
  </div>

  <!--<div>-->
  <!--  ID:<input type="text" v-model="mqttForm.id" placeholder="id"/>-->
  <!--  <br><br>-->
  <!--  MachineId: <input type="text" v-model="mqttForm.machineId" placeholder="machine id"/>-->
  <!--  <br><br>-->
  <!--  TransId: <input type="text" v-model="mqttForm.transId" placeholder="Trans id"/>-->
  <!--  <br><br>-->
  <!--  Time: <input type="text" v-model="mqttForm.time" placeholder="Time"/>-->
  <!--  <br><br>-->
  <!--  Content: <input type="text" v-model="mqttForm.content" placeholder="content"/>-->
  <!--  <br><br>-->
  <!--  <button v-on:click="mqtt">Mqtt</button>-->
  <!--</div>-->
</template>


<script>
  import TopBar from "../user/common/TopBar";
  import Menu from "../user/order/Menu";
  import Recommand from "./order/Recommend";
  export default {
    name: "UserHome",
    components: {TopBar, Menu, Recommand},
    data () {
      return {
        mqttForm: {
          id: '',
          machineId: '',
          transId: '',
          time: '',
          content: ''
        }
      }
    },
    methods: {
      mqttPour () {
        this.$axios
          .get(`/pour?id=${this.mqttForm.id}&machineId=${this.mqttForm.machineId}&transId=${this.mqttForm.transId}&time=${this.mqttForm.time}&content=${this.mqttForm.content}`)
          .then(successResponse => {
            if (successResponse.data.code === 200) {
              // this.$router.replace({path: '/index'})
            }
          })
          .catch(failResponse => {
          })
      }
    }
  }
</script>
