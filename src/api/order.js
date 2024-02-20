import http from '@/lib/http';
export const orderApi ={
  createOrder (drinkId, userId) {
    return http
      .post('/order/create',{
        drinkId,
        userId
      })
  }
}
