<template>
  <div>
    <PopularDrinks></PopularDrinks>
    <Recommand></Recommand>
  </div>
</template>

<script>
  import PopularDrinks from "./order/PopularDrinks";
  import Recommand from "./order/Recommend";

  export default {
    name: "Menu",
    components: {PopularDrinks, Recommand},
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
