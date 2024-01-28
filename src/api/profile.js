import http from '@/lib/http';
export const profileApi ={
  getDefaultAllergyList () {
    return http
      .get('/allergen/options')
  },
  getUserAllergyList (userid) {
    return http
      .get('/allergen/user/'+userid)
  },
  setUserAllergy (allergenIds,userId) {
    return http
      .post('/allergen/associate',{
        allergenIds,
        userId
      })
  },
}
