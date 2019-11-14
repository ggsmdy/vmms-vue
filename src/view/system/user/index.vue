<!-- 账号添加管理 -->
<template>
  <div>
    <Card>
      <tables ref="tables" :loading="tableLoading" editable searchable addUser :addUserLoading="addUserLoading" yon="true" search-place="top" v-model="currPageData" :columns="columns" @on-add-user="handleAddUser"/>
      <div class="c-table-footer">
        <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
        <Page show-sizer :total="total" :current="curPage" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-page-size-change="pageSizeChange" @on-change="onChange" class-name="c-page"/>
      </div>
    </Card>
    <Modal
      v-model="editUserModal"
      title="修改用户"
      :loading="loading"
      @on-ok="handleSubmit('editForm')">
      <Form ref="editForm" :model="editForm" :rules="editRuleValidate" :label-width="80" style="margin-right: 20px">
        <FormItem label="id" prop="id" v-show='false'>
            <Input v-model="editForm.id" placeholder="用户id" />
        </FormItem>
        <FormItem label="用户名" prop="username">
            <Input v-model="editForm.username" placeholder="输入用户名" />
        </FormItem>
        <FormItem label="全名" prop="fullname">
            <Input v-model="editForm.fullname" placeholder="输入全名" />
        </FormItem>
        <FormItem label="电话" prop="tel">
            <Input v-model="editForm.tel" placeholder="输入手机号码" />
        </FormItem>
        <FormItem label="密码" prop="password">
            <Input v-model="editForm.password" placeholder="请输入密码" />
        </FormItem>
        <FormItem label="用户等级" prop="level" v-if="notEditSelf">
            <Select v-model="editForm.level" placeholder="选择用户等级" @on-change="userLevelChange">
                <Option v-for="item in userLevelList" :key="item.value" :value="item.value">{{item.name}}</Option>
            </Select>
        </FormItem>
        <FormItem label="所属代理" prop="belongTo" v-if="notEditSelf">
            <Select v-model="editForm.belongTo" placeholder="选择所属代理" :disabled="!hasBelongTo">
              <Option v-for="item in belongToLeaguerList" :value="item.id" :key="item.id">{{ item.username }}</Option>
            </Select>
        </FormItem>
        <FormItem label="上级代理" prop="higher" v-if="notEditSelf">
            <Select v-model="editForm.higher" placeholder="选择上级代理" :disabled="!hasHigher">
              <Option v-for="item in higherLeaguerList" :value="item.id" :key="item.id">{{ item.username }}</Option>
            </Select>
        </FormItem>
        <FormItem label="分成比例" prop="gain_profit">
            <Input v-model="editForm.gain_profit" placeholder="请输入分成比例(%)" :disabled="!hasHigher || !isManager" />
        </FormItem>
        <FormItem label="毛利比例" prop="gross_profit">
            <Input v-model="editForm.gross_profit" placeholder="请输入毛利比例(%)" :disabled="!hasHigher" />
        </FormItem>
        <FormItem label="银行卡号" prop="bank_card_no" v-show="isManager">
            <Input v-model="editForm.bank_card_no" placeholder="请输入付款银行卡号" :disabled="!hasHigher"/>
        </FormItem>
        <FormItem label="开户行" prop="bank_card_code" v-show="isManager">
            <Select v-model="editForm.bank_card_code" placeholder="选择付款银行卡开户行" :disabled="!hasHigher">
              <Option v-for="item in bankCodeList" :value="item.code" :key="item.code" type="number">{{ item.name }}</Option>
            </Select>
        </FormItem>
        <FormItem label="开户名称" prop="bank_card_name" v-show="isManager">
            <Input v-model="editForm.bank_card_name" placeholder="请输入付款人姓名" :disabled="!hasHigher"/>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="addUserModal"
      title="新增用户"
      :loading="loading"
      @on-ok="handleSubmit('addForm')">
      <Form ref="addForm" :model="addForm" :rules="addRuleValidate" :label-width="80" style="margin-right: 20px">
        <FormItem label="id" prop="id" v-show='false'>
            <Input v-model="addForm.id" placeholder="用户id" />
        </FormItem>
        <FormItem label="用户名" prop="username">
            <Input v-model="addForm.username" placeholder="输入用户名" />
        </FormItem>
        <FormItem label="全名" prop="fullname">
            <Input v-model="addForm.fullname" placeholder="输入全名" />
        </FormItem>
        <FormItem label="电话" prop="tel">
            <Input v-model="addForm.tel" placeholder="输入手机号码" />
        </FormItem>
        <FormItem label="密码" prop="password">
            <Input v-model="addForm.password" placeholder="请输入密码" />
        </FormItem>
        <FormItem label="用户等级" prop="level">
            <Select v-model="addForm.level" placeholder="选择用户等级" @on-change="userLevelChange">
                <Option v-for="item in userLevelList" :key="item.value" :value="item.value">{{item.name}}</Option>
            </Select>
        </FormItem>
        <FormItem label="所属代理" prop="belongTo">
            <Select v-model="addForm.belongTo" placeholder="选择所属代理" :disabled="!hasBelongTo">
              <Option v-for="item in belongToLeaguerList" :value="item.id" :key="item.id">{{ item.username }}</Option>
            </Select>
        </FormItem>
        <FormItem label="上级代理" prop="higher">
            <Select v-model="addForm.higher" placeholder="选择上级代理" :disabled="!hasHigher">
              <Option v-for="item in higherLeaguerList" :value="item.id" :key="item.id">{{ item.username }}</Option>
            </Select>
        </FormItem>
        <FormItem label="分成比例" prop="gain_profit">
            <Input v-model="addForm.gain_profit" placeholder="请输入分成比例(%)" :disabled="!hasHigher" />
        </FormItem>
        <FormItem label="毛利比例" prop="gross_profit">
            <Input v-model="addForm.gross_profit" placeholder="请输入毛利比例(%)" :disabled="!hasHigher" />
        </FormItem>
        <FormItem label="银行卡号" prop="bank_card_no" v-show="isManager">
            <Input v-model="addForm.bank_card_no" placeholder="请输入付款银行卡号" :disabled="!hasHigher"/>
        </FormItem>
        <FormItem label="开户行" prop="bank_card_code" v-show="isManager">
            <Select v-model="addForm.bank_card_code" placeholder="选择付款银行卡开户行" :disabled="!hasHigher">
              <Option v-for="item in bankCodeList" :value="item.code" :key="item.code" type="number">{{ item.name }}</Option>
            </Select>
        </FormItem>
        <FormItem label="开户名称" prop="bank_card_name" v-show="isManager">
            <Input v-model="addForm.bank_card_name" placeholder="请输入付款人姓名" :disabled="!hasHigher"/>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="changePermModal"
      title="权限修改"
      :loading="loading"
      @on-ok="permSubmit()">
      <Transfer
        :titles="permTitles"
        :data="allPermKeys"
        :target-keys="chosePermKeys"
        @on-change="permKeysChange"
        style="margin-left: 30px"></Transfer>
    </Modal>
    <Modal
        v-model="delUserModal"
        title="删除用户"
        :loading="loading"
        @on-ok="delUserConfirm">
        <p>是否确定删除 <strong style="color: red">{{delUserName}}</strong> 用户</p>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getSystemUser, addSystemUser, editSystemUser, delSystemUser, getLeaguerUser, getUserPerms, changeUserPerms, getBankCodeList } from '@/api/system'
export default {
  name: 'user_list',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        {
          title: '用户名', align: 'center', width: 110, key: 'username', sortable: true, search: true
        },
        {
          title: '微信绑定',
          key: 'isBind',
          search: false,
          width: 110,
          render: (h, params) => {
            return h('Tag',
              {props: {
                color: params.row.is_bind === true ? 'primary' : 'error'
              }},
              params.row.is_bind === true ? '已绑定' : '未绑定')
          }
        },
        {
          title: '全名',
          key: 'fullname',
          align: 'center',
          sortable: false,
          width: 100,
          search: true
        },
        {
          title: '手机号码', align: 'center', width: 110, key: 'tel', sortable: false, search: true
        },
        {
          title: '用户等级', align: 'center', width: 90, key: 'level_name', sortable: false, search: true
        },
        {
          title: '所属代理', align: 'center', width: 100, key: 'belong_to_name', sortable: false, search: true
        },
        {
          title: '上级代理', align: 'center', width: 100, key: 'higher_name', sortable: false, search: true
        },
        {
          title: '分成比例(%)', align: 'center', width: 110, key: 'gain_profit', sortable: false, search: false
        },
        {
          title: '银行卡号', align: 'center', width: 110, key: 'bank_card_no', sortable: false, search: false
        },
        {
          title: '银行账户名', align: 'center', width: 110, key: 'bank_card_name', sortable: false, search: false
        },
        {
          title: '银行开户行', align: 'center', width: 110, key: 'bank_card_code_name', sortable: false, search: false
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
                    this.handleEditPerm(params.index)
                  }
                }
              }, '权限'),
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
      addUserModal: false,
      hasBelongTo: true,
      hasHigher: true,
      leaguerList: [],
      higherLeaguerList: [],
      belongToLeaguerList: [],
      // 新增用户表单验证
      addForm: {
        username: '',
        fullname: '',
        password: '',
        tel: '',
        level: '',
        higher: '',
        belongTo: '',
        gain_profit: '0',
        gross_profit: '0',
        bank_card_no: '',
        bank_card_name: '',
        bank_card_code: null
      },
      addRuleValidate: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        fullname: [
          { required: true, message: '改名用于显示，不能为空' }
        ],
        password: [
          { required: false, type: 'string', min: 6, message: '密码最少６个字符' }
        ],
        tel: [
          { required: false, type: 'string', pattern: /^([\d]{11})$/, len: 11, message: '请填写正确的手机号码' }
        ],
        level: [
          { required: true, message: '请选择用户等级', trigger: 'change' }
        ],
        gain_profit: [
          { required: false, type: 'string', pattern: /^100$|^(\d|[1-9]\d)$/, message: '请输入正确的分成比例(0-100)', trigger: 'change' }
        ],
        gross_profit: [
          { required: false, type: 'string', pattern: /^100$|^(\d|[1-9]\d)$/, message: '请输入正确的毛利比例(0-100)', trigger: 'change' }
        ]
      },
      // 新增用户modal
      editUserModal: false,
      // 是否修改自己
      notEditSelf: false,
      // 修改用户表单验证
      editForm: {
        id: '',
        username: '',
        fullname: '',
        password: '',
        tel: '',
        level: '',
        higher: '',
        belongTo: '',
        gain_profit: '0',
        gross_profit: '0',
        bank_card_no: '',
        bank_card_name: '',
        bank_card_code: null
      },
      editRuleValidate: {
        id: [
          { required: true }
        ],
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        fullname: [
          { required: false }
        ],
        password: [
          { required: false, type: 'string', min: 6, message: '密码最少６个字符' }
        ],
        tel: [
          { required: false, type: 'string', pattern: /^([\d]{11})$/, len: 11, message: '请填写正确的手机号码' }
        ],
        level: [
          { required: true, message: '请选择用户等级', trigger: 'change' }
        ],
        gain_profit: [
          { required: false, type: 'string', pattern: /^100$|^(\d|[1-9]\d)$/, message: '请输入正确的分成比例(0-100)', trigger: 'change' }
        ],
        gross_profit: [
          { required: false, type: 'string', pattern: /^100$|^(\d|[1-9]\d)$/, message: '请输入正确的毛利比例(0-100)', trigger: 'change' }
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
      return this.currPageData.length ? this.currPageData[this.activeIndex].username : ''
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
      let currUserData = this.currPageData[index]
      if (currUserData.username === this.$store.state.user.userName) {
        this.notEditSelf = false
      } else {
        this.notEditSelf = true
      }
      getLeaguerUser().then(res => {
        this.editForm = {
          id: currUserData.id,
          username: currUserData.username,
          fullname: currUserData.fullname,
          password: currUserData.password,
          tel: currUserData.tel,
          level: currUserData.level.toString(),
          higher: currUserData.higher,
          belongTo: currUserData.belongTo,
          gain_profit: currUserData.gain_profit.toString(),
          gross_profit: currUserData.gross_profit.toString(),
          bank_card_no: currUserData.bank_card_no.toString(),
          bank_card_name: currUserData.bank_card_name.toString(),
          bank_card_code: currUserData.bank_card_code
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
    // 触发权限编辑按钮
    handleEditPerm (index) {
      this.activeIndex = index
      if (this.currPageData[index].username === this.$store.state.user.userName) {
        this.$Message.error('不能更改自己的权限')
        return
      }
      if (this.$store.state.user.level === 0) {
        this.$Message.error('没有权限')
        return
      }
      getUserPerms(this.currPageData[index].id).then(res => {
        this.allPermKeys = res.perms.map(item => {
          let obj = {
            key: item.id,
            label: item.name
          }
          return obj
        })
        this.chosePermKeys = res.old_perms.map(item => {
          return item.id
        })
        this.changePermModal = true
      })
    },
    // 新增用户表单提交
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        this.loading = true
        if (valid) {
          if (name === 'addForm') {
            addSystemUser(this.addForm).then(res => {
              this.currPageData.push(res)
              this.addUserModal = false
              this.$Message.success('增加成功!')
            })
          } else {
            editSystemUser(this.editForm.id, this.editForm).then(res => {
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
      if (this.currPageData[index].username === this.$store.state.user.userName) {
        this.$Message.error('不能删除自己')
        return
      }
      this.delUserModal = true
    },
    delUserConfirm () {
      let _id = this.currPageData[this.activeIndex].id
      delSystemUser(_id).then(res => {
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
    getSystemUser(this.curPage, this.pageSize).then(res => {
      this.currPageData = res.results
      this.total = res.count
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
</style>
