<template>
  <div>
    <el-menu :default-active="activeIndex" class="el-menu-demo topbartext topbar" mode="horizontal" @select="handleSelect" background-color="rgb(84, 92, 100)" text-color="rgb(255, 255, 255)" active-text-color="rgb(255, 208, 75)"  :router="true">
<!--      <el-menu-item  class ="menuitem" index="/user/menu">Drink Menu</el-menu-item>-->
<!--      <el-submenu index= "2" class ="topbartext">-->
<!--        <template slot="title">Drink Menu</template>-->
<!--        <el-menu-item index="/user/menu">Recommended</el-menu-item>-->
<!--        &lt;!&ndash;<el-menu-item index="/user/menu">Non-Alcohol</el-menu-item>&ndash;&gt;-->
<!--        &lt;!&ndash;<el-menu-item index="/user/menu">Alcohol</el-menu-item>&ndash;&gt;-->
<!--        &lt;!&ndash;<el-menu-item index="/user/menu">Create Your Own Drink</el-menu-item>&ndash;&gt;-->
<!--      </el-submenu>-->
<!--      <el-menu-item index="/user/menu"> Drink Menu</el-menu-item>-->
<!--      <el-menu-item index="/user/order"> Order History</el-menu-item>-->
<!--      <el-menu-item index="/user/profile"> Profile</el-menu-item>-->
      <el-menu-item v-for="item in navList" :key="item.id" :index="item.name">{{item.navItem}}</el-menu-item>
    </el-menu>
    <div class="line"></div>
  </div>
</template>

<script>
  export default {
    name: "TopBar",
    data() {
      return {
        activeIndex: '/user/menu',
        navList:[
          {id:1,name:'/user/menu',navItem:'Drink Menu'},
          {id:2,name:'/user/order',navItem:'Order History'},
          {id:3,name:'/user/profile',navItem:'Profile'}
        ]
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        // if(key ==3) {
        //   this.$router.replace('/user/profile')
        // }
      }
    },
   mounted(){
      this.activeIndex = this.$route.path
   }
  }
</script>
<style>
  .topbartext {
    font: 600 16px "Manrope", sans-serif;
  }

</style>
