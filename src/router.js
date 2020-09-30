import Vue from 'vue'
import Router from 'vue-router'
import { TOKEN_NAME } from '@/config/constants'
import Main from './components/Layout'
import Home from './views/Home'
import Login from './views/Login'
import Register from './views/Register'
import User from './views/User'
import Product from './views/Product'
import Device from './views/Device'
import TestRecord from './views/TestRecord'
import Station from './views/Station'
import Factory from './views/Factory'
import Download from './views/Download'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/',
      name: 'download',
      component: Download
    },
    {
      path: '/home',
      name: 'home',
      component: Main,
      children: [
        {
          path: '/',
          component: Home,
          meta: { title: '首页', requireAuth: true }
        }
      ]
    },
    {
      path: '/user',
      name: 'user',
      component: Main,
      children: [
        {
          path: '/users',
          component: User,
          meta: { title: '用户列表', requireAuth: true }
        }
      ]
    },
    {
      path: '/product',
      name: 'product',
      component: Main,
      children: [
        {
          path: '/devices',
          component: Device,
          meta: { title: 'SN列表', requireAuth: true }
        },
        {
          path: '/products',
          component: Product,
          meta: { title: '产品列表', requireAuth: true }
        }
      ]
    },
    {
      path: '/test',
      name: 'test',
      component: Main,
      children: [
        {
          path: '/test_records',
          component: TestRecord,
          meta: { title: '测试记录管理', requireAuth: true }
        },
        {
          path: '/factorys',
          component: Factory,
          meta: { title: '工厂管理', requireAuth: true }
        },
        {
          path: '/stations',
          component: Station,
          meta: { title: '工位管理', requireAuth: true }
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
    },
    {
      path: '/401',
      component: resolve => require(['./views/401.vue'], resolve),
      meta: { title: '401' }
    },
    {
      path: '/403',
      component: resolve => require(['./views/403.vue'], resolve),
      meta: { title: '403' }
    },
    {
      path: '/404',
      component: resolve => require(['./views/404.vue'], resolve),
      meta: { title: '404' }
    },
    {
      path: '/500',
      component: resolve => require(['./views/500.vue'], resolve),
      meta: { title: '500' }
    },
    {
      path: '*',
      redirect: '/404'
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
