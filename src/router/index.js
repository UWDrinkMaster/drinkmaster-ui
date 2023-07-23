import Vue from 'vue'
import VueRouter from 'vue-router'
import UserHome from "../components/user/Home";
import UserLogin from "../components/user/Login";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Default',
    redirect:  '/user/login',
  },

  {path: '/user/home', name: 'UserHome', component: ()=>import('../components/user/Home')},
  {path: '/user/login',name:'UserLogin',component:()=>import('../components/user/Login')},
  {path:'/user/register',name:'UserRegister',component:()=>import('../components/user/Register')},
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
    {path: '/user/home', name: 'UserHome', component: ()=>import('../components/user/Home')},
    {path: '/user/login',name:'UserLogin',component:()=>import('../components/user/Login')},
    {path:'/user/register',name:'UserRegister',component:()=>import('../components/user/Register')},
  ]
})

