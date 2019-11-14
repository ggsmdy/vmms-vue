<!-- 账号添加管理 -->
<template>
  <div>
    <Card>
      <div class="c-table-top"><!--
        <Input clearable placeholder="输入区域名称" class="search-input"/>&lt;!&ndash; v-model="searchValue"&ndash;&gt;
        <Button class="search-btn" type="primary"><Icon type="md-search" size="15"/>&nbsp;&nbsp;搜索</Button>&nbsp;&lt;!&ndash;@click="handleSearch" &ndash;&gt;-->
        <Button class="search-btn" type="primary" @click="handleAddUser"><Icon type="plus-round" size="15"/>&nbsp;&nbsp;新增</Button>
      </div>
      <tables ref="tables" :loading="tableLoading" yon="true" search-place="top" v-model="currPageData" :columns="columns"/>
      <div class="c-table-footer">
        <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
        <Page show-sizer :total="total" :current="curPage" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-page-size-change="pageSizeChange" @on-change="onChange" class-name="c-page"/>
      </div>
    </Card>
    <Modal
      v-model="addUserModal"
      title="新增线路"
      :loading="loading"
      @on-ok="handleSubmit('addForm')" width="400">
      <Form ref="addForm" :model="addForm" :rules="addRuleValidate" :label-width="100" style="margin-right: 20px">
        <FormItem label="线路名称" prop="name" class="modal-input">
          <Input v-model="addForm.name" placeholder="输入线路名称" />
        </FormItem>
        <FormItem label="所属区域" prop="area">
          <Select style="width:200px" v-model="addForm.area">
            <Option v-for="item in areaList" :value="item.id" :key="item.id" name="sendValue">{{
              item.name }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="线路所属人" prop="user">
          <Select style="width:200px" v-model="addForm.user">
            <Option v-for="item in userList" :value="item.id" :key="item.id" name="sendValue">{{
              item.fullname }}
            </Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="editUserModal"
      title="修改线路"
      :loading="loading"
      @on-ok="handleSubmit('editForm')" width="400">
      <Form ref="editForm" :model="editForm" :rules="editRuleValidate" :label-width="100" style="margin-right: 20px">
        <FormItem label="id" prop="id" v-show='false' class="modal-input">
          <Input v-model="editForm.id" placeholder="用户id" />
        </FormItem>
        <FormItem label="线路名称" prop="name" class="modal-input">
          <Input v-model="editForm.name" placeholder="输入用户名" />
        </FormItem>
        <FormItem label="所属区域" prop="area">
          <Select style="width:200px" v-model="editForm.area">
            <Option v-for="item in areaList" :value="item.id" :key="item.id" name="sendValue">{{item.name}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="线路所属人" prop="user">
          <Select style="width:200px" v-model="editForm.user">
            <Option v-for="item in userList" :value="item.id" :key="item.id" name="sendValue">{{item.fullname}}
            </Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="delUserModal"
      title="删除线路"
      :loading="loading"
      @on-ok="delUserConfirm">
      <p>是否确定删除 <strong style="color: red">{{delName}}</strong> 线路</p>
    </Modal>
  </div>
</template>

<script>
  import Tables from '_c/tables'
  import { getSystemUser, getUserPerms, changeUserPerms, getBankCodeList } from '@/api/system'
  import { getLineList,getAreaList,addLine,editLine,delLine } from '@/api/machine'

  export default {
    name: 'lineMd',
    components: {
      Tables
    },
    data () {
      return {
        columns: [
          {
            title: '线路名称', align: 'center', key: 'name', sortable: true, search: true
          },
          {
            title: '所属区域', align: 'center', key: 'area_name', sortable: false, search: true
          },
          {
            title: '线路所属人', align: 'center', key: 'user_name', sortable: false, search: true
          },
          {
            title: '操作',
            key: 'action',
            width: 180,
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
                      this.handleEditUser(params.index)
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
                      this.handleDelUser(params.index)
                    }
                  }
                }, '删除')
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
        pageSize: 100,
        // 可选的每页数据总量
        pageSizeOpts: [ 100, 200],
        // 数据总量
        total: 400,
        // 存放修改用户modal中的参数
        currUserData: 1,
        // 存放修改的用户的index
        activeIndex: 0,
        loading: true,
        tableLoading: false,
        // 是否是管理员
        isManager: false,
        // addUserLoading
        addUserLoading: false,

        // 新增用户modal中的参数
        userList: [],
        areaList: [],
        addUserModal:false,
        // 新增用户表单验证
        addForm: {
          name:'',
          area:'',
          user:''
        },
        addRuleValidate: {
         name: [
            { required: true, message: '线路名称不能为空', trigger: 'blur' }
          ],
          area: [
            { required: true, message: '选择区域，不能为空' }
          ],
          user: [
            { required: true, message: '选择用户，不能为空' }
          ]
        },
        // 修改线路modal
        editUserModal: false,
        // 是否修改自己
        notEditSelf: false,
        // 修改用户表单验证
        editForm: {
          id: '',
          name: '',
          area: '',
          user:''
        },
        editRuleValidate: {
          id: [
            { required: true }
          ],
          name: [
            { required: true, message: '线路名称不能为空', trigger: 'blur' }
          ],
          area: [
            { required: true }
          ],
          user: [
            { required: true }
          ]
        },
        // 权限修改穿梭框
        changePermModal: false,
        permTitles: ['可分配权限', '已分配权限'],
        allPermKeys: [],
        chosePermKeys: [],
        // 删除用户确认框
        delUserModal: false,
        bankCodeList: []
      }
    },
    computed: {
      delName: function () {
        return this.currPageData.length ? this.currPageData[this.activeIndex].name : ''
      }
    },
    methods: {
      exportExcel () {
        this.$refs.tables.exportCsv({
          filename: `table-${(new Date()).valueOf()}.csv`
        })
      },
      onChange (pageId) {
        getSystemUser(pageId, this.pageSize).then(res => {
          this.currPageData = res.results
          this.total = res.count
          this.tableLoading = false
        })
      },
      pageSizeChange (pageSize) {
        getSystemUser(this.curPage, pageSize).then(res => {
          this.currPageData = res.results
          this.total = res.count
          this.tableLoading = false
        })
      },
      // 触发修改按钮
      handleEditUser (index) {
        // this.currPageData.splice(index, 1)
        this.activeIndex = index
        let currData = this.currPageData[index]
        this.editForm = {
          id: currData.id,
          name: currData.name,
          area: currData.area,
          user: currData.user
        }/*
        if (currUserData.username === this.$store.state.user.userName) {
          this.notEditSelf = false
        } else {
          this.notEditSelf = true
        }*/

        this.editUserModal = true
      },
      // 触发新增按钮
      handleAddUser () {
        if (this.$store.state.user.level === 0) {
          this.$Message.error('没有权限')
          return
        }
        this.addUserLoading = true
        this.addUserLoading = false
        this.addUserModal = true
      },
      // 新增用户表单提交
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          this.loading = true
          if (valid) {
            if (name === 'addForm') {
              addLine(this.addForm).then(res => {
                this.currPageData.push(res)
                this.addUserModal = false
                this.$Message.success('增加成功!')
                this.addForm.name=''
                this.addForm.area=''
                this.addForm.user=''
              })
            } else {
              editLine(this.editForm.id, this.editForm).then(res => {
                this.currPageData[this.activeIndex] = res
                // 重载表格数据
                this.currPageData = this.currPageData.slice()
                this.editUserModal = false
                this.$Message.success('修改成功!')
              })
            }
          } else {
            this.$Message.error('验证失败!')
            this.loading = false
          }
        })
      },
      permSubmit () {
        let data = {
          userId: this.currPageData[this.activeIndex].id,
          permList: this.chosePermKeys
        }
        changeUserPerms(data).then(res => {
          if (res.result === 'success') {
            this.$Message.success('更新成功!')
          } else {
            this.$Message.error(res.message)
          }
          this.changePermModal = false
        })
      },
      permKeysChange (newChosePermKeys) {
        this.chosePermKeys = newChosePermKeys
      },
      handleDelUser (index) {
        this.activeIndex = index
        if (this.currPageData[index].username === this.$store.state.user.userName) {
          this.$Message.error('不能删除自己')
          return
        }
        this.delUserModal = true
      },
      delUserConfirm () {
        let _id = this.currPageData[this.activeIndex].id
        delLine(_id).then(res => {
          let index = this.activeIndex
          this.activeIndex = 0
          this.delUserModal = false
          this.$Message.success('删除成功')
          this.currPageData.splice(index, 1)
        })
      },
      editUserBankConfirm () {}
    },
    mounted () {
      this.tableLoading = true
      if (this.$store.state.user.level === 99) {
        this.isManager = true
      }
      getSystemUser().then(res => {
        this.userList = res
      })
      getAreaList().then(res =>{
        this.areaList = res
      })
      getLineList().then(res => {
        this.currPageData = res
        this.total = res.length
        this.tableLoading = false
      })
      getBankCodeList().then(res => {
        this.bankCodeList = res
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

