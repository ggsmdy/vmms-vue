<template>
  <div>
    <Card>
      <Row style="margin:10px">
        <Button @click="handleAddGoods" class="add-btn" type="info">增加</Button>
      </Row>
      <tables ref="tables" :loading="tableLoading" v-model="totalData" :columns="columns"/>
    </Card>
    <Modal
      v-model="addGoodsModal"
      title="新增商品"
      :loading="loading"
      width="500"
      @on-ok="handleSubmit('addForm')">
      <Form ref="addForm" :model="addForm" :rules="addRuleValidate" :label-width="80" style="margin-right: 20px">
        <FormItem label="id" prop="id" v-show='false'>
            <Input v-model="addForm.id" placeholder="商品id" />
        </FormItem>
        <FormItem label="中文名" prop="name">
            <Input v-model="addForm.name" placeholder="请输入商品名称" />
        </FormItem>
        <FormItem label="英文名" prop="en_name">
            <Input v-model="addForm.en_name" placeholder="请输入英文名称" />
        </FormItem>
        <FormItem label="品牌" prop="brand">
            <Input v-model="addForm.brand" placeholder="请输入品牌名称" />
        </FormItem>
        <FormItem label="生产日期" prop="src_product_date">
          <DatePicker type="date" placeholder="请选择生产日期" v-model="addForm.src_product_date" @on-change="trancAddDate"></DatePicker>
        </FormItem>
        <FormItem label="保质期" prop="shelf_life">
            <Input v-model="addForm.shelf_life" placeholder="请输入保质期(天)" />
        </FormItem>
        <FormItem label="生产厂家" prop="mfrs">
            <Input v-model="addForm.mfrs" placeholder="请输入生产厂家名称" />
        </FormItem>
        <FormItem label="厂家信息" prop="mfrs_desc">
            <Input v-model="addForm.mfrs_desc" placeholder="请输入生产厂家详细信息" />
        </FormItem>
        <FormItem label="所属代理" prop="owner">
            <!-- <Input v-model="addForm.owner" placeholder="请选择所属代理商" /> -->
          <Select v-model="addForm.owner" filterable style="width:auto" label-in-value clearable placeholder="请选择所属代理商">
            <Option v-for="item in userList" :value="item.id" :key="item.id">{{ item.username }}</Option>
          </Select>
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
      v-model="editGoodsModal"
      title="修改商品"
      :loading="loading"
      width="500"
      @on-ok="handleSubmit('editForm')">
      <Form ref="editForm" :model="editForm" :rules="editRuleValidate" :label-width="80" style="margin-right: 20px">
        <FormItem label="id" prop="id" v-show='false'>
            <Input v-model="editForm.id" placeholder="商品id" />
        </FormItem>
        <FormItem label="中文名" prop="name">
            <Input v-model="editForm.name" placeholder="请输入商品名称" />
        </FormItem>
        <FormItem label="英文名" prop="en_name">
            <Input v-model="editForm.en_name" placeholder="请输入英文名称" />
        </FormItem>
        <FormItem label="品牌" prop="brand">
            <Input v-model="editForm.brand" placeholder="请输入品牌名称" />
        </FormItem>
        <FormItem label="生产日期" prop="src_product_date">
            <DatePicker type="date" placeholder="请选择生产日期" v-model="editForm.src_product_date" @on-change="trancEditDate"></DatePicker>
        </FormItem>
        <FormItem label="保质期" prop="shelf_life">
            <Input v-model="editForm.shelf_life" placeholder="请输入保质期(天)" />
        </FormItem>
        <FormItem label="生产厂家" prop="mfrs">
            <Input v-model="editForm.mfrs" placeholder="请输入生产厂家名称" />
        </FormItem>
        <FormItem label="厂家信息" prop="mfrs_desc">
            <Input v-model="editForm.mfrs_desc" placeholder="请输入生产厂家详细信息" />
        </FormItem>
        <FormItem label="所属代理" prop="owner">
            <Select v-model="editForm.owner" filterable style="width:auto" label-in-value clearable placeholder="请选择所属代理商">
              <Option v-for="item in userList" :value="item.id" :key="item.id">{{ item.username }}</Option>
            </Select>
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
        v-model="delGoodsModal"
        title="删除商品"
        :loading="loading"
        @on-ok="delGoodsConfirm">
        <p>是否确定删除 <strong style="color: red">{{delGoodsName}}</strong> 商品</p>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getGoods, addGoods, editGoods, delGoods } from '@/api/member'
import { getUserList } from '@/api/machine'
export default {
  name: 'goods_list',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
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
                    this.handleEditGoods(params.index)
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
                    this.handleDelGoods(params.index)
                  }
                }
              }, '删除')
            ])
          }
        },
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
          title: '英文名称', width: 120, key: 'en_name', sortable: true, search: true
        },
        {
          title: '品牌', width: 120, key: 'brand', sortable: true, search: true
        },
        {
          title: '生产日期', width: 120, key: 'product_date', sortable: true, search: true
        },
        {
          title: '保质期(天)', width: 120, key: 'shelf_life', sortable: true, search: true
        },
        {
          title: '所属代理', width: 120, key: 'owner_name', sortable: true, search: true
        },
        {
          title: '生产厂家', width: 120, key: 'mfrs', sortable: true, search: true
        },
        {
          title: '厂家信息', minWidth: 120, key: 'mfrs_desc', sortable: true, search: true
        }
      ],
      // 所有数据
      totalData: [],
      // 存放当前活动index
      activeIndex: 0,
      loading: true,
      tableLoading: false,
      // 存放代理用户列表
      userList: [],
      // 新增群组表单验证
      addGoodsModal: false,
      addForm: {
        id: '',
        name: '',
        en_name: '',
        brand: '',
        product_date: Date,
        src_product_date: '',
        shelf_life: '',
        mfrs: '',
        mfrs_desc: '',
        owner: null,
        icon: null
      },
      addRuleValidate: {
        id: [
          { required: false }
        ],
        name: [
          { required: true, message: '请填写商品名字' }
        ],
        en_name: [
          { required: false, message: '请填写英文名称' }
        ],
        brand: [
          { required: false, message: '请填写品牌名' }
        ],
        src_product_date: [
          { required: true, type: 'date', message: '请选择生产日期' }
        ],
        shelf_life: [
          { required: true, message: '请填写正确的有效期' }
        ],
        mfrs: [
          { required: false, message: '请填写生产厂家名称' }
        ],
        mfrs_desc: [
          { required: false, message: '请填写生产厂家详细信息' }
        ],
        owner: [
          { required: true, message: '请选择所属代理商' }
        ],
        icon: [
          { required: false, message: '请上传图标文件' }
        ]
      },
      // 新增用户modal
      editGoodsModal: false,
      // 修改用户表单验证
      editForm: {
        id: '',
        name: '',
        en_name: '',
        brand: '',
        product_date: Date,
        src_product_date: '',
        shelf_life: 0,
        mfrs: '',
        mfrs_desc: '',
        owner: null,
        icon: null
      },
      editRuleValidate: {
        id: [
          { required: false }
        ],
        name: [
          { required: true, message: '请填写商品名字' }
        ],
        en_name: [
          { required: false, message: '请填写英文名称' }
        ],
        brand: [
          { required: false, message: '请填写品牌名' }
        ],
        src_product_date: [
          { required: true, type: 'date', message: '请选择生产日期' }
        ],
        shelf_life: [
          { required: true, message: '请填写正确的有效期' }
        ],
        mfrs: [
          { required: false, message: '请填写生产厂家名称' }
        ],
        mfrs_desc: [
          { required: false, message: '请填写生产厂家详细信息' }
        ],
        owner: [
          { required: true, message: '请选择所属代理商' }
        ],
        icon: [
          { required: false, message: '请上传图标文件' }
        ]
      },
      // 删除用户确认框
      delGoodsModal: false
    }
  },
  computed: {
    delGoodsName: function () {
      return this.totalData.length ? this.totalData[this.activeIndex].name : ''
    }
  },
  methods: {
    // 触发修改按钮
    handleEditGoods (index) {
      // this.currPageData.splice(index, 1)
      this.activeIndex = index
      let currGoodsData = this.totalData[index]
      this.editForm = {
        id: currGoodsData.id,
        name: currGoodsData.name,
        en_name: currGoodsData.en_name,
        brand: currGoodsData.brand,
        product_date: currGoodsData.product_date,
        src_product_date: new Date(currGoodsData.product_date),
        shelf_life: currGoodsData.shelf_life,
        mfrs: currGoodsData.mfrs,
        mfrs_desc: currGoodsData.mfrs_desc,
        owner: currGoodsData.owner,
        icon: null
      }
      this.editGoodsModal = true
    },
    // 触发新增按钮
    handleAddGoods () {
      this.addForm = {
        id: '',
        name: '',
        en_name: '',
        brand: '',
        product_date: Date,
        src_product_date: '',
        shelf_life: '',
        mfrs: '',
        mfrs_desc: '',
        owner: null,
        icon: null
      }
      this.addGoodsModal = true
    },
    // 新增表单提交
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        this.loading = true
        if (valid) {
          let data = name === 'addForm' ? this.addForm : this.editForm
          let goodsData = new FormData()
          goodsData.append('name', data.name)
          goodsData.append('en_name', data.en_name)
          goodsData.append('brand', data.brand)
          goodsData.append('product_date', data.product_date)
          goodsData.append('shelf_life', data.shelf_life)
          goodsData.append('mfrs', data.mfrs)
          goodsData.append('mfrs_desc', data.mfrs_desc)
          goodsData.append('owner', data.owner)
          if (data.icon !== null) goodsData.append('icon', data.icon)
          if (name === 'addForm') {
            addGoods(goodsData).then(res => {
              this.totalData.push(res)
              this.addGoodsModal = false
              this.$Message.success('增加成功')
            })
          } else {
            editGoods(this.editForm.id, goodsData).then(res => {
              this.totalData[this.activeIndex] = res
              // 重载表格数据
              this.totalData = this.totalData.slice()
              this.editGoodsModal = false
              this.$Message.success('修改成功')
            })
          }
        } else {
          this.$Message.error('验证失败!')
          this.loading = false
        }
      })
    },
    handleDelGoods (index) {
      this.activeIndex = index
      this.delGoodsModal = true
    },
    delGoodsConfirm () {
      let pk = this.totalData[this.activeIndex].id
      delGoods(pk).then(res => {
        let index = this.activeIndex
        this.activeIndex = 0
        this.delGoodsModal = false
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
    },
    trancAddDate (strDate, date) {
      this.addForm.product_date = strDate
    },
    trancEditDate (strDate, date) {
      this.editForm.product_date = strDate
    }
  },
  mounted () {
    this.tableLoading = true
    getGoods().then(res => {
      this.totalData = res
      this.tableLoading = false
    })
    getUserList().then(res => {
      this.userList = res
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
