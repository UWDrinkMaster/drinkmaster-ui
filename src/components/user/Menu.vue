<template>
  <div>
    <PopularDrinks></PopularDrinks>
    <CustomDrinks></CustomDrinks>
  </div>
</template>

<script>
  import PopularDrinks from "@/components/user/order/PopularDrinks";
import CustomDrinks from "./order/CustomDrinks.vue";

  export default {
    name: "Menu",
    components: { PopularDrinks, CustomDrinks },
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
