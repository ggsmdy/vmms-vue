<template>
  <div>
    <!--新课数量统计-->
    <Row>
      <i-col span="24">
        <Card shadow>
          <p slot="title">
            <Icon type="ios-podium" />
            新客数量统计
          </p>
          <div slot="extra">
            <Button type="primary" shape="circle" size='small' @click="showFilterModal('new')">筛选</Button>
          </div>
          <chart-line style="height: 400px;" :value="newMemberDatas" />
        </Card>
      </i-col>
    </Row>
    <!--第一次购买统计-->
    <Row :gutter="20" style="margin-top: 30px;">
      <i-col span="12">
        <Card shadow>
          <p slot="title">
            <Icon type="ios-podium" />
            第一次购买统计
          </p>
          <div slot="extra">
            <Button type="primary" shape="circle" size='small' @click="showFilterModal('first')">筛选</Button>
          </div>
          <chart-line style="height: 300px;" :value="firstPayDatas"/><!--引入chart图表-->
        </Card>
      </i-col>
      <i-col span="12">
        <Card shadow>
          <p slot="title">
            <Icon type="ios-podium" />
            第二次购买统计
          </p>
          <div slot="extra">
            <Button type="primary" shape="circle" size='small' @click="showFilterModal('second')">筛选</Button>
          </div>
          <chart-line style="height: 300px;" :value="secondPayDatas"/>
        </Card>
      </i-col>
    </Row>
    <!--第二次购买统计-->
    <Row :gutter="20" style="margin-top: 30px;">
      <i-col span="12">
        <Card shadow>
          <p slot="title">
            <Icon type="ios-podium" />
            七日沉睡会员列表
          </p>
          <div slot="extra">
            <Button type="primary" shape="circle" size='small' @click="showFilterModal('week')">筛选</Button>
          </div>
          <Table :columns="weekColumns" :data="weekSleepDatas" style="height: 300px;"></Table>
        </Card>
      </i-col>
      <i-col span="12">
        <Card shadow>
          <p slot="title">
            <Icon type="ios-podium" />
            月沉睡会员列表
          </p>
          <div slot="extra">
            <Button type="primary" shape="circle" size='small' @click="showFilterModal('mouth')">筛选</Button>
          </div>
          <Table :columns="mouthColumns" :data="mouthSleepDatas" style="height: 300px;"></Table>
        </Card>
      </i-col>
    </Row>
    <!--modal 为四个筛选条件-->
    <Modal
      v-model="filterModal1"
      title="筛选条件"
      :loading="loading"
      width="350"
      @on-ok="handleSubmit('newForm')">
      <Form ref="newForm" :model="newForm" :label-width="60" style="margin-right: 30px">
        <FormItem label="商圈" prop="tag">
            <Select v-model="newForm.tag" placeholder="请选择商圈" clearable>
              <Option v-for="(option, index) in tagList" :value="option.value" :key="'new-tag-'+ index">{{option.label}}</Option>
            </Select>
        </FormItem>
        <FormItem label="设备" prop="machine_id">
            <Select v-model="newForm.machine_id" placeholder="请选择设备" clearable>
              <Option v-for="(option, index) in machineList" :value="option.value" :key="'new-machine-'+ index">{{option.label}}</Option>
            </Select>
        </FormItem>
        <FormItem label="账号" prop="user_id">
            <Select v-model="newForm.user_id" placeholder="请选择账号" clearable>
              <Option v-for="(option, index) in userList" :value="option.value" :key="'new-user-'+ index">{{option.label}}</Option>
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
      @on-ok="handleSubmit('firstForm')">
      <Form ref="firstForm" :model="firstForm" :label-width="60" style="margin-right: 30px">
        <FormItem label="商圈" prop="tag">
            <Select v-model="firstForm.tag" placeholder="请选择商圈" clearable>
              <Option v-for="(option, index) in tagList" :value="option.value" :key="'first-tag-'+ index">{{option.label}}</Option>
            </Select>
        </FormItem>
        <FormItem label="设备" prop="machine_id">
            <Select v-model="firstForm.machine_id" placeholder="请选择设备" clearable>
              <Option v-for="(option, index) in machineList" :value="option.value" :key="'first-machine-'+ index">{{option.label}}</Option>
            </Select>
        </FormItem>
        <FormItem label="账号" prop="user_id">
            <Select v-model="firstForm.user_id" placeholder="请选择账号" clearable>
              <Option v-for="(option, index) in userList" :value="option.value" :key="'first-user-'+ index">{{option.label}}</Option>
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
      @on-ok="handleSubmit('secondForm')">
      <Form ref="secondForm" :model="secondForm" :label-width="60" style="margin-right: 30px">
        <FormItem label="商圈" prop="tag">
            <Select v-model="secondForm.tag" placeholder="请选择商圈" clearable>
              <Option v-for="(option, index) in tagList" :value="option.value" :key="'second-tag-'+ index">{{option.label}}</Option>
            </Select>
        </FormItem>
        <FormItem label="设备" prop="machine_id">
            <Select v-model="secondForm.machine_id" placeholder="请选择设备" clearable>
              <Option v-for="(option, index) in machineList" :value="option.value" :key="'second-machine-'+ index">{{option.label}}</Option>
            </Select>
        </FormItem>
        <FormItem label="账号" prop="user_id">
            <Select v-model="secondForm.user_id" placeholder="请选择账号" clearable>
              <Option v-for="(option, index) in userList" :value="option.value" :key="'second-user-'+ index">{{option.label}}</Option>
            </Select>
        </FormItem>
        <FormItem label="日期" prop="permList">
            <DatePicker type="daterange" split-panels placeholder="默认显示最近一周" :options="datePickerOptions" @on-change="onDateChange3" style="width: 230px"></DatePicker>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="filterModal4"
      title="筛选条件"
      :loading="loading"
      width="350"
      @on-ok="handleSubmit('weekForm')">
      <Form ref="weekForm" :model="weekForm" :label-width="60" style="margin-right: 30px">
        <FormItem label="商圈" prop="tag">
            <Select v-model="weekForm.tag" placeholder="请选择商圈" clearable>
              <Option v-for="(option, index) in tagList" :value="option.value" :key="'week-tag-'+ index">{{option.label}}</Option>
            </Select>
        </FormItem>
        <FormItem label="设备" prop="machine_id">
            <Select v-model="weekForm.machine_id" placeholder="请选择设备" clearable>
              <Option v-for="(option, index) in machineList" :value="option.value" :key="'week-machine-'+ index">{{option.label}}</Option>
            </Select>
        </FormItem>
        <FormItem label="账号" prop="user_id">
            <Select v-model="weekForm.user_id" placeholder="请选择账号" clearable>
              <Option v-for="(option, index) in userList" :value="option.value" :key="'week-user-'+ index">{{option.label}}</Option>
            </Select>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="filterModal5"
      title="筛选条件"
      :loading="loading"
      width="350"
      @on-ok="handleSubmit('mouthForm')">
      <Form ref="mouthForm" :model="mouthForm" :label-width="60" style="margin-right: 30px">
        <FormItem label="商圈" prop="tag">
            <Select v-model="mouthForm.tag" placeholder="请选择商圈" clearable>
              <Option v-for="(option, index) in tagList" :value="option.value" :key="'mouth-tag-'+ index">{{option.label}}</Option>
            </Select>
        </FormItem>
        <FormItem label="设备" prop="machine_id">
            <Select v-model="mouthForm.machine_id" placeholder="请选择设备" clearable>
              <Option v-for="(option, index) in machineList" :value="option.value" :key="'mouth-machine-'+ index">{{option.label}}</Option>
            </Select>
        </FormItem>
        <FormItem label="账号" prop="user_id">
            <Select v-model="mouthForm.user_id" placeholder="请选择账号" clearable>
              <Option v-for="(option, index) in userList" :value="option.value" :key="'mouth-user-'+ index">{{option.label}}</Option>
            </Select>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { ChartCbar, ChartLine } from '_c/charts'
import { getMachineList, getUserList, getTagList, getMemberData } from '@/api/charts'
export default {
  name: 'message',
  components: {
    ChartCbar,
    ChartLine
  },
  data () {
    return {
      newMemberDatas: {},
      datePickerOptions: {},
      firstPayDatas: {},
      secondPayDatas: {},
      weekSleepDatas: [],
      mouthSleepDatas: [],
      loading: true,
      // 共用数据
      machineList: [],
      userList: [],
      tagList: [],
      // 七日沉睡会员列表
      weekColumns: [
        {
          title: '昵称',
          key: 'name'
        },
        {
          title: '卡号',
          key: 'mid'
        },
        {
          title: '最后更新时间',
          key: 'last'
        }
      ],
      // 月沉睡会员列表表格
      mouthColumns: [
        {
          title: '昵称',
          key: 'name'
        },
        {
          title: '卡号',
          key: 'mid'
        },
        {
          title: '最后更新时间',
          key: 'last'
        }
      ],
      // 筛选模态框1
      filterModal1: false,
      newForm: {
        query_type: 'new',
        tag: null,
        machine_id: null,
        user_id: null,
        st_date: null,
        end_date: null
      },
      // 筛选模态框2
      filterModal2: false,
      firstForm: {
        query_type: 'first',
        tag: null,
        machine_id: null,
        user_id: null,
        st_date: null,
        end_date: null
      },
      // 筛选模态框3
      filterModal3: false,
      secondForm: {
        query_type: 'second',
        tag: null,
        machine_id: null,
        user_id: null,
        st_date: null,
        end_date: null
      },
      // 筛选模态框4
      filterModal4: false,
      weekForm: {
        query_type: 'week_sleep',
        tag: null,
        machine_id: null,
        user_id: null
      },
      // 筛选模态框5
      filterModal5: false,
      mouthForm: {
        query_type: 'mouth_sleep',
        tag: null,
        machine_id: null,
        user_id: null
      }
    }
  },
  methods: {
    //日期筛选
    onDateChange1 (dates, type) {
      this.newForm.st_date = dates[0]
      this.newForm.end_date = dates[1]
    },
    //日期筛选
    onDateChange2 (dates, type) {
      this.firstForm.st_date = dates[0]
      this.firstForm.end_date = dates[1]
    },
    //日期筛选
    onDateChange3 (dates, type) {
      this.secondForm.st_date = dates[0]
      this.secondForm.end_date = dates[1]
    },
    /*筛选条件*/
    showFilterModal (name) {
      if (name === 'new') {
        this.filterModal1 = true
      } else if (name === 'first') {
        this.filterModal2 = true
      } else if (name === 'second') {
        this.filterModal3 = true
      } else if (name === 'week') {
        this.filterModal4 = true
      } else if (name === 'mouth') {
        this.filterModal5 = true
      }
    },
    //筛选
    handleSubmit (name) {
      if (name === 'newForm') {
        getMemberData(this.newForm).then(res => {
          this.newMemberDatas = res
          this.filterModal1 = false
        })
      } else if (name === 'firstForm') {
        getMemberData(this.firstForm).then(res => {
          this.firstPayDatas = res
          this.filterModal2 = false
        })
      } else if (name === 'secondForm') {
        getMemberData(this.secondForm).then(res => {
          this.secondPayDatas = res
          this.filterModal3 = false
        })
      } else if (name === 'weekForm') {
        getMemberData(this.weekForm).then(res => {
          this.weekSleepDatas = res
          this.filterModal4 = false
        })
      } else if (name === 'mouthForm') {
        getMemberData(this.mouthForm).then(res => {
          this.mouthSleepDatas = res
          this.filterModal5 = false
        })
      }
    }
  },
  mounted () {
    this.datePickerOptions = {
      disabledDate (date) {
        return date && date.valueOf() > Date.now()
      }
    }
    getMemberData(this.newForm).then(res => {
      this.newMemberDatas = res
      this.filterModal1 = false
    })
    getMemberData(this.firstForm).then(res => {
      this.firstPayDatas = res
      this.filterModal2 = false
    })
    getMemberData(this.secondForm).then(res => {
      this.secondPayDatas = res
      this.filterModal3 = false
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
