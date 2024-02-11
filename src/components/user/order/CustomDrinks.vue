<template>
  <div>
    <el-row>
    </el-row>

  <el-row>
    <el-col :span="24"><div class="grid-content bg-purple-dark menu">Custom Drinks</div></el-col>
  </el-row>

  <div class="scroll-container">
    <el-row class="scroll-row">
      <el-col :span="10" v-for="drink in drinks" :key="drink.id" :offset="1">
        <el-card class="card" :body-style="{ padding: '0px' }">
          <div class="content-with-icon">
            <div class="content">
          <img src="../../../assets/img/drink_sample_1.png" class="image">
          <div style="padding: 10px; text-align: center;">
            <h5>{{drink.name}}</h5>
            <p class="description">{{drink.description}}</p>
            <div v-if="drink.is_available">
              <div class="bottom clearfix">
                <CustomizeDrink button-text='Customize' :ingredient-ids=drink.ingredient_ids :base-drink-name=drink.name></CustomizeDrink>
                <SobrietyTest @testFinished="handleTestFinished"/>
              </div>
            </div>
            <div v-else>
              <p>This drink is currently unavailable.</p>
            </div>
            <el-tooltip v-if="drink.is_allergic" placement="top">
                  <template #content>
                    {{ getAllergenText(drink.allergen_ids) }}
                  </template>
                  <i class="el-icon-warning icon-right"></i>
                </el-tooltip>
          </div>
          </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="10" :offset="1">
        <el-card class="centered-content" :body-style="{ padding: '0px' }">
          <h4 style="white-space: normal;">Click the button below to create a custom drink</h4>
          <div class="bottom clearfix">
            <CustomizeDrink button-text='Create Custom Drink'></CustomizeDrink>
          </div>
        </el-card>
      </el-col>

    </el-row>
  </div>

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

          <el-button  @click="handleMixing">Next</el-button>
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
          <el-button @click="drinkOrderPendingStep3 = false">Confirm</el-button>
      </span>
    </el-dialog>

    </div>
</template>

<script>
  import '@/assets/css/main.css';
  import SobrietyTest from '../SobrietyTest.vue';
  import CustomizeDrink from './CustomizeDrink.vue';

  export default {
    name: "PopularDrinks",
    data() {
        return {
            machineId: 1,
            transId: -1,
            drinkOrderPendingStep1: false,
            drinkOrderPendingStep2: false,
            drinkOrderPendingStep3: false,
            drinkDetailDialog: false,
            form: {
                name: '',
                ingredientA: 1,
                ingredientB: 2,
                ingredientC: 1,
                ingredientD: 2,
            },
            formLabelWidth: '100px',
            drinks: [],
            allergens: []
        };
    },
    created() {
      this.getDrinks();
      this.getAllergensList();
    },
    methods: {
        handleConfirmation() {
            const Ingredient1 = parseInt(this.form.ingredientA);
            const Ingredient2 = parseInt(this.form.ingredientB);
            const Ingredient3 = parseInt(this.form.ingredientC);
            const Ingredient4 = parseInt(this.form.ingredientD);
            const transId = parseInt(this.transId);
            const machineId = parseInt(this.machineId);
            const pourContent = [{ Ingredient1 }, { Ingredient2 }, { Ingredient3 }, { Ingredient4 }];
            this.$mqttApi.mqttPour('1', machineId, transId, pourContent);
            this.drinkOrderPendingStep1 = false;
            this.openNewDialog();
        },
        handleTestFinished(result) {
          if (result.passed) {
            this.orderDrink()
          } else {
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
        orderDrink() {
            let userId = -1;
            if (this.$store.getters.getUser) {
                userId = this.$store.getters.getUser.id;
            }
            this.$orderApi.createOrder(2, this.machineId, 1, userId).then(res => {
                if (res.status === 201) {
                    this.transId = res.data.id;
                    this.drinkOrderPendingStep1 = true;
                }
            }).catch(err => {
                console.log(err.response);
                this.$message.error(err.response.data.message);
            });
        },
        getDrinks(){
          let userId = -1;
            if (this.$store.getters.getUser) {
                userId = this.$store.getters.getUser.id;
            }
            this.$drinkApi.getDrinkMenu(userId).then(res => {
                if (res.status === 200) {
                  for (let drink of res.data) {
                    if (drink.is_active && drink.is_customized) {
                      this.drinks.push(drink)
                    }
                  }
                }
            }).catch(err => {
                console.log(err.response);
                this.$message.error(err.response.data.message);
            });
        },
        getAllergensList(){
          this.$profileApi.getDefaultAllergyList().then((res)=>{
            if(res&&res.status ===200){
              this.allergens = res.data
            }
          })
        },
        getAllergenText(allergenIds){
          let allergenNames = [];
          for (let allergen of allergenIds) {
            let matchedAllergen = this.allergens.find(obj => obj.id == allergen)
            allergenNames.push(matchedAllergen.name)
          }
          if (allergenNames.length > 0){
            return "WARNING: This drink contains the following allergens: " + allergenNames.join(', ');
          } else {
            return ""
          }
        }
    },
    components: { SobrietyTest, CustomizeDrink }
}
</script>

<style scoped>
  .menu {
    color: #000000;
    text-align: center;
    font: 600 16px "Manrope", sans-serif;

  }
  .description {
    font-size: 12px;
  }
  .el-row {
    margin-bottom: 20px;
   &:last-child {
     margin-bottom: 0;
   }
  }
  .el-col {
    border-radius: 4px;
    display: inline-block;
    flex: 0 0 auto;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .scroll-container {
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  }

.scroll-row {
  display: flex;
  flex-wrap: nowrap;
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
  .add-card-container {
  width: 50vw;
  height: 50vh;
  max-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.card{
    border-radius: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
.centered-content {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 100%;
  background-color: #bbc1c9;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-bottom: 40px;
}
.content-with-icon {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content {
  flex-grow: 1;
}

.icon-right {
  padding: 10px;
  font-size: 32px; /* Adjust the size as needed */
}
</style>
