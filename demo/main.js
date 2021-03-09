import Vue from 'vue'
import App from './App.vue'

import xDataGrid from '../lib/xDataGrid.umd.min.js'
Vue.use(xDataGrid)
import '../lib/xDataGrid.css'

new Vue({
  render: h => h(App)
}).$mount('#app')
