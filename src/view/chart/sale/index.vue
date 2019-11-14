<template>
  <div>
    <Row>
      <i-col span="24">
        <Card shadow>
          <p slot="title">
            <Icon type="ios-podium" />
            销售订单(金额)统计
          </p>
          <div slot="extra">
            <Button type="info" shape="circle" size='small' @click="exportHandler('order')" style="margin-right:10px">导出</Button>
            <Button type="primary" shape="circle" size='small' @click="showFilterModal('order')">筛选</Button>
            <RadioGroup v-model="lineChoseType1" type="button" size="small" style="margin-left: 20px">
              <Radio label='0'>订单</Radio>
              <Radio label='2'>销售量</Radio>
              <Radio label='1'>金额</Radio>
            </RadioGroup>
          </div>
          <chart-line style="height: 400px;" :value="orderDatas" :choseType="lineChoseType1" />
        </Card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 30px;">
      <i-col span="12">
        <Card shadow>
          <p slot="title">
            <Icon type="ios-podium" />
            会员充值(余额)统计
          </p>
          <div slot="extra">
            <Button type="info" shape="circle" size='small' @click="exportHandler('recharge')" style="margin-right:10px">导出</Button>
            <Button type="primary" shape="circle" size='small' @click="showFilterModal('recharge')">筛选</Button>
          </div>
          <chart-line style="height: 300px;" :value="rechargeDatas" :text="rechargeTitle"/>
        </Card>
      </i-col>
      <i-col span="12">
        <Card shadow>
          <p slot="title">
            <Icon type="ios-podium" />
            会员积分兑换(剩余)统计
          </p>
          <div slot="extra">
            <Button type="info" shape="circle" size='small' @click="exportHandler('integral')" style="margin-right:10px">导出</Button>
            <Button type="primary" shape="circle" size='small' @click="showFilterModal('integral')">筛选</Button>
          </div>
          <chart-line style="height: 300px;" :value="integralDatas" :text="integralTitle"/>
        </Card>
      </i-col>
    </Row>
    <Modal
      v-model="filterModal1"
      title="筛选条件"
      :loading="loading"
      width="350"
      @on-ok="handleSubmit('orderForm')">
      <Form ref="orderForm" :model="orderForm" :label-width="60" style="margin-right: 30px">
        <FormItem label="商圈" prop="tag">
            <Select v-model="orderForm.tag" placeholder="请选择商圈" clearable>
              <Option v-for="(option, index) in tagList" :value="option.value" :key="'order-tag-'+ index">{{option.label}}</Option>
            </Select>
        </FormItem>
        <FormItem label="设备" prop="machine_id">
            <Select v-model="orderForm.machine_id" placeholder="请选择设备" clearable>
              <Option v-for="(option, index) in machineList" :value="option.value" :key="'order-machine-'+ index">{{option.label}}</Option>
            </Select>
        </FormItem>
        <FormItem label="账号" prop="user_id">
            <Select v-model="orderForm.user_id" placeholder="请选择账号" clearable>
              <Option v-for="(option, index) in userList" :value="option.value" :key="'order-user-'+ index">{{option.label}}</Option>
            </Select>
        </FormItem>
        <FormItem label="日期" prop="permList">
            <DatePicker type="daterange" split-panels placeholder="默认显示最近一周" :options="datePickerOptions" @on-change="onDateChange1" style="width: 230px"></DatePicker>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="filterModal2"
      title="筛选条件"
      :loading="loading"
      width="350"
      @on-ok="handleSubmit('rechargeForm')">
      <Form ref="rechargeForm" :model="rechargeForm" :label-width="60" style="margin-right: 30px">
        <FormItem label="商圈" prop="tag">
            <Select v-model="rechargeForm.tag" placeholder="请选择商圈" clearable>
              <Option v-for="(option, index) in tagList" :value="option.value" :key="'recharge-tag-'+ index">{{option.label}}</Option>
            </Select>
        </FormItem>
        <FormItem label="设备" prop="machine_id">
            <Select v-model="rechargeForm.machine_id" placeholder="请选择设备" clearable>
              <Option v-for="(option, index) in machineList" :value="option.value" :key="'recharge-machine-'+ index">{{option.label}}</Option>
            </Select>
        </FormItem>
        <FormItem label="账号" prop="user_id">
            <Select v-model="rechargeForm.user_id" placeholder="请选择账号" clearable>
              <Option v-for="(option, index) in userList" :value="option.value" :key="'recharge-user-'+ index">{{option.label}}</Option>
            </Select>
        </FormItem>
        <FormItem label="日期" prop="permList">
            <DatePicker type="daterange" split-panels placeholder="默认显示最近一周" :options="datePickerOptions" @on-change="onDateChange2" style="width: 230px"></DatePicker>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="filterModal3"
      title="筛选条件"
      :loading="loading"
      width="350"
      @on-ok="handleSubmit('integralForm')">
      <Form ref="integralForm" :model="integralForm" :label-width="60" style="margin-right: 30px">
        <FormItem label="商圈" prop="tag">
            <Select v-model="integralForm.tag" placeholder="请选择商圈" clearable>
              <Option v-for="(option, index) in tagList" :value="option.value" :key="'integral-tag-'+ index">{{option.label}}</Option>
            </Select>
        </FormItem>
        <FormItem label="设备" prop="machine_id">
            <Select v-model="integralForm.machine_id" placeholder="请选择设备" clearable>
              <Option v-for="(option, index) in machineList" :value="option.value" :key="'integral-machine-'+ index">{{option.label}}</Option>
            </Select>
        </FormItem>
        <FormItem label="账号" prop="user_id">
            <Select v-model="integralForm.user_id" placeholder="请选择账号" clearable>
              <Option v-for="(option, index) in userList" :value="option.value" :key="'integral-user-'+ index">{{option.label}}</Option>
            </Select>
        </FormItem>
        <FormItem label="日期" prop="permList">
            <DatePicker type="daterange" split-panels placeholder="默认显示最近一周" :options="datePickerOptions" @on-change="onDateChange3" style="width: 230px"></DatePicker>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import XLSX from 'xlsx'
import { ChartCbar, ChartLine } from '_c/charts'/*图表组件 只用了chartline，   chartcbr没有调用*/
/*api/charts.js中的getOrderData, getRechargeData, getIntegralData, getMachineList, getUserList, getTagList方法*/
import { getOrderData, getRechargeData, getIntegralData, getMachineList, getUserList, getTagList } from '@/api/charts'
export default {
  name: 'message',
  components: {
    ChartCbar,
    ChartLine
  },
  data () {
    return {
      orderDatas: {},
      lineChoseType1: '0', // 0为订单，１为金额
      datePickerOptions: {},
      rechargeDatas: {},
      rechargeTitle: '',
      integralDatas: {},
      integralTitle: '',
      loading: true,
      // 共用数据
      machineList: [],
      userList: [],
      tagList: [],
      // 筛选模态框1
      filterModal1: false,
      orderForm: {
        tag: null,
        machine_id: null,
        user_id: null,
        st_date: null,
        end_date: null
      },
      // 筛选模态框2
      filterModal2: false,
      rechargeForm: {
        tag: null,
        machine_id: null,
        user_id: null,
        st_date: null,
        end_date: null
      },
      // 筛选模态框1
      filterModal3: false,
      integralForm: {
        tag: null,
        machine_id: null,
        user_id: null,
        st_date: null,
        end_date: null
      }
    }
  },
  methods: {
      /*选的时间限制*/
    onDateChange1 (dates, type) {
      if ((new Date(dates[1]) - new Date(dates[0])) / 86400000 > 183) {
        this.$Message.error('最长只能查询半年内的日期!')
        this.datePickerValue1 = ''
      } else {
        this.orderForm.st_date = dates[0]
        this.orderForm.end_date = dates[1]
      }
    },
    onDateChange2 (dates, type) {
      if ((new Date(dates[1]) - new Date(dates[0])) / 86400000 > 183) {
        this.$Message.error('最长只能查询半年内的日期!')
        this.datePickerValue1 = ''
      } else {
        this.rechargeForm.st_date = dates[0]
        this.rechargeForm.end_date = dates[1]
      }
    },
    onDateChange3 (dates, type) {
      if ((new Date(dates[1]) - new Date(dates[0])) / 86400000 > 183) {
        this.$Message.error('最长只能查询半年内的日期!')
        this.datePickerValue1 = ''
      } else {
        this.integralForm.st_date = dates[0]
        this.integralForm.end_date = dates[1]
      }
    },
      //筛选的方法
    showFilterModal (name) {
      if (name === 'order') {
        this.filterModal1 = true
      } else if (name === 'recharge') {
        this.filterModal2 = true
      } else {
        this.filterModal3 = true
      }
    },
    handleSubmit (name) {
      if (name === 'orderForm') {
        getOrderData(this.orderForm).then(res => {
          let _data = {}
          let _keys = Object.keys(res)
          _keys.forEach(el => {
            _data[el] = [res[el][0], res[el][1] / 100,res[el][2]]
          })
          this.orderDatas = _data
          this.filterModal1 = false
        })
      } else if (name === 'rechargeForm') {
        getRechargeData(this.rechargeForm).then(res => {
          let _data = {}
          let _keys = Object.keys(res.data)
          _keys.forEach(el => {
            _data[el] = res.data[el] / 100
          })
          this.rechargeDatas = _data
          this.rechargeTitle = '总余额：' + res.balance / 100
          this.filterModal2 = false
        })
      } else {
        getIntegralData(this.integralForm).then(res => {
          this.integralDatas = res.data
          this.integralTitle = '总剩余积分：' + res.integral
          this.filterModal3 = false
        })
      }
    },
    getObjectName (arrayObject, arrayId) {
      return arrayObject.forEach(item => {
        if (item.value === arrayId) {
          return item.label
        }
      })
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
    exportExcel (title, data, formData) {
      if (data) {
        let tag = formData.tag ? formData.tag : '默认商圈'
        let machine = formData.machine_id ? this.getObjectName(this.machineList, formData.machine_id) : '所有设备'
        let userName = formData.user_id ? this.getObjectName(this.userList, formData.user_id) : '默认账号'
        let sheetName = tag + '-' + machine + '-' + userName
        let wb = XLSX.utils.book_new()
        let keys = Object.keys(data)
        let arr = keys.map(v => { return [v, data[v][0], data[v][1]] })
        arr.unshift(title)
        let ws = XLSX.utils.aoa_to_sheet(arr)
        this.auto_width(ws, arr)
        XLSX.utils.book_append_sheet(wb, ws, sheetName)
        XLSX.writeFile(wb, 'export.xlsx')
      } else {
        this.$Message.info('表格数据不能为空！')
      }
    },
      //导出图片的方法
    exportHandler (name) {
      if (name === 'order') {
        let title = ['日期', '订单', '金额（元）']
        this.exportExcel(title, this.orderDatas, this.orderForm)
      } else if (name === 'recharge') {
        let title = ['日期', '充值金额(元)']
        this.exportExcel(title, this.rechargeDatas.data, this.rechargeForm)
      } else if (name === 'integral') {
        let title = ['日期', '兑换积分']
        this.exportExcel(title, this.integralDatas.data, this.integralForm)
      }
    }
  },
  mounted () {
    this.datePickerValue = []
    this.datePickerOptions = {
      disabledDate (date) {
        return date && date.valueOf() > Date.now()
      }
    }
    let params = {
      st_date: this.datePickerValue[0],
      end_date: this.datePickerValue[1]
    }
    getOrderData(params).then(res => {
      let _data = {}
      let _keys = Object.keys(res)
      _keys.forEach(el => {
        _data[el] = [res[el][0], res[el][1] / 100, res[el][2]]
      })
      this.orderDatas = _data
    })
    getRechargeData(params).then(res => {
      let _data = {}
      let _keys = Object.keys(res.data)
      _keys.forEach(el => {
        _data[el] = res.data[el] / 100
      })
      this.rechargeDatas = _data
      this.rechargeTitle = '总余额：' + res.balance / 100
    })
    getIntegralData(params).then(res => {
      this.integralDatas = res.data
      this.integralTitle = '总剩余积分：' + res.integral
    })
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

</style>
