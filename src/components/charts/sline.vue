<template>
  <div ref="dom" class="charts chart-mline"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartSline',
  props: {
    value: Object,
    text: String,
    subtext: String
  },
  methods: {
    getOption () {
      let xAxis = this.value.date // 存放日期
      let legend = this.value.mType // 存放类型
      let series = [] // 存放数据

      for (let item in this.value.data) {
        let seriesItem = {}
        seriesItem.name = this.value.mType[item]
        seriesItem.type = 'line'
        seriesItem.stack = '总量'
        seriesItem.data = this.value.data[item]
        series.push(seriesItem)
      }
      let option = {
        title: {
          text: this.text
        },
        tooltip: {
          trigger: 'axis'
        },
        toolbox: {
          right: 20,
          feature: {
            saveAsImage: {}
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
        yAxis: {
          type: 'value'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxis
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
