<template>
  <div style="min-width: 1610px; ">
    <div style="width: 21.65vw;float: left">
      <Card>
        <tables ref="tables" :loading="tableLoading" editable searchable search-place="top" v-model="currPageData" :columns="columns" ajaxSync @on-ajax-sync="ajaxSync" @on-ajax-synd="ajaxSynd" @on-row-click="onclicks"/>
      </Card>
    </div>
    <div style="width: 1200px;height:79.3vh;border: 1px solid #f4f4f4;float: left;background-color: #ffffff;margin-left: 0.2rem;padding-left: 0.3rem" v-show="machinename!='机器名'">
      <div style="position: sticky;">
        <div style="font-size: 23px;position: absolute;left: 45vw;margin-top: 5vh;">{{machinename}}</div>
      </div>
      <div style="width: 1220px; font-size: 23px;margin-bottom: 2vh;padding-top: 2vh">
      口味:
        <div class="taste" v-for="(kouweis,i) in kouwei">
          <input type="checkbox" @click='xz(kouweis,"kouwei")' :id="kouweis.aisle_sn" :checked="kouweis.dis_work_state!='停用'?'checked':''" class="a">
          <label :for="kouweis.aisle_sn" class="right-top"></label>
          <select @change="changea(kouweis,$event,'kouwei')" style="width: 100px;height: 30px"class="mac-select">
            <option value="" disabled selected>{{kouweis.goods_name}}</option>
            <option  v-for="item in goodsList" :value="item.name+'|'+item.id">{{item.name}}</option>
          </select>
          <div align="center"><input v-model="kouweis.price" class="input-center"placeholder="价格"/></div>
          <div>
            <input v-model="kouweis.capacity" class="input-center left"placeholder="容量"/>
            <input v-model="kouweis.extant" class="input-center right"placeholder="现存"/>
          </div>
        </div>
      </div>
      <div style="width: 100%; font-size: 25px;margin-bottom: 2vh">
        果酱:
        <div class="taste" v-for="(guojiangs,i) in guojiang">
          <input type="checkbox" @click='xz(guojiangs,"guojiang")' :id="guojiangs.aisle_sn" :checked="guojiangs.dis_work_state!='停用'?'checked':''" class="a">
          <label :for="guojiangs.aisle_sn" class="right-top"></label>
          <select @change="changea(guojiangs,$event,'guojiang')" style="width: 100px;" class="mac-select">
            <option value="" disabled selected>{{guojiangs.goods_name}}</option>
            <option  v-for="item in goodsList" :value="item.name+'|'+item.id">{{item.name}}</option>
          </select>
          <div align="center"><input v-model="guojiangs.price" class="input-center"placeholder="价格"/></div>
          <div>
            <input v-model="guojiangs.capacity" class="input-center left"placeholder="容量"/>
            <input v-model="guojiangs.extant" class="input-center right"placeholder="现存"/>
          </div>
        </div>
      </div>
      <div style="width: 100%; font-size: 25px;padding-bottom: 5vw">
        辅料:
        <div class="taste" v-for="(fuliaos,i) in fuliao">
          <input type="checkbox" @click='xz(fuliaos,"fuliao")' :id="fuliaos.aisle_sn" :checked="fuliaos.dis_work_state!='停用'?'checked':''" :value="fuliaos.dis_work_state!='停用'?'停用':'正常'" class="a">
          <label :for="fuliaos.aisle_sn" class="right-top"></label>
          <select @change="changea(fuliaos,$event,'fuliao')" style="width: 100px;" class="mac-select">
            <option value="" disabled selected>{{fuliaos.goods_name}}</option>
            <option  v-for="item in goodsList" :value="item.name+'|'+item.id">{{item.name}}</option>
          </select>
          <div align="center"><input v-model="fuliaos.price" class="input-center"placeholder="价格"/></div>
          <div>
            <input v-model="fuliaos.capacity" class="input-center left"placeholder="容量"/>
            <input v-model="fuliaos.extant" class="input-center right"placeholder="现存"/>
          </div>
        </div>
      </div>
      <div style="position: absolute;right: 5vw;">
        <i-button type="primary" :loading="loading1" @click="toLoading">
          <span v-if="!loading1">保存</span>
          <span v-else>保存中...</span>
        </i-button>
      </div>
    </div>
  </div>
</template>
<!-- @on-row-click="onclikes" -->
<script>
  import Tables from '_c/tables'
  import { getMachineList, getAisleList, getUserList, changeMachine, delMachine, getAllGoods, editAisleMulti} from '@/api/machine'
  import { renderRunStateClass } from '@/libs/util'
  export default {
    name: 'machine_loading',
    components: {
      Tables
    },
    data () {
      return {
        columns: [
          {
            title: '设备号', align: 'center', key: 'uid', sortable: false, search: true
          },
          {
            title: '设备名称', align: 'center', key: 'name', sortable: false, search: true
          }
        ],
        machineData:[],
        // 修改表单
        editForm: {
          uid: '',
          name: '',
          leaguer: '',
          tag: ''
        },
        loading1: false,
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
        bindModal: false,
        loading: true,
        tag: '',
        userList: [],
        // 存放选中绑定人的名字和id
        bindUserName: '',
        tableLoading: false,
        // 删除机器
        delMachineModal: false,
        machinename:"机器名",
        kouwei:[],
        guojiang:[],
        fuliao:[]
      }
    },
    computed: {
      delMachineUid: function () {
        return this.currPageData.length && this.currPageData[this.currIndex] ? this.currPageData[this.currIndex].uid : ''
      }
    },
    methods: {
      toLoading () {
        this.loading1 = true
        let data = []
        for (let i=0;i<this.kouwei.length;i++){
          data.push(this.kouwei[i])
        }
        for(let i = 0; i<this.guojiang.length;i++){
          data.push(this.guojiang[i])
        }
        for(let i=0; i<this.fuliao.length;i++){
          data.push(this.fuliao[i])
        }
        editAisleMulti(data).then(res =>{
          this.$router.go(0)
          this.loading1 = false
        })
      },
      exportExcel () {
        this.$refs.tables.exportCsv({
          filename: `table-${(new Date()).valueOf()}.csv`
        })
      },
      onChange (pageId) {
        this.curPage = pageId
        this.tableLoading = true
        getMachineList(pageId, this.pageSize, this.kwargs ,this.machineData).then(res => {
          this.currPageData = res.results
          this.total = res.count
          this.tableLoading = false
        })
      },
      pageSizeChange (pageSize) {
        this.pageSize = pageSize
        this.tableLoading = true
        getMachineList(this.curPage, pageSize, this.kwargs ,this.machineData).then(res => {
          this.currPageData = res.results
          this.total = res.count
          this.curPage = res.curPage
          this.tableLoading = false
        })
      },
      bindUser (index) {
        // this.currPageData.splice(index, 1)
        this.$emit('clearSingleSelect')
        this.currIndex = index
        this.bindModal = true
        this.editForm.tag = this.currPageData[this.currIndex].tag
        this.editForm.name = this.currPageData[this.currIndex].name
        this.editForm.leaguer = this.currPageData[this.currIndex].leaguer
        this.editForm.uid = this.currPageData[this.currIndex].uid
        this.bindUserName = this.currPageData[this.currIndex].leaguer_name
        getUserList().then(res => {
          this.userList = res
        })
      },
      handleDelMachine (index) {
        this.currIndex = index
        if (this.$store.state.user.level !== 99 && this.$store.state.user.level !== '99') {
          this.$Message.error('非管理员不能操作')
          return
        }
        this.delMachineModal = true
      },
      asyncOK () {
        changeMachine(this.editForm.uid, this.editForm).then(res => {
          this.bindModal = false
          this.currPageData[this.currIndex].leaguer_name = res.leaguer_name
          this.currPageData[this.currIndex].tag = res.tag
          this.currPageData[this.currIndex].name = res.name
        })
      },
      delMachineConfirm () {
        let _id = this.currPageData[this.currIndex].uid
        delMachine(_id).then(res => {
          let index = this.currIndex
          this.currIndex = 0
          this.delMachineModal = false
          this.$Message.success('删除成功')
          this.currPageData.splice(index, 1)
        })
      },
      ajaxSync (key, value) {
        this.kwargs = {}
        this.kwargs[key] = value
        this.tableLoading = true
        getMachineList(this.curPage, this.pageSize, this.kwargs ,this.machineData).then(res => {
          this.currPageData = res.results
          this.total = res.count
          this.tableLoading = false
        })
      },
      ajaxSynd(key,value){
        this.machineData=value
        getMachineList(this.curPage, this.pageSize, this.kwargs ,this.machineData).then(res => {
          this.currPageData = res.results
          this.total = res.count
          this.tableLoading = false
        })
      },
      onclicks(key){
        this.kwargs = {}
        this.machinename=key.name
        this.kwargs["machine"]=key.uid
        this.kwargs["work_state"]=0
        getAisleList(this.curPage, this.pageSize, this.kwargs).then(res => {
          this.kouwei=[]
          this.guojiang=[]
          this.fuliao=[]
          for (let i=0;i<res.count;i++){
            if (res.results[i].aisle_sn>0&&res.results[i].aisle_sn<4){
              this.kouwei.push(res.results[i])
            }else if (res.results[i].aisle_sn>100&&res.results[i].aisle_sn<109) {
              this.guojiang.push(res.results[i])
            }else if (res.results[i].aisle_sn>200&&res.results[i].aisle_sn<209) {
              this.fuliao.push(res.results[i])
            }
          }
        })
        /*this.$router.push({path:'/machine/map',query:{machine_Uid:key}})*/
      },
      xz(fuliaos,pz){
        if (pz=="fuliao"){
          for(let i=0;i<this.fuliao.length;i++){
            if(this.fuliao[i].aisle_sn == fuliaos.aisle_sn){
              if (this.fuliao[i].dis_work_state=="停用"){
                this.fuliao[i].dis_work_state="正常"
                this.fuliao[i].work_state = 0
              }else {
                this.fuliao[i].dis_work_state="停用"
                this.fuliao[i].work_state = 1
              }
            }
          }
        }else if (pz=="guojiang"){
          for(let i=0;i<this.guojiang.length;i++){
            if(this.guojiang[i].aisle_sn == fuliaos.aisle_sn){
              if (this.guojiang[i].dis_work_state=="停用"){
                this.guojiang[i].dis_work_state="正常"
                this.guojiang[i].work_state = 0
              }else {
                this.guojiang[i].dis_work_state="停用"
                this.guojiang[i].work_state = 1
              }
            }
          }
        } else  if (pz=="kouwei"){
          for(let i=0;i<this.kouwei.length;i++){
            if(this.kouwei[i].aisle_sn == fuliaos.aisle_sn){
              if (this.kouwei[i].dis_work_state=="停用"){
                this.kouwei[i].dis_work_state="正常"
                this.kouwei[i].work_state = 0
              }else {
                this.kouwei[i].dis_work_state="停用"
                this.kouwei[i].work_state = 1
              }
            }
          }
        }
      },
      changea(fuliaos,e,pz) {
        let arr = e.target.value.split("|")
        let value=arr[0]
        let id = arr[1]
        if (pz=="fuliao"){
          for(let i=0;i<this.fuliao.length;i++){
            if(this.fuliao[i].aisle_sn == fuliaos.aisle_sn){
              this.fuliao[i].goods_name = value
              this.fuliao[i].goods = id
            }
          }
        }else if (pz=="guojiang"){
          for (let i=0;i<this.guojiang.length;i++){
            if (this.guojiang[i].aisle_sn == fuliaos.aisle_sn){
              this.guojiang[i].goods_name = value
              this.guojiang[i].goods = id
            }
          }
        }else if (pz=="kouwei"){
          for (let i=0;i<this.kouwei.length;i++){
            if (this.kouwei[i].aisle_sn == fuliaos.aisle_sn){
              this.kouwei[i].goods_name = value
              this.kouwei[i].goods = id
            }
          }
        }
      }
      },
    mounted () {
      this.tableLoading = true
      getMachineList(this.curPage, this.pageSize).then(res => {
        this.currPageData = res.results
        this.total = res.count
        this.tableLoading = false
      })
      getAllGoods().then(res => {
        this.goodsList = res
      })
    }
  }
</script>

<style>
  .c-page {
    float: right;
    padding: 12px;
  }
  .taste{
    display:inline-block;
    border: 1px solid #d4d4d4;
    font-size: 22px;
    width: 8rem;
    height: 7rem;
    margin: 0.2rem;
  }
  .right-top{
    float: right;
    margin-right: 0.2rem;
    margin-top: 0.2rem;
  }
  .a+label {
    background-color: white;
    border-radius: 0px;
    border: 1px solid #d3d3d3;
    width: 20px;
    height: 20px;
    display: inline-block;
    text-align: center;
    vertical-align: bottom;
    line-height: 20px;
  }
  .a {
    display: none;
  }
  .a+label:hover {
    cursor: pointer;
    border: 1px solid #2783FB;
  }

  .a:checked+label {
    background-color: #eee;
    background: #2783FB;
  }

  .a:checked+label:after {
    content: "\2714";
    color: white;
  }

  .input-center{
    width: 3vw;
    height: 3vh;
    font-size: 13px;
  }
  .left{
    float: left;
    margin-top: 10px;
    margin-left: 5px;
  }
  .right{
    float: right;
    margin-top: 10px;
    margin-right: 5px;
  }
  .mac-select{
    font-size: 20px;
    border: none;
    /*去掉默认的下拉三角
    appearance:none;
    -moz-appearance:none;
    -webkit-appearance:none;*/
    /*添加下拉三角图标
    background: url("../img/task5-2_07.jpg") no-repeat right center transparent;*/
  }

</style>
