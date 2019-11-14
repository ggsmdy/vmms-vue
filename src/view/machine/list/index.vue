<template>
  <div>
    <Card>
      <tables ref="tables" :loading="tableLoading" editable searchable search-place="machine" v-model="currPageData" :columns="columns" ajaxSync @on-ajax-sync="ajaxSync" @on-ajax-synd="ajaxSynd"/>
      <div class="c-table-footer">
        <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
        <Page show-sizer :total="total" :current="curPage" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-page-size-change="pageSizeChange" @on-change="onChange" class-name="c-page"/>
      </div>
    </Card>
    <Modal
      v-model="bindModal"
      title="请选择需要的加盟商绑定"
      width="415"
      :loading="loading"
      @on-ok="asyncOK">
      <Form ref="editForm" :model="editForm" inline :label-width="80">
        <FormItem label="名称" prop="name">
          <Input type="text" v-model="editForm.name" style="width:200px" />
        </FormItem>
        <FormItem label="商圈" prop="tag">
          <Input type="text" v-model="editForm.tag" style="width:200px" />
        </FormItem>
        <FormItem label="加盟商" prop="leaguer">
          <Select v-model="editForm.leaguer" filterable style="width:200px" label-in-value clearable :placeholder="bindUserName">
              <Option v-for="item in userList" :value="item.id" :key="item.id">{{ item.username }}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
    <Modal
        v-model="delMachineModal"
        title="删除用户"
        :loading="loading"
        @on-ok="delMachineConfirm">
        <p>是否确定删除 <strong style="color: red">{{delMachineUid}}</strong> 机器，相应的订单也将被删除!</p>
    </Modal>
  </div>
</template>
<!-- @on-row-click="onclikes" -->
<script>
import Tables from '_c/tables'
import { getMachineList, getUserList, changeMachine, delMachine } from '@/api/machine'
import { renderRunStateClass } from '@/libs/util'
export default {
  name: 'machine_list',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        {
          title: '设备号', width: 150, align: 'center', key: 'uid', sortable: false, search: true
        },
        {
          title: '名称', width: 150, align: 'center', key: 'name', sortable: false, search: true
        },
        {
          title: '标签', width: 120, align: 'center', key: 'tag', sortable: false, search: true
        },
        {
          title: '联网',
          key: 'net_state',
          width: 80,
          align: 'center',
          search: true,
          render: (h, params) => {
            return h('Tag',
              {props: {
                color: params.row.net_state === '在线' ? 'primary' : 'error'
              }},
              params.row.net_state)
          }
        },
        {
          title: '运行',
          key: 'work_state',
          width: 80,
          align: 'center',
          search: true,
          render: (h, params) => {
            return h('Tag',
              {props: {
                color: renderRunStateClass(params.row.work_state)
              }},
              params.row.work_state)
          }
        },
        {
          title: '所属人', width: 120, align: 'center', key: 'leaguer_name', sortable: false, search: true
        },
        {
          title: '清洗时间', width: 160, align: 'center', key: 'cls_time', sortable: false, search: false
        },
        {
          title: '操作',
          key: 'action',
          width: 95,
          align: 'center',
          search: false,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small',
                  shape: 'circle',
                  icon: 'md-create'
                },
                on: {
                  click: () => {
                    this.bindUser(params.index)
                  }
                }
              }, '修改')
              // h('Button', {
              //   props: {
              //     type: 'error',
              //     size: 'small',
              //     shape: 'circle',
              //     icon: 'md-close'
              //   },
              //   on: {
              //     click: () => {
              //       this.handleDelMachine(params.index)
              //     }
              //   }
              // }, '删除')
            ])
          }
        },
        {
          title: '进入地图',
          width: 100,
          align: 'center',
          key: 'cls_time',
          sortable: false,
          search: false,
          render: (h, params) => {
            return h('Button', {
              props: {
                type: 'warning',
                size: 'small',
                shape: 'circle'
              },
              on: {
                click: () => {
                  this.onclikes(params.row.uid)
                }
              }
            }, '进入地图')
          }
        },
        {
          title: '详细', minWidth: 240, key: 'desc', sortable: false, search: false
        }
      ],
      machineData:[],
      // 修改表单
      editForm: {
        uid: '',
        name: '',
        leaguer: '',
        tag: ''
      },
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
      bindModal: false,
      loading: true,
      tag: '',
      userList: [],
      // 存放选中绑定人的名字和id
      bindUserName: '',
      tableLoading: false,
      // 删除机器
      delMachineModal: false
    }
  },
  computed: {
    delMachineUid: function () {
      return this.currPageData.length && this.currPageData[this.currIndex] ? this.currPageData[this.currIndex].uid : ''
    }
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
      getMachineList(pageId, this.pageSize, this.kwargs ,this.machineData).then(res => {
        this.currPageData = res.results
        this.total = res.count
        this.tableLoading = false
      })
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize
      this.tableLoading = true
      getMachineList(this.curPage, pageSize, this.kwargs ,this.machineData).then(res => {
        this.currPageData = res.results
        this.total = res.count
        this.curPage = res.curPage
        this.tableLoading = false
      })
    },
    bindUser (index) {
      // this.currPageData.splice(index, 1)
      this.$emit('clearSingleSelect')
      this.currIndex = index
      this.bindModal = true
      this.editForm.tag = this.currPageData[this.currIndex].tag
      this.editForm.name = this.currPageData[this.currIndex].name
      this.editForm.leaguer = this.currPageData[this.currIndex].leaguer
      this.editForm.uid = this.currPageData[this.currIndex].uid
      this.bindUserName = this.currPageData[this.currIndex].leaguer_name
      getUserList().then(res => {
        this.userList = res
      })
    },
    handleDelMachine (index) {
      this.currIndex = index
      if (this.$store.state.user.level !== 99 && this.$store.state.user.level !== '99') {
        this.$Message.error('非管理员不能操作')
        return
      }
      this.delMachineModal = true
    },
    asyncOK () {
      changeMachine(this.editForm.uid, this.editForm).then(res => {
        this.bindModal = false
        this.currPageData[this.currIndex].leaguer_name = res.leaguer_name
        this.currPageData[this.currIndex].tag = res.tag
        this.currPageData[this.currIndex].name = res.name
      })
    },
    delMachineConfirm () {
      let _id = this.currPageData[this.currIndex].uid
      delMachine(_id).then(res => {
        let index = this.currIndex
        this.currIndex = 0
        this.delMachineModal = false
        this.$Message.success('删除成功')
        this.currPageData.splice(index, 1)
      })
    },
    ajaxSync (key, value) {
      this.kwargs = {}
      this.kwargs[key] = value
      this.tableLoading = true
      getMachineList(this.curPage, this.pageSize, this.kwargs ,this.machineData).then(res => {
        this.currPageData = res.results
        this.total = res.count
        this.tableLoading = false
      })
    },
    ajaxSynd(key,value){
      this.machineData=value
      getMachineList(this.curPage, this.pageSize, this.kwargs ,this.machineData).then(res => {
        this.currPageData = res.results
        this.total = res.count
        this.tableLoading = false
      })
    },
    onclikes(key){
      this.$router.push({path:'/machine/map',query:{machine_Uid:key}})
    }
  },
  mounted () {
    this.tableLoading = true
    getMachineList(this.curPage, this.pageSize).then(res => {
      this.currPageData = res.results
      this.total = res.count
      this.tableLoading = false
    })
  }
}
</script>

<style>
.c-page {
  float: right;
  padding: 12px;
}
</style>
