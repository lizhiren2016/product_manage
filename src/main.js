import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/icon.css'
import 'babel-polyfill'
import './common/js/axios'
import './common/js/dateFormat'
import './vendor/Blob'
import './vendor/Export2Excel'

import Pagination from './components/Pagination'
import RefreshButton from './components/RefreshButton'
import SearchInput from './components/SearchInput'

Vue.config.productionTip = false

Vue.use(ElementUI, {
  size: 'small'
})
Vue.use(Pagination)
Vue.use(RefreshButton)
Vue.component(Pagination)
Vue.use(SearchInput)
Vue.component('pagination', Pagination)
Vue.component('refresh-button', RefreshButton)
Vue.component('search-input', SearchInput)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
