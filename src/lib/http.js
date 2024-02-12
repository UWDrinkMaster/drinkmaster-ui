/**
 * @name: http
 * @author: Zhongxu(Donald)
 * @date: 12/12/2023 14:28
 * @description：http
 */
import axios from 'axios'


const http = axios.create({
  baseURL:  process.env.VUE_APP_URL + process.env.VUE_APP_PORT,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json;charset=UTF-8'
  },
  timeout: 30000,
  withCredentials: false
});


export default http
