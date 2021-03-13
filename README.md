# x-data-grid

## 安装
```
npm install x-data-grid -S
```

## 使用
```
import Vue from 'vue'

import xDataGrid from 'x-data-grid'
Vue.use(xDataGrid)
import 'x-data-grid/lib/xDataGrid.css'
```



**Demo** ：https://wuchuanxun.github.io/x-data-grid/

#### 参数配置

| 参数         | 类型         | 说明                 |
| ------------ | ------------ | -------------------- |
| columns      | Object Array | 列定义               |
| source       | Object Array | 数据                 |
| pageSize     | Number       | 0表示不分页          |
| editable     | Boolean      | 表格是否可以编辑     |
| height       | String       | 内表格高度，可用calc |
| rowKey       | String       | 行的键，默认用_index |
| hiddenSearch | Boolean      | 隐藏搜索行           |
| hiddenFooter | Boolean      | 隐藏底部分页栏       |
| noDataText   | String       | 没有数据显示的文本   |



#### 列定义

| 属性        | 类型                  | 选项                 | 说明                           |
| ----------- | --------------------- | -------------------- | ------------------------------ |
| type        | Sting                 | text\|number\|_check | _check表示勾选框               |
| width       | Number                |                      |                                |
| title       | String                |                      | 行标题                         |
| key         | String\|Number        |                      | 属性索引，可使用.              |
| adjustable  | Boolean               |                      | 可调整列宽                     |
| filterable  | Boolean               |                      | 加入搜索，默认False            |
| sortable    | Boolean               |                      | 是否可以搜索                   |
| sortFn      | function(a,b): number |                      | 自定义排序比较函数，可以不指定 |
| scopedSlots | String                |                      | 自定义插槽                     |
| align       | String                | left\|center\|right  | 对齐方式                       |
| _sortType   | String                | normal\|asc\|desc    | 默认排序方式                   |



#### 插槽使用

```vue
<template
    slot="slotName"
    slot-scope="text,record,index"
>
	<a>
    	{{ text }}
    </a>
</template>
```

其中 text = record[key] 



#### 事件

| 事件名称         | 参数          | 说明                   |
| ---------------- | ------------- | ---------------------- |
| selectChanged    | selectRowKeys | 选择的行key列表        |
| editCell         | cellData      | 编辑单元格编辑后的数据 |
| activeRowChanged | rowData       | 点选行，参数表示行数据 |

注：双击启用编辑，回车确定更改