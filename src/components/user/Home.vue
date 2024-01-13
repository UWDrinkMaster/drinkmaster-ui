<template>
  <div>
    <TopBar></TopBar>
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>


<script>
  import TopBar from "@/components/user/common/TopBar";

  export default {
    name: "UserHome", components: {TopBar}
  }
</script>
