<template>
  <div ref="dom" class="charts chart-mbar"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartMbar',
  props: {
    value: Object,
    text: String,
    subtext: String
  },
  methods: {
    getOption () {
      let yAxis = [] // 存放日期
      let legend = [] // 存放商圈
      let series = [] // 存放数据

      for (let item in this.value) {
        legend.push(item)
        if (yAxis.length === 0) {
          yAxis = Object.keys(this.value[item])
        }
        let seriesItem = {}
        seriesItem.name = item
        seriesItem.type = 'bar'
        seriesItem.stack = '总量'
        seriesItem.label = {
          normal: {
            show: true,
            position: 'insideRight'
          }
        }
        seriesItem.data = []
        let itemData = Object.values(this.value[item])
        itemData.forEach(element => {
          seriesItem.data.push(element[0])
        })
        series.push(seriesItem)
      }
      let option = {
        title: {
          text: this.text
        },
        toolbox: {
          right: 20,
          feature: {
            saveAsImage: {}
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: legend
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: yAxis
        },
        series: series
      }
      return option
    }
  },
  mounted () {
    this.$nextTick(() => {
      let option = this.getOption()
      let dom = echarts.init(this.$refs.dom, 'tdTheme')
      dom.setOption(option)
      on(window, 'resize', dom.resize)
    })
  },
  watch: {
    value: function (val) {
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
