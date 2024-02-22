<template>
    <div>
      <el-button size="mini" @click="showDialog = true" round>{{ buttonText }}</el-button>

      <el-dialog title="Customize Your Drink" :visible.sync="showDialog" @close="closeDialog" width="80%">
        <el-form ref="customDrinkForm">

        <el-form-item>
            <div style="text-align: left;">Drink Name:</div>
            <el-input v-model="drinkName"></el-input>
        </el-form-item>

        <el-form-item>
          <div style="text-align: left;">Select Ingredients:</div>
          <el-select v-model="selectedIngredientIds" multiple @change="handleIngredientSelect" placeholder="Select ingredients...">
            <el-option
              v-for="ingredient in availableIngredients"
              :key="ingredient.id"
              :label="ingredient.name"
              :value="ingredient.id">
            </el-option>
          </el-select>
        </el-form-item>

        <div v-for="ingredient in selectedIngredients" :key="ingredient.id">
          <el-form-item>
            <div style="text-align: left;">{{ ingredient.name }}</div>
            <div class="input-wrapper">
              <el-input v-model="ingredient.amount" type="number"  min=1 style="margin-right: 8px;"></el-input>
              <span class="unit">oz</span>
            </div>
          </el-form-item>
        </div>

        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">Cancel</el-button>
          <el-button type="primary" @click="createCustomDrink">Create</el-button>
        </span>
      </el-dialog>
    </div>
  </template>

  <script>
import { reactive } from 'vue';

  export default {

    data() {
      return {
        showDialog: false,
        selectedIngredients: [],
        availableIngredients: [],
        selectedIngredientIds: [],
        drinkName: "Custom " + this.baseDrinkName
      };
    },
    props: {
        buttonText: {
            type: String,
            default: "Create Custom Drink"
        },
        ingredientIds:{
            type: Array,
            default() {
                return [];
            }
        },
        baseDrinkName: {
            type: String,
            default: "Drink"
        }
    },
    created() {
        this.getIngredients()
    },
    methods: {
      getIngredients() {
        this.$drinkApi.getIngredientsList().then(res => {
            if (res.status === 200) {
                for (let ingredient of res.data) {
                    if (ingredient.is_active) {
                        this.availableIngredients.push(ingredient)

                        if(this.ingredientIds.includes(ingredient.id)) {
                            ingredient.amount = 1;
                            const reactiveIngredient = reactive({ id: ingredient.id, name: ingredient.name, amount: 1 })
                            this.selectedIngredients.push(reactiveIngredient)
                            this.selectedIngredientIds.push(ingredient.id)
                        }
                    }
                }
            }
        }).catch(err => {
            //console.log(err.response);
            this.$message.error(err.response.data.message);
        });
      },
      handleIngredientSelect(value) {
        this.selectedIngredients = this.availableIngredients.filter(ingredient => value.includes(ingredient.id)).map(ingredient => ({
        ...ingredient,
        amount: this.selectedIngredients.find(i => i.id === ingredient.id)?.amount || 1,
        }));
      },
      createCustomDrink() {

        let drinkIngredients = [];
        for (let ingredient of this.selectedIngredients) {
            let ingredientObject = {
                "ingredientId": parseInt(ingredient.id),
                "quantity": ingredient.amount
            }
            drinkIngredients.push(ingredientObject);
        }
        let userId = this.$store.getters.getUser.id;
        this.$drinkApi.createCustomDrink(drinkIngredients, this.drinkName, userId).then(res => {
            if (res.status === 201) {
                //console.log(res)
                this.closeDialog();
                //console.log(this.$router.currentRoute)
              this.$router.go(this.$router.currentRoute)
            }
        }).catch(err => {
            console.log(err.response);
            this.$message.error(err.response.data.message);
        });
      },
      resetIngredientsList() {
        this.selectedIngredients = [];
        this.selectedIngredientIds = [];
        for (let ingredient of this.availableIngredients) {
            if(this.ingredientIds.includes(ingredient.id)) {
                ingredient.amount = 1;
                const reactiveIngredient = reactive({ id: ingredient.id, name: ingredient.name, amount: 1 })
                this.selectedIngredients.push(reactiveIngredient)
                this.selectedIngredientIds.push(ingredient.id)
            }
        }
        this.drinkName = "Custom " + this.baseDrinkName;
      },
      closeDialog(){
        this.resetIngredientsList();
        this.showDialog = false;
      }
    },

  };
  </script>

  <style scoped>
  .dialog-footer {
    text-align: right;
  }
  .input-wrapper {
  display: flex; /* Use flexbox to align items in a row */
  align-items: center; /* Align items vertically in the center */
}

.unit {
  white-space: nowrap; /* Prevent the "oz" text from wrapping */
}
  </style>
