<template>
  <div>
    <el-menu :default-active="activeIndex" class="el-menu-demo topbartext" mode="horizontal" @select="handleSelect">
      <el-submenu index="1">
        <template slot="title">Drink Menu</template>
        <el-menu-item index="1-1">Alcohol</el-menu-item>
        <el-menu-item index="1-2">Non-Alcohol</el-menu-item>
        <el-menu-item index="1-3">Create Your Own Drink</el-menu-item>
      </el-submenu>
      <el-menu-item index="2"> Order History</el-menu-item>
      <el-menu-item index="3"> User Info</el-menu-item>
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
        console.log(key, keyPath);
      }
    }
  }
</script>
<style>
.topbartext{
  font: 600 16px "Manrope", sans-serif;
}
</style>
