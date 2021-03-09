import xDataGrid from './x-data-grid.js'
import './x-data-grid.scss'

xDataGrid.install = Vue => Vue.component(xDataGrid.name, xDataGrid)

const install = function (Vue) {
  Vue.component(xDataGrid.name, xDataGrid)
}

/* 支持使用标签的方式引入 */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  xDataGrid
}
