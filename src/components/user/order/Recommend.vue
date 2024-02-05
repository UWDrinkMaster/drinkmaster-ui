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
          <div style="padding: 10px; text-align: center;">
            <span>Recommended Drink Sample</span>
            <div class="bottom clearfix">
              <el-button  size="mini" @click="dialogFormVisible = true" icon="el-icon-edit"></el-button>

              <!--<el-button type="text" size="mini" class="button" style="float: left" @click="dialogFormVisible = true" round="true">Customize</el-button>-->
              <SobrietyTest @testFinished="handleTestFinished"/>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      title="Order Confirm"
      :visible.sync="drinkOrderPendingStep1"
      width="80%"
      center>
      <span>Drinkmaster is ready to mix your drink.
Please confirm the drink cup has been placed in the machine.</span>
      <span slot="footer" class="dialog-footer">
            <el-button  type="warning" @click="drinkOrderPendingStep1 = false">Close</el-button>
            <el-button  @click="handleConfirmation">Confirm</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="Your Drink is mixing!"
      :visible.sync="drinkOrderPendingStep2"
      width="80%"
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
    <SobrietyTest @testFinished="handleTestFinished"/>
  </span>
    </el-dialog>

  </div>
</template>

<script>
  import '@/assets/css/main.css';
  import SobrietyTest from '../SobrietyTest.vue';

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
        handleTestFinished(result) {
            if (result.passed) {
                this.drinkOrderPendingStep1 = true;
            }
            else {
                this.drinkOrderPendingStep1 = false;
            }
        },
        openNewDialog() {
            this.drinkOrderPendingStep2 = true;
        },
        handleMixing() {
            this.drinkOrderPendingStep2 = false;
            this.drinkOrderPendingStep3 = true;
        },
        openDrinkDetail() {
            this.dialogFormVisible = true;
        }
    },
    components: { SobrietyTest }
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
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .button {
    float: right;
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
  .dialog-footer{
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-evenly;
  }
</style>
