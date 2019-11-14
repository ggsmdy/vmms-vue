<template>
  <div>
    <Card>
      <!--引入这个表格-->
      <tables ref="tables" :loading="tableLoading" editable searchable search-place="top" ajaxSync v-model="currPageData" :columns="columns" @on-ajax-sync="ajaxSync"/>
      <!--表格下的自定义控件-->
      <div class="c-table-footer">
        <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
        <Page show-sizer :total="total" :current="curPage" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-page-size-change="pageSizeChange" @on-change="onChange" class-name="c-page"/>
      </div>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getMemberList } from '@/api/member'
export default {
  name: 'member_list',
  components: {
    Tables
  },
    //表格的每列叫什么  已经每列绑定的数据
  data () {
    return {
      columns: [
        {
          title: '会员号', align: 'center', key: 'mid', sortable: false, search: true
        },
        {
          title: '昵称', align: 'center', key: 'name', sortable: false, search: false
        },
        {
          title: '注册时间', align: 'center', key: 'ct_time', sortable: false, search: false
        },
        {
          title: '手机', align: 'center', key: 'tel', sortable: false, search: true
        },
        // {
        //   title: '余额', align: 'center', key: 'balance', sortable: false, search: false
        // },
        {
          title: '余额',
          key: 'balance',
          align: 'center',
          sortable: false,
          search: false,
          render: (h, params) => {
            return h('span', this.currPageData[params.index].balance / 100)
          }
        },
        {
          title: '积分', align: 'center', key: 'integral', sortable: false, search: false
        },
        {
          title: '注册机器', key: 'machine_name', sortable: false, search: true
        }
      ],
      // 当前页数据
      currPageData: [],
      // 所有数据
      tableTotalData: [],
      // 原始数据
      // 当前页码
      curPage: 1,
      // 每页数据量
      pageSize: 100,
      // 可选的每页数据总量
      pageSizeOpts: [ 100, 200],
      // 数据总量
      total: 400,
      // 存放绑定modal中的参数
      currIndex: 1,
      tableLoading: false,
      // 存放搜索内容
      kwargs: {}
    }
  },
  methods: {
    exportExcel () {
      this.$refs.tables.exportCsv({
        //导出csv文件是的名字  table-***。csv
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    },
    onChange (pageId) {
      this.curPage = pageId
      this.tableLoading = true
      getMemberList(pageId, this.pageSize, this.kwargs).then(res => {
        this.currPageData = res.results
        this.total = res.count
        this.tableLoading = false
      })
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize
      this.tableLoading = true
      getMemberList(this.curPage, pageSize, this.kwargs).then(res => {
        this.currPageData = res.results
        this.total = res.count
        this.curPage = res.curPage
        this.tableLoading = false
      })
    },
    ajaxSync (key, value) {
      this.kwargs = {}
      this.kwargs[key] = value
      this.tableLoading = true
      getMemberList(this.curPage, this.pageSize, this.kwargs).then(res => {
        this.currPageData = res.results
        this.total = res.count
        this.tableLoading = false
      })
    }
  },
  mounted () {
    this.tableLoading = true
    getMemberList(this.curPage, this.pageSize, this.kwargs).then(res => {
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
