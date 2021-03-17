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

function _index (obj, i) {
  if (obj) {
    return obj[i]
  }
  return null
}

function _set (obj, i) {
  if (i in obj) {
    return obj[i]
  }
  obj[i] = {}
  return obj[i]
}

export const objectTakeByKey = function (obj, key) {
  if (key) {
    return key.split('.').reduce(_index, obj)
  } else {
    return obj
  }
}

export const objectSetByKey = function (obj, key, value) {
  const keys = key.split('.')
  if (keys.length > 1) {
    const objAt = keys.slice(0, -1).reduce(_set, obj)
    objAt[keys[keys.length - 1]] = value
  } else {
    obj[key] = value
  }
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
    },
    hiddenSearch: {
      type: Boolean,
      default: false
    },
    hiddenFooter: {
      type: Boolean,
      default: false
    },
    noDataText: {
      type: String,
      default: '没有数据'
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
      searchSchema: ''
    }
  },

  computed: {
    fuse () {
      return new Fuse(this.sourceLocal, this.options)
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
        } else {
          titleContent[0] += '↑↓'
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

          that.columns.forEach((p, idx) => {
            if (idx === index) {
              p._sortType = that.sortType
            } else {
              p._sortType = 'normal'
            }
          })

          // 强制刷新
          if (that.sortType !== 'normal') {
            const dir = that.sortType === 'asc' ? 1 : -1
            that.filterSource.sort((a, b) => {
              return that.sortFn(a[that.sortKey], b[that.sortKey]) * dir
            })
          } else {
            that.filterSource.sort((a, b) => {
              return defaultSortFn(a._index, b._index)
            })
          }
          that.columns.push()
        }
      }

      if (col.fixed === 'left') {
        ths.push(createElement('th', {
          style: {
            userSelect: 'none',
            position: 'sticky',
            left: fixL + 'px',
            textAlign: col.align || 'left',
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
            textAlign: col.align || 'left',
            zIndex: 10
          },
          on: event
        }, titleContent))
      } else if (col.adjustable) {
        ths.push(createElement('th', {
          style: {
            userSelect: 'none',
            textAlign: col.align || 'left'
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
                e.stopPropagation()
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
              },
              'click': function (e) {
                e.stopPropagation()
              }
            }
          })
        ]))
      } else {
        ths.push(createElement('th', {
          style: {
            userSelect: 'none',
            textAlign: col.align || 'left'
          },
          on: event
        }, titleContent))
      }
    })

    let renderData = this.filterSource

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

        let tdContent = objectTakeByKey(row, cell.key)
        if (cell.type === 'number') {
          tdContent = numeral(tdContent).format(cell.format)
        } else if (cell.type === 'text' && tdContent) {
          tdContent = JSON.stringify(tdContent)
        }

        if (cell.type === '_check') {
          tdContent = [
            createElement('input', {
              attrs: {
                type: 'checkbox'
              },
              domProps: {
                checked: row._checked
              },
              on: {
                change (e) {
                  const status = e.target.checked
                  that.$set(row, '_checked', status)
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

        let editIt = that.editable
        if (cell.editable === true) {
          editIt = true
        } else if (cell.editable === false) {
          editIt = false
        }

        if (!editIt) {
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
              value: objectTakeByKey(row, cell.key)
            },
            ref: 'editCell',
            on: {
              blur: function () {
                // 修改数据
                that.$set(that, 'editCell', [-1, -1])
              },
              'keyup': function (e) {
                if (e.key === 'Enter' || e.keyCode === 13) {
                  if (that.editCell[1].includes('.')) {
                    objectSetByKey(that.sourceLocal[that.editCell[0]], that.editCell[1], e.target.value)
                  } else {
                    that.$set(that.sourceLocal[that.editCell[0]], that.editCell[1], e.target.value)
                  }

                  that.$set(that, 'editCell', [-1, -1])
                  that.$emit('editCell', row)
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
                if (cell.type === '_check' || cell.scopedSlots) {
                  // 不允许编辑
                  return false
                }

                that.editCell = [row._index, cell.key]
                setTimeout(() => {
                  that.$refs.editCell.focus()
                  that.$refs.editCell.selectionStart = that.$refs.editCell.selectionEnd = objectTakeByKey(row, cell.key).toString().length
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

    if (renderData.length === 0) {
      // 渲染替代文本
      trs.push(createElement('tr', [
        createElement('td', {
          attrs: {
            colspan: this.columns.length
          },
          style: {
            textAlign: 'center',
            lineHeight: '100px',
            borderBottom: 0,
            borderRight: 0,
            fontSize: '20px',
            opacity: 0.8,
            letterSpacing: '5px'
          }
        }, this.noDataText)
      ]))
    }

    const navigation = []
    if (this.pageSize > 0) {
      const pages = Math.ceil(this.filterSource.length / this.pageSize)
      navigation.push(createElement('span', {
        style: {
          marginRight: '5px'
        }
      }, '跳转到'))
      navigation.push(createElement('input', {
        class: 'x-page-number',
        attrs: {
          type: 'number',
          min: 1,
          max: pages
        },
        domProps: {
          value: that.pageIndex + 1
        },
        style: {
          width: (Math.floor(Math.log10(pages)) * 8 + 30) + 'px',
          outlineStyle: 'none',
          border: '1px solid #ccc',
          fontSize: '15px',
          height: '20px'
        },
        on: {
          change: function (e) {
            const to = parseInt(e.target.value)
            if (to < 1) {
              that.pageIndex = 0
            } else if (to > pages) {
              that.pageIndex = pages - 1
            } else {
              that.pageIndex = to - 1
            }
          }
        }
      }))
      navigation.push(createElement('span', {
        style: {
          margin: '0 5px'
        }
      }, '页'))
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
    }

    const navigationDom = createElement('span', {
      style: {
        float: 'right'
      }
    }, navigation)
    const infoDom = createElement('span', `共有数据${this.sourceLocal.length}条, 筛选结果${this.filterSource.length}条`)

    const footer = createElement('div', {
      style: {
        textAlign: 'left',
        background: '#F8F8F9',
        padding: '10px 10px',
        fontSize: '14px',
        borderTop: '1px solid #D8DADC'
      }
    }, [infoDom, navigationDom])

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
      domProps: {
        value: that.searchSchema
      },
      on: {
        'input': debounce(function (e) {
          if (that.options.keys.includes('.')) {
            that.options.keys = keys
          }
          const text = e.target.value.trim()

          that.searchSchema = text
          if (text.length === 0) {
            that.filterSource = that.sourceLocal
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
            that.searchSchema = text
            if (text.length === 0) {
              that.filterSource = that.sourceLocal
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

    const nodes = this.hiddenSearch ? [] : [
      createElement('div', {
        class: 'x-table-title',
        style: {
          textAlign: 'left'
        }
      }, search)
    ]
    nodes.push(createElement('div', {
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
    ]))
    if (!this.hiddenFooter) {
      nodes.push(footer)
    }

    return createElement('div', {
      class: 'x-data-grid'
    }, nodes)
  },

  watch: {
    source () {
      this.sourceLocal = this.source.map(function (row, index) {
        // 新建字段，标识当前行在数组中的索引
        row._index = index
        return row
      })

      this.filterSource = this.sourceLocal
      this.searchSchema = ''
      // 重新排序
      if (this.sortType !== 'normal') {
        const dir = this.sortType === 'asc' ? 1 : -1
        const that = this
        this.filterSource.sort((a, b) => {
          return that.sortFn(a[that.sortKey], b[that.sortKey]) * dir
        })
      }
    }
  },

  created () {
    const that = this
    this.columns.map(function (col, index) {
      // 新建字段，标识当前列排序类型；默认为“不排序”
      col._sortType = col._sortType || 'normal'
      // 新建字段，标识当前列在数组中的索引
      col._index = index
      // 数值的格式化
      if (col.type === 'number' && !col.format) {
        col.format = defaultNumberFormat
      }
      if (col._sortType !== 'normal') {
        that.sortFn = col.sortFn || defaultSortFn
        that.sortKey = col.key
        that.sortType = col._sortType
      }
      return col
    })

    this.sourceLocal = this.source.map(function (row, index) {
      // 新建字段，标识当前行在数组中的索引
      row._index = index
      return row
    })

    this.filterSource = this.sourceLocal

    // 默认排序
    if (this.sortType !== 'normal') {
      const dir = this.sortType === 'asc' ? 1 : -1
      this.filterSource.sort((a, b) => {
        return that.sortFn(a[that.sortKey], b[that.sortKey]) * dir
      })
    }

    // 缩放列
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
