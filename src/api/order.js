import http from '@/lib/http';
export const orderApi ={
  createOrder (drinkId, userId) {
    return http
      .post('/order/create',{
        drinkId,
        userId
      })
  },
  getUserOrders ( userId) {
    return http
      .get('/order/user/' + userId)
  },


}
