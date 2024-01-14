import http from '@/lib/http';
export const orderApi ={
  createOrder (drinkId, machineId, quantity, userId) {
    return http
      .post('/order/create',{
        drinkId,
        machineId,
        quantity,
        userId,
      })
  }
}
