import http from '@/lib/http';
export const userApi ={
  login (email,password) {
    return http
      .post('/user/login',{
        email,
        password
      })
  },
  register (email,password, dateOfBirth) {
    return http
      .post('/user/signup',{
        email,
        password,
        dateOfBirth,
      })
  },
  getUser (userId){
    return http
    .get('/user/' + userId)
  },
  updateSobrietyScore(score, userId){
    return http.post('/user/sobriety_test', {
      score,
      userId
    })
  }
}
