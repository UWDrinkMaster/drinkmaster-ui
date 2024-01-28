<template>
  <div>
    <div style="width: 100%; height: 100%; position: relative; background: white">

      <img style="width: 116px; height: 111px; display: block; margin-left: auto; margin-right: auto;" src="../../assets/img/user_icon.png" />
      <ul >
        <li  >Email: {{this.$store.getters.getUser.username}}</li >
        <li >Allergy:
          <el-select v-model="storedAllergyOptions" multiple placeholder="Select your allergy" @blur="saveAllergy()">
            <el-option
              v-for="item in defaultAllergyOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              <span style=" color: #8492a6; font-size: 13px">{{ item.name }}: </span>

              <span style="float: bottom; font-size: 10px">{{ item.description }}</span>
            </el-option>
          </el-select></li >
      </ul>
      <button style=" background: linear-gradient(180deg, #F9E8A8 0%, #F4C317 91%); border-radius: 24px;display: block; margin-left: auto;margin-right: auto;">

        <div style="color: white; font-size: 18px; font-family: Source Sans Pro; font-weight: 600; line-height: 28px; word-wrap: break-word" @click="logout">Sign Out</div>
      </button>
    </div>

</div>
</template>

<script>
    export default {
      name: "Profile",
      data(){
        return {
          defaultAllergyOptions: [],
          storedAllergyOptions:[],
         // updatedAllergyOptions:[],
        }
      },
      methods:{
       // logout(){ console.log(this.defaultAllergyOptions)},
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
        },
        getDefaultAllergyList(){
          this.$profileApi.getDefaultAllergyList().then((res)=>{
            if(res&&res.status ===200){
              console.log(res.data)
              this.defaultAllergyOptions = res.data
            }
          })
        },
        getUserAllergyList(){
          if(this.$store.getters.getUser.id){
            this.$profileApi.getUserAllergyList(this.$store.getters.getUser.id).then((res)=>{
              if(res&&res.status ===200){
                if(res.data !== null && res.data.length>0){
                  console.log("pre data")
                  console.log( res.data)
                  this.storedAllergyOptions = [...new Set(res.data.map(obj => obj.id))];
                }
              }
            })
          }
        },
        saveAllergy(){
          console.log("set")

          console.log(this.storedAllergyOptions)

          this.$profileApi.setUserAllergy(this.storedAllergyOptions,this.$store.getters.getUser.id).then(res => {
            if (res.status === 201) {
              console.log(res)
            }
          }).catch(err => {
            this.$message.error(err.response.data.message)
          })
          console.log(this.storedAllergyOptions)
        },
        displayOptions(){
          if(this.storedAllergyOptions.length===0 ){
            return this.defaultAllergyOptions
          }
          return this.storedAllergyOptions;
        }


      },
      mounted() {
        this.getDefaultAllergyList();
        this.getUserAllergyList();

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
