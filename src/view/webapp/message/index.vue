<template>
  <div>
    <Card>
      <Row style="margin:10px">
        <Button @click="handleAddMessage" class="add-btn" type="info">增加</Button>
      </Row>
      <tables ref="tables" :loading="tableLoading" v-model="currPageData" :columns="columns"/>
      <Row class="c-table-footer">
        <i-col span="24">
          <Page show-sizer :total="total" style="fload:right" :current="curPage" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-page-size-change="pageSizeChange" @on-change="onChange" class-name="c-page"/>
        </i-col>
      </Row>
    </Card>
    <Modal
        v-model="delMessageModal"
        title="删除消息"
        :loading="loading"
        width="300"
        @on-ok="delMessageConfirm">
        <p>是否确定删除ID为 <strong style="color: red">{{delConfigId}}</strong> 的消息?</p>
    </Modal>
    <Modal
      v-model="sendModal"
      title="消息推送"
      width="315"
      :loading="loading"
      @on-ok="startSend">
      <p style="margin-left:30px;margin-bottom:10px">将推送ID为 <strong style="color: red">{{sendMsgId}}</strong> 的消息给如下用户</p>
      <Select v-model="recUser" style="width:200px;margin-left:30px">
        <Option v-for="item in recUsers" :value="item.value" :key="item.value">{{ item.name }}</Option>
      </Select>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getMessage, delMessage, sendMessage } from '@/api/member'
export default {
  name: 'member_list',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        {
          title: 'ID', width: 120, align: 'center', key: 'id', sortable: false, search: true
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 220,
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
                    this.handleEditMessage(params.index)
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
                    this.handleDelMessage(params.index)
                  }
                }
              }, '删除'),
              h('Button', {
                props: {
                  type: 'info',
                  size: 'small',
                  shape: 'circle',
                  icon: 'md-send'
                },
                on: {
                  click: () => {
                    this.handleSendMessage(params.index)
                  }
                }
              }, '推送')
            ])
          }
        },
        {
          title: '标题', minWidth: 120, align: 'center', key: 'title', sortable: false, search: true
        },
        {
          title: '副标题', minWidth: 120, align: 'center', key: 'subtitle', sortable: false, search: true
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
      pageSize: 20,
      // 可选的每页数据总量
      pageSizeOpts: [20, 50, 100, 200],
      // 数据总量
      total: 400,
      // 存放绑定modal中的参数
      currIndex: 1,
      tableLoading: false,
      // 刪除消息
      delMessageModal: false,
      delConfigId: '',
      loading: true,
      // 推送消息modal
      sendModal: false,
      // 推送消息id
      sendMsgId: null,
      // 接受消息人群
      recUsers: [
        {name: '所有用户', value: 'all'},
        {name: '所有会员', value: 'all_member'},
        {name: '七天沉睡', value: 'seven'},
        {name: '超月沉睡', value: 'mouth'}
      ],
      recUser: null
    }
  },
  methods: {
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    },
    handleAddMessage () {
      this.$router.push({
        name: 'addMessage'
      })
    },
    handleSendMessage (index) {
      let msgId = this.currPageData[index].id
      this.sendMsgId = msgId
      this.sendModal = true
    },
    delMessageConfirm () {
      let msgId = this.currPageData[this.currIndex].id
      delMessage(msgId).then(res => {
        let index = this.currIndex
        this.currIndex = 0
        this.delMessageModal = false
        this.$Message.success('删除成功')
        this.currPageData.splice(index, 1)
      })
    },
    handleEditMessage (index) {
      let msgId = this.currPageData[index].id
      this.$router.push({
        name: 'editMessage',
        params: { msgId: msgId }
      })
    },
    handleDelMessage (index) {
      this.currIndex = index
      let msgId = this.currPageData[index].id
      this.delConfigId = msgId
      this.delMessageModal = true
    },
    onChange (pageId) {
      this.curPage = pageId
      this.tableLoading = true
      getMessage(pageId, this.pageSize).then(res => {
        this.currPageData = res.results
        this.total = res.count
        this.tableLoading = false
      })
    },
    // 页码改变
    pageSizeChange (pageSize) {
      this.pageSize = pageSize
      this.tableLoading = true
      getMessage(this.curPage, pageSize).then(res => {
        this.currPageData = res.results
        this.total = res.count
        this.curPage = res.curPage
        this.tableLoading = false
      })
    },
    // 开始推送
    startSend () {
      let data = {
        msgId: this.sendMsgId,
        recUser: this.recUser
      }
      sendMessage(data).then(res => {
        this.$Message.success('推送成功!')
        this.sendModal = false
      })
    }
  },
  mounted () {
    this.tableLoading = true
    getMessage(this.curPage, this.pageSize).then(res => {
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
.c-table-footer {
  margin: 5px;
}
</style>
