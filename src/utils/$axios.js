import axios from "axios";
import {environment} from "../environment/environment.ts";
import Vue from "vue";


const $axios = axios.create({
  baseURL: environment.backendServerName + environment.sveServicesPort,
  withCredentials: false
});
Vue.prototype.$axios = $axios

export default $axios
