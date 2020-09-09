import Vue from 'vue'
import Vuex from 'vuex'
import { TOKEN_NAME, SUCCESS_CODE } from '@/config/constants'
import { usersApi } from '@/config/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {},
    token: localStorage.getItem(TOKEN_NAME)
  },
  mutations: {
    LOGOUT: (state) => {
      localStorage.removeItem(TOKEN_NAME)
      localStorage.removeItem('account')
      localStorage.removeItem('name')
      localStorage.removeItem('password')
      state.token = null
      state.userInfo = {}
    },
    LOGIN: (state, userInfo) => {
      localStorage.setItem('account', userInfo.account)
      localStorage.setItem('name', userInfo.name)
      localStorage.setItem('password', userInfo.password)
      state.token = userInfo.token
      state.userInfo = { ...userInfo }
    },
    SET_TOKEN (state, token) {
      state.token = token
      localStorage.setItem(TOKEN_NAME, token)
    },
    SET_USER_INFO (state, userInfo) {
      state.userInfo = { ...userInfo }
    }
  },
  actions: {
    GET_USER_INFO ({ commit }) {
      return new Promise((resolve, reject) => {
        Vue.prototype.$axios.get(usersApi).then(res => {
          const { code, data, message } = res.data
          if (code === SUCCESS_CODE) {
            commit('SET_USER_INFO', data)
            resolve()
          } else {
            commit('SET_TOKEN', '')
            commit('SET_USER_INFO', {})
            reject(new Error(message))
          }
        })
      })
    }
  }
})
