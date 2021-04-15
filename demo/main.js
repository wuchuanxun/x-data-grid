import Vue from 'vue'
import App from './App.vue'

import xDataGrid from '../packages/x-data-grid'
Vue.component('x-data-grid', xDataGrid)
import '../packages/x-data-grid.scss'

new Vue({
  render: h => h(App)
}).$mount('#app')
