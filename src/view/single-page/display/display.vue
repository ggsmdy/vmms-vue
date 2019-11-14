<template>
  <div class="body">
    <div style="height: 100%;width: 96%;margin-left: 2%; margin-right: 2%;position: absolute;">
      <div class="left_side">
        <div style="margin: 5px;">
          <div style=" height: 44%;margin-top: 10px;">
            <div class="left-top" style="height: 43vh;">
              <div id="left-top-ul">
                <a>商品类型占比</a>
                <hr width="90%"/>
              </div>
              <div style="width:90%;height:84%;margin-top: 1rem;margin-left: 1.2rem">
                  <chart-hfpie :value="pieData" itemName="支付方式" style="height: 100%">

                  </chart-hfpie>
              </div>
            </div><!-- border: 1px solid blue; -->
            <div class="left-btn" style="height: 54.5vh; margin-top: 1vh;">
              <div id="left-btn-ul">
                <a class="a-on">商品畅销榜</a>
                <a class="a-mo">点位畅销榜</a>
                <hr style="width: 63%"/>
              </div>
              <div style="width:90%;height:83%;margin-top: 1rem;margin-left: 1.2rem">
                <i-table :columns="columns1" :data="data1" :height="450"></i-table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="content-top" style="width: 100%;height: 27.5vh">
          <div class="top">
            <div>
              <div class="left-time">
                <span>{{currentTime}}</span>
              </div>
            </div>
          </div>
          <div class="btn" align="center">
            <div class="cent-btn">
              <h1>0.00</h1>
              <span>今日销售额(元)</span>
            </div>
            <div class="cent-btn">
              <h1>0</h1>
              <span>今日销量(件)</span>
            </div>
            <div class="cent-btn">
              <h1>0</h1>
              <span>今日购买用户(人)</span>
            </div>
          </div>
        </div>
        <div class="content-body" style="width: 100%;height: 32.5vh">
            <chart-disline :value="pieData" itemName="支付方式" style="height: 90%">

            </chart-disline>
        </div>
        <div class="content-btn" style="width: 100%;height: 40vh">
          <chart-dis-map :value="pieData" itemName="支付方式" style="height: 98%">

          </chart-dis-map>
        </div>
      </div>
      <div class="right_side">
        <div style="margin: 5px;">
            <div class="right-top" style="height: 43.5vh;">
              <div id="right-top-ul">
                <a>支付方式占比</a>
                <hr width="90%"/>
              </div>
              <div style="width:90%;height:84%;margin-top: 0.5rem;margin-left: 1.2rem">
                <chart-twopie :value="pieData" itemName="支付方式" style="height: 100%">

                </chart-twopie>
              </div>
            </div>
            <div class="right-btn" style="height: 54.5vh; margin-top: 1vh;">
              <div id="right-btn-ul">
                <a class="a-mo">警告</a>
                <a class="a-on">通知</a>
                <hr style="width: 63%"/>
              </div>
              <div style="width:90%;height:83%;margin-top: 1rem;margin-left: 1.2rem">
                <i-table :columns="columns1" :data="data1" :height="450"></i-table>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ChartHfpie,ChartDisMap,ChartTwopie,ChartDisline } from '_c/charts'
import { getDashboradInfo } from '@/api/common'
export default {
  name:'display',
  components: {
    ChartDisMap,
//创造模板方法
    ChartHfpie,
    ChartTwopie,
    ChartDisline
  },
  data(){
    return {
      pieData: [],
      columns1:[],
      data1:[],
      timer:"",
      currentTime: new Date()
    }
  },
  created() {
    let _this = this; //声明一个变量指向Vue实例this，保证作用域一致
    let weekDay = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    this.timer = setInterval(function() {
      _this.currentTime = //修改数据date
        new Date().getFullYear() +
        "/" +
        (new Date().getMonth() + 1) +
        "/" +
        new Date().getDate() +
        " " +
        weekDay[new Date().getDay()] +
        " "+
        new Date().getHours() +
        ":" +
        new Date().getMinutes() +
        ": " +
        new Date().getSeconds();
    }, 1000);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }
  },
  mounted () {
    //调用getDashboradInfo方法（api/common.js中）
    getDashboradInfo().then(res => {//res为这个方法的返回值  再给tadayData等等赋值   （=   赋值）
      let data = res
      this.pieData = data.pay_data
    })
    this.columns1=[{
                    title: '姓名',
                    key: 'name',
                    align:"center"
                  },
                    {
                      title: '年龄',
                      key: 'age',
                      align:"center"
                    }]
    this.data1=[]
  }
}
</script>

<style>
 .body{
   height: 100vh;
   width: 100vw;
   background: #1b253a url(../../../assets/images/bg.png);
   background-size: 100vw 100vh;
   min-width: 1200px;
 }
 .left_side {
     top: 0px;
     position: absolute;
     width: 25%;
     height: 100%;
     float: left;
     left: 0px;
 }
 .content {
     position: absolute;
     margin-left: 25%;
     height: 100%;
     width: 50%;
     float: left;
 }
 .right_side {
    top: 0px;
    position: absolute;
    width: 25%;
    height: 100%;
    margin-left: 75%;
    float: left;
 }
 #left-top-ul{
   margin-left: 1.8rem;
   margin-top: 2rem;
   min-width: 25%;
 }
 #left-top-ul a{
    font-size: 15px;
    border-bottom: 1px solid #4e80ff;
    padding-bottom:4px;
    padding-left: 10px;
    padding-right: 10px;
 }
 hr{
  border: 1px solid #464C5B;
 }
 #left-btn-ul{
   margin-left: 1.8rem;
   margin-top: 1rem;
   min-width: 25%;
 }
 #left-btn-ul .a-on{
   font-size: 15px;
   border-bottom: 1px solid #4e80ff;
   padding-bottom:4px;
   padding-left: 10px;
   padding-right: 10px;
 }
 #left-btn-ul .a-mo{
   font-size: 15px;
   color: #fff;
   border-bottom: 1px solid #464C5B;
   padding-bottom:4px;
   padding-left: 10px;
   padding-right: 10px;
 }

 #right-top-ul{
   margin-left: 1.8rem;
   margin-top: 2rem;
   min-width: 25%;
 }
 #right-top-ul a{
   font-size: 15px;
   border-bottom: 1px solid #4e80ff;
   padding-bottom:4px;
   padding-left: 10px;
   padding-right: 10px;
 }
 #right-btn-ul{
   margin-left: 1.8rem;
   margin-top: 1rem;
   min-width: 25%;
 }
 #right-btn-ul .a-on{
   font-size: 15px;
   border-bottom: 1px solid #4e80ff;
   padding-bottom:4px;
   padding-left: 10px;
   padding-right: 10px;
 }
 #right-btn-ul .a-mo{
   font-size: 15px;
   color: #fff;
   border-bottom: 1px solid #464C5B;
   padding-bottom:4px;
   padding-left: 10px;
   padding-right: 10px;
 }
 .ivu-table{
   background-color:transparent;
 }
 .ivu-table td{
   background-color: transparent;
   color: #F0F0F0;
 }
 .ivu-table th{
   background-color: transparent;
   color: #ffffff;
 }
 div.ivu-card-body {
   padding: 0;
 }
 div.ivu-table-wrapper {
   border: none;
 }
 .ivu-table:before{content:'';width:100%;height:0px;position:absolute;left:0;bottom:0;z-index:1}
 .ivu-table:after{content:'';width:0px;height:100%;position:absolute;top:0;right:0;z-index:3}
 .ivu-table-row-hover td {
   background-color: #4e80ff!important;
 }
  .left-time{
    margin-left: 2rem;
    margin-top: 1rem;
    width: 12rem;
    height: 5rem;
    line-height: 5rem;
    color: #4e80ff;
    font-size: 15px;
  }
  .cent-btn{
    display: inline-block;
    width: 30%;
    height: 7.9rem;
    line-height: 3rem;
    margin-top: 2.1rem;
  }
  .cent-btn h1{
    padding-top: 1rem;
    font-size: 30px;
    color: orange;
  }
  .cent-btn span{
    font-size: 15px;
    color: #4e80ff;
  }
</style>
