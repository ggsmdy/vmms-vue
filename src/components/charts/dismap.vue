<template>
  <div ref="dom" class="charts chart-pie"></div>
</template>

<script>
  import echarts from 'echarts'
  import 'echarts/map/js/china.js'
  import tdTheme from './theme.json'
  import { on, off } from '@/libs/tools'
  echarts.registerTheme('tdTheme', tdTheme)
  export default {
    name: 'ChartDisMap',
    props: {
      value: Array,
      text: String,
      subtext: String,
      itemName: String
    },
    mounted () {
      this.$nextTick(() => {
        let legend = this.value.map(_ => _.name)
        let option = {
          title: {
            text: this.text,
            subtext: this.subtext,
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            // orient: 'vertical',
            left: 'center',
            bottom: 10,
            data: legend
          },
          series: [
            {
              type: 'pie',
              name: this.itemName,
              radius: '55%',
              center: ['50%', '40%'],
              data: this.value,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
        let dom = echarts.init(this.$refs.dom, 'tdTheme')
        dom.setOption(option)
        on(window, 'resize', dom.resize)
      })
    },
    watch: {
      value: function (val) {
        var dom = echarts.getInstanceByDom(this.$refs.dom)
        var seriesjson = [
          {customTel:"199****8566",longitude:110.416720,latitude:21.191193,customInfo:"在湛江市-进行购买车辆报备",customName:"王先生",createType:2},
          {customTel:"134****7979",longitude:104.088788,latitude:30.622603,customInfo:"在成都市-奔驰4S店来访",customName:"田小姐",createType:1},
          {customTel:"186****8989",longitude:109.537356,latitude:18.299484,customInfo:"在三亚市-奔驰4S店购买车辆",customName:"张小姐",createType:3},
          {customTel:"177****1234",longitude:102.735913,latitude:24.984286,customInfo:"在昆明市-保时捷4S店购买车辆",customName:"Peter",createType:3},
          {customTel:"186****9950",longitude:114.373061,latitude:30.515092,customInfo:"在武汉市-进行购买车辆报备",customName:"熊先生",createType:2},
          {customTel:"181****5239",longitude:123.550983,latitude:41.779613,customInfo:"在沈阳市-路虎4S店来访",customName:"周先生",createType:1}
        ];
        var option = null;
        var geoCoordMap = {
          '黑龙江': [127.9688, 45.368],
          '内蒙古': [110.3467, 41.4899],
          "吉林": [125.8154, 44.2584],
          '北京': [116.4551, 40.2539],
          "辽宁": [123.1238, 42.1216],
          "河北": [114.4995, 38.1006],
          "天津": [117.4219, 39.4189],
          "山西": [112.3352, 37.9413],
          "陕西": [109.1162, 34.2004],
          "甘肃": [103.5901, 36.3043],
          "宁夏": [106.3586, 38.1775],
          "青海": [101.4038, 36.8207],
          "新疆": [87.9236, 43.5883],
          "西藏": [91.11, 29.97],
          "四川": [103.9526, 30.7617],
          "重庆": [108.384366, 30.439702],
          "山东": [117.1582, 36.8701],
          "河南": [113.4668, 34.6234],
          "江苏": [118.8062, 31.9208],
          "安徽": [117.29, 32.0581],
          "湖北": [114.3896, 30.6628],
          "浙江": [119.5313, 29.8773],
          "福建": [119.4543, 25.9222],
          "江西": [116.0046, 28.6633],
          "湖南": [113.0823, 28.2568],
          "贵州": [106.6992, 26.7682],
          "云南": [102.9199, 25.4663],
          "广东": [113.12244, 23.009505],
          "广西": [108.479, 23.1152],
          "海南": [110.3893, 19.8516],
          '上海': [119.1803, 31.2891],
          '台湾': [121.4648, 25.5630]
        };
        var chinaDatas = [
          {
            name: '黑龙江',
            value: 300
          },
          {
            name: '内蒙古',
            value: 300
          },
          {
            name: '吉林',
            value: 300
          },
          {
            name: '辽宁',
            value: 300
          },
          {
            name: '河北',
            value: 300
          },
          {
            name: '天津',
            value: 300
          },
          {
            name: '山西',
            value: 300
          },
          {
            name: '陕西',
            value: 300
          },
          {
            name: '甘肃',
            value: 300
          },
          {
            name: '宁夏',
            value: 300
          },
          {
            name: '青海',
            value: 300
          },
          {
            name: '新疆',
            value: 300
          },
          {
            name: '西藏',
            value: 300
          },
          {
            name: '四川',
            value: 300
          },
          {
            name: '重庆',
            value: 300
          },
          {
            name: '山东',
            value: 300
          },
          {
            name: '河南',
            value: 300
          },
          {
            name: '江苏',
            value: 300
          },
          {
            name: '安徽',
            value: 300
          },
          {
            name: '湖北',
            value: 300
          },
          {
            name: '浙江',
            value: 300
          },
          {
            name: '福建',
            value: 300
          },
          {
            name: '江西',
            value: 300
          },
          {
            name: '湖南',
            value: 300
          },
          {
            name: '贵州',
            value: 300
          },
          {
            name: '广西',
            value: 300
          },
          {
            name: '海南',
            value: 300
          },
          {
            name: '上海',
            value: 300
          },
          {
            name: '广东',
            value: 300
          },
          {
            name: '云南',
            value: 300
          },
          {
            name: '北京',
            value: 300
          },
          {
            name: '台湾',
            value: 300
          }
        ];
        var convertData = function(data, type) {
          /*type:1 地图参数；type:2数据参数*/
          var res = [];
          for (var i = 0; i < data.length; i++) {
            var geoCoord = geoCoordMap[data[i].name];
            if (geoCoord) {
              if (type == 2) {
                res.push({
                  name: data[i].name,
                  value: geoCoord.concat(data[i].value),
                  username: data[i].username,
                  telphone: data[i].telphone,
                  address: data[i].address
                });
              } else {
                res.push({
                  name: data[i].name,
                  value: geoCoord.concat(data[i].value)
                });
              }
            }
          }
          //console.log(res);
          return res;
        };
        option = {
          map: 'china',
          roam: false,//是否允许缩放
          top: 80,
          zoom: 1.1, //默认显示级别
          scaleLimit: {
            min: 0,
            max: 3
          }, //缩放级别
          label: {
            normal: {
              show: true,
              textStyle: {
                color: '#fff'
              }
            },
            emphasis: {
              textStyle: {
                color: '#fff'
              }
            }
          },
          geo: {
            map: 'china',
            label: {
              show: true,
              color: '#ffffff',
              emphasis: {
                color: 'white',
                show: false
              }
            },
            zoom: 1.2,
            itemStyle: {
              normal: {
                borderColor: 'rgba(26,82,231, 1)',
                borderWidth: 1,
                areaColor: {
                  type: 'radial',
                  x: 0.5,
                  y: 0.5,
                  r: 0.8,
                  colorStops: [{
                    offset: 0,
                    color: 'rgba(14, 101, 247, .1)' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: 'rgba(125, 183, 252, .1)' // 100% 处的颜色
                  }],
                  globalCoord: false // 缺省为 false
                },
                shadowColor: 'rgba(255, 255, 255, 0)',
                shadowOffsetX: -2,
                shadowOffsetY: 2,
                shadowBlur: 10
              },
              emphasis: {
                areaColor: 'rgba(249,157,51, .)',
                borderWidth: 0
              }
            },
            //是否显示南海诸岛
            /*regions: [{
                    name: "南海诸岛",
                    value: 0,
                    itemStyle: {
                        normal: {
                            opacity: 0,
                            label: {
                                show: false
                            }
                        }
                    }
                }],*/
            tooltip: {
              show: false
            }
          },
          series: [
            //报备
            {
              type: 'effectScatter',
              coordinateSystem: 'geo',
              z: 1,
              data: [],
              symbolSize: 14,
              label: {
                normal: {
                  show: true,
                  formatter: function(params) {
                    return '{fline|客户：'+params.data.username+'  '+params.data.telphone+'}\n{tline|'+params.data.address+'}';
                  },
                  position: 'top',
                  backgroundColor: 'rgba(254,174,33,.8)',
                  padding: [0, 0],
                  borderRadius: 3,
                  lineHeight: 32,
                  color: '#f7fafb',
                  rich:{
                    fline:{
                      padding: [0, 10, 10, 10],
                      color:'#ffffff'
                    },
                    tline:{
                      padding: [10, 10, 0, 10],
                      color:'#ffffff'
                    }
                  }
                },
                emphasis: {
                  show: true
                }
              },
              itemStyle: {
                color: '#feae21',
              }
            },
            //建档
            {
              type: 'effectScatter',
              coordinateSystem: 'geo',
              z: 1,
              data: [],
              symbolSize: 14,
              label: {
                normal: {
                  show: true,
                  formatter: function(params) {
                    return '{fline|客户：'+params.data.username+'  '+params.data.telphone+'}\n{tline|'+params.data.address+'}';
                  },
                  position: 'top',
                  backgroundColor: 'rgba(233,63,66,.9)',
                  padding: [0, 0],
                  borderRadius: 3,
                  lineHeight: 32,
                  color: '#ffffff',
                  rich:{
                    fline:{
                      padding: [0, 10, 10, 10],
                      color:'#ffffff'
                    },
                    tline:{
                      padding: [10, 10, 0, 10],
                      color:'#ffffff'
                    }
                  }
                },
                emphasis: {
                  show: true
                }
              },
              itemStyle: {
                color: '#e93f42',
              }
            },
            //来访
            {
              type: 'effectScatter',
              coordinateSystem: 'geo',
              z: 1,
              data: [],
              symbolSize: 14,
              label: {
                normal: {
                  show: true,
                  formatter: function(params) {
                    return '{fline|客户：'+params.data.username+'  '+params.data.telphone+'}\n{tline|'+params.data.address+'}';
                  },
                  position: 'top',
                  backgroundColor: 'rgba(8,186,236,.9)',
                  padding: [0, 0],
                  borderRadius: 3,
                  lineHeight: 32,
                  color: '#ffffff',
                  rich:{
                    fline:{
                      padding: [0, 10, 10, 10],
                      color:'#ffffff'
                    },
                    tline:{
                      padding: [10, 10, 0, 10],
                      color:'#ffffff'
                    }
                  }
                },
                emphasis: {
                  show: true
                }
              },
              itemStyle: {
                color: '#08baec',
              }
            },
            //地图
            {
              type: 'map',
              mapType: 'china',
              geoIndex: 0,
              z: 0,
              data: convertData(chinaDatas, 1)
            }
          ]
        };
        if (option && typeof option === "object") {
          dom.setOption(option, true)
        }
        var runidx = 0;
        var timer = setInterval(()=>{
          if(runidx>=seriesjson.length){
            runidx = 0;
          }
          console.log(runidx);
          option.series[seriesjson[runidx].createType-1].data = [{
            name:'',
            username: seriesjson[runidx].customName,
            telphone: seriesjson[runidx].customTel,
            address: seriesjson[runidx].customInfo,
            value: [seriesjson[runidx].longitude, seriesjson[runidx].latitude, 300]
          }];
          dom.setOption(option, true)
          runidx++;
        },3000);
      }
    }
  }
</script>

<style lang="less">
  .charts{
    //
  }
</style>
