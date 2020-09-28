import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { TOKEN_NAME, API_BASE_URL } from '@/config/constants'

axios.defaults.timeout = 10000
axios.defaults.baseURL = API_BASE_URL

// 请求拦截器
axios.interceptors.request.use(
  config => {
    if (localStorage[TOKEN_NAME]) { // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = `${localStorage[TOKEN_NAME]}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  })

// 响应拦截器
axios.interceptors.response.use(function (response) {
  // 获取更新的token
  const { authorization } = response.headers
  // 如果token存在则存在localStorage
  authorization && localStorage.setItem(TOKEN_NAME, authorization)
  return response
},
function (error) {
  let msg = ''
  if (error.response) {
    msg = error.response.data.message
    switch (error.response.status) {
      case 401 :
        // 返回 401 (未授权) 清除 token 并跳转到登录页面
        store.commit('LOGOUT')
        router.replace({
          path: '/login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        })
        break
      case 405 :
        console.log('请求方法不能被用于请求相应的资源！')
        break
      default:
        console.log('服务器出错，请稍后重试！')
    }
  }
  const err = { code: error.response.status, message: msg }
  return Promise.reject(err)
})

Vue.prototype.$axios = axios
