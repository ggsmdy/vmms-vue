<template>
  <div ref="dom" class="charts chart-mline"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartMline',
  props: {
    value: Object,
    text: String,
    subtext: String,
    choseType: 0 // 0为订单，１为金额
  },
  methods: {
    getOption () {
      let xAxis = [] // 存放日期
      let legend = [] // 存放商圈
      let series = [] // 存放数据

      for (let item in this.value) {
        legend.push(item)
        if (xAxis.length === 0) {
          xAxis = Object.keys(this.value[item])
        }
        let seriesItem = {}
        seriesItem.name = item
        seriesItem.type = 'line'
        seriesItem.stack = '总量'
        seriesItem.data = []
        let itemData = Object.values(this.value[item])
        itemData.forEach(element => {
          seriesItem.data.push(element[this.choseType])
        })
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
