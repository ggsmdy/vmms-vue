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
      v-model="setStatusModal"
      title="订单状态更改"
      width="415"
      :loading="loading"
      @on-ok="setStatusHandler">
      <Form ref="setForm" :model="setForm" inline :label-width="80">
        <FormItem label="切换为" prop="opt_type">
          <Select v-model="setForm.opt_type" filterable style="width:200px" label-in-value clearable placeholder="请选择需要切换的状态">
              <Option v-for="item in userList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="快递名称" prop="name" v-if="setForm.opt_type === 'deliver'">
          <Input type="text" v-model="setForm.name" style="width:200px" />
        </FormItem>
        <FormItem label="快递单号" prop="uid" v-if="setForm.opt_type === 'deliver'">
          <Input type="text" v-model="setForm.uid" style="width:200px" />
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="printModal" fullscreen footer-hide title="订单详情">
      <form name="form1" ref="printThis">
        <div class="w">
          <div class="logo"><img width="170" height="60" :src="maxLogo" alt="热冰物联" /></div>
          <div class="m m1">
            <table class="tb1">
              <tr>
                <td class="t1">订单编号：{{printItem.uid}}</td>
                <td class="t2">订购时间：{{printItem.ct_time}}</td>
              </tr>
            </table>
            <table class="tb2">
              <colgroup>
                <col class="t1">
                <col class="t2">

              </colgroup>
              <tr>
                <td>订单状态：</td>
                <td>{{printItem.status}}</td>
              </tr>
              <tr>
                <td>下单用户：</td>
                <td>{{printItem.ct_user}}</td>
              </tr>
              <tr>
                <td>客户姓名：</td>
                <td>{{printItem.rec_name}}</td>
              </tr>
              <tr>
                <td>联系方式：</td>
                <td>{{printItem.rec_tel}}</td>
              </tr>
              <tr>
                <td>客户地址：</td>
                <td>{{printItem.rec_addr}}</td>
              </tr>
            </table>
          </div>
          <div class="m m2">
            <table class="tb4">
              <colgroup>
                <col class="gap">
                <col class="t3">
                <col class="t4" style="width:50%;">
                <col class="t5">
                <col class="t7">
                <col class="gap">
              </colgroup>
              <tr>
                <th class="gap"></th>
                <th class="al">商品编号</th>
                <th>商品名称</th>
                <th>数量</th>
                <th class="ar">商品金额</th>
                <th class="gap"></th>
              </tr>
              <tr v-for="stuff in printItem.stuffs" :key="stuff.id">
                <td class="gap"></td>
                <td class="al">{{stuff.id}}</td>
                <td>
                  <div class="p-name">{{stuff.name}}</div>
                </td>
                <td><span class="num">{{stuff.num}}</span></td>
                <td class="ar"><span class="num">&yen;{{stuff.num * stuff.price / 100}}</span></td>
                <td class="gap"></td>
              </tr>
            </table>
            <div class="goods-total">
              <ul>
                <li>
                  <span class="label">商品总额：</span>
                  <span class="txt">&yen;{{printItem.total_price / 100}}</span>
                </li>
                <li class="ftx-01">
                  <span class="label">应付总额：</span>
                  <span class="txt count">&yen;{{printItem.total_price / 100}}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="v-h">
          <div class="w"><input name="" class="print-btn" type="button" value="打印" @click="startPrint" /><input name="" class="close-btn" type="button" value="取消" @click="closePrint" /></div>
          <!-- <div class="w"><input name="" class="print-btn" type="button" value="取消" @click="closePrint" /></div> -->
        </div>
        <div class="footer">
          <p class="p1">热冰物联，用心为你服务</p>
        </div>
      </form>
    </Modal>
    <Modal
        title="微信支付"
        v-model="wxPayModal"
        :mask-closable="false"
        :loading="loading"
        :closable="false"
        width="330"
        okText='完成支付'
        cancelText='取消支付'
        @on-ok="payComplete">
        <div id="qrcode" ref="qrcode"></div>
    </Modal>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import Tables from '_c/tables'
import { getStuffOrderList, changeStuffOrder, getStuffOrderDetail, getStuffOrderPayment } from '@/api/order'
import maxLogo from '@/assets/images/logo.png'
export default {
  name: 'deliveryList',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        {
          title: '订单号', key: 'uid', sortable: true, search: true
        },
        {
          title: '创建时间', key: 'ct_time', sortable: true, search: true
        },
        {
          title: '更新时间', key: 'up_time', sortable: true, search: true
        },
        {
          title: '创建人', key: 'ct_user', sortable: true, search: true
        },
        {
          title: '总金额',
          key: 'total_price',
          sortable: true,
          search: true,
          render: (h, params) => {
            return h('strong', params.row.total_price / 100)
          }
        },
        {
          title: '状态', key: 'status', sortable: true, search: true
        },
        {
          title: '快递公司', key: 'send_company', sortable: true, search: true
        },
        {
          title: '快递单号', key: 'send_uid', sortable: true, search: true
        },
        {
          title: '操作',
          key: 'action',
          width: 200,
          align: 'center',
          search: false,
          render: (h, params) => {
            let els = this.renderBtn(h, params)
            return h('div', els)
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
      pageSize: 100,
      // 可选的每页数据总量
      pageSizeOpts: [100, 200],
      // 数据总量
      total: 400,
      // 设置状态modal
      setStatusModal: false,
      loading: true,
      // 状态列表
      userList: [
        {value: 'deliver', label: '已发货'},
        {value: 'confirm', label: '订单完成'},
        {value: 'cancel', label: '取消订单'}
      ],
      // 设置状态传递数据
      setForm: {
        opt_type: '',
        uid: '', // 快递单号
        name: '' // 快递名称
      },
      // 微信支付
      wxPayModal: false,
      qrcode: null,
      currOrderId: null,
      // 付款按钮loading
      // payBtnIndex: null,
      // 订单打印
      maxLogo,
      printModal: false,
      printItem: {
        uid: '------',
        ct_time: '9999-99-99 99:99:99',
        ct_user: '',
        rec_name: '',
        rec_addr: '',
        rec_tel: '',
        stuffs: []
      }
    }
  },
  computed: {},
  methods: {
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `原料订单-${(new Date()).valueOf()}.csv`
      })
    },
    onChange (pageId) {
      this.curPage = pageId
      this.tableLoading = true
      getStuffOrderList(pageId, this.pageSize).then(res => {
        this.currPageData = res.data
        this.total = res.count
        this.tableLoading = false
      })
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize
      this.tableLoading = true
      getStuffOrderList(this.curPage, pageSize).then(res => {
        this.currPageData = res.data
        this.total = res.count
        this.curPage = res.curPage
        this.tableLoading = false
      })
    },
    actionHandler (event, index, action) {
      let item = this.currPageData[index]
      switch (action) {
        case 'pay':
          event.target.parentElement.disabled = true
          this.currIndex = index
          getStuffOrderPayment(item.id).then(res => {
            event.target.parentElement.disabled = false
            if (res.is_paid === 'ok') {
              this.$Message.success('订单已支付!')
              this.currPageData[index].status = '等待出货'
            } else {
              this.wxPayModal = true
              this.qrcode.clear()
              this.qrcode.makeCode(res.wx_qrcode)
              this.currOrderId = item.id
            }
          })
          break
        case 'cancel':
          let data = {
            opt_type: 'cancel'
          }
          this.$Modal.confirm({
            title: '取消确认框',
            content: '<p>确定要删除订单' + item.uid + '吗？</p>',
            onOk: () => {
              changeStuffOrder(data, item.id).then(res => {
                item.status = '订单取消'
                this.$Message.success('订单取消成功!')
              })
            },
            onCancel: () => {
              this.$Message.info('取消操作')
            }
          })
          break
        case 'view':
          this.showDetail(item)
          break
        case 'set':
          this.currIndex = index
          this.setStatusModal = true
          break
        case 'print':
          this.handlePrint(item)
          break
      }
    },
    renderBtn (h, params) {
      let els = []
      let actionList = []
      let curItem = this.currPageData[params.index]
      if (curItem.status === '等待付款') {
        if (this.$store.state.user.level === 99) {
          actionList.push({name: '设置', action: 'set'})
        } else {
          actionList.push({name: '付款', action: 'pay'})
        }
        actionList.push({name: '查看', action: 'view'})
        actionList.push({name: '取消', action: 'cancel'})
      } else {
        actionList.push({name: '查看', action: 'view'})
        // actionList.push({name: '打印', action: 'print'})
        if (this.$store.state.user.level === 99) {
          actionList.push({name: '设置', action: 'set'})
        }
      }
      actionList.forEach(el => {
        els.push(
          h('Button', {
            props: {
              type: 'text',
              size: 'small',
              loading: false
            },
            on: {
              click: (event) => {
                this.actionHandler(event, params.index, el.action)
              }
            }
          }, el.name)
        )
      })
      return els
    },
    setStatusHandler () {
      let _id = this.currPageData[this.currIndex].id
      changeStuffOrder(this.setForm, _id).then(res => {
        this.currPageData[this.currIndex].status = res.status
        this.$Message.success('成功设置订单状态为:' + res.status)
        this.setStatusModal = false
      })
    },
    handlePrint (item) {
      getStuffOrderDetail(item.id).then(res => {
        this.printItem = res
        this.printModal = true
      })
    },
    printElement (elem) {
      var domClone = elem.cloneNode(true)

      var $printSection = document.getElementById('printSection')

      if (!$printSection) {
        $printSection = document.createElement('div')
        $printSection.id = 'printSection'
        document.body.appendChild($printSection)
      }

      $printSection.innerHTML = ''
      $printSection.appendChild(domClone)
      window.print()
    },
    startPrint () {
      this.printElement(this.$refs.printThis)
    },
    closePrint () {
      this.printModal = false
    },
    showDetail (item) {
      getStuffOrderDetail(item.id).then(res => {
        this.printItem = res
        this.printModal = true
      })
    },
    payComplete () {
      getStuffOrderPayment(this.currOrderId).then(res => {
        if (res.is_paid === 'ok') {
          this.wxPayModal = false
          this.$Message.success('订单已完成支付!')
          this.currPageData[this.currIndex].status = '等待出货'
        } else {
          this.wxPayModal = false
          this.$Message.error('订单未支付成功!')
        }
      })
    }
  },
  mounted () {
    this.qrcode = new QRCode(this.$refs.qrcode, {
      width: 300,
      height: 300,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    })
    this.tableLoading = true
    getStuffOrderList(this.curPage, this.pageSize).then(res => {
      this.currPageData = res.data
      this.total = res.count
      this.curPage = res.curPage
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
@import './order-print.css';
</style>
