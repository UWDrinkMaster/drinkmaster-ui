<template>
  <div>
    <el-row>
    </el-row>

    <el-row>
      <el-col :span="24"><div class="grid-content bg-purple-dark menu">Recommended For You</div></el-col>
    </el-row>

    <el-row>
      <el-col :span="10" v-for="(o, index) in 2" :key="o" :offset="index > 0 ? 2 : 0">
        <el-card :body-style="{ padding: '0px' }" >
          <img src="../../../assets/img/drink_sample_1.png" class="image">
          <div style="padding: 10px;">
            <span>Recommended Drink Sample</span>
            <div class="bottom clearfix">
              <el-button  size="mini" @click="dialogFormVisible = true" icon="el-icon-edit"></el-button>

              <!--<el-button type="text" size="mini" class="button" style="float: left" @click="dialogFormVisible = true" round="true">Customize</el-button>-->

              <el-button  size="mini" class="button"  @click="drinkOrderPendingStep1 = true" round="true">Order</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      title="Order Confirm"
      :visible.sync="drinkOrderPendingStep1"
      width="80%"
      show-close=false
      center>
      <span>Your drink is ready to be mixed.
Please confirm you put your bottle on the machine  </span>
      <span slot="footer" class="dialog-footer">
            <el-button  type="primary" @click="drinkOrderPendingStep1 = false">No, I haven't.</el-button>
    <el-button type="primary" @click="handleConfirmation">Yes, I put!</el-button>
  </span>
    </el-dialog>

    <el-dialog
      title="Your Drink is mixing!"
      :visible.sync="drinkOrderPendingStep2"
      width="80%"
      show-close=false
      center>
      <span>
              Mixing... </span>
      <span slot="footer" class="dialog-footer">

          <el-button type="primary" @click="handleMixing">Next</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="Your Drink is ready!"
      :visible.sync="drinkOrderPendingStep3"
      width="80%"
      show-close=false
      center>
      <span>
              Please click on the confirm button, after you take your drink! </span>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="drinkOrderPendingStep3 = false">Confirm</el-button>
      </span>
    </el-dialog>


    <el-dialog       width="80%"
                     title="Drink Details" :visible.sync="dialogFormVisible">
      <el-form :model="form">

        <el-form-item label="Ingredient A:" :label-width="formLabelWidth">
          <el-input v-model="form.ingredientA" autocomplete="off" placeholder="1 oz"></el-input>
        </el-form-item>

        <el-form-item label="Ingredient B:" :label-width="formLabelWidth">
          <el-input v-model="form.ingredientB" autocomplete="off" placeholder="3 oz"></el-input>
        </el-form-item>

        <el-form-item label="Ingredient C:" :label-width="formLabelWidth">
          <el-input v-model="form.ingredientC" autocomplete="off" placeholder="1 oz"></el-input>
        </el-form-item>

        <el-form-item label="Ingredient D:" :label-width="formLabelWidth">
          <el-input v-model="form.ingredientD" autocomplete="off" placeholder="3 oz"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">Cancel</el-button>
    <el-button type="warning" @click="drinkOrderPendingStep1 = true">Order</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
  import '../../../assets/css/main.css';
  export default {
    name: "Recommended",
    data() {
      return {
        drinkOrderPendingStep1: false,
        drinkOrderPendingStep2: false,
        drinkOrderPendingStep3: false,
        drinkDetailDialog: false,
        dialogFormVisible: false,
        form: {
          name: '',
          ingredientA: '',
          ingredientB: '',
        },
        formLabelWidth: '120px'
      };
    },
    methods: {

      handleConfirmation() {
        this.drinkOrderPendingStep1 = false;

        this.openNewDialog();
      },
      openNewDialog() {
        this.drinkOrderPendingStep2 = true;
      },
      handleMixing(){
        this.drinkOrderPendingStep2 = false;
        this.drinkOrderPendingStep3 = true;
      },
      openDrinkDetail(){
        this.dialogFormVisible = true;
      }
    }
  }
</script>

<style scoped>
  .menu {
    color: #000000;
    text-align: center;
    font: 600 16px "Manrope", sans-serif;

  }
  .el-row {
    margin-bottom: 20px;
  &:last-child {
     margin-bottom: 0;
   }
  }
  .el-col {
    border-radius: 4px;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  .text{
    color: black;
  }
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>
