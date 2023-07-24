<template>
  <div>

    <div style="width: 100%; height: 100%; position: relative; background: white">
      <div style="width: 257px; left: 30%; top: 187px; position: absolute; color: #09101D; font-size: 19px; font-weight: 600; line-height: 20px; word-wrap: break-word">Email: {{this.$store.getters.getUser.username}}</div>
      <img style="width: 116px; height: 111px; left: 37%; top: 60px; position: absolute" src="../../assets/img/user_icon.png" />

      <button style="padding-left: 20px; padding-right: 20px; padding-top: 8px; padding-bottom: 8px; left: 37%; top: 264px; position: absolute; background: linear-gradient(180deg, #F9E8A8 0%, #F4C317 91%); border-radius: 24px; justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex">
        <div style="color: white; font-size: 18px; font-family: Source Sans Pro; font-weight: 600; line-height: 28px; word-wrap: break-word" @click="logout">Sign Out</div>
      </button>
    </div>

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
<style>
  .container {
    display: flex;
    justify-content: center;
    align-items: center; /* Center vertically */
    height: 100vh;
  }

</style>
