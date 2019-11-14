<template>
  <div>
    <Card>
      <!-- <Row style="margin:10px">
        <Button @click="handleAddAisle" class="add-btn" type="info">增加</Button>
      </Row> -->
      <tables ref="tables" :loading="tableLoading" searchable search-place="top" v-model="currPageData" :columns="columns" ajaxSync @on-ajax-sync="ajaxSync"/>
      <div class="c-table-footer">
        <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
        <Page show-sizer :total="total" :current="curPage" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-page-size-change="pageSizeChange" @on-change="onChange" class-name="c-page"/>
      </div>
    </Card>
    <Modal
      v-model="addAisleModal"
      title="新增货道"
      :loading="loading"
      width="500"
      @on-ok="handleSubmit('addForm')">
      <Form ref="addForm" :model="addForm" :rules="addRuleValidate" :label-width="80" style="margin-right: 20px">
        <FormItem label="id" prop="id" v-show='false'>
            <Input v-model="addForm.id" placeholder="id" />
        </FormItem>
        <FormItem label="所属设备" prop="machine">
          <Select v-model="addForm.machine" filterable style="width:auto" label-in-value clearable placeholder="请选择设备">
            <Option v-for="item in machineList" :value="item.uid" :key="item.uid">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="货道号" prop="aisle_sn">
            <Input v-model="addForm.aisle_sn" placeholder="请输入货道号" />
        </FormItem>
        <FormItem label="容量" prop="capacity">
            <Input v-model="addForm.capacity" placeholder="请输入容量" />
        </FormItem>
        <FormItem label="现存" prop="extant">
            <Input v-model="addForm.extant" placeholder="请输入现存数量" />
        </FormItem>
        <FormItem label="商品" prop="goods">
          <Select v-model="addForm.goods" filterable style="width:auto" label-in-value clearable placeholder="请选择商品">
            <Option v-for="item in goodsList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="价格" prop="price">
            <Input v-model="addForm.price" placeholder="请输入商品价格" />
        </FormItem>
        <FormItem label="工作状态" prop="work_state">
            <Select v-model="addForm.work_state" filterable style="width:auto" label-in-value clearable placeholder="请选择商品">
              <Option :value="0" >正常</Option>
              <Option :value="1" >停用</Option>
              <Option :value="2" >故障</Option>
            </Select>
        </FormItem>
        <FormItem label="错误信息" prop="err_info">
            <Input v-model="addForm.err_info" placeholder="请输入错误信息" />
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="editAisleModal"
      title="修改商品"
      :loading="loading"
      width="500"
      @on-ok="handleSubmit('editForm')">
      <Form ref="editForm" :model="editForm" :rules="editRuleValidate" :label-width="80" style="margin-right: 20px">
        <FormItem label="id" prop="id" v-show='false'>
            <Input v-model="editForm.id" placeholder="id" />
        </FormItem>
        <FormItem label="所属设备" prop="machine">
          <Select v-model="editForm.machine" filterable style="width:auto" label-in-value clearable placeholder="请选择设备">
            <Option v-for="item in machineList" :value="item.uid" :key="item.uid">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="货道号" prop="aisle_sn">
            <Input v-model="editForm.aisle_sn" placeholder="请输入货道号" />
        </FormItem>
        <FormItem label="容量" prop="capacity">
            <Input v-model="editForm.capacity" placeholder="请输入容量" />
        </FormItem>
        <FormItem label="现存" prop="extant">
            <Input v-model="editForm.extant" placeholder="请输入现存数量" />
        </FormItem>
        <FormItem label="商品" prop="goods">
          <Select v-model="editForm.goods" filterable style="width:auto" label-in-value clearable placeholder="请选择商品">
            <Option v-for="item in goodsList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="价格" prop="price">
            <Input v-model="editForm.price" placeholder="请输入商品价格" />
        </FormItem>
        <FormItem label="工作状态" prop="work_state">
            <Select v-model="editForm.work_state" filterable style="width:auto" label-in-value clearable placeholder="请选择商品">
              <Option :value="0" >正常</Option>
              <Option :value="1" >停用</Option>
              <Option :value="2" >故障</Option>
            </Select>
        </FormItem>
        <FormItem label="错误信息" prop="err_info">
            <Input v-model="editForm.err_info" placeholder="请输入错误信息" />
        </FormItem>
      </Form>
    </Modal>
    <Modal
        v-model="delAisleModal"
        title="删除机器货道信息"
        :loading="loading"
        @on-ok="delAisleConfirm">
        <p>是否确定删除 <strong style="color: red">{{delAisleMachine}}</strong> 的货道 <strong style="color: red">{{delAisleSN}}</strong> 吗？</p>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getAisleList, getAllMachine, getAllGoods, addAisle, editAisle, delAisle } from '@/api/machine'
export default {
  name: 'aisle_list',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        {
          title: '操作',
          key: 'action',
          width: 120,
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
                    this.handleEditAisle(params.index)
                  }
                }
              }, '修改')
              // h('Button', {
              //   props: {
              //     type: 'text',
              //     size: 'small'
              //   },
              //   on: {
              //     click: () => {
              //       this.handleDelAisle(params.index)
              //     }
              //   }
              // }, '删除')
            ])
          }
        },
        {
          title: '状态',
          width: 90,
          key: 'dis_work_state',
          sortable: false,
          search: true,
          render: (h, params) => {
            return h('Tag', {
              props: {
                color: this.getColor(this.currPageData[params.index].dis_work_state)
              }
            }, this.currPageData[params.index].dis_work_state)
          }
        },
        {
          title: '设备号', width: 150, key: 'machine', sortable: false, search: true
        },
        {
          title: '设备名', width: 150, key: 'machine_name', sortable: false, search: true
        },
        {
          title: '货道号', width: 90, key: 'aisle_sn', sortable: false, search: true
        },
        {
          title: '商品', width: 120, key: 'goods_name', sortable: false, search: true
        },
        {
          title: '商品价格(分)', width: 140, key: 'price', sortable: true, search: false
        },
        {
          title: '容量', width: 80, key: 'capacity', sortable: false, search: false
        },
        {
          title: '现存', width: 80, key: 'extant', sortable: false, search: false
        },
        {
          title: '错误详情', minWidth: 120, key: 'err_info', sortable: false, search: false
        }
      ],
      // 所有数据
      totalData: [],
      // 当前页数据
      currPageData: [],
      // 当前页码
      curPage: 1,
      // 每页数据量
      pageSize: 100,
      // 可选的每页数据总量
      pageSizeOpts: [ 100, 200],
      // 数据总量
      total: 400,
      // 存放当前活动index
      activeIndex: 0,
      loading: true,
      tableLoading: false,
      // 存放设备列表
      machineList: [],
      // 存放商品列表
      goodsList: [],
      // 新增群组表单验证
      addAisleModal: false,
      addForm: {
        id: '',
        machine: '',
        aisle_sn: '',
        capacity: '',
        extant: '',
        goods: '',
        price: '',
        work_state: 0,
        err_info: ''
      },
      addRuleValidate: {
        id: [
          { required: false }
        ],
        machine: [
          { required: true, message: '请选择设备' }
        ],
        aisle_sn: [
          { required: true, message: '请填写货道号' }
        ],
        capacity: [
          { required: true, message: '请填写容量' }
        ],
        extant: [
          { required: true, message: '请填写现存' }
        ],
        goods: [
          { required: true, message: '请选择商品' }
        ],
        price: [
          { required: true, message: '请填写商品价格(分)' }
        ],
        work_state: [
          { required: true, message: '请选择货道工作状态' }
        ],
        err_info: [
          { required: false, message: '请填写错误信息，可不填' }
        ]
      },
      // 新增用户modal
      editAisleModal: false,
      // 修改用户表单验证
      editForm: {
        id: '',
        machine: '',
        aisle_sn: '',
        capacity: '',
        extant: '',
        goods: '',
        price: '',
        work_state: '',
        err_info: ''
      },
      editRuleValidate: {
        id: [
          { required: false }
        ],
        machine: [
          { required: true, message: '请选择设备' }
        ],
        aisle_sn: [
          { required: true, message: '请填写货道号' }
        ],
        capacity: [
          { required: true, message: '请填写容量' }
        ],
        extant: [
          { required: true, message: '请填写现存' }
        ],
        goods: [
          { required: true, message: '请选择商品' }
        ],
        price: [
          { required: true, message: '请填写商品价格(分)' }
        ],
        work_state: [
          { required: true, message: '请选择货道工作状态' }
        ],
        err_info: [
          { required: false, message: '请填写错误信息，可不填' }
        ]
      },
      // 删除用户确认框
      delAisleModal: false
    }
  },
  computed: {
    delAisleMachine: function () {
      return this.currPageData.length && this.currPageData[this.activeIndex] ? this.currPageData[this.activeIndex].machine : ''
    },
    delAisleSN: function () {
      return this.currPageData.length && this.currPageData[this.activeIndex] ? this.currPageData[this.activeIndex].aisle_sn : ''
    }
  },
  methods: {
    // 获取状态颜色
    getColor (str) {
      if (str === '正常') {
        return 'blue'
      } else if (str === '停用') {
        return 'grey'
      } else {
        return 'red'
      }
    },
    // 触发修改按钮
    handleEditAisle (index) {
      // this.currPageData.splice(index, 1)
      this.activeIndex = index
      let currAisleData = this.currPageData[index]
      console.log(currAisleData)
      this.editForm = {
        id: currAisleData.id,
        machine: currAisleData.machine,
        aisle_sn: currAisleData.aisle_sn,
        capacity: currAisleData.capacity,
        extant: currAisleData.extant,
        goods: currAisleData.goods,
        price: currAisleData.price,
        work_state: currAisleData.work_state,
        err_info: currAisleData.err_info
      }
      this.editAisleModal = true
    },
    // 触发新增按钮
    handleAddAisle () {
      this.addForm = {
        id: '',
        machine: '',
        aisle_sn: '',
        capacity: '',
        extant: '',
        goods: '',
        price: '',
        work_state: 0,
        err_info: ''
      }
      this.addAisleModal = true
    },
    // 新增表单提交
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        this.loading = true
        if (valid) {
          if (name === 'addForm') {
            addAisle(this.addForm).then(res => {
              this.currPageData.push(res)
              this.addAisleModal = false
              this.$Message.success('增加成功')
            })
          } else {
            editAisle(this.editForm.id, this.editForm).then(res => {
              this.currPageData[this.activeIndex] = res
              // 重载表格数据
              this.currPageData = this.currPageData.slice()
              this.editAisleModal = false
              this.$Message.success('修改成功')
            })
          }
        } else {
          this.$Message.error('验证失败!')
          this.loading = false
        }
      })
    },
    handleDelAisle (index) {
      this.activeIndex = index
      this.delAisleModal = true
    },
    delAisleConfirm () {
      let pk = this.currPageData[this.activeIndex].id
      delAisle(pk).then(res => {
        let index = this.activeIndex
        this.activeIndex = 0
        this.delAisleModal = false
        this.$Message.success('删除成功')
        this.currPageData.splice(index, 1)
      })
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize
      this.tableLoading = true
      getAisleList(this.curPage, pageSize, this.kwargs).then(res => {
        this.currPageData = res.results
        this.total = res.count
        this.curPage = res.curPage
        this.tableLoading = false
      })
    },
    onChange (pageId) {
      this.curPage = pageId
      this.tableLoading = true
      getAisleList(pageId, this.pageSize, this.kwargs).then(res => {
        this.currPageData = res.results
        this.total = res.count
        this.tableLoading = false
      })
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    },
    ajaxSync (key, value) {
      this.kwargs = {}
      this.kwargs[key] = value
      this.tableLoading = true
      console.log(this.kwargs)
      getAisleList(this.curPage, this.pageSize, this.kwargs).then(res => {
        this.currPageData = res.results
        this.total = res.count
        this.tableLoading = false
      })
    },
    getPrices(){//获取价格个方法 直接调用 去价格那列改一下就行
      for(let item in this.currPageData){
        this.currPageData[item].prices=(this.currPageData[item].price/100).toFixed(2)
      }
      console.log(this.currPageData[1].prices)
    }
  },
  mounted () {
    this.tableLoading = true
    getAisleList(this.curPage, this.pageSize).then(res => {
      this.currPageData = res.results
      this.total = res.count
      this.tableLoading = false
    })
    getAllGoods().then(res => {
      this.goodsList = res
    })
    getAllMachine().then(res => {
      this.machineList = res
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
