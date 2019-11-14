<template>
  <div>
    <Card>
      <Row style="margin:10px">
        <Button @click="addModal = true" class="add-btn" type="info">增加</Button>
      </Row>
      <tables ref="tables" :loading="tableLoading" v-model="totalData" :columns="columns"/>
      <div class="c-table-footer">
        <!-- <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button> -->
        <!-- <Page show-sizer :total="total" :current="curPage" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-page-size-change="pageSizeChange" @on-change="onChange" class-name="c-page"/> -->
      </div>
    </Card>
    <Modal
      v-model="addModal"
      title="增加收货地址"
      width="415"
      :loading="loading"
      @on-ok="addAddrConfirm">
      <Form ref="addForm" :model="addForm" inline :label-width="60">
        <FormItem label="收件人" prop="name">
          <Input type="text" v-model="addForm.name" placeholder="请输入收件人" style="width:300px" />
        </FormItem>
        <FormItem label="电话" prop="tel">
          <Input type="text" v-model="addForm.tel" placeholder="请输入收件人手机号码" style="width:300px" />
        </FormItem>
        <FormItem label="地址" prop="addr">
          <Input type="textarea" v-model="addForm.addr" placeholder="请输入详细地址" style="width:300px" />
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="editModal"
      title="修改收货地址"
      width="415"
      :loading="loading"
      @on-ok="editAddrConfirm">
      <Form ref="editForm" :model="editForm" inline :label-width="60">
        <FormItem label="收件人" prop="name">
          <Input type="text" v-model="editForm.name" placeholder="请输入收件人" style="width:300px" />
        </FormItem>
        <FormItem label="电话" prop="tel">
          <Input type="text" v-model="editForm.tel" placeholder="请输入收件人手机号码" style="width:300px" />
        </FormItem>
        <FormItem label="地址" prop="addr">
          <Input type="textarea" v-model="editForm.addr" placeholder="请输入详细地址" style="width:300px" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getAddr, delAddr, addAddr, changeAddr } from '@/api/user'
export default {
  name: 'stuff-remain',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        {
          title: '操作',
          key: 'action',
          width: 200,
          align: 'center',
          search: false,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small',
                  loading: false
                },
                on: {
                  click: (event) => {
                    this.changeHandler(event, params.index)
                  }
                }
              }, '变更')
            ])
          }
        },
        {
          title: '收件人', key: 'name', width: 80, sortable: false, search: false
        },
        {
          title: '电话', key: 'tel', width: 100, sortable: false, search: false
        },
        {
          title: '更新时间', key: 'up_time', width: 120, sortable: false, search: false
        },
        {
          title: '详细地址', key: 'addr', sortable: false, search: false
        }
      ],
      // 当前页数据
      totalData: [],
      // 表格加载
      tableLoading: false,
      // 当前操作序号
      currIndex: null,
      // 新增modal
      addModal: false,
      addForm: {
        name: null,
        tel: null,
        addr: null
      },
      // 变更modal
      loading: true,
      editModal: false,
      editForm: {
        id: null,
        name: '',
        tel: '',
        addr: ''
      }
    }
  },
  methods: {
    addAddrConfirm () {
      addAddr(this.addForm).then(res => {
        this.$Message.success('增加成功!')
        this.addModal = false
        this.totalData.push(res)
      })
    },
    editAddrConfirm () {
      changeAddr(this.addForm, this.editForm.id).then(res => {
        this.$Message.success('修改成功!')
        this.editModal = false
        this.totalData.push(res)
      })
    },
    delAddrConfirm () {
      delAddr(this.currIndex).then(res => {
        this.$Message.success('删除成功!')
        this.addModal = false
      })
    },
    changeHandler (event, index) {
      this.currIndex = index
      let item = this.totalData[this.currIndex]
      this.editForm.id = item.id
      this.editForm.username = item.username
      this.editForm.stuff_name = item.stuff_name
      this.editForm.num = 0
      this.changeModal = true
    },
    changeConfirm () {
      changeStuffRemain(this.editForm, this.editForm.id).then(res => {
        this.$Message.success('变更成功!')
        this.changeModal = false
        this.totalData[this.currIndex].num = res.num
      })
    }
  },
  mounted () {
    if (this.$store.state.user.level !== 99) {
      this.columns = [
        {
          title: '商品名称', key: 'stuff_name', sortable: true, search: true
        },
        {
          title: '商品剩余', key: 'num', sortable: true, search: true
        },
        {
          title: '商品单位', key: 'unit', sortable: true, search: true
        }
      ]
    }
    this.tableLoading = true
    getAddr().then(res => {
      this.totalData = res.results
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
