<template>
  <div>
    <Card>
      <Row style="margin:10px">
        <Button @click="handleAddGroup" :loading="addGroupLoading" class="add-btn" type="info">增加</Button>
      </Row>
      <tables ref="tables" :loading="tableLoading" v-model="totalData" :columns="columns"/>
    </Card>
    <Modal
      v-model="addGroupModal"
      title="新增群组"
      :loading="loading"
      width="600"
      @on-ok="handleSubmit('addForm')">
      <Form ref="addForm" :model="addForm" :rules="addRuleValidate" :label-width="60" style="margin-right: 10px">
        <FormItem label="id" prop="groupId" v-show='false'>
            <Input v-model="addForm.groupId" placeholder="群组id" />
        </FormItem>
        <FormItem label="群组名" prop="name">
            <Input v-model="addForm.name" placeholder="输入群组名" />
        </FormItem>
        <FormItem label="描述" prop="desc">
            <Input v-model="addForm.desc" placeholder="输入描述信息" />
        </FormItem>
        <FormItem label="权限分配" prop="permList">
            <Transfer
              :titles="permTitles"
              :data="allPermKeys"
              :target-keys="addForm.permList"
              @on-change="addPermKeysChange"
              style="margin-left: 30px"></Transfer>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="editGroupModal"
      title="修改群组"
      :loading="loading"
      width="600"
      @on-ok="handleSubmit('editForm')">
      <Form ref="editForm" :model="editForm" :rules="editRuleValidate" :label-width="60" style="margin-right: 10px">
        <FormItem label="id" prop="groupId" v-show='false'>
            <Input v-model="editForm.groupId" placeholder="群组id" />
        </FormItem>
        <FormItem label="群组名" prop="name">
            <Input v-model="editForm.name" placeholder="输入群组名" />
        </FormItem>
        <FormItem label="描述" prop="desc">
            <Input v-model="editForm.desc" placeholder="输入描述信息" />
        </FormItem>
        <FormItem label="权限分配" prop="permList">
            <Transfer
              :titles="permTitles"
              :data="allPermKeys"
              :target-keys="editForm.permList"
              @on-change="editPermKeysChange"
              style="margin-left: 30px"></Transfer>
        </FormItem>
      </Form>
    </Modal>
    <Modal
        v-model="delGroupModal"
        title="删除用户"
        :loading="loading"
        @on-ok="delGroupConfirm">
        <p>是否确定删除群组 <strong style="color: red">{{delGroupName}}</strong> </p>
    </Modal>
    <Modal
      v-model="addUserToGroupModal"
      title="分配人员"
      :loading="loading"
      @on-ok="addUserGroupSubmit()">
      <Transfer
        :titles="addUserToGroupTitle"
        :data="allUsers"
        :target-keys="choseUsers"
        filterable
        @on-change="userKeyChange"
        style="margin-left: 30px"></Transfer>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getAuthGroup, changeSystemGroup, getUserGroup, setUserGroup, delSystemGroup } from '@/api/system'
export default {
  name: 'user_list',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        {
          title: '群组名', width: 120, key: 'name', sortable: true, search: true
        },
        {
          title: '操作',
          key: 'action',
          width: 220,
          align: 'center',
          search: false,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small',
                  shape: 'circle',
                  icon: 'md-create'
                },
                on: {
                  click: () => {
                    this.handleEditGroup(params.index)
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'info',
                  size: 'small',
                  shape: 'circle',
                  icon: 'md-person'
                },
                on: {
                  click: () => {
                    this.handleAllocGroup(params.index)
                  }
                }
              }, '分配'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  shape: 'circle',
                  icon: 'md-close'
                },
                on: {
                  click: () => {
                    this.handleDelGroup(params.index)
                  }
                }
              }, '删除')
            ])
          }
        },
        {
          title: '描述', key: 'desc', sortable: true, search: true
        }
      ],
      // 所有数据
      totalData: [],
      // 存放当前活动index
      activeIndex: 0,
      loading: true,
      tableLoading: false,
      // 新增群组loading
      addGroupLoading: false,
      // 新增群组表单验证
      addGroupModal: false,
      addForm: {
        groupId: '',
        name: '',
        desc: '',
        permList: []
      },
      addRuleValidate: {
        groupId: [
          { required: false }
        ],
        name: [
          { required: true, message: '请填写群组名字' }
        ],
        desc: [
          { required: true, type: 'string', message: '请填写描述信息' }
        ]
      },
      // 新增用户modal
      editGroupModal: false,
      // 修改用户表单验证
      editForm: {
        groupId: '',
        name: '',
        desc: '',
        permList: []
      },
      editRuleValidate: {
        groupId: [
          { required: true }
        ],
        name: [
          { required: true, message: '请填写群组名字' }
        ],
        desc: [
          { required: true, type: 'string', message: '请填写描述信息' }
        ]
      },
      // 权限修改穿梭框
      changePermModal: false,
      permTitles: ['可分配权限', '已分配权限'],
      allPermKeys: [],
      // 删除用户确认框
      delGroupModal: false,
      // 分配用户至群组
      addUserToGroupTitle: ['可分配用户', '已分配用户'],
      addUserToGroupModal: false,
      allUsers: [],
      choseUsers: []
    }
  },
  computed: {
    delGroupName: function () {
      return this.totalData.length ? this.totalData[this.activeIndex].name : ''
    }
  },
  methods: {
    // 触发修改按钮
    handleEditGroup (index) {
      // this.currPageData.splice(index, 1)
      this.activeIndex = index
      let currGroupData = this.totalData[index]
      this.editForm = {
        groupId: currGroupData.groupId,
        name: currGroupData.name,
        desc: currGroupData.desc,
        permList: currGroupData.perms
      }
      this.editGroupModal = true
    },
    // 触发新增按钮
    handleAddGroup () {
      this.addGroupLoading = true
      this.addForm = {
        groupId: '',
        name: '',
        desc: '',
        permList: []
      }
      this.addGroupModal = true
      this.addGroupLoading = false
    },
    // 新增用户表单提交
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        this.loading = true
        if (valid) {
          if (name === 'addForm') {
            changeSystemGroup(this.addForm).then(res => {
              if (res.result === 'success') {
                this.totalData.push(res.data)
                this.addGroupModal = false
                this.$Message.success('增加成功')
              } else {
                this.addGroupModal = false
                this.$Message.error('增加失败')
              }
            })
          } else {
            changeSystemGroup(this.editForm).then(res => {
              if (res.result === 'success') {
                this.totalData[this.activeIndex] = res.data
                // 重载表格数据
                this.totalData = this.totalData.slice()
                this.editGroupModal = false
                this.$Message.success('修改成功')
              } else {
                this.editGroupModal = false
                this.$Message.error('增加失败')
              }
            })
          }
        } else {
          this.$Message.error('验证失败!')
          this.loading = false
        }
      })
    },
    addPermKeysChange (newChosePermKeys) {
      this.addForm.permList = newChosePermKeys
    },
    editPermKeysChange (newChosePermKeys) {
      this.editForm.permList = newChosePermKeys
    },
    handleDelGroup (index) {
      this.activeIndex = index
      this.delGroupModal = true
    },
    delGroupConfirm () {
      let _id = this.totalData[this.activeIndex].groupId
      let data = {
        groupId: _id
      }
      delSystemGroup(data).then(res => {
        let index = this.activeIndex
        this.activeIndex = 0
        this.delUserModal = false
        this.$Message.success('删除成功')
        this.totalData.splice(index, 1)
      })
    },
    userKeyChange (newChoseUserKeys) {
      this.choseUsers = newChoseUserKeys
    },
    handleAllocGroup (index) {
      this.activeIndex = index
      getUserGroup(this.totalData[index].groupId).then(res => {
        this.allUsers = res.allUsers
        this.choseUsers = res.oldUsers
        this.addUserToGroupModal = true
      })
    },
    addUserGroupSubmit () {
      let data = {
        groupId: this.totalData[this.activeIndex].groupId,
        userList: this.choseUsers
      }
      setUserGroup(data).then(res => {
        if (res.result === 'success') {
          this.$Message.success('更新群组成功!')
        } else {
          this.$Message.error('更新群组失败!')
        }
        this.addUserToGroupModal = false
      })
    }
  },
  mounted () {
    this.tableLoading = true
    getAuthGroup().then(res => {
      this.totalData = res.data
      this.allPermKeys = res.perms
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
