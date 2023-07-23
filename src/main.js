import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from "axios"
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en'

axios.defaults.baseURL = 'http://localhost:8498'
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
axios.defaults.withCredentials = false

Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.use(ElementUI,{locale})
/* eslint-disable no-new */

router.beforeEach(((to, from, next) => {
  // if(store.getters.getUser && to.path.startsWith('/admin')){
  //   initAdminMenu(router,store)
  //   next()
  // }

  // if(store.getters.getUser && to.path.startsWith('/login')){
  //   next({
  //     path:'/admin/dashboard'
  //   })
  // }

  if(to.meta.requireAuth){
    if(store.getters.getUser){
      // axios.get('/authentication').then(res=>{
      //   if(res){
          next()
      //   }
      // })
    }else{
      next({
        path:'/user/login',
        query:{redirect:to.fullPath}
      })
    }
  }else{
    next()
  }

}))

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

