<template>
  <div>
    <Card>
      <Row style="margin:10px">
        <Button @click="handleAddConfig" class="add-btn" type="info">增加</Button>
      </Row>
      <tables ref="tables" :loading="tableLoading" v-model="tableData" :columns="columns"/>
    </Card>
    <Modal
      v-model="addConfigModal"
      title="新增配置"
      :loading="loading"
      width="400"
      @on-ok="handleSubmit('addForm')">
      <Form ref="addForm" :model="addForm" :rules="addRuleValidate" :label-width="80" style="margin-right: 10px">
        <FormItem label="id" prop="id" v-show='false'>
            <Input v-model="addForm.id" placeholder="配置id"></Input>
        </FormItem>
        <FormItem label="兑换金额" prop="balance_num">
            <Input v-model="addForm.balance_num" placeholder="请输入兑换金额"><span slot="append">（元）</span></Input>
        </FormItem>
        <FormItem label="消耗积分" prop="integral_num">
            <Input v-model="addForm.integral_num" placeholder="请输入对应的消耗积分"><span slot="append">（个）</span></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="editConfigModal"
      title="修改配置"
      :loading="loading"
      width="400"
      @on-ok="handleSubmit('editForm')">
      <Form ref="editForm" :model="editForm" :rules="editRuleValidate" :label-width="80" style="margin-right: 10px">
        <FormItem label="id" prop="id" v-show='false'>
            <Input v-model="editForm.id" placeholder="配置id"></Input>
        </FormItem>
        <FormItem label="兑换金额" prop="balance_num">
            <Input v-model="editForm.balance_num" placeholder="请输入兑换金额"><span slot="append">（元）</span></Input>
        </FormItem>
        <FormItem label="消耗积分" prop="integral_num">
            <Input v-model="editForm.integral_num" placeholder="请输入对应的消耗积分"><span slot="append">（个）</span></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal
        v-model="delConfigModal"
        title="删除配置"
        :loading="loading"
        width="300"
        @on-ok="delConfigConfirm">
        <p>是否确定删除ID为 <strong style="color: red">{{delConfigId}}</strong> 的配置信息</p>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getIntegralConf, addIntegralConf, delIntegralConf, editIntegralConf } from '@/api/member'
export default {
  name: 'recharge',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        {
          title: 'id', width: 120, align: 'center', key: 'id', sortable: false, search: true
        },
        {
          title: '更新时间', width: 240, align: 'center', key: 'update_time', sortable: false, search: true
        },
        {
          title: '兑换金额(元)', width: 150, align: 'center', key: 'balance_num', sortable: false, search: true
        },
        {
          title: '消耗积分(个)', width: 150, align: 'center', key: 'integral_num', sortable: false, search: true
        },
        {
          title: '操作',
          key: 'action',
          align: 'left',
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
                    this.handleEditConfig(params.index)
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  shape: 'circle',
                  icon: 'md-close'
                },
                on: {
                  click: () => {
                    this.handleDelConfig(params.index)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      // 表格数据
      tableData: [],
      tableLoading: false,
      activeIndex: 0,
      // 新增modal
      loading: true,
      addConfigModal: false,
      addForm: {
        id: '',
        balance_num: '',
        integral_num: ''
      },
      addRuleValidate: {
        id: [
          { required: false }
        ],
        balance_num: [
          { required: true, type: 'string', pattern: '^[0-9]+$', trigger: 'blur', message: '请填写兑换金额' }
        ],
        integral_num: [
          { required: true, type: 'string', pattern: '^[0-9]+$', trigger: 'blur', message: '请填写兑换积分数' }
        ]
      },
      // 修改modal
      editConfigModal: false,
      editForm: {
        id: '',
        balance_num: '',
        integral_num: ''
      },
      editRuleValidate: {
        id: [
          { required: true }
        ],
        balance_num: [
          { required: true, type: 'string', pattern: '^[0-9]+$', trigger: 'blur', message: '请填写兑换金额' }
        ],
        integral_num: [
          { required: true, type: 'string', pattern: '^[0-9]+$', trigger: 'blur', message: '请填写兑换积分数' }
        ]
      },
      // 删除modal
      delConfigModal: false
    }
  },
  computed: {
    delConfigId: function () {
      return this.tableData.length ? this.tableData[this.activeIndex].id : ''
    }
  },
  methods: {
    handleAddConfig () {
      this.addConfigModal = true
    },
    handleEditConfig (index) {
      let item = this.tableData[index]
      this.editForm.id = item.id
      this.editForm.balance_num = item.balance_num.toString()
      this.editForm.integral_num = item.integral_num.toString()
      this.editConfigModal = true
    },
    handleDelConfig (index) {
      this.activeIndex = index
      this.delConfigModal = true
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        this.loading = true
        if (valid) {
          if (name === 'addForm') {
            addIntegralConf(this.addForm).then(res => {
              this.tableData.push(res)
              this.addConfigModal = false
              this.$Message.success('增加成功')
            })
          } else {
            editIntegralConf(this.editForm.id, this.editForm).then(res => {
              this.tableData[this.activeIndex] = res
              // 重载表格数据
              this.tableData = this.tableData.slice()
              this.editConfigModal = false
              this.$Message.success('修改成功')
            })
          }
        } else {
          this.$Message.error('验证失败!')
          this.loading = false
        }
      })
    },
    delConfigConfirm () {
      let _id = this.tableData[this.activeIndex].id
      delIntegralConf(_id).then(res => {
        let index = this.activeIndex
        this.activeIndex = 0
        this.delConfigModal = false
        this.$Message.success('删除成功')
        this.tableData.splice(index, 1)
      })
    }
  },
  mounted () {
    this.tableLoading = true
    getIntegralConf().then(res => {
      this.tableData = res
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
