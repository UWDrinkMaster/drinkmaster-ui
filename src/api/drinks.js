import http from '@/lib/http';
export const drinkApi ={
  getDrinkMenu (userId) {
    return http
      .get('/drink/user/' + userId)
  },
  getIngredientsList(){
    return http.get('/drink/ingredient')
  },
  createCustomDrink(drinkIngredients, name, userId){
    return http.post('/drink/customize', {
      drinkIngredients,
      name,
      userId
    })
  }
}