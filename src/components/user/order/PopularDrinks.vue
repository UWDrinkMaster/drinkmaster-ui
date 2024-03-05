<template>
  <div>
    <el-row>
    </el-row>

  <el-row>
    <el-col :span="24"><div class="grid-content bg-purple-dark menu">Popular Drinks</div></el-col>
  </el-row>

  <div class="scroll-container">
    <el-row class="scroll-row">
      <el-col :span="10" v-for="drink in drinks" :key="drink.id" :offset="1">
        <el-card class="card" :body-style="{ padding: '0px' }">
          <div class="content-with-icon">
            <div class="content">
              <img :src=drink.image_url class="image">
              <div style="padding: 10px; text-align: center;">
                <h5 style="white-space: normal; word-break: keep-all;">{{drink.name}}</h5>
                <p style="white-space: normal; font-size: 12px;">{{drink.description}}</p>
                <div v-if="drink.is_available">
                  <div class="bottom clearfix">
                    <CustomizeDrink button-text='Customize' :ingredient-ids=drink.ingredient_ids :base-drink-name=drink.name></CustomizeDrink>
                    <SobrietyTest :drinkId="drink.id" @testFinished="handleTestFinished"/>
                  </div>
                </div>
                <div v-else>
                  <h6 style="white-space: normal; font-size: 12px;">This drink is currently out of stock.</h6>
                </div>
                <el-tooltip v-if="drink.id < 5 && !drink.is_allergic" placement="top">
                  <template #content>
                    Recommended for you!
                  </template>
                  <i class="el-icon-star-on icon-left"></i>
                </el-tooltip>
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
    </el-row>
  </div>

    <el-dialog
      title="Order Confirm"
      :visible.sync="drinkOrderPendingStep1"
      width="80%"
      :modalAppendToBody="false"
      center>
      <span>Drinkmaster is ready to mix your drink.
Please confirm the drink cup has been placed in the machine.</span>
      <span slot="footer" class="dialog-footer">
            <el-button  type="warning" @click="drinkOrderPendingStep1 = false">Close</el-button>
            <el-button  @click="orderDrink">Confirm</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="Your Drink is Ordered!"
      :visible.sync="drinkOrderPendingStep2"
      width="80%"
      :modalAppendToBody="false"
      center>
        <div class="dialog-content">
      <p>
           Mixing... </p>
        <span>
              You will get a pop-up message when your drink is ready! </span>
        <span>
              or you can track your order status in Order History. </span>
<!--      <span slot="footer" class="dialog-footer">-->

<!--&lt;!&ndash;          <el-button  @click="handleMixing">Next</el-button>&ndash;&gt;-->
<!--      </span>-->
        </div>
    </el-dialog>

    <el-dialog
      title="Your Drink is ready!"
      :visible.sync="drinkOrderPendingStep3"
      width="80%"
      :modalAppendToBody="false"
      center>
      <span>
              Your drink has finished mixing. Enjoy! </span>
      <span slot="footer" class="dialog-footer">
          <el-button @click="drinkOrderPendingStep3 = false">Finish</el-button>
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
            selectedDrinkId: -1,
            selectedDrinkId: -1,
            drinkOrderPendingStep1: false,
            drinkOrderPendingStep2: false,
            drinkOrderPendingStep3: false,
            drinkDetailDialog: false,
            formLabelWidth: '100px',
            drinks: [],
            allergens: []
        };
    },
    created() {
      this.getDrinks()
      this.getAllergensList()
    },
    methods: {
        handleTestFinished(result) {
          if (result.passed) {
            //console.log("testfinished, drink id is:" + result.drinkId)
            this.selectedDrinkId = result.drinkId;
            this.drinkOrderPendingStep1 = true;
          }
        },
        handleMixing() {
            this.drinkOrderPendingStep2 = false;
            this.drinkOrderPendingStep3 = true;
        },
        updateSelectedDrink(drinkId) {
          //console.log("drinkId is :" + drinkId)
          this.selectedDrinkId = drinkId;
        },
        orderDrink() {
            let userId = -1;
            if (this.$store.getters.getUser) {
                userId = this.$store.getters.getUser.id;
            }
            this.$orderApi.createOrder(this.selectedDrinkId, userId).then(res => {
                if (res.status === 201) {
                    this.transId = res.data.id;
                    this.drinkOrderPendingStep1 = false;
                    this.drinkOrderPendingStep2 = true;
                    this.drinkOrderPendingStep1 = false;
                    this.drinkOrderPendingStep2 = true;
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
                    if (drink.is_active && !drink.is_customized) {
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

  .card{
    border-radius: 20px; /* Increase border radius for rounded corners */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    margin-bottom: 16px;
    overflow-wrap: break-word;
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
  color: #FA3939;
}
.icon-left {
  padding: 10px;
  font-size: 32px; /* Adjust the size as needed */
  color: gold;
}
  .dialog-content {
      padding: 20px;
      text-align: center;
      background-color: rgb(255, 250, 170);
      border-radius: 5px;
      white-space: normal; /* Allow text to wrap */
  }

  .el-dialog__header {
      background-color: #409EFF;
      color: white;
      border-radius: 5px 5px 0 0;
  }

  .el-dialog__footer {
      text-align: center;
  }

  .el-button--primary,
  .el-button--default {
      margin: 0 10px;
  }

  .icon-star {
  position: absolute;
  z-index: 10;
  top: 0;
  right: 0;
  font-size: 24px; /* Adjust size as needed */
  color: gold; /* Or any color you prefer */
  padding: 10px; /* Adjust for positioning inside the card */
}
</style>
