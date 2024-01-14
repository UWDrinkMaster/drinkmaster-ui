<template>
  <div>
    <PopularDrinks></PopularDrinks>
    <Recommend></Recommend>
  </div>
</template>

<script>
  import PopularDrinks from "@/components/user/order/PopularDrinks";
  import Recommend from "@/components/user/order/Recommend";

  export default {
    name: "Menu",
    components: {PopularDrinks, Recommend},
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
    }
  }
</script>
