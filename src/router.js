import Vue from 'vue'
import Router from 'vue-router'
import { TOKEN_NAME } from '@/config/constants'
import Main from './components/Layout'
import Home from './views/Home'
import Login from './views/Login'
import Register from './views/Register'
import User from './views/User'
import Product from './views/Product'
Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main,
      children: [
        {
          path: '/',
          component: Home,
          meta: { title: '首页', requireAuth: true }
        },
        {
          path: '/users',
          component: User,
          meta: { title: '用户列表', requireAuth: true }
        },
        {
          path: '/products',
          component: Product,
          meta: { title: '产品列表', requireAuth: true }
        }
      ]
    },
    {
      path: '/login',
      component: Login,
      meta: { title: '登陆页' }
    },
    {
      path: '/register',
      component: Register,
      meta: { title: '注册页' }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage[TOKEN_NAME]
  if (to.meta.requireAuth) { // 判断该路由是否需要登陆权限
    if (token) {
      next()
    } else {
      next({
        path: '/login'
      })
    }
  } else {
    next()
  }
})

export default router
