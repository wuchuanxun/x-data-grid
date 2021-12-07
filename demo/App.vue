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
      :group-key="groupFunc"
      show-group-qty
      click-expand
      :checked-keys.sync="checkedKeys"
      @selectChanged="showId"
      @editCell="editCell"
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
          title: '单价',
          adjustable: true,
          key: 'unitPrice.value'
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

      ],
      checkedKeys: []
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
        name: 'wdee',
        num: 3 * index,
        unitPrice: { value: 2132139128381278.0 },
        id: index * 3 + 1
      },
      {
        name: 'asdas',
        num: 4 * index,
        unitPrice: { value: 66.0 },
        id: index * 3 + 2
      }])
    }

    this.data = dataCache
    const that = this
    setInterval(() => {
      that.data = [...dataCache]
    }, 6000)
  },
  methods: {
    groupFunc (record) {
      return record.name
    },

    showId (checkedKeys) {

    },

    deleteRow (row) {

    },

    editCell (record) {
      this.$set(this.data[record.index], record.key, record.value)
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

    .hello>td{
      background-color: red !important;
    }
}
</style>
