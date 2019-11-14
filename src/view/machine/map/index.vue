<template>
    <div id="allmap"></div>
</template>

<script>
import { getMachineGpsInfo } from '@/api/machine'
export default {
  name: 'machine_map',
  data () {
    return {
      map: null,
      geolocationControl: null,
      messageCtrl:null,
      points: [],
      agolnglat:[],
      sousuolist:[]
    }
  },
  methods: {
    initMap () {
      let _ = this
      // 创建Map实例
      this.map = new BMap.Map('allmap', {minZoom: 6, maxZoom: 19})
      this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 11)
      // 设置地图显示的城市 此项是必须设置的
      this.map.setCurrentCity('湖南')
      // 开启鼠标滚轮缩放
      this.map.enableScrollWheelZoom(true)
      // 增加定位控件
      this.geolocationControl = new BMap.GeolocationControl()
      // 定义一个控件类,即function
      function MessageControl(){
        // 默认停靠位置和偏移量
        this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT
        this.defaultOffset = new BMap.Size(10, 10)
      }
      // 通过JavaScript的prototype属性继承于BMap.Control
      MessageControl.prototype = new BMap.Control()
      // 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
      // 在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中
      MessageControl.prototype.initialize = function(map){
        // 创建一个DOM元素
        let div = document.createElement("div")
        let input = document.createElement("input")
        let btn = document.createElement("button")
        input.setAttribute("class", "sh-input")
        input.setAttribute("placeholder","请输入机器名称")
        btn.appendChild(document.createTextNode("搜索"))
        btn.setAttribute("class","sh-btn")
        let ul = document.createElement("ul")
        ul.setAttribute("class","list-module")
        let li = null
        // 设置样式
        div.appendChild(input)
        div.appendChild(btn)
        div.appendChild(ul)
        // 绑定事件,点击一次放大两级
        let values=null
        btn.onclick = function(e){
          let value=input.value.replace(/(^\s*)|(\s*$)/, "")
          if(values!=value){
            values=value
          let data={"name":value}
          if(value!=" "&&value!=null&&value.length!=0){
            if(_.agolnglat!==null){
              //获取地图上所有的覆盖物
              let allOverlay =_.map.getOverlays()
              for(let i = 0;i<allOverlay.length;i++) {
              if(allOverlay[i].toString()=="[object Marker]"){
                for(let j=0;j<_.agolnglat.length;j++){
                  if (allOverlay[i].getPosition().lng == _.agolnglat[j].longitude && allOverlay[i].getPosition().lat == _.agolnglat[j].latitude) {
                    _.drawPoint(_.agolnglat[j])
                    map.removeOverlay(allOverlay[i]);
                  }
                }
              }
              }
            }
            getMachineGpsInfo(data).then(res => {
              let data = res.result
              _.sousuolist=data
              if(li!=null){
                ul.innerHTML = ""
               }
              _.sousuolist.forEach(item =>{
                li=document.createElement('li')
                li.setAttribute("class","li")
                li.appendChild(document.createTextNode(item.name))
                ul.appendChild(li)
                li.onclick = function(e){
                  _.drawPoint(item,1,1)
                }
              })
              data.forEach(item => {
                let agolnglat={"name":item.name,"user":item.user,"uid":item.uid,"tag":item.tag,"desc":item.desc,"longitude":item.longitude,"latitude":item.latitude,"address":item.address,"net_state":item.net_state,"work_state":item.work_state}
                _.drawPoint(item,1)
                if (_.agolnglat.length!=0) {
                  let a=null
                  for(let i=0;i<_.agolnglat.length;i++){
                    if(_.agolnglat[i].name==agolnglat.name){
                      a=1
                    }
                  }
                  if(a!=1){
                    _.agolnglat.push(agolnglat)
                  }
                }else{
                  _.agolnglat.push(agolnglat)
                }
              })
              _.map.setViewport(_.points)
            })
          }
          }
        }
        // 添加DOM元素到地图中
        map.getContainer().appendChild(div);
        // 将DOM元素返回
        return div
      }
      // 创建控件
      this.messageCtrl = new MessageControl()
      // 添加到地图当中
      this.map.addControl(this.messageCtrl)
      this.map.addControl(this.geolocationControl)
    },
    drawPoint (Point,state,openstate) {
      let sContent =
      '<div>' +
      '<h4 style="margin:0 0 5px 0;padding:0.2em 0">设备信息</h4>' +
      '<p><strong>设备名: </strong>' + Point.name + '</p>' +
      '<p><strong>设备uid: </strong>' + Point.uid + '</p>' +
      '<p><strong>工作状态: </strong>' + Point.work_state + '</p>' +
      '<p><strong>网络状态: </strong>' + Point.net_state + '</p>' +
      '<p><strong>详细信息: </strong>' + Point.desc + '</p>' +
      '<p><strong>地址: </strong>' + Point.address + '</p>' +
      '</div>'
      let point = new BMap.Point(Point.longitude, Point.latitude)
      let myIcon
      if(state!=1){
        myIcon = new BMap.Icon(this.JudgeState(Point.work_state,Point.net_state), new BMap.Size(32,32))
      }else{
        myIcon = new BMap.Icon(this.JudgeState(Point.work_state,Point.net_state,0), new BMap.Size(50,50))
      }
      let marker = new BMap.Marker(point,{icon:myIcon})
      let infoWindow = new BMap.InfoWindow(sContent)
      this.map.addOverlay(marker)
      if(openstate!=1){
        marker.addEventListener('click', function () {
          this.openInfoWindow(infoWindow)
        })
      }else{
        marker.addEventListener('click', function () {
          this.openInfoWindow(infoWindow)
        })
        this.map.openInfoWindow(infoWindow,point)
      }
      this.points.push(point)
    },
    JudgeState(work_state,net_state,state){
        //图片克切换  直接放入assets下  再改下地址 再把这个值返回     后台 没给料少和缺料的数据
        let normal=require("@/assets/lmarkimgs/green.png")//正常
        let line=require("@/assets/lmarkimgs/gray.png")//离线
        let fault=require("@/assets/lmarkimgs/red.png")//故障
        let alarm=require("@/assets/lmarkimgs/yellow.png")//异常
        let less=require("@/assets/lmarkimgs/less.png")//料少
        let starved=require("@/assets/lmarkimgs/starved.png")//缺料

        let normal_big=require("@/assets/lmarkimgs/green-big.png")//正常
        let line_big=require("@/assets/lmarkimgs/gray-big.png")//离线
        let fault_big=require("@/assets/lmarkimgs/red-big.png")//故障
        let alarm_big=require("@/assets/lmarkimgs/yellow-big.png")//异常
        if(state!=0){
          if(net_state=="在线"){
              if(work_state=="正常"){
                return normal
              }else if(work_state=="报警"){
                return alarm
              }else if(work_state=="故障"){
                return fault
              }
          }else if(net_state=="离线"){
            return line
          }
        }else{
          if(net_state=="在线"){
              if(work_state=="正常"){
                return normal_big
              }else if(work_state=="报警"){
                return alarm_big
              }else if(work_state=="故障"){
                return fault_big
              }
          }else if(net_state=="离线"){
            return line_big
          }
        }
    }
  },
  mounted () {
    let machine_Uid=this.$route.query.machine_Uid
    this.initMap()
    getMachineGpsInfo().then(res => {
      let data = res.result
      data.forEach(item => {
        this.drawPoint(item)
        if(machine_Uid!=null&&machine_Uid==item.uid){
          this.drawPoint(item,1,1)
        }
      })
      this.map.setViewport(this.points)
    })
  }
}
</script>

<style>
.c-page {
  float: right;
  padding: 12px;
}

#allmap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin:0;
  font-family:"微软雅黑";
 }

.anchorBL>a {
  display: none
  }
.sh-input{
  outline-style: none ;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 3px 3px;
  font-size: 14px;
  font-family: "Microsoft soft";
}
.sh-input:focus{
  border-color: #66afe9;
  outline: 0;
  -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);
  box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)
}
.sh-btn{
  padding: 3px 3px;
  border:1px solid #1e7db9;
  box-shadow: 0 1px 2px #8fcaee inset,0 -1px 0 #497897 inset,0 -2px 3px #8fcaee inset;
  background: -webkit-linear-gradient(top,#42a4e0,#2e88c0);
  background: -moz-linear-gradient(top,#42a4e0,#2e88c0);
  background: linear-gradient(top,#42a4e0,#2e88c0);
  font-size: 14px;
}
 .list-module {
  overflow: auto;
  list-style:none;
  margin:0px;
 }
  .li{
    background-color:rgba(255,255,255,0.7);
    position: relative;
    margin-top: 0.5em;
    padding: 0.5em;
    border: 1px solid #999999;
    white-space: nowrap;
    font-size: 15px;
  }
 .li:hover{
    background-color: #999999;		/*改变li的背景颜色*/
    font-size: 16px;
  }

</style>
