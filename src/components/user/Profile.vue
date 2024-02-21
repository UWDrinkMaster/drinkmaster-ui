<template>
  <div>
    <div style="width: 100%; height: 100%; position: relative; background: white">

      <img style="width: 116px; height: 111px; display: block; margin-left: auto; margin-right: auto;" src="../../assets/img/user_icon.png" />
      <ul class="user-info">
        <li class="date-container" >Email: {{this.$store.getters.getUser.username}}</li >
        <li class="date-container" >Date of Birth: {{birthday}}</li >
        <li  class="date-container">Last sobriety test at: {{lastSobrietyTestAt.toLocaleString()}}</li >
        <li  class="date-container">Last sobriety test score: {{lastSobrietyTestScore}}</li >
        <li class="date-container">Last sobriety test result: {{ !drunk ? 'PASS' : 'FAIL' }}</li>
        <li class="date-container">Please wait {{ timeLeft }} minutes to retake the sobriety test to order more drinks  :)</li>


        <li class="date-container">Allergy:
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
          birthday:"",
          lastSobrietyTestAt:"",
          lastSobrietyTestScore:"",
          drunk:false,
          timeLeft:0,
         // updatedAllergyOptions:[],
        }
      },
      methods:{
       // logout(){ console.log(this.defaultAllergyOptions)},
        logout() {
          // this.$axios.get('logout').then(res=>{
          //   if(res&&res.status===200){
              this.$store.commit('LOGOUT')
          this.$webSocket.disconnect();
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
            //  console.log(res.data)
              this.defaultAllergyOptions = res.data
            }
          })
        },
        getUserAllergyList(){
          if(this.$store.getters.getUser.id){
            this.$profileApi.getUserAllergyList(this.$store.getters.getUser.id).then((res)=>{
              if(res&&res.status ===200){
                if(res.data !== null && res.data.length>0){
                 // console.log("pre data")
                 // console.log( res.data)
                  this.storedAllergyOptions = [...new Set(res.data.map(obj => obj.id))];
                }
              }
            })
          }
        },
        async getUserProfile(){
          if(this.$store.getters.getUser){
            await this.$userApi.getUser(this.$store.getters.getUser.id).then(res => {
              if (res.status === 200) {
                this.lastSobrietyTestAt = res.data.last_sobriety_test_at;
                this.lastSobrietyTestScore = res.data.last_sobriety_test_score;
                if(this.lastSobrietyTestScore != null){
                  this.lastSobrietyTestScore =this.lastSobrietyTestScore.toFixed(2)
                }
                this.birthday = res.data.date_of_birth;

              }
            }).catch(err => {
              console.log(err.response);
              this.$message.error(err.response.data.message);
            });

            if(this.lastSobrietyTestScore != null){
              if (this.lastSobrietyTestScore > 45 && this.lastSobrietyTestScore < 78 && !this.hasTimePassed(this.lastSobrietyTestAt , 15)) {
                this.drunk = true;
                this.timeLeft = this.getTimeDiff(this.lastSobrietyTestAt , 15);

              } else if (this.lastSobrietyTestScore > 78 && !this.hasTimePassed(this.lastSobrietyTestAt , 30)) {
                this.drunk = true;
                this.timeLeft = this.getTimeDiff(this.lastSobrietyTestAt , 30);

              }
              else if (this.lastSobrietyTestScore < 45 && !this.hasTimePassed(this.lastSobrietyTestAt , 15)) {
                //allow the user to bypass the test if they passed 15 mins ago
                this.drunk = false;

              }
            }

          }},
        saveAllergy(){
          //console.log("set")

          //console.log(this.storedAllergyOptions)

          this.$profileApi.setUserAllergy(this.storedAllergyOptions,this.$store.getters.getUser.id).then(res => {
            if (res.status === 201) {
              //console.log(res)
            }
          }).catch(err => {
            this.$message.error(err.response.data.message)
          })
          //console.log(this.storedAllergyOptions)
        },
        displayOptions(){
          if(this.storedAllergyOptions.length===0 ){
            return this.defaultAllergyOptions
          }
          return this.storedAllergyOptions;
        },

        setGameResult(){
          if(last_test_score != null){
            if (last_test_score > 45 && last_test_score < 78 && !this.hasTimePassed(last_test_time, 15)) {
              this.drunk = true;
              this.timeLeft = this.getTimeDiff(last_test_time, 15);
              this.dialogVisible = true;
              return;
            } else if (last_test_score > 78 && !this.hasTimePassed(last_test_time, 30)) {
              this.drunk = true;
              this.timeLeft = this.getTimeDiff(last_test_time, 30);
              this.dialogVisible = true;
              return;
            }
            else if (last_test_score < 45 && !this.hasTimePassed(last_test_time, 15)) {
              //allow the user to bypass the test if they passed 15 mins ago
              this.$emit('testFinished', { passed: true, drinkId: this.drinkId });
              this.closeDialog()
              return;
            }
          }},
        hasTimePassed(timestamp, minutesPassed) {
          // Current time
          const now = new Date();
          const givenTime = new Date(timestamp);
          const difference = now - givenTime;

          //minutes in milliseconds
          const minutes = minutesPassed * 60 * 1000;

          return difference > minutes;
        },
        getTimeDiff(timestamp, minutesPassed){
          const now = new Date();
          const givenTime = new Date(timestamp);
          const difference = now - givenTime;

          //minutes in milliseconds
          const minutes = minutesPassed * 60 * 1000;

          return (minutes - difference)/60/1000;
        }


      },
      mounted() {
        this.getDefaultAllergyList();
        this.getUserAllergyList();
        this.getUserProfile();

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
  .user-info {
    list-style-type: none;
    padding: 25px;
    padding-top: 0px;
  }

  .user-info li {
    margin-bottom: 10px;
  }

  /* Optional: add specific styles for individual list items */
  .user-info li:nth-child(odd) {
    color: #333; /* Change text color for odd-numbered list items */
  }

  .user-info li:nth-child(even) {
    color: #666; /* Change text color for even-numbered list items */
  }
  .date-container {
    font-family: 'Arial', sans-serif;
    font-size: 14px;
    color: #fff;
    background-color: oldlace;
    padding: 5px 10px;
    border-radius: 3px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
</style>
