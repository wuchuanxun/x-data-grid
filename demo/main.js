import Vue from 'vue'
import App from './App.vue'

import xDataGrid from '../packages/x-data-grid'
Vue.component('x-data-grid', xDataGrid)
import '../lib/xDataGrid.css'

new Vue({
  render: h => h(App)
}).$mount('#app')
