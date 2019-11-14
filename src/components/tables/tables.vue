<template>
  <div>
      <div v-if="searchable && searchPlace === 'top'||searchPlace === 'machine'||searchPlace === 'consume'" class="search-con search-con-top">
        <Select v-model="searchKey" class="search-col"><!-- 下拉框 searKey 指向这个表格的下拉框数据 -->
          <Option v-for="item in columns" v-if="item.key !== 'handle' && item.search" :value="item.key" :key="`search-col-${item.key}`">{{item.title}}</Option>
        </Select>
        <Input @on-change="handleClear" clearable placeholder="输入关键字搜索" class="search-input" v-model="searchValue"/>
        <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="md-search" size="15"/>&nbsp;&nbsp;搜索</Button>&nbsp;
        <Button @click="handleAdd" v-show="addUser" :loading="addUserLoading" class="add-btn" type="info"><Icon type="md-person-add" size="15"/>&nbsp;&nbsp;增加</Button>
        <div v-if="searchPlace === 'machine'" style="float: right;">
          <Button type="primary" shape="circle" size='small' @click="showFilterModal('tables')">筛选</Button>
        </div>
        <div v-if="searchPlace === 'consume'" style="float: right;">
          <Button type="primary" shape="circle" size='small' @click="showFilterModal('consume')">时间段筛选</Button>
        </div>
      </div>
      <Modal
      v-model="filterModal4"
      title="筛选条件"
      :loading="loading"
      width="350"
      @on-ok="handleTable()">
      <Form ref="tablesForm" :model="tablesForm" :label-width="60" style="margin-right: 30px">
        <FormItem label="联网状态" prop="net_state">
            <Select v-model="tablesForm.net_state" placeholder="请选择状态" clearable>
              <Option value="在线">在线</Option>
              <Option value="离线">离线</Option>
            </Select>
        </FormItem>
        <FormItem label="运行状态" prop="work_state">
            <Select v-model="tablesForm.work_state" placeholder="请选择状态" clearable>
              <Option value="正常">正常</Option>
              <Option value="故障">故障</Option>
              <Option value="报警">报警</Option>
            </Select>
        </FormItem>
        <FormItem label="清洗时间" prop="permList">
            <DatePicker type="daterange" split-panels placeholder="默认显示所有" :options="datePickerOptions" @on-change="onDateChange4" style="width: 230px"></DatePicker>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="filterModal5"
      title="筛选条件"
      :loading="loading"
      width="350"
      @on-ok="handleconTable()">
      <Form ref="consumeForm" :model="consumeForm" :label-width="60" style="margin-right: 30px">
        <FormItem label="创建时间" prop="permList">
            <DatePicker type="daterange" split-panels placeholder="默认显示所有" :options="datePickerOptions" @on-change="onDateChange5" style="width: 230px"></DatePicker>
        </FormItem>
      </Form>
    </Modal>
    <!-- height:"height"  为表格内容有多少显示多大 -->
    <Table
      ref="tablesMain"
      :data="insideTableData"
      :columns="insideColumns"
      :stripe="stripe"
      :border="border"
      :show-header="showHeader"
      :width="width"
      :height="625"
      :loading="loading"
      :disabled-hover="disabledHover"
      :highlight-row="highlightRow"
      :row-class-name="rowClassName"
      :size="size"
      :no-data-text="noDataText"
      :no-filtered-data-text="noFilteredDataText"
      @on-current-change="onCurrentChange"
      @on-select="onSelect"
      @on-select-cancel="onSelectCancel"
      @on-select-all="onSelectAll"
      @on-selection-change="onSelectionChange"
      @on-sort-change="onSortChange"
      @on-filter-change="onFilterChange"
      @on-row-click="onRowClick"
      @on-row-dblclick="onRowDblclick"
      @on-expand="onExpand"
    style="height: 39rem;">
      <slot name="header" slot="header"></slot>
      <slot name="footer" slot="footer"></slot>
      <slot name="loading" slot="loading"></slot>
    </Table>
      <div v-if="searchable && searchPlace === 'bottom'" class="search-con search-con-top">
        <Select v-model="searchKey" class="search-col">
          <Option v-for="item in columns" v-if="item.key !== 'handle'" :value="item.key" :key="`search-col-${item.key}`">{{ item.title }}</Option>
        </Select>
        <Input placeholder="输入关键字搜索" class="search-input" v-model="searchValue"/>
        <Button class="search-btn" type="primary"><Icon type="ios-search"/>&nbsp;&nbsp;搜索</Button>
      </div>
    <a id="hrefToExportTable" style="display: none;width: 0px;height: 0px;"></a>
  </div>
</template>

<script>

import TablesEdit from './edit.vue'
import handleBtns from './handle-btns'
import { getOrderData, getRechargeData, getIntegralData, getMachineList, getUserList, getTagList } from '@/api/charts'
import './index.less'
export default {
  name: 'Tables',
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
    },
    columns: {
      type: Array,
      default () {
        return []
      }
    },
    addUserLoading: {
      type: Boolean,
      default: false
    },
    size: String,
    width: {
      type: [Number, String]
    },
    height: {
      type: [Number, String]
    },
    stripe: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    highlightRow: {
      type: Boolean,
      default: false
    },
    rowClassName: {
      type: Function,
      default () {
        return ''
      }
    },
    context: {
      type: Object
    },
    noDataText: {
      type: String
    },
    noFilteredDataText: {
      type: String
    },
    disabledHover: {
      type: Boolean
    },
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * @description 全局设置是否可编辑
     */
    editable: {
      type: Boolean,
      default: false
    },
    /**
     * @description 是否可搜索
     */
    searchable: {
      type: Boolean,
      default: false
    },
    /**
     * @description 搜索控件所在位置，'top' / 'bottom'
     */
    searchPlace: {
      type: String,
      default: 'top'
    },
    /**
     * @description 是否有新增用户按钮
     */
    addUser: {
      type: Boolean,
      default: false
    },
    /**
     * @description 是否是异步刷新
     */
    ajaxSync: {
      type: Boolean,
      default: false
    }
  },
  /**
   * Events
   * @on-start-edit 返回值 {Object} ：同iview中render函数中的params对象 { row, index, column }
   * @on-cancel-edit 返回值 {Object} 同上
   * @on-save-edit 返回值 {Object} ：除上面三个参数外，还有一个value: 修改后的数据
   */
  data () {
    return {
      insideColumns: [],
      insideTableData: [],
      edittingCellId: '',
      edittingText: '',
      searchValue: '',
      searchKey:'',
      filterModal4: false,
      tablesForm: {
        net_state: null,
        work_state: null,
        clean_st_time: null,
        clean_end_time: null
      },
      filterModal5: false,
      consumeForm: {
        st_date: null,
        end_date: null
      },
      machineList: [],
      userList: [],
      tagList: [],
      datePickerOptions: {}
    }
  },
  methods: {
    suportEdit (item, index) {
      item.render = (h, params) => {
        console.log(params)
        return h(TablesEdit, {
          props: {
            params: params,
            value: this.insideTableData[params.index][params.column.key],
            edittingCellId: this.edittingCellId,
            editable: this.editable
          },
          on: {
            'input': val => {
              this.edittingText = val
            },
            'on-start-edit': (params) => {
              this.edittingCellId = `editting-${params.index}-${params.column.key}`
              this.$emit('on-start-edit', params)
            },
            'on-cancel-edit': (params) => {
              this.edittingCellId = ''
              this.$emit('on-cancel-edit', params)
            },
            'on-save-edit': (params) => {
              this.value[params.index][params.column.key] = this.edittingText
              this.$emit('input', this.value)
              this.$emit('on-save-edit', Object.assign(params, {value: this.edittingText}))
              this.edittingCellId = ''
            }
          }
        })
      }
      return item
    },
    surportHandle (item) {
      let options = item.options || []
      let insideBtns = []
      options.forEach(item => {
        if (handleBtns[item]) insideBtns.push(handleBtns[item])
      })
      let btns = item.button ? [].concat(insideBtns, item.button) : insideBtns
      item.render = (h, params) => {
        params.tableData = this.value
        return h('div', btns.map(item => item(h, params, this)))
      }
      return item
    },
    handleColumns (columns) {
      this.insideColumns = columns.map((item, index) => {
        let res = item
        if (res.editable) res = this.suportEdit(res, index)
        if (res.key === 'handle') res = this.surportHandle(res)
        // if (res.key === 'action') res = ""
        return res
      })
    },
    setDefaultSearchKey () {
      this.searchKey = this.columns[0].key !== 'handle' ? this.columns[0].key : (this.columns.length > 1 ? this.columns[1].key : '')
    },
    handleClear (e) {
      if (e.target.value === '') this.insideTableData = this.value
    },
    handleSearch () {
      if (this.ajaxSync) {
        this.$emit('on-ajax-sync', this.searchKey, this.searchValue)
      } else {
        this.insideTableData = this.value.filter(item => item[this.searchKey].toString().indexOf(this.searchValue) > -1)
      }
    },
    handleTable(){
        this.$emit('on-ajax-synd',"machinedata",this.tablesForm)
    },
    handleconTable(){
        this.$emit('on-ajax-synd',"consdata",this.consumeForm)
    },
    handleAdd () {
      this.$emit('on-add-user')
    },
    handleTableData () {
      this.insideTableData = this.value.map((item, index) => {
        let res = item
        res.initRowIndex = index
        return res
      })
    },
    exportCsv (params) {
      this.$refs.tablesMain.exportCsv(params)
    },
    clearCurrentRow () {
      this.$refs.talbesMain.clearCurrentRow()
    },
    onCurrentChange (currentRow, oldCurrentRow) {
      this.$emit('on-current-change', currentRow, oldCurrentRow)
    },
    onSelect (selection, row) {
      this.$emit('on-select', selection, row)
    },
    onSelectCancel (selection, row) {
      this.$emit('on-select-cancel', selection, row)
    },
    onSelectAll (selection) {
      this.$emit('on-select-all', selection)
    },
    onSelectionChange (selection) {
      this.$emit('on-selection-change', selection)
    },
    onSortChange (column, key, order) {
      this.$emit('on-sort-change', column, key, order)
    },
    onFilterChange (row) {
      this.$emit('on-filter-change', row)
    },
    onRowClick (row, index) {
      this.$emit('on-row-click', row, index)
    },
    onRowDblclick (row, index) {
      this.$emit('on-row-dblclick', row, index)
    },
    onExpand (row, status) {
      this.$emit('on-expand', row, status)
    },
    showFilterModal (name) {
      if (name === 'tables') {
        this.filterModal4 = true
      }else if (name === 'consume'){
        this.filterModal5 = true
      }
    },
    onDateChange4 (dates, type) {
      /*if ((new Date(dates[1]) - new Date(dates[0])) / 86400000 > 183) {
        this.$Message.error('最长只能查询半年内的日期!')
        this.datePickerValue1 = ''
      } else { */
        this.tablesForm.clean_st_time = dates[0]+" 00:00:00"
        this.tablesForm.clean_end_time = dates[1]+" 00:00:00"
      //}
    },
    onDateChange5 (dates, type) {
      /*if ((new Date(dates[1]) - new Date(dates[0])) / 86400000 > 183) {
        this.$Message.error('最长只能查询半年内的日期!')
        this.datePickerValue1 = ''
      } else { */
        this.consumeForm.st_date = dates[0]
        this.consumeForm.end_date = dates[1]
      //}
    }
  },
  watch: {
    columns (columns) {
      this.handleColumns(columns)
      this.setDefaultSearchKey()
    },
    value (val) {
      this.handleTableData()
      if (this.searchable && !this.ajaxSync) {
        this.handleSearch()
      }
    }
  },
  mounted () {
    this.datePickerOptions = {
      disabledDate (date) {
        return date && date.valueOf() > Date.now()
      }
    }
    this.handleColumns(this.columns)
    this.setDefaultSearchKey()
    this.handleTableData()
    getMachineList().then(res => {
      this.machineList = res
    })
    getUserList().then(res => {
      this.userList = res
    })
    getTagList().then(res => {
      this.tagList = res
    })
  }
}
</script>

<style>
  .gcs-checkbox {
    display: none;
  }
  .gcs-checkbox+label {
    background-color: white;
    border-radius: 0px;
    border: 1px solid #d3d3d3;
    width: 18px;
    height: 19px;
    display: inline-block;
    text-align: center;
    vertical-align: bottom;
    line-height: 20px;
  }
  .gcs-checkbox+label:hover {
    cursor: pointer;
    border: 1px solid #2783FB;
  }
  .gcs-checkbox:checked+label {
    background-color: #eee;
    background: #2783FB;
  }
  .gcs-checkbox:checked+label:after {
    content: "\2714";
    color: white;
  }
</style>
