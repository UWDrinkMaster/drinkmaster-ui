<template>
<div>
  profile
  <i class="el-icon-switch-button" @click="logout"></i>

</div>
</template>

<script>
    export default {
      name: "Profile",
      methods:{
        logout() {
          // this.$axios.get('logout').then(res=>{
          //   if(res&&res.status===200){
              this.$store.commit('LOGOUT')
              this.$message.success('logout successfully')
              // const newRouter = createRouter()
              // this.$router.matcher = newRouter.matcher
              this.$router.replace('/user/login')
          //   }
          // }).catch(err=>{
          //   console.log(err)
          // })
        }
      }
    };
</script>
