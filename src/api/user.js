import http from '@/lib/http';
export const userApi ={
  login (email,password) {
    return http
      .post('/user/login',{
        email,
        password
      })
  },
  register (email,password) {
    return http
      .post('/user/signup',{
        email,
        password
      })
  }
}
