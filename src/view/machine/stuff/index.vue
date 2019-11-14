<template>
  <div>
    <Card>
      <Row style="margin:10px">
        <Button @click="handleAddStuff" class="add-btn" type="info">增加</Button>
      </Row>
      <tables ref="tables" :loading="tableLoading" v-model="totalData" :columns="columns"/>
    </Card>
    <Modal
      v-model="addStuffModal"
      title="新增原料"
      :loading="loading"
      width="600"
      @on-ok="handleSubmit('addForm')">
      <Form ref="addForm" :model="addForm" :rules="addRuleValidate" :label-width="60" style="margin-right: 10px">
        <FormItem label="id" prop="id" v-show='false'>
            <Input v-model="addForm.id" placeholder="原料id" />
        </FormItem>
        <FormItem label="原料名" prop="name">
            <Input v-model="addForm.name" placeholder="请输入原料名称" />
        </FormItem>
        <FormItem label="单位" prop="unit">
            <Input v-model="addForm.unit" placeholder="请输出计量单位" />
        </FormItem>
        <FormItem label="价格" prop="price">
            <i-input v-model="addForm.price" placeholder="请输出单位价格"><span slot="append">（元）</span></i-input>
        </FormItem>
        <FormItem label="描述" prop="desc">
            <Input v-model="addForm.desc" placeholder="请输出描述信息" />
        </FormItem>
        <FormItem label="图标" prop='icon'>
          <Upload
            :before-upload="handleAddUpload"
            :max-size="250"
            action="">
            <Button icon="ios-cloud-upload-outline">选择图片上传</Button>
          </Upload>
          <div v-if="addForm.icon !== null">图片: {{ addForm.icon.name }} <Button type="text" @click="iconDelete('addForm')">X</Button></div>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="editStuffModal"
      title="修改原料信息"
      :loading="loading"
      width="600"
      @on-ok="handleSubmit('editForm')">
      <Form ref="editForm" :model="editForm" :rules="editRuleValidate" :label-width="60" style="margin-right: 10px">
        <FormItem label="id" prop="id" v-show='false'>
            <Input v-model="editForm.id" placeholder="商品id" />
        </FormItem>
        <FormItem label="商品名" prop="name">
            <Input v-model="editForm.name" placeholder="请输入商品名称" />
        </FormItem>
        <FormItem label="单位" prop="unit">
            <Input v-model="editForm.unit" placeholder="请输出计量单位" />
        </FormItem>
        <FormItem label="价格" prop="price">
            <i-input v-model="editForm.price" placeholder="请输出单位价格"><span slot="append">（元）</span></i-input>
        </FormItem>
        <FormItem label="描述" prop="desc">
            <Input v-model="editForm.desc" placeholder="请输出描述信息" />
        </FormItem>
        <FormItem label="图标" prop='icon'>
          <Upload
            :before-upload="handleEditUpload"
            :max-size="250"
            action="">
            <Button icon="ios-cloud-upload-outline">选择图片上传</Button>
          </Upload>
          <div v-if="editForm.icon !== null">图片: {{ editForm.icon.name }} <Button type="text" @click="iconDelete('editForm')">X</Button></div>
        </FormItem>
      </Form>
    </Modal>
    <Modal
        v-model="delStuffModal"
        title="删除原料"
        :loading="loading"
        @on-ok="delStuffConfirm">
        <p>是否确定删除 <strong style="color: red">{{delStuffName}}</strong> 原料信息</p>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getStuff, addStuff, editStuff, delStuff } from '@/api/machine'
export default {
  name: 'user_list',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        {
          title: '图标',
          width: 80,
          key: 'icon',
          sortable: false,
          search: false,
          render: (h, params) => {
            return h('Avatar', {
              props: {
                src: this.totalData[params.index].icon
              }
            })
          }
        },
        {
          title: '商品名', width: 120, key: 'name', sortable: true, search: true
        },
        {
          title: '计量单位', width: 120, key: 'unit', sortable: true, search: true
        },
        {
          title: '单位价格(元)', width: 130, key: 'price', sortable: true, search: true
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
                  type: 'success',
                  size: 'small',
                  shape: 'circle',
                  icon: 'md-create'
                },
                on: {
                  click: () => {
                    this.handleEditStuff(params.index)
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
                    this.handleDelStuff(params.index)
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
      // 新增群组表单验证
      addStuffModal: false,
      addForm: {
        id: '',
        name: '',
        desc: '',
        unit: '',
        price: 0,
        icon: null
      },
      addRuleValidate: {
        id: [
          { required: false }
        ],
        name: [
          { required: true, message: '请填写商品名字' }
        ],
        unit: [
          { required: true, message: '请输入单位信息' }
        ],
        price: [
          { required: true, type: 'string', pattern: /^([\d]+)$/, message: '请输入单位价格' }
        ],
        desc: [
          { required: true, message: '请填写描述信息' }
        ],
        icon: [
          { required: false, message: '请上传图标文件' }
        ]
      },
      // 新增用户modal
      editStuffModal: false,
      // 修改用户表单验证
      editForm: {
        id: '',
        name: '',
        desc: '',
        unit: '',
        price: '0',
        icon: null
      },
      editRuleValidate: {
        id: [
          { required: false }
        ],
        name: [
          { required: true, message: '请填写商品名字' }
        ],
        unit: [
          { required: true, message: '请输入计量单位' }
        ],
        price: [
          { required: true, type: 'string', pattern: /^([\d]+)$/, message: '请输入单位价格' }
        ],
        desc: [
          { required: true, message: '请填写描述信息' }
        ],
        icon: [
          { required: false, message: '请上传图标文件' }
        ]
      },
      // 删除用户确认框
      delStuffModal: false
    }
  },
  computed: {
    delStuffName: function () {
      return this.totalData.length ? this.totalData[this.activeIndex].name : ''
    }
  },
  methods: {
    // 触发修改按钮
    handleEditStuff (index) {
      // this.currPageData.splice(index, 1)
      this.activeIndex = index
      let currStuffData = this.totalData[index]
      this.editForm = {
        id: currStuffData.id,
        name: currStuffData.name,
        unit: currStuffData.unit,
        price: currStuffData.price.toString(),
        desc: currStuffData.desc,
        icon: null
      }
      this.editStuffModal = true
    },
    // 触发新增按钮
    handleAddStuff () {
      this.addForm = {
        id: '',
        name: '',
        desc: '',
        unit: '',
        price: '0',
        icon: null
      }
      this.addStuffModal = true
    },
    // 新增用户表单提交
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        this.loading = true
        if (valid) {
          let data = name === 'addForm' ? this.addForm : this.editForm
          let StuffData = new FormData()
          StuffData.append('name', data.name)
          StuffData.append('unit', data.unit)
          StuffData.append('price', data.price)
          StuffData.append('desc', data.desc)
          if (data.icon !== null) StuffData.append('icon', data.icon)
          if (name === 'addForm') {
            addStuff(StuffData).then(res => {
              this.totalData.push(res)
              this.addStuffModal = false
              this.$Message.success('增加成功')
            })
          } else {
            editStuff(this.editForm.id, StuffData).then(res => {
              this.totalData[this.activeIndex] = res
              // 重载表格数据
              this.totalData = this.totalData.slice()
              this.editStuffModal = false
              this.$Message.success('修改成功')
            })
          }
        } else {
          this.$Message.error('验证失败!')
          this.loading = false
        }
      })
    },
    handleDelStuff (index) {
      this.activeIndex = index
      this.delStuffModal = true
    },
    delStuffConfirm () {
      let pk = this.totalData[this.activeIndex].id
      delStuff(pk).then(res => {
        let index = this.activeIndex
        this.activeIndex = 0
        this.delStuffModal = false
        this.$Message.success('删除成功')
        this.totalData.splice(index, 1)
      })
    },
    handleAddUpload (file) {
      this.addForm.icon = file
    },
    handleEditUpload (file) {
      this.editForm.icon = file
    },
    iconDelete (name) {
      if (name === 'addForm') {
        this.addForm.icon = null
      } else {
        this.editForm.icon = null
      }
    }
  },
  mounted () {
    this.tableLoading = true
    getStuff().then(res => {
      this.totalData = res
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
