<template>
  <div>
    <Card>
      <tables ref="tables" :loading="tableLoading" searchable search-place="top" v-model="currPageData" :columns="columns"/>
      <div class="c-table-footer">
        <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
        <Page show-sizer :total="total" :current="curPage" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-page-size-change="pageSizeChange" @on-change="onChange" class-name="c-page"/>
      </div>
    </Card>
    <Modal
      v-model="changeModal"
      title="原料库存消耗"
      width="415"
      :loading="loading"
      @on-ok="changeConfirm">
      <Form ref="editForm" :model="editForm" inline :label-width="80">
        <FormItem label="代理账号" prop="username">
          <Input type="text" v-model="editForm.username" style="width:200px" />
        </FormItem>
        <FormItem label="商品名称" prop="stuff_name">
          <Input type="text" v-model="editForm.stuff_name" style="width:200px" />
        </FormItem>
        <FormItem label="消耗数量" prop="num">
          <Input type="text" v-model="editForm.num" style="width:200px" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getStuffRemain, changeStuffRemain } from '@/api/order'
export default {
  name: 'stuff-remain',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        {
          title: '商品名称', key: 'stuff_name', sortable: true, search: true
        },
        {
          title: '商品剩余', key: 'num', sortable: true, search: true
        },
        {
          title: '商品单位', key: 'unit', sortable: true, search: true
        },
        {
          title: '所属代理',
          key: 'username',
          sortable: true,
          search: true
        },
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
        }
      ],
      // 当前页数据
      currPageData: [],
      // 所有数据
      tableTotalData: [],
      // 表格加载
      tableLoading: false,
      // 当前页码
      curPage: 1,
      // 当前操作序号
      currIndex: null,
      // 每页数据量
      pageSize: 20,
      // 可选的每页数据总量
      pageSizeOpts: [20, 50, 100, 200],
      // 数据总量
      total: 400,
      // 变更modal
      loading: true,
      changeModal: false,
      editForm: {
        id: null,
        username: '',
        stuff_name: '',
        num: 0
      }
    }
  },
  methods: {
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `原料库存-${(new Date()).valueOf()}.csv`
      })
    },
    changeHandler (event, index) {
      this.currIndex = index
      let item = this.currPageData[this.currIndex]
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
        this.currPageData[this.currIndex].num = res.num
      })
    },
    onChange (pageId) {
      this.curPage = pageId
      this.tableLoading = true
      getStuffRemain(pageId, this.pageSize).then(res => {
        this.currPageData = res.results
        this.total = res.count
        this.tableLoading = false
      })
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize
      this.tableLoading = true
      getStuffRemain(this.curPage, pageSize).then(res => {
        this.currPageData = res.results
        this.total = res.count
        this.curPage = res.curPage
        this.tableLoading = false
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
    getStuffRemain(this.curPage, this.pageSize).then(res => {
      this.currPageData = res.results
      this.total = res.count
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
