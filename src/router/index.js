import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "../components/Home";
import Login from "../components/Login";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Default',
    redirect: '/login',
    component:  Login,
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login', name: 'Login', component: () => import('../components/Login')
  },
  {
    path: '/register', name: 'Register', component: () => import('../components/Register')
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
      redirect: '/home',
      component:  Home,
    },
    {
      path: '/login', name: 'Login', component: () => import('@/components/Login.vue')
    },
    {
      path: '/register', name: 'Register', component: () => import('@/components/Register.vue')
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,

    },
  ]
})

