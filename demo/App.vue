<template>
  <div id="app">
    <x-data-grid
      ref="grid"
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
        slot-scope="text,record"
      >
        <button @click="deleteRow(record)">
          删除
        </button>
      </template>
      <p
        slot="expandedRowRender"
        slot-scope="record,index"
      >
        展开行数据下标为: {{ index }}
      </p>
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
          width: 100,
          ellipsis: true,
          sortable: true,
          customAttrs: function (value, row, index, source) {
            if (index > 0 && source[index].name === source[index - 1].name) {
              return {
                rowspan: 0
              }
            }
            let rowspan = 1
            const rname = source[index].name
            let ri = index + 1
            while (ri < source.length && source[ri].name === rname) {
              ri++
              rowspan++
            }
            return {
              rowspan: rowspan
            }
          }
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
          title: '单价',
          adjustable: true,
          key: 'unitPrice.value',
          filterable: true,
          width: 800
        },
        {
          title: '操作',
          key: 'none',
          width: 100,
          adjustable: true,
          scopedSlots: 'operation'
        }
      ],
      data: [

      ]
    }
  },
  created () {
    const dataCache = []
    for (let index = 0; index < 20; index++) {
      dataCache.push(...[{
        name: '真果切换绑阿萨德群无多无群定强无敌无抢班夺权我觉得千万 ',
        num: 2 * index + 0.2131213,
        unitPrice: { value: 59.9 },
        id: index * 3
      },
      {
        name: ['苏泊力锅', 'dadqw'],
        num: 3 * index,
        unitPrice: { value: 2132139128381278.0 },
        id: index * 3 + 1
      },
      {
        name: { name: '乐薯片' },
        num: 4 * index,
        unitPrice: { value: 66.0 },
        id: index * 3 + 2
      }])
    }
    this.data = dataCache
    const that = this
    setTimeout(() => {
      that.data[0]._checked = true
      that.data.push()
    }, 5000)
  },
  methods: {
    showId (checkedKeys) {

    },
    deleteRow (row) {

    },

    slice10 () {
      this.$refs.grid.filterData((source) => {
        return source.slice(0, 10)
      })
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

.x-data-grid {
    th,td{
      padding: 6px 10px !important;
    }
}
</style>
