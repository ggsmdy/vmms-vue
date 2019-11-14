<template>
  <div>
    <Card>
      <Input clearable placeholder="输入角色名称关键字搜索" class="search-input"/>
      <Input clearable placeholder="输入权限名称关键字搜索" class="search-input"/>
      <Input clearable placeholder="输入权限名称关键字搜索" class="search-input"/>
      <Button class="search-btn" type="primary"><Icon type="md-search" size="15"/>&nbsp;&nbsp;搜索</Button>&nbsp;
      <Button class="search-btn" type="primary" style="float: right;">&nbsp;&nbsp;新增</Button>&nbsp;
      <tables ref="tables" border :loading="tableLoading" v-model="currPageData" :columns="columns" @on-selection-change="selectItem"/>
      <Row class="c-table-footer">
        <i-col span="24">
          <Page show-sizer :total="total" style="fload:right" :current="curPage" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-page-size-change="pageSizeChange" @on-change="onChange" class-name="c-page"/>
        </i-col>
      </Row>
    </Card>
    <Modal
      v-model="showDetailModal"
      width="415">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>告警详细信息</span>
      </p>
      <div style="text-align:left;padding-left:20px">
        <p><strong>错误码: </strong>{{code}}</p>
        <p><strong>部件编号: </strong>{{com_uid}}</p>
        <p><strong>产生时间: </strong>{{ct_time}}</p>
        <p><strong>派单时间: </strong>{{dispatch_time}}</p>
        <p><strong>处理状态: </strong>{{dispose_state}}</p>
        <p><strong>跟进人员: </strong>{{dispatch_user}}</p>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="showDetailOK">确认</Button>
      </div>
    </Modal>
    <Modal
      v-model="dispatchModal"
      title="将告警信息指派给维护人员"
      width="315"
      :loading="loading"
      @on-ok="dispatchOK">
      <Select v-model="dispatchUser" style="width:200px;margin-left:30px">
        <Option v-for="item in maintainer" :value="item.userId" :key="item.userId">{{ item.fullname }}</Option>
      </Select>
    </Modal>
  </div>
</template>

<script>
  import Tables from '_c/tables'
  import { getAlarmList, changeAlarmStatus, getMaintainerList, setMaintainer } from '@/api/machine'
  import { renderAlarmLevelClass } from '@/libs/util'
  export default {
    name: 'role_list',
    components: {
      Tables
    },
    data () {
      return {
        columns: [
          {
            title: '角色编号', key: 'id', align: 'center', sortable: false
          },
          {
            title: '角色名称', key: 'machine_name', align: 'center', sortable: false
          },
          {
            title: '创建时间',
            key: 'level',
            align: 'center',
            render: (h, params) => {
              return h('Tag',
                {props: {
                    color: renderAlarmLevelClass(params.row.level)
                  }},
                params.row.level)
            }
          },
          {
            title: '更新时间',
            key: 'desc',
            sortable: false
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            search: false,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.showDetail(params.index)
                    }
                  }
                }, '修改')
              ])
            }
          }
        ],
        // 当前页数据
        currPageData: [],
        // 所有数据
        tableTotalData: [],
        // 当前页码
        curPage: 1,
        // 每页数据量
        pageSize: 20,
        // 可选的每页数据总量
        pageSizeOpts: [20, 50, 100, 200],
        // 数据总量
        total: 20,
        // 存放绑定modal中的参数
        currIndex: 0,
        showDetailModal: false,
        loading: true,
        // 存放选中的告警信息
        selectedItem: [],
        tableLoading: false,
        // 派单
        dispatchUser: '',
        maintainer: [],
        dispatchModal: false
      }
    },
    computed: {
      code: function () { return this.currPageData.length ? this.currPageData[this.currIndex].code : '' },
      com_uid: function () { return this.currPageData.length ? this.currPageData[this.currIndex].com_uid : '' },
      ct_time: function () { return this.currPageData.length ? this.currPageData[this.currIndex].ct_time : '' },
      dispatch_time: function () { return this.currPageData.length ? this.currPageData[this.currIndex].dispatch_time : '' },
      dispose_state: function () { return this.currPageData.length ? this.currPageData[this.currIndex].dispose_state : '' },
      dispatch_user: function () { return this.currPageData.length ? this.currPageData[this.currIndex].dispatch_user : '' }
    },
    methods: {
      exportExcel () {
        this.$refs.tables.exportCsv({
          filename: `table-${(new Date()).valueOf()}.csv`
        })
      },
      onChange (pageId) {
        this.curPage = pageId
        this.tableLoading = true
        getAlarmList(pageId, this.pageSize).then(res => {
          this.currPageData = res.results
          this.total = res.count
          this.tableLoading = false
        })
      },
      pageSizeChange (pageSize) {
        this.pageSize = pageSize
        this.tableLoading = true
        getAlarmList(this.curPage, pageSize).then(res => {
          this.currPageData = res.results
          this.total = res.count
          this.curPage = res.curPage
          this.tableLoading = false
        })
      },
      showDetail (index) {
        this.currIndex = index
        this.showDetailModal = true
      },
      showDetailOK () {
        this.showDetailModal = false
      },
      setReadStatus (status) {
        let tmpArray = []
        this.selectedItem.forEach(element => {
          tmpArray.push(element.id)
        })
        if (!tmpArray.length) {
          this.$Message.error('请选中一行或多行进行操作!')
          return
        }
        let data = {
          alarms: tmpArray,
          read: true
        }
        if (status === 'read') {
          data.read = true
        } else {
          data.read = false
        }
        changeAlarmStatus(data).then(res => {
          if (res.result === 'success') {
            this.currPageData.forEach(item => {
              item.is_read = tmpArray.indexOf(item.id) !== -1 ? data.read : item.is_read
            })
            this.$Message.success('更改状态成功!')
          } else {
            this.$Message.success('更改状态失败!')
          }
        })
      },
      selectItem (selection, row) {
        this.selectedItem = selection
      },
      dispatchHander () {
        if (this.selectedItem.length !== 1) {
          this.$Message.error('只能选择一行进行操作!')
          return
        }
        getMaintainerList(this.selectedItem[0].machine).then(res => {
          this.maintainer = res.data
          this.dispatchModal = true
        })
      },
      dispatchOK () {
        let data = {
          alarmId: this.selectedItem[0].id,
          userId: this.dispatchUser
        }
        setMaintainer(data).then(res => {
          if (res.result === 'success') {
            this.$Message.success('派单成功')
          }
          this.dispatchModal = false
        })
      }
    },
    mounted () {
      this.tableLoading = true
      /*getAlarmList(this.curPage, this.pageSize).then(res => {
        this.currPageData = res.results
        this.total = res.count
        this.tableLoading = false
      })*/
      this.tableLoading = false
    }
  }
</script>

<style>
  .c-page {
    float: right;
    padding: 12px;
  }
  .c-table-footer {
    margin: 5px;
  }
  .search-input{
    display: inline-block;
    width: 200px;
    margin-left: 2px;
  }
</style>
