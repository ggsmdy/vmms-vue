<!-- 区域管理 -->
<template>
  <div>
    <Card>
      <div class="c-table-top"><!--
        <Input clearable placeholder="输入区域名称" class="search-input"/>&lt;!&ndash; v-model="searchValue"&ndash;&gt;
        <Button class="search-btn" type="primary"><Icon type="md-search" size="15"/>&nbsp;&nbsp;搜索</Button>&nbsp;&lt;!&ndash;@click="handleSearch" &ndash;&gt;-->
        <Button class="search-btn" type="primary" @click="handleAddUser"><Icon type="plus-round" size="15"/>&nbsp;&nbsp;新增</Button>
      </div>
      <tables ref="tables" :loading="tableLoading" :addUserLoading="addUserLoading" yon="true" search-place="top" v-model="currPageData" :columns="columns"/>
      <div class="c-table-footer">
        <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
        <Page show-sizer :total="total" :current="curPage" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-page-size-change="pageSizeChange" @on-change="onChange" class-name="c-page"/>
      </div>
    </Card>
    <Modal
      v-model="editUserModal"
      title="修改用户"
      :loading="loading"
      @on-ok="handleSubmit('editForm')" width="400">
      <Form ref="editForm" :model="editForm" :rules="editRuleValidate" :label-width="100" style="margin-right: 20px">
        <FormItem label="id" prop="id" v-show='false' class="modal-input">
          <Input v-model="editForm.id" placeholder="区域id" />
        </FormItem>
        <FormItem label="区域名称" prop="name" class="modal-input">
          <Input v-model="editForm.name" placeholder="输入区域名称" />
        </FormItem>
        <FormItem label="区域负责人" prop="user">
          <Select style="width:200px" v-model="editForm.user">
            <Option v-for="item in userList" :value="item.id" :key="item.id" name="sendValue">{{
              item.fullname }}
            </Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="addUserModal"
      title="新增区域"
      :loading="loading"
      @on-ok="handleSubmit('addForm')" width="400">
      <Form ref="addForm" :model="addForm" :rules="addRuleValidate" :label-width="100" style="margin-right: 20px">
        <FormItem label="区域名称" prop="name" class="modal-input">
          <Input v-model="addForm.name" placeholder="输入区域名称" />
        </FormItem>
        <FormItem label="区域负责人" prop="user">
          <Select style="width:200px" v-model="addForm.user">
            <Option v-for="item in userList" :value="item.id" :key="item.id" name="sendValue">{{
              item.fullname }}
            </Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="delUserModal"
      title="删除区域"
      :loading="loading"
      @on-ok="delUserConfirm">
      <p>是否确定删除 <strong style="color: red">{{delUserName}}</strong>区域</p>
    </Modal>
  </div>
</template>

<script>
  import Tables from '_c/tables'
  import { getSystemUser, getLeaguerUser, changeUserPerms, getBankCodeList,} from '@/api/system'
  import { getAreaList, addArea, editArea, delArea } from '@/api/machine'
  export default {
    name: 'areaMd',
    components: {
      Tables
    },
    data () {
      return {
        columns: [
          {
            title: '区域名称', align: 'center', key: 'name', sortable: true, search: true
          },
          {
            title: '区域所属人', align: 'center', key: 'user_name', sortable: false, search: true
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
        userList:[],
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
        addUserModal: false,
        hasBelongTo: true,
        hasHigher: true,
        leaguerList: [],
        higherLeaguerList: [],
        belongToLeaguerList: [],
        // 新增用户表单验证
        addForm: {
          name: '',
          username:'',
          user: ''
        },
        addRuleValidate: {
          name: [
            { required: true, message: '区域名称不能为空', trigger: 'blur' }
          ],
          user: [
            { required: true, message: '所属人选择，不能为空' }
          ]
        },
        // 新增用户modal
        editUserModal: false,
        // 是否修改自己
        notEditSelf: false,
        // 修改用户表单验证
        editForm: {
          id: '',
          name:'',
          user: ''
        },
        editRuleValidate: {
          id: [
            { required: true }
          ],
          name: [
            { required: true, message: '区域名称不能为空', trigger: 'blur' }
          ],
          user: [
            { required: true, message: '所属人选择，不能为空' }
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
      delUserName: function () {
        return this.currPageData.length ? this.currPageData[this.activeIndex].name : ''
      },
      userLevelList: function () {
        if (this.$store.state.user.level === 99) {
          return [
            {name: '普通用户', value: '0'},
            {name: '一级代理', value: '11'},
            {name: '二级代理', value: '12'},
            {name: '三级代理', value: '13'},
            {name: '管理员', value: '99'}
          ]
        } else {
          return [
            {name: '普通用户', value: '0'}
          ]
        }
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
        /*if (currUserData.username === this.$store.state.user.userName) {
          this.notEditSelf = false
        } else {
          this.notEditSelf = true
        }*/
        getLeaguerUser().then(res => {
          this.editForm = {
            id: currData.id,
            name: currData.name,
            username: currData.username,
            user: currData.user
          }
          this.userLevelChange(this.editForm.level)
          this.leaguerList = res
          this.editUserModal = true
        })
      },
      // 触发新增按钮
      handleAddUser () {
        if (this.$store.state.user.level === 0) {
          this.$Message.error('没有权限')
          return
        }
        this.addUserLoading = true
        getLeaguerUser().then(res => {
          this.leaguerList = res
          this.addUserModal = true
          this.addUserLoading = false
        })
      },
      // 新增用户表单提交
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          this.loading = true
          if (valid) {
            if (name === 'addForm') {
              addArea(this.addForm).then(res => {
                this.currPageData.push(res)
                this.addUserModal = false
                this.$Message.success('增加成功!')
                this.addForm.name=''
                this.addForm.user=''
              })
            } else {
              editArea(this.editForm.id, this.editForm).then(res => {
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
      userLevelChange (value) {
        if (value === '0') {
          this.hasHigher = false
          this.hasBelongTo = true
          this.addForm.higher = ''
          this.addForm.gain_profit = '0'
          this.addForm.gross_profit = '0'
          this.addForm.bank_card_no = ''
          this.addForm.bank_card_name = ''
          this.addForm.bank_card_code = null
          this.editForm.gain_profit = '0'
          this.editForm.gross_profit = '0'
          this.editForm.bank_card_no = ''
          this.editForm.bank_card_name = ''
          this.editForm.bank_card_code = null
          this.higherLeaguerList = []
          this.belongToLeaguerList = this.leaguerList.filter((item, index) => {
            let res = item
            return value < res.level < 20
          })
        } else {
          this.hasHigher = true
          this.hasBelongTo = false
          this.addForm.belongTo = ''
          this.belongToLeaguerList = []
          this.higherLeaguerList = this.leaguerList.filter((item, index) => {
            let res = item
            return value > res.level > 0
          })
        }
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
        this.delUserModal = true
      },
      delUserConfirm () {
        let _id = this.currPageData[this.activeIndex].id
        delArea(_id).then(res => {
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
      getAreaList().then(res => {
        this.currPageData = res
        this.total = res.length
        this.tableLoading = false
      })
      getSystemUser().then(res =>{
        this.userList=res
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

