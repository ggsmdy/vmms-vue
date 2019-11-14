<template>
  <div ref="dom" class="charts chart-line"></div>
</template>

<script>
  import echarts from 'echarts'
  import tdTheme from './theme.json'
  import { on, off } from '@/libs/tools'
  echarts.registerTheme('tdTheme', tdTheme)
  export default {
    name: 'ChartDisline',
    props: {
      value: Object,
      text: String,
      subtext: String,
      choseType: String // 数值选择
    },
    methods: {
      getOption () {
        let xAxisData = Object.keys(this.value)
        let seriesData = []
        xAxisData.forEach(item => {
          if (this.value[item].length) {
            seriesData.push(this.value[item][Number(this.choseType)])
          } else {
            seriesData.push(this.value[item])
          }
        })
        let option = {
          title: {
            text: this.text,
            subtext: this.subtext,
            x: 'center'
          },
          tooltip: {
            trigger: 'axis',
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxisData,
            splitLine: {
              show:false
            }
          },
          yAxis: {
            type: 'value',
            splitLine: {
              show:false
            }
          },
          series: [{
            data: seriesData,
            type: 'line'
          }]
        }
        /*let option={
          title: {
            text: this.text,
            subtext: this.subtext,
            x: 'center'
          },
          color: ['#3398DB'],
          tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis : [
            {
              type : 'category',
              data : xAxisData,
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis : [
            {
              type : 'value'
            }
          ],
          series : [
            {
              type:'bar',
              barWidth: '60%',
              data:seriesData
            }
          ]
        }*/
        return option
      }
    },
    mounted () {
      let _=this
      this.$nextTick(() => {
        let option = this.getOption()
        let dom = echarts.init(this.$refs.dom, 'tdTheme')
        dom.setOption(option)
        dom.on('click', function (params) {
          _.$emit('on-click-kw',"name",params.name)
        })
        on(window, 'resize', dom.resize)
      })

    },
    watch: {
      value: function (val) {
        let option = this.getOption()
        let dom = echarts.getInstanceByDom(this.$refs.dom)
        dom.setOption(option)
      },
      choseType: function (val) {
        let option = this.getOption()
        let dom = echarts.getInstanceByDom(this.$refs.dom)
        dom.setOption(option)
      }
    },
    beforeDestroy () {
      let dom = echarts.getInstanceByDom(this.$refs.dom)
      off(window, 'resize', dom.resize)
    }
  }
</script>

<style lang="less">
  .charts{
    //
  }
</style>
