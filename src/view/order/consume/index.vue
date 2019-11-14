<template>
  <div>
    <Card style="width: 100%;">
      <div class="c-table-top">
        <Input clearable placeholder="输入设备名称" class="search-input" v-model="kwargs.machine_name"/><!-- v-model="searchValue"-->
        <Input clearable placeholder="输入设备编号" class="search-input" v-model="kwargs.machine"/>
        <Input clearable placeholder="输入支付宝订单号" class="search-input" v-model="kwargs.zfb_order"/>
        <Input clearable placeholder="输入微信订单号" class="search-input" v-model="kwargs.wx_order"/>
        <Button class="search-btn" type="primary" @click="hendleSearch"><Icon type="md-search" size="15"/>&nbsp;&nbsp;搜索</Button>&nbsp;<!--@click="handleSearch" -->
        <div style="float: right;">
          <Button type="primary" shape="circle" size='small' @click="showFilterModaltime">时间段筛选</Button>
        </div>
      </div>
      <tables ref="tables" :loading="tableLoading" editable v-model="currPageData" :columns="columns" ajaxSync @on-ajax-sync="ajaxSync" @on-ajax-synd="ajaxSynd"/>
      <div class="c-table-footer">
        <Button style="margin: 10px 0;" type="primary" @click="startExport">导出数据</Button>
        <Page show-sizer :total="total" :current="curPage" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-page-size-change="pageSizeChange" @on-change="onChange" class-name="c-page"/>
      </div>
    </Card>
    <Card>
      <chart-line style="height: 400px;" :value="integralDatas" @on-click-kw="clickkw"/>
       <i-table border :columns="columns1" :data="data1"></i-table>
    </Card>
    <Modal
      v-model="exportModal"
      title="按时间段导出数据"
      :loading="loading"
      width="350"
      @on-ok="exportData">
      <Form ref="filterForm" :model="filterForm" :label-width="60" style="margin-right: 30px">
        <!-- <FormItem label="商圈" prop="tag">
            <Select v-model="filterForm.tag" placeholder="请选择商圈" clearable>
              <Option v-for="(option, index) in tagList" :value="option.value" :key="'integral-tag-'+ index">{{option.label}}</Option>
            </Select>
        </FormItem>
        <FormItem label="设备" prop="machine_id">
            <Select v-model="filterForm.machine_id" placeholder="请选择设备" clearable>
              <Option v-for="(option, index) in machineList" :value="option.value" :key="'integral-machine-'+ index">{{option.label}}</Option>
            </Select>
        </FormItem> -->
        <FormItem label="日期" prop="permList">
          <DatePicker type="daterange" split-panels placeholder="请选择时间段" :options="datePickerOptions" @on-change="onDateChange" style="width: 230px"></DatePicker>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="refundModal"
      title="退款"
      width="350"
      @on-ok="refundHandler">
      <Form ref="refundForm" :model="refundForm" :label-width="60" style="margin-right: 30px">
        <FormItem label="退款单号" prop="refundUID">
          <Input v-model="refundForm.uid" disabled />
        </FormItem>
        <FormItem label="订单总额(元)" prop="refundTotal">
          <Input v-model="refundForm.total" disabled number />
        </FormItem>
        <FormItem label="退款金额(元)" prop="refundPrice" >
          <Input v-model="refundForm.price" number/>
        </FormItem>
        <FormItem label="退款理由" prop="refundReason">
          <Input v-model="refundForm.msg" />
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="filterModal5"
      title="筛选条件"
      :loading="loading"
      width="350"
      @on-ok="ajaxcsForm()">
      <Form ref="consumeForm" :model="consumeForm" :label-width="60" style="margin-right: 30px">
        <FormItem label="创建时间" prop="permList">
          <DatePicker type="daterange" split-panels placeholder="默认显示所有" :options="datePickerOptions" @on-change="onDateChange5" style="width: 230px"></DatePicker>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import XLSX from 'xlsx'
  import Tables from '_c/tables'
  import { ChartCbar, ChartLine } from '_c/charts'
  // import Tables from '@/src/components/tables'
  import { getOrderInfo, getExportOrderInfo } from '@/api/operator'
  import { refundOrder } from '@/api/order'
  import { getGoodsData,v3getGoodsData } from '@/api/charts'
  export default {
    name: 'consume_order',
    components: {
      Tables,
      ChartLine
    },
    data () {
      return {
        columns: [
          {
            title: '创建时间',width:100, align: 'center', key: 'mk_time', sortable: false, search: false
          },
          {
            title: '设备名称',width:100, align: 'center', key: 'machine_name', sortable: false, search: true
          },
          {
            title: '设备uid',width:100, align: 'center', key: 'machine', sortable: false, search: true
          },
          {
            title: '杯数',width:85, align: 'center', key: 'quantity', sortable: false, search: false
          },
          {
            title: '出货状态',
            key: 'status',
            width:95,
            align: 'center',
            search: true,
            render: (h, params) => {
              return h('Tag',
                {props: {
                    color: params.row.status === '正常' ? 'primary' : 'error'
                  }},
                params.row.status)
            }
          },
          /* {
            title: '货道号', width: 80, align: 'center', key: 'channel', sortable: false, search: false
          }, */
          {
            title: '支付方式',width:95, align: 'center', key: 'pay_mode', sortable: false, search: true
          },
          {
            title: '支付宝订单',width:160, align: 'center', key: 'zfb_order', sortable: false, search: true
          },
          {
            title: '微信订单',width:160, align: 'center', key: 'wx_order', sortable: false, search: true
          },
          {
            title: '实付金额',width:95, align: 'center', key: 'real_pay', sortable: false, search: false
          },
          {
            title: '所购商品',width:95, align: 'center', key: 'real_pay', sortable: false, search: false
          },
          {
            title: '退款状态',width:100, align: 'center', key: 'refund_state', sortable: false, search: false
          },
          {
            title: '退款金额',width:100, align: 'center', key: 'refund_price', sortable: false, search: false
          },
          {
            title: '退款理由',width:100, align: 'center', key: 'refund_reason', sortable: false, search: false
          },
          // {
          //   title: '是否测试', width: 120, align: 'center', key: 'is_test', sortable: false, search: false
          // },
          {
            title: '错误信息',width:190, align: 'center', key: 'error_info', sortable: false, search: false
          },
          {
            title: '操作',
            width:95,
            key: 'action',
            align: 'center',
            search: false,
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'warning',
                  size: 'small',
                  loading: false
                },
                on: {
                  click: () => {
                    this.refundAction(params.index)
                  }
                }
              }, '退款')
            }
          }
        ],
        columns1: [
          {
            title: '机器编号',
            key: 'machine_id'
          },
          {
            title: '机器名称',
            key: 'machine_name'
          },
          {
            title: '销量',
            key: 'num',
            sortType:'desc'
          }
        ],
        data1:[],
        search1:"",
        search2:"",
        // 当前页数据
        currPageData: [],
        // 所有数据
        tableTotalData: [],
        // 原始数据
        // 当前页码
        curPage: 1,
        // 每页数据量
        pageSize: 100,
        // 可选的每页数据总量
        pageSizeOpts: [ 100, 200],
        // 数据总量
        total: 400,
        // 存放绑定modal中的参数
        currIndex: 1,
        tag: '',
        // 存放选中绑定人的名字和id
        tableLoading: false,
        // 存放搜索内容
        kwargs: {},
        // 筛选导出用户数据
        loading: true,
        exportModal: false,
        exportModal2: false,
        filterModal5: false,
        consumeForm: {
          st_date: null,
          end_date: null
        },
        machineList: [],
        tagList: [],
        datePickerOptions: {},
        filterForm: {
          tag: null,
          machine_id: null,
          st_date: null,
          end_date: null
        },
        filterForm2: {
          st_date: null,
          end_date: null
        },
        // 退款
        refundModal: false,
        refundForm: {
          pk: null,
          uid: null,
          total: null,
          price: null,
          msg: null
        },
        // 导出
        valueMap: {
          'mk_time': '创建时间',
          'machine_name': '设备名称',
          'machine': '设备uid',
          'quantity': '销售量',
          'goods_weight': '商品重量',
          'status': '出货状态',
          // 'channel': '货道号',
          'pay_mode': '支付方式',
          'zfb_order': '支付宝订单',
          'wx_order': '微信订单',
          'real_pay': '实付金额(分)',
          'refund_state': '退款状态',
          // 'is_test': '是否测试',
          'error_info': '错误信息'
        },
        integralDatas: {},
        integralTitle: '',
        machineDatas:{}
      }
    },
    methods: {
      onDateChange5 (dates, type) {
        /*if ((new Date(dates[1]) - new Date(dates[0])) / 86400000 > 183) {
          this.$Message.error('最长只能查询半年内的日期!')
          this.datePickerValue1 = ''
        } else { */
        this.consumeForm.st_date = dates[0]
        this.consumeForm.end_date = dates[1]
        //}
      },
      showFilterModaltime () {
          this.filterModal5 = true
      },
      onDateChange (dates, type) {
        if ((new Date(dates[1]) - new Date(dates[0])) / 86400000 > 183) {
          this.$Message.error('最长只能查询半年内的日期!')
          this.datePickerValue1 = ''
        } else {
          this.filterForm.st_date = dates[0]
          this.filterForm.end_date = dates[1]
        }
      },
      startExport () {
        this.exportModal = true
      },
      auto_width (ws, data) {
        /* set worksheet max width per col */
        let colWidth = data.map(row => row.map(val => {
          /* if null/undefined */
          if (val == null) {
            return {'wch': 10}
            /* if chinese */
          } else if (val.toString().charCodeAt(0) > 255) {
            return {'wch': val.toString().length * 2}
          } else {
            return {'wch': val.toString().length}
          }
        }))
        /* start in the first row */
        let result = colWidth[0]
        for (let i = 1; i < colWidth.length; i++) {
          for (let j = 0; j < colWidth[i].length; j++) {
            if (result[j]['wch'] < colWidth[i][j]['wch']) {
              result[j]['wch'] = colWidth[i][j]['wch']
            }
          }
        }
        ws['!cols'] = result
      },
      exportExcel (data) {
        if (data) {
          let sheetName = this.filterForm.st_date + '-' + this.filterForm.end_date
          let wb = XLSX.utils.book_new()
          // let keys = Object.keys(data)
          // let arr = keys.map(v => { return [v, data[v][0], data[v][1]] })
          let title = Object.values(this.valueMap)
          let keys = Object.keys(this.valueMap)
          let arr = []
          data.forEach(el => {
            arr.push(
              keys.map(v => { return el[v] })
            )
          })
          arr.unshift(title)
          let ws = XLSX.utils.aoa_to_sheet(arr)
          this.auto_width(ws, arr)
          XLSX.utils.book_append_sheet(wb, ws, sheetName)
          XLSX.writeFile(wb, 'export.xlsx')
        } else {
          this.$Message.info('表格数据不能为空！')
        }
      },
      exportData () {
        if (!this.filterForm.st_date || !this.filterForm.end_date) {
          this.$Message.error('请选择时间段!')
          this.exportModal = false
        }
        getExportOrderInfo(this.filterForm).then(res => {
          let data = res
          this.exportExcel(data)
          this.exportModal = false
        })
      },
      onChange (pageId) {
        this.curPage = pageId
        this.tableLoading = true
        getOrderInfo(pageId, this.pageSize, this.kwargs ,this.consData).then(res => {
          this.currPageData = res.results
          this.total = res.count
          this.tableLoading = false
        })
      },
      pageSizeChange (pageSize) {
        this.pageSize = pageSize
        this.tableLoading = true
        getOrderInfo(this.curPage, pageSize, this.kwargs ,this.consData).then(res => {
          this.currPageData = res.results
          this.total = res.count
          this.curPage = res.curPage
          this.tableLoading = false
        })
      },
      hendleSearch(){
        this.data1=[]
        this.tableLoading = true
        getOrderInfo(this.curPage, this.pageSize, this.kwargs ,this.consData).then(res => {
          this.currPageData = res.results
          this.total = res.count
          this.tableLoading = false
        })
        v3getGoodsData(this.kwargs, this.consData).then(res =>{
          let _data = {}
          this.machineDatas=res
          for(let i=0;i<res.length;i++){
            _data[res[i].name]=res[i].num
          }
          this.integralDatas = _data
        })
      },
      ajaxSync (key, value) {
        this.kwargs = {}
        this.kwargs[key] = value
        this.tableLoading = true
        getOrderInfo(this.curPage, this.pageSize, this.kwargs ,this.consData).then(res => {
          this.currPageData = res.results
          this.total = res.count
          this.tableLoading = false
        })
        getGoodsData(key,value ,this.consData).then(res =>{
          let _data = {}
          this.machineDatas=res
          for(let i=0;i<res.length;i++){
            _data[res[i].name]=res[i].num
          }
          this.integralDatas = _data
        })
      },
      ajaxcsForm(){
        this.data1=[]
        this.consData=this.consumeForm
        getOrderInfo(this.curPage, this.pageSize, this.kwargs ,this.consData).then(res => {
          this.currPageData = res.results
          this.total = res.count
          this.tableLoading = false
        })
        this.filterModal5 = false
        v3getGoodsData(this.kwargs ,this.consData).then(res =>{
          let _data = {}
          this.machineDatas=res
          for(let i=0;i<res.length;i++){
            _data[res[i].name]=res[i].num
          }
          this.integralDatas = _data
        })
      },
      ajaxSynd(key,value){
        this.consData=value
        getOrderInfo(this.curPage, this.pageSize, this.kwargs ,this.consData).then(res => {
          this.currPageData = res.results
          this.total = res.count
          this.tableLoading = false
        })
        getGoodsData(this.kwargs ,this.consData).then(res =>{
          let _data = {}
          this.machineDatas=res
          for(let i=0;i<res.length;i++){
            _data[res[i].name]=res[i].num
          }
          this.integralDatas = _data
        })
      },
      showFilterModal (name) {
        this.exportModal2 = true
      },
      // 退款操作
      refundAction (index) {
        if (this.$store.state.user.level !== 99) {
          this.$Message.error('没有权限')
          return
        }
        let order = this.currPageData[index]
        if (order.refund_state === '已退款') {
          this.$Message.error('已退款无需再退')
          return
        }
        this.refundForm = {
          pk: order.id,
          uid: order.uid,
          msg: null,
          total: order.real_pay,
          price: order.real_pay
        }
        this.refundModal = true
      },
      // 执行退款
      refundHandler () {
        if (this.refundForm.price > this.refundForm.total) {
          this.$Message.error('退款金额不能大于实付金额')
        }
        let data = {
          pk: this.refundForm.pk,
          price: this.refundForm.price,
          msg: this.refundForm.msg
        }
        if(data.msg!=null){
          refundOrder(data).then(res => {
            this.refundModal = false
            if (res.result === 'success') {
              this.$Message.success('退款已成功')
            } else {
              this.$Message.error('退款失败: ' + res.msg)
              return
            }
          })
          this.refundForm = {
            pk: null,
            uid: null,
            total: null,
            price: null,
            msg: null
          }
        }else{
          this.$Message.error('请检查是否有信息未填写完整')
        }
      },
      clickkw(key,value){
        this.data1=[]
        for (let i=0;i<this.machineDatas.length;i++){
          if (value===this.machineDatas[i].name){
            for(let j=0;j<this.machineDatas[i].machine_list.length;j++){
              this.data1.push({'machine_id':this.machineDatas[i].machine_list[j][0],'machine_name':this.machineDatas[i].machine_list[j][1],'num':this.machineDatas[i].machine_list[j][2]})
            }
          }
        }
      }
    },
    mounted () {
      this.datePickerOptions = {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      }
      this.tableLoading = true
      getOrderInfo(this.curPage, this.pageSize, this.kwargs).then(res => {
        this.currPageData = res.results
        this.total = res.count
        this.tableLoading = false
      })
      getGoodsData().then(res =>{
        this.machineDatas=res
        let _data = {}
        for(let i=0;i<res.length;i++){
          _data[res[i].name]=res[i].num
        }
        this.integralDatas = _data
      })
      // getMachineList().then(res => {
      //   this.machineList = res
      // })
      // getTagList().then(res => {
      //   this.tagList = res
      // })
    }
  }
</script>

<style>
  .c-page {
    float: right;
    padding: 12px;
  }
  .c-table-top .search-input{
    width: 150px;
    margin-right: 2px;
    margin-bottom: 3px;
  }
  .c-table-top button{
    margin-bottom: 3px;
  }
</style>
