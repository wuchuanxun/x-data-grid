import Fuse from 'fuse.js'
import { debounce } from 'debounce'
import numeral from 'numeral'

const defaultSortFn = function (a, b) {
  if (a < b) {
    return -1
  } else if (a > b) {
    return 1
  }
  return 0
}

const defaultNumberFormat = '0,0[.]00'

export default {
  name: 'x-data-grid',

  props: {
    // 表头列名称
    columns: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 数据
    source: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 页面大小
    pageSize: {
      type: Number,
      default: 0
    },
    editable: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: ''
    },
    rowKey: {
      type: String,
      default: '_index'
    }
  },

  data () {
    return {
      pageX: 0, // 移动的时候鼠标位置
      inResize: false, // 是否正在缩放

      colWidth: 0, // 缩放列原始宽度
      col: null, // 缩放列
      nextCol: null, // 下一列
      nextColWidth: 0, // 下一列原始列宽

      editCell: [1, 1],
      pageIndex: 0,

      options: {
        useExtendedSearch: true,
        keys: ['.']
      },

      filterSource: [],

      activeRowKey: -1,

      sortFn: defaultSortFn,
      sortType: 'normal',
      sortKey: null,
      needSort: false
    }
  },

  computed: {
    fuse () {
      return new Fuse(this.source, this.options)
    }
  },

  render (createElement) {
    const that = this

    const ths = [] // 标题
    const cols = [] // 列定义
    const trs = [] // 行数据

    let fixRAll = 0
    let fixL = 0
    let fixR = 0

    this.columns.forEach(col => {
      if (col.fixed === 'right') {
        fixRAll += col.width
      }
    })
    fixR = fixRAll

    this.columns.forEach(function (col, index) {
      if (col.type === '_check') {
        cols.push(createElement('col', {
          style: {
            width: (col.width || 20) + 'px'
          }
        }))
      } else if (col.width) {
        cols.push(createElement('col', {
          style: {
            width: col.width + 'px'
          }
        }))
      } else if (col.minWidth) {
        cols.push(createElement('col', {
          style: {
            width: col.minWidth + 'px'
          }
        }))
      } else {
        cols.push(createElement('col'))
      }

      let titleContent = [col.title]
      if (col.type === '_check') {
        titleContent = [
          createElement('input', {
            attrs: {
              type: 'checkbox',
              checked: false
            },
            on: {
              change (e) {
                const status = e.target.checked
                const rKeys = []
                for (const rr of renderData) {
                  that.$set(rr, '_checked', status)
                  if (status) {
                    rKeys.push(rr[that.rowKey])
                  }
                }
                that.$emit('selectChanged', rKeys)
              }
            }
          })
        ]
      } else if (col.sortable) {
        if (col._sortType === 'asc') {
          titleContent[0] += '↑'
        } else if (col._sortType === 'desc') {
          titleContent[0] += '↓'
        }
      }

      const event = {}
      if (col.sortable) {
        event.click = function (e) {
          if (col._sortType === 'normal') {
            that.sortType = 'asc'
          } else if (col._sortType === 'asc') {
            that.sortType = 'desc'
          } else {
            that.sortType = 'normal'
          }
          that.sortFn = col.sortFn || defaultSortFn
          that.sortKey = col.key
          that.needSort = true

          that.columns.forEach((p, idx) => {
            if (idx === index) {
              p._sortType = that.sortType
            } else {
              p._sortType = 'normal'
            }
          })
          // 强制刷新
          that.columns.push()
        }
      }

      if (col.fixed === 'left') {
        ths.push(createElement('th', {
          style: {
            userSelect: 'none',
            position: 'sticky',
            left: fixL + 'px',
            zIndex: 10
          },
          on: event
        }, titleContent))
        fixL += col.width
      } else if (col.fixed === 'right') {
        fixR -= col.width
        ths.push(createElement('th', {
          style: {
            userSelect: 'none',
            position: 'sticky',
            right: fixR + 'px',
            borderLeft: '1px solid #D8DADC',
            zIndex: 10
          },
          on: event
        }, titleContent))
      } else if (col.adjustable) {
        ths.push(createElement('th', {
          style: {
            userSelect: 'none'
          },
          on: event
        }, [
          createElement('span', {
            style: {
              display: 'inline-block',
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }
          }, titleContent),
          createElement('div', {
            style: {
              top: 0,
              right: '-4px',
              width: '8px',
              position: 'absolute',
              cursor: 'col-resize',
              height: '100%',
              touchAction: 'none'
            },
            on: {
              'mousedown': function (e) {
                that.pageX = e.pageX
                const curCol = e.target.parentElement
                const nxtCol = curCol.nextElementSibling

                that.colWidth = curCol.offsetWidth
                that.inResize = true
                that.col = col
                that.nextCol = that.columns[index + 1]

                if (nxtCol) {
                  that.nextColWidth = nxtCol.offsetWidth
                }
              }
            }
          })
        ]))
      } else {
        ths.push(createElement('th', {
          style: {
            userSelect: 'none'
          },
          on: event
        }, titleContent))
      }
    })

    let renderData = this.filterSource
    // 排序
    if (this.needSort) {
      if (this.sortType !== 'normal') {
        const dir = this.sortType === 'asc' ? 1 : -1
        renderData.sort((a, b) => {
          return that.sortFn(a[that.sortKey], b[that.sortKey]) * dir
        })
      } else {
        renderData.sort((a, b) => {
          return defaultSortFn(a._index, b._index)
        })
      }
      this.needSort = false
    }

    // 分页
    if (this.pageSize > 0) {
      renderData = renderData.slice(this.pageSize * this.pageIndex, this.pageSize * this.pageIndex + this.pageSize)
    }

    renderData.forEach(function (row, rindex) { // 遍历行
      var tds = []// <td> 标签数组

      fixL = 0
      fixR = fixRAll

      if (that.enableRowSelector) {
        tds.push(createElement('input', {
          attrs: {
            type: 'checkbox'
          }
        }))
      }

      that.columns.forEach(function (cell) { // 遍历单元格
        const styleText = cell.ellipsis ? {
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden'
        } : {}

        let tdContent = row[cell.key]
        if (cell.type === 'number') {
          tdContent = numeral(tdContent).format(cell.format)
        }

        if (cell.type === '_check') {
          tdContent = [
            createElement('input', {
              attrs: {
                type: 'checkbox',
                checked: row._checked
              },
              on: {
                change (e) {
                  const status = e.target.checked
                  row._checked = status
                  const rKeys = []
                  for (const rr of renderData) {
                    if (rr._checked) {
                      rKeys.push(rr[that.rowKey])
                    }
                  }
                  that.$emit('selectChanged', rKeys)
                }
              }
            })
          ]
        } else if (cell.scopedSlots) {
          tdContent = that.$scopedSlots[cell.scopedSlots](tdContent, row, row._index)
        }

        if (cell.fixed === 'left') {
          styleText.position = 'sticky'
          styleText.left = fixL + 'px'
          styleText.zIndex = 9
          fixL += cell.width
        } else if (cell.fixed === 'right') {
          fixR -= cell.width
          styleText.position = 'sticky'
          styleText.right = fixR + 'px'
          styleText.zIndex = 9
          styleText.borderLeft = '1px solid #D8DADC'
        }

        if (that.editable === false) {
          tds.push(createElement('td', {
            style: {
              wordBreak: 'break-all',
              textAlign: cell.align || 'left',
              ...styleText
            }
          }, tdContent))
        } else if (that.editCell[0] === row._index && that.editCell[1] === cell.key) {
          tds.push(createElement('td', [createElement('input', {
            style: {
              width: '100%',
              margin: 0,
              padding: 0,
              border: 'none',
              outlineStyle: 'none',
              fontSize: '16px'
            },
            attrs: {
              value: row[cell.key]
            },
            ref: 'editCell',
            on: {
              blur: function () {
                // 修改数据
                that.$set(that, 'editCell', [-1, -1])
              },
              'keyup': function (e) {
                if (e.key === 'Enter' || e.keyCode === 13) {
                  that.source[that.editCell[0]][that.editCell[1]] = e.target.value
                  that.$set(that, 'editCell', [-1, -1])
                }
              }
            }
          })]))
        } else {
          tds.push(createElement('td', {
            style: {
              wordBreak: 'break-all',
              textAlign: cell.align || 'left',
              ...styleText
            },
            on: {
              'dblclick': function (e) {
                that.editCell = [row._index, cell.key]
                setTimeout(() => {
                  that.$refs.editCell.focus()
                  that.$refs.editCell.selectionStart = that.$refs.editCell.selectionEnd = row[cell.key].toString().length
                }, 200)
              }
            }
          }, tdContent))
        }
      })
      trs.push(createElement('tr', {
        class: {
          'zebra-pattern': rindex % 2 === 1,
          'active': row[that.rowKey] === that.activeRowKey
        },
        on: {
          click: function () {
            that.activeRowKey = row[that.rowKey]
            that.$emit('activeRowChanged', row)
          }
        }
      }, tds))
    })

    let footer = null
    if (this.pageSize > 0) {
      const navigation = []
      const pages = Math.ceil(this.filterSource.length / this.pageSize)
      navigation.push(createElement('button', {
        class: 'x-nav-bt',
        domProps: {
          disabled: that.pageIndex === 0
        },
        on: {
          'click': function (e) {
            that.pageIndex -= 1
          }
        }
      }, '<'))

      navigation.push(createElement('span', {
        style: {
          color: '#708DF4'
        }
      }, this.pageIndex + 1 + '/' + pages))
      navigation.push(createElement('button', {
        class: 'x-nav-bt',
        domProps: {
          disabled: that.pageIndex === pages - 1
        },
        on: {
          'click': function (e) {
            that.pageIndex += 1
          }
        }
      }, '>'))

      const navigationDom = createElement('span', {
        style: {
          float: 'right'
        }
      }, navigation)
      const infoDom = createElement('span', `共有数据${this.source.length}条, 筛选结果${this.filterSource.length}条`)

      footer = createElement('div', {
        style: {
          textAlign: 'left',
          background: '#F8F8F9',
          padding: '5px 10px',
          fontSize: '14px'
        }
      }, [infoDom, navigationDom])
    }

    const searchOptions = []
    const keys = []
    for (const col of this.columns) {
      if (col.filterable) {
        searchOptions.push(createElement('option', {
          attrs: { value: col.key }
        }, col.title))
        keys.push(col.key)
      }
    }

    const search = []
    search.push(createElement('select', {
      on: {
        'change': function (e) {
          that.options.keys = [e.target.value]
        }
      }
    }, [
      createElement('option', { attrs: { value: '.' }}, '全部'),
      ...searchOptions
    ]))
    search.push(createElement('input', {
      on: {
        'input': debounce(function (e) {
          if (that.options.keys.includes('.')) {
            that.options.keys = keys
          }
          const text = e.target.value.trim()
          if (text.length === 0) {
            that.filterSource = that.source
          } else {
            that.filterSource = that.fuse.search(text).map(p => p.item)
          }
          that.pageIndex = 0
        }, 300),

        'keyup': function (e) {
          if (e.key === 'Enter' || e.keyCode === 13) {
            if (that.options.keys.includes('.')) {
              that.options.keys = keys
            }
            const text = e.target.value.trim()
            if (text.length === 0) {
              that.filterSource = that.source
            } else {
              that.filterSource = that.fuse.search(text).map(p => p.item)
            }
            that.pageIndex = 0
          }
        }
      }
    }))

    search.push(createElement('span', {
      style: {
        color: '#5A77B3',
        marginLeft: '5px'
      },
      attrs: {
        tooltip: `文本前加=表示完全匹配
        文本前加'表示包含
        文本前加!表示不包含
        文本前加^表示开头为
        文本前加!^表示开头不为
        文本后加$表示结尾为
        文本前加!，后加$表结尾不为
        空格表示与，|表示或`
      }
    }, '☀'))

    search.push(createElement('span', {
      style: {
        float: 'right'
      }
    }, that.$slots._action))

    return createElement('div', {
      class: 'x-data-grid'
    }, [
      createElement('div', {
        class: 'x-table-title',
        style: {
          textAlign: 'left'
        }
      }, search),
      createElement('div', {
        style: {
          width: '100%',
          height: this.height,
          padding: '0 0 0 0',
          overflowY: 'scroll',
          overflowX: 'auto'
        }
      }, [
        createElement('table', {
          style: {
            margin: 0,
            width: 'calc(100% - 4px)'
          }
        }, [
          createElement('colgroup', cols),
          createElement('thead', [createElement('tr', ths)]),
          createElement('tbody', trs)
        ])
      ]),
      footer
    ])
  },

  mounted () {
    this.columns.map(function (col, index) {
      // 新建字段，标识当前列排序类型；默认为“不排序”
      col._sortType = 'normal'
      // 新建字段，标识当前列在数组中的索引
      col._index = index
      // 数值的格式化
      if (col.type === 'number' && !col.format) {
        col.format = defaultNumberFormat
      }
      return col
    })

    this.source.map(function (row, index) {
      // 新建字段，标识当前行在数组中的索引
      row._index = index
      return row
    })

    this.filterSource = this.source

    // 缩放列
    const that = this
    document.addEventListener('mousemove', function (e) {
      if (that.inResize) {
        var diffX = e.pageX - that.pageX
        that.$set(that.col, 'width', Math.max(that.col.minWidth || 10, that.colWidth + diffX))
        if (that.nextCol && !that.nextCol.fixed) {
          that.$set(that.nextCol, 'width', Math.max(that.nextCol.minWidth || 10, that.nextColWidth - diffX))
        }
      }
    })

    document.addEventListener('mouseup', function (e) {
      that.inResize = false
      that.pageX = undefined
    })
  }
}
