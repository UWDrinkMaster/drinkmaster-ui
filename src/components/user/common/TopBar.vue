<template>
  <div>
    <el-menu :default-active="this.$router.path" class="el-menu-demo topbartext" mode="horizontal" @select="handleSelect" router>
      <el-menu-item index="/user/menu">Drink Menu</el-menu-item>
      <!--<el-submenu index="/user/home">-->
      <!--  <template slot="title">Drink Menu</template>-->
      <!--  <el-menu-item index="1-1">Alcohol</el-menu-item>-->
      <!--  <el-menu-item index="1-2">Non-Alcohol</el-menu-item>-->
      <!--  <el-menu-item index="1-3">Create Your Own Drink</el-menu-item>-->
      <!--</el-submenu>-->
      <el-menu-item index="/user/order"> Order History</el-menu-item>
      <el-menu-item index="/user/profile"> User Info</el-menu-item>
    </el-menu>
    <div class="line"></div>
  </div>
</template>

<script>
  export default {
    name: "TopBar",
    data() {
      return {
        activeIndex: '1'
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        // if(key ==3) {
        //   this.$router.replace('/user/profile')
        // }
      }
    }
  }
</script>
<style>
.topbartext{
  font: 600 16px "Manrope", sans-serif;
}
</style>
