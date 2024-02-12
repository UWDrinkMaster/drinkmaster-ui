<template>
  <body id="paper" v-loading="loading">

  <el-form ref="form" :model="registerForm" label-width="0px" label-position="left" class="container-register"
           :rules="rules">
    <h3 class="title-register">Register</h3>

    <el-form-item prop="email">
      <el-input v-model="registerForm.email" placeholder="E-Mail" prefix-icon="el-icon-message"></el-input>
    </el-form-item>
    <!--<el-form-item prop="username">-->
    <!--  <el-input v-model="registerForm.username" placeholder="username" prefix-icon="el-icon-user"></el-input>-->
    <!--</el-form-item>-->
    <el-form-item prop="password">
      <el-input v-model="registerForm.password" placeholder="password" show-password prefix-icon="el-icon-lock"></el-input>
    </el-form-item>
    <el-form-item prop="age" :inline="true">
      <el-input
        v-model="registerForm.age"
        class="age_input"
        placeholder="age"
        disabled
      >
        <template slot="append">years old</template>
      </el-input>
      <el-button type="primary" icon="el-icon-camera" @click="scanCard()"></el-button>
    </el-form-item>
    <el-form-item style="width: 100%">
      <el-button type="info" class="btn-register" @click="$router.back()" style="float: left">Cancel</el-button>
      <el-button type="primary" class="btn-register" @click="register" style="float: right">Register</el-button>
    </el-form-item>
  </el-form>
  <el-dialog
    title="Scan your Driver's Licence"
    :visible.sync="centerDialogVisible"
    width="70%"
    center
    append-to-body
    v-loading = "loading"
  >
    <div>
      <el-row type="flex" class="row-bg" justify="row-bg">
        <el-col>
          <div class="grid-content bg-purple" >
            <vue-web-cam
              :device-id="deviceId"
              ref="webcam"
              @camera-change="onCameraChange"
              @cameras="onCameras"
              @error="onError"
              height="100%"
              width="100%"
              border-radius="10px"
            />
          </div>

          <div class="grid-content bg-purple-light" v-if="this.image !== null && this.image !== 'data:,'">
            <el-image width="100%" :src="image" alt/>
          </div>
          <!--<el-row :gutter="20">-->
          <!--<div>-->
          <!--  <select v-model="camera">-->
          <!--    <option>&#45;&#45; Select Device &#45;&#45;</option>-->
          <!--    <option-->
          <!--      v-for="device in devices"-->
          <!--      :key="device.deviceId"-->
          <!--      :value="device.deviceId"-->
          <!--    >{{ device.label }}</option>-->
          <!--  </select>-->
          <!--</div>-->
          <!--</el-row>-->
          <el-row :gutter="20">
          <el-col :span="12">

          <div>
            <el-button @click="capture" color="success"  size="mini">Capture</el-button>
          </div>
          </el-col>
          <el-col :span="12">
            <div>
              <el-button type="primary"  v-if="this.extractedDate !== null && this.extractedDate !==''" @click="computeAge()" size="mini">Confirm</el-button>


            </div>
          </el-col>
          </el-row>

          <div class="sub-title">Date of Birth read from picture:</div>
          <el-row :gutter="20">

          <el-col >
            <el-input
            placeholder= "yyyy/mm/dd"
            v-model="extractedDate"
            v-loading="this.extractedDate ===''&& this.image == null"
            :disabled="true">
          </el-input>
          </el-col>


          </el-row>
        </el-col>
      </el-row>

      <el-collapse>
        <el-collapse-item >
          <template slot="title">
            Failed to scan, need help? <i class="header-icon el-icon-info"></i>
          </template>
          <el-form >
            <el-form-item label="Manager Code">
              <el-input v-model="managerCode" show-password prefix-icon="el-icon-lock" ></el-input>
            </el-form-item>
            <el-form-item label="Date of Birth">
              <el-input v-model="birthday"  placeholder="YYYY-MM-DD"></el-input>
            </el-form-item>
            <el-col :span="6"><div class="grid-content bg-purple-light">
              <el-button type="primary" @click="confirm()" size="mini">skip</el-button>
            </div></el-col>
        </el-form>
        </el-collapse-item>
      </el-collapse>
    </div>
  </el-dialog>
  </body>
</template>

<script>
  import {WebCam} from "vue-web-cam";
  import Tesseract from 'tesseract.js';

  export default {
    name: "UserRegister", components: {
      "vue-web-cam": WebCam
    }, data() {
      var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('Please input the age'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('Please input digits'));
          } else {
            if (value < 18) {
              callback(new Error('Age must be greater than 18'));
            } else {
              callback();
            }
          }
        }, 1000);
      };
      return {
        age:'',
        birthday:'',
        extractedDate: null,
        managerCode: "",
        centerDialogVisible: false,
        image: null,
        camera: null,
        deviceId: null,
        defaultImageData: "data:,",
        plate: "",
        devices: [],
        registerForm: {
          // username:'',
          password: '', // phone: '',
          email: '',
          age: ''
        },
        rules: {
          // username:[{required:true,message:'Username can\'t be empty',trigger:'blur'}],
          password: [{required: true, message: 'Password can\'t be empty', trigger: 'blur'}],
          email: [{required: true, type: 'email', message: 'Please input the correct email address'}],
          age: [{ validator: checkAge, trigger: 'blur'}]
        },
        loading: false
      }
    }, methods: {
      scanCard(){
        this.centerDialogVisible = true;
        console.log(this.image)
        this.age = '';
        this.managerCode = '';
        this.image = null;
        this.extractedDate = null;
      },
      checkDateFormat( date ) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(date);
      },
      confirm(){
        if(this.managerCode == '123'){
          if (this.checkDateFormat(this.birthday)===true){
            const dateObject = new Date(this.birthday);
            const currentDate = new Date();
            const ageInMilliseconds = currentDate - dateObject;
            const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
            this.registerForm.age = Math.floor(ageInYears);
            this.centerDialogVisible = false;
          }else{
            const h = this.$createElement;

            this.$notify({
              title: 'Warning',
              message: h('i', { style: 'color: rgba(253, 213, 79, 0.98)' }, 'Birthday format is invalid')
            });
          }

        }else{
          const h = this.$createElement;

          this.$notify({
            title: 'Warning',
            message: h('i', { style: 'color: rgba(253, 213, 79, 0.98)' }, 'Manager Code is invalid')
          });
        }
      },
      computeAge(){
        if (this.extractedDate) {
          const extractedDateObject = new Date(this.extractedDate);
          const currentDate = new Date();
          const ageInMilliseconds = currentDate - extractedDateObject;
          const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
          this.registerForm.age = Math.floor(ageInYears);
          this.centerDialogVisible = false;

        } else {
          const h = this.$createElement;

          this.$notify({
            title: 'Warning',
            message: h('i', { style: 'color: rgba(253, 213, 79, 0.98)' }, 'Cannot compute age, extracted date is not available.')
          });
          console.warn('Cannot compute age, extracted date is not available.');
        }
      },
      capture() {
        if (this.$refs.webcam != undefined) {
          this.loading = true;
          console.log(this.$refs.webcam.capture())
          this.image = this.$refs.webcam.capture();
        }
        return this.image;
      },
      onError(error) {
        console.error(error);
      }, onCameraChange(deviceId) {
        this.deviceId = deviceId;
        this.camera = deviceId;
      }, onCameras(cameras) {
        this.devices = cameras;
      }, capturewithInterval(interval) {
        setInterval(() => {
          this.capture();
        }, interval);
      },
      register() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            // this.extractedDate.replace(/\//g, '-');
            this.$userApi.register(this.registerForm.email, this.registerForm.password,this.extractedDate.replace(/\//g, '-')).then(res => {
              if (res.status === 201) {
                console.log(res)
                this.$message({
                  showClose: true, message: 'Registered successfully!', type: 'success'
                });
                this.$router.replace('/user/login')
              }
            }).catch(err => {
              this.$message.error(err.response.data.message)
            })
          } else {
            return false;
          }
        })
      }
    }, watch: {
      camera(id) {
        this.deviceId = id;
      }, devices() {
        // const [first, ...tail] = this.devices;
        // if (first) {
        //   this.camera = first.deviceId;
        //   this.deviceId = first.deviceId;
        // }
        const [last, ...rest] = this.devices.slice().reverse();
        if (last) {
          // Assign the deviceId of the last device to the camera and deviceId properties
          this.camera = last.deviceId;
          this.deviceId = last.deviceId;
        }
      }, async image(val) {
        if (val !== this.defaultImageData && val !== null) {
          Tesseract.recognize(
            val,
            'eng', // Language code (English in this case)
            { logger: info => console.log(info) } // Optional logger function
          ).then(({ data: { text } }) => {
            const datePattern = /S00pcoN\s*(\d{4}\/\d{2}\/\d{2})\s*(.*)/;
            const match = text.match(datePattern);
            if (match && match.length > 0) {
              this.extractedDate = match[1];
            } else {
              console.warn('Date not found in the expected format');
              this.extractedDate = '';
            }
          }).catch(error => {

            console.error('OCR Error:', error);
          }).finally(()=>{
            this.loading = false;
if(this.extractedDate ===''&& this.image !== null){
  const h = this.$createElement;
  this.$notify({
    title: 'Error',
    message: h('i', { style: 'color: rgba(253, 213, 79, 0.98)' }, 'Failed to extract your birthday, please re-click on capture button to try again!')
  });
}


          });
        }
      }
    },
  }
</script>

<style scoped>
  #paper {
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }

  .container-register {
    border-radius: 15px;
    width: 260px;
    background: #fff;
    padding: 35px 35px 15px 35px;
    margin: 180px auto;
    background-clip: padding-box;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .title-register {
    margin: 40px auto;
    text-align: center;
    color: #505458;
  }

  body {
    margin: 0;
  }

  .btn-register {
    /*background-color: #505458;*/
    width: 40%;
    border: none;
  }

  .age_input {
    width: 12rem;
  }
</style>
