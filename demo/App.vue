<template>
  <div id="app">
    <x-data-grid
      height="calc(100vh - 200px)"
      :editable="true"
      :source="data"
      :columns="columns"
      :page-size="50"
      :page-index="0"
      @selectChanged="showId"
    >
      <template slot="_action">
        导出
      </template>
      <template
        slot="operation"
        slot-scope="text"
      >
        <button>{{ text }}</button>
      </template>
    </x-data-grid>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      columns: [
        {
          type: '_check',
          width: 40,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '名称',
          key: 'name',
          type: 'text',
          adjustable: true,
          filterable: true,
          width: 100,
          ellipsis: true,
          sortable: true
        },
        {
          title: '数量',
          key: 'num',
          sortable: true,
          sortFn: null,
          adjustable: true,
          filterable: true,
          type: 'number',
          align: 'center'
        },
        {
          title: '复制',
          adjustable: true,
          key: 'num',
          width: 800
        },
        {
          title: '单价',
          adjustable: true,
          key: 'unitPrice',
          width: 300,
          scopedSlots: 'operation',
          fixed: 'right'
        }
      ],
      data: [

      ]
    }
  },
  created () {
    const dataCache = []
    for (let index = 0; index < 10000; index++) {
      dataCache.push(...[{
        name: '真果切换绑阿萨德群无多无群定强无敌无抢班夺权我觉得千万 ',
        num: 2 * index + 0.2131213,
        unitPrice: 59.9,
        id: index * 3
      },
      {
        name: '苏泊力锅 ',
        num: 3 * index,
        unitPrice: 2132139128381278.0,
        id: index * 3 + 1
      },
      {
        name: '乐薯片',
        num: 4 * index,
        unitPrice: 63.0,
        id: index * 3 + 2
      }])
    }
    this.data = dataCache
  },
  methods: {
    showId (checkedKeys) {
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
