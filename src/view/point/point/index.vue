<template>
  <div>
    <Card>
      <div class="c-table-top"><!--
        <Input clearable placeholder="输入区域名称" class="search-input"/>&lt;!&ndash; v-model="searchValue"&ndash;&gt;
        <Button class="search-btn" type="primary"><Icon type="md-search" size="15"/>&nbsp;&nbsp;搜索</Button>&nbsp;&lt;!&ndash;@click="handleSearch" &ndash;&gt;-->
        <Button class="search-btn" type="primary" @click="handleAddPoint"><Icon type="plus-round" size="15"/>&nbsp;&nbsp;新增</Button>
      </div>
      <tables ref="tables" :loading="tableLoading" v-model="currPageData" :columns="columns" ajaxSync @on-ajax-sync="ajaxSync" @on-ajax-synd="ajaxSynd"/>
      <div class="c-table-footer">
        <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
        <Page show-sizer :total="total" :current="curPage" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-page-size-change="pageSizeChange" @on-change="onChange" class-name="c-page"/>
      </div>
    </Card>
    <Modal
      v-model="addUserModal"
      title="新增点位"
      :loading="loading"
      width="400"
      @on-ok="handleSubmit('addForm')">
      <Form ref="addForm" :model="addForm" :rules="addRuleValidate" :label-width="100" style="margin-right: 20px">
        <FormItem label="点位名称" prop="name" class="modal-input">
          <Input v-model="addForm.name" placeholder="输入点位名称" />
        </FormItem>
        <FormItem label="所属区域" prop="area">
          <Select style="width:200px" v-model="addForm.area">
            <Option v-for="item in areaList" :value="item.id" :key="item.id" name="sendValue">
              {{item.name }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="所属线路" prop="line">
          <Select style="width:200px" v-model="addForm.line">
            <Option v-for="item in linesList" :value="item.id" :key="item.id" name="sendValue">
              {{item.name }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="点位负责人" prop="user">
          <Select style="width:200px" v-model="addForm.user">
            <Option v-for="item in userList" :value="item.id" :key="item.id" name="sendValue">
              {{item.fullname }}
            </Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="bindModal"
      title="编辑点位"
      width="400"
      :loading="loading"
      @on-ok="handleSubmit('editForm')">
      <Form ref="editForm" :model="editForm" :rules="editFormdata" inline :label-width="100">
        <FormItem label="点位名称" prop="name" class="modal-input">
          <Input v-model="editForm.name" placeholder="输入点位名称" />
        </FormItem>
        <FormItem label="所属区域" prop="area">
          <Select style="width:200px" v-model="editForm.area">
            <Option v-for="item in areaList" :value="item.id" :key="item.id" name="sendValue">
              {{item.name }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="所属线路" prop="line">
          <Select style="width:200px" v-model="editForm.line">
            <Option v-for="item in lineeList" :value="item.id" :key="item.id" name="sendValue">
              {{item.name }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="点位负责人" prop="user">
          <Select style="width:200px" v-model="editForm.user">
            <Option v-for="item in userList" :value="item.id" :key="item.id" name="sendValue">
              {{item.fullname }}
            </Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="delMachineModal"
      title="删除点位"
      :loading="loading"
      @on-ok="delMachineConfirm">
      <p>是否确定删除 <strong style="color: red">{{delMachineUid}}</strong> 点位</p>
    </Modal>
  </div>
</template>
<!-- @on-row-click="onclikes" -->
<script>
  import Tables from '_c/tables'
  import {getLeaguerUser ,getSystemUser} from '@/api/system'
  import { getMachineList, getPointList,getAreaList,getLineList,addPoint ,delPoint,editPoint} from '@/api/machine'
  import { renderRunStateClass } from '@/libs/util'
  export default {
    name: 'pointMd',
    components: {
      Tables
    },
    data () {
      return {
        columns: [
          {
            title: '点位名称',  align: 'center', key: 'name', sortable: false, search: true
          },
          {
            title: '所属区域',  align: 'center', key: 'area_name', sortable: false, search: true
          },
          {
            title: '所属线路',  align: 'center', key: 'line_name', sortable: false, search: true
          },
          {
            title: '所属用户',  align: 'center', key: 'user_name', sortable: false, search: true
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
                      this.bindUser(params.index)
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.handleDelMachine(params.index)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        machineData:[],
        addUserModal:false,
        // 新增表单验证
        lineList:[],
        areaList:[],
        addForm: {
          name: '',
          area: '',
          line: '',
          user: ''
        },
        addRuleValidate: {
          name: [
            { required: true, message: '点位名称不能为空', trigger: 'blur' }
          ],
          line: [
            { required: true, message: '选择所属线路，不能为空' }
          ],
          user: [
            { required: true, message: '选择所属人，不能为空' }
          ]
        },
        // 修改表单
        editForm: {
          id: '',
          name: '',
          area: '',
          line: '',
          user: ''
        },
        editFormdata: {
          name: [
            { required: true, message: '点位名称不能为空', trigger: 'blur' }
          ],
          line: [
            { required: true, message: '选择所属线路，不能为空' }
          ],
          user: [
            { required: true, message: '选择所属人，不能为空' }
          ]
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
        return this.currPageData.length && this.currPageData[this.currIndex] ? this.currPageData[this.currIndex].name : ''
      },
      linesList:function () {
        let a=[]
        if (this.addForm.area!=''){
          for (let i = 0; i < this.lineList.length;i++){
            if (this.addForm.area==this.lineList[i].area){
              a.push(this.lineList[i]);
            }
          }
          return a
        }else{
          return this.lineList
        }
      },
      lineeList:function () {
        let a=[]
        if (this.editForm.area!=''){
          for (let i = 0; i < this.lineList.length;i++){
            if (this.editForm.area==this.lineList[i].area){
              a.push(this.lineList[i]);
            }
          }
          return a
        }else{
          return this.lineList
        }
      }
    },
    methods: {
      exportExcel () {
        this.$refs.tables.exportCsv({
          filename: `table-${(new Date()).valueOf()}.csv`
        })
      },
      // 触发新增按钮
      handleAddPoint () {
        if (this.$store.state.user.level === 0) {
          this.$Message.error('没有权限')
          return
        }
        this.addUserLoading = true
        this.addUserModal = true
      },
      // 表单提交
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          this.loading = true
          if (valid) {
            if (name === 'addForm') {
              addPoint(this.addForm).then(res => {
                this.currPageData.push(res)
                this.addUserModal = false
                this.$Message.success('增加成功!')
                this.addForm.name=''
                this.addForm.area=''
                this.addForm.line=''
                this.addForm.user=''
              })
            } else {
              editPoint(this.editForm.id, this.editForm).then(res => {
                this.currPageData[this.activeIndex] = res
                // 重载表格数据
                this.currPageData = this.currPageData.slice()
                this.bindModal = false
                this.$Message.success('修改成功!')
              })
            }
          } else {
            this.$Message.error('验证失败!')
            this.loading = false
          }
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
        this.activeIndex = index
        // this.currPageData.splice(index, 1)
        this.$emit('clearSingleSelect')
        this.currIndex = index
        this.bindModal = true
        this.editForm.id = this.currPageData[this.currIndex].id
        this.editForm.name = this.currPageData[this.currIndex].name
        this.editForm.area = ''
        this.editForm.line = this.currPageData[this.currIndex].line
        this.editForm.user = this.currPageData[this.currIndex].user
      },
      handleDelMachine (index) {
        this.currIndex = index
        this.delMachineModal = true
      },
      delMachineConfirm () {
        let _id = this.currPageData[this.currIndex].id
        delPoint(_id).then(res => {
          this.delMachineModal = false
          let index = this.currIndex
          this.currIndex = 0
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
      getPointList().then(res => {
        this.currPageData = res
        this.total = res.count
        this.tableLoading = false
      })
      getLeaguerUser().then(res => {
        this.leaguerList = res
        this.addUserLoading = false
      })
      getSystemUser().then(res => {
        this.userList = res
      })
      getAreaList().then(res =>{
        this.areaList = res
      })
      getLineList().then(res =>{
        this.lineList = res
      })
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
  .modal-input{
    width: 19rem;
  }
</style>
