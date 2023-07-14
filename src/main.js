import Vue from 'vue'
import App from './App'
import router from './router'
// import store from './store'
import axios from "axios"
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en'

axios.defaults.baseURL = 'http://localhost:8498/mqtt'

// axios.defaults.withCredentials = true
Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.use(ElementUI,{locale})
/* eslint-disable no-new */
new Vue({
  router,
  // store,
  render: h => h(App)
}).$mount('#app')

