import Vue from 'vue'
import VueRouter from 'vue-router'
import UserHome from "../components/user/Home";
import UserLogin from "../components/user/Login";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Default',
    component:  UserLogin,
  },
  {
    path: '/user',
    name: 'User',
    children: [
      {path: '/home', name: 'UserHome', component: ()=>import('../components/user/Home')},
      {path: '/login',name:'UserLogin',component:()=>import('../components/user/Login')},
      {path:'/register',name:'UserRegister',component:()=>import('../components/user/Register')},
    ]
  },
]




const router = new VueRouter({
  mode:'history',
  routes
})

router.selfaddRoutes = (params) => {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
  // router.matcher = new VueRouter({mode: 'history'}).matcher
  router.addRoutes(params)
}
export default router

export const createRouter =() => new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Default',
      redirect: '/user/login',
      component:  UserLogin,
    },
    {
      path: '/user',
      name: 'User',
      children: [
        {path: '/home', name: 'UserHome', component: ()=>import('../components/user/Home')},
        {path: '/login',name:'UserLogin',component:()=>import('../components/user/Login')},
        {path:'/register',name:'UserRegister',component:()=>import('../components/user/Register')},
      ]
    },
  ]
})

