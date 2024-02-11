import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en'
import {mqttApi} from "@/api/mqtt";
import {orderApi} from "@/api/order";
import {userApi} from "@/api/user";
import {profileApi} from "@/api/profile";
import { drinkApi } from './api/drinks';


Vue.prototype.$mqttApi = mqttApi;
Vue.prototype.$orderApi = orderApi;
Vue.prototype.$userApi = userApi;
Vue.prototype.$profileApi = profileApi;
Vue.prototype.$drinkApi = drinkApi;
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

