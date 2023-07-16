<template>
  <body id="poster" v-loading="loading">
  <el-form class="container-login" label-position="left" label-width="0px" :rules="rules" :model="loginForm" ref="ruleForm">
    <h3 class="title-login">Drink Master</h3>
    <el-form-item prop="username">
      <el-input v-model="loginForm.username" placeholder="username" prefix-icon="el-icon-user"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="loginForm.password" placeholder="password" show-password prefix-icon="el-icon-lock"></el-input>
    </el-form-item>
    <!--<el-checkbox class="login_remember" v-model="checked"><span style="color: #505458">remember</span></el-checkbox>-->
    <router-link to="/user/home" class="testEntry">Test Entry</router-link>
    <br>
    <el-form-item style="width: 100%">
      <router-link to="/register"><el-button type="info" class="btn-login" style="float: left; background-color: rgba(253,213,79,0.98) ">Register</el-button></router-link>
      <el-button type="primary" class="btn-login" @click="login" style="float: right; background-color: rgba(253,213,79,0.98)  ">Login</el-button>
    </el-form-item>
  </el-form>
  </body>
</template>

<script>
  export default {
    name:'UserLogin',
    data(){
      return{
        loginForm:{
          username:'',
          password:''
        },
        rules:{
          username:[{required:true,message:'Username can\'t be empty',trigger:'blur'}],
          password:[{required:true,message:'Password can\'t be empty',trigger:'blur'}]
        },
        loading:false,
        checked:true
      }
    },
    methods:{
      login(){
        this.$refs.ruleForm.validate((valid)=>{
          if(valid){
            let _this = this
            this.$axios.post('/login',{
              username:this.loginForm.username,
              password:this.loginForm.password
            }).then(res=>{
              if(res.status===200){
                _this.$store.commit('LOGIN',res.data)
                let path  = this.$route.query.redirect;
                _this.$router.replace({path: path === '/' || path === undefined ? '/admin/dashboard' : path}).catch(()=>{})
              }
            }).catch(err=>{
              console.log(err.response)
              this.$message.error(err.response.data.message)
            })
          }else{
            return false;
          }
        })
      }
    }
  }
</script>
<style scoped>
  .btn-login {
    /*background-color: #505458;*/
    width: 40%;
    border: none;
  }

  .testEntry{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .container-login {
    border-radius: 15px;
    width: 260px;
    background-color: #fff;
    padding: 35px 35px 15px 35px;
    margin: 180px auto;
    background-clip: padding-box;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .title-login {
    margin: 40px auto;
    text-align: center;
    color: #505458;
  }
  #poster {
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }
  body {
    margin: 0;
  }
  .login_remember {
    margin: 0px 0px 35px 0px;
    text-align: left;
  }

</style>
