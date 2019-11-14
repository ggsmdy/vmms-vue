<template>
  <div ref="dom" class="charts chart-bar"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartCbar',
  props: {
    value: Object,
    text: String,
    subtext: String,
    vType: String, // vertical horizontal
    choseType: 0 // 0为订单，１为金额
  },
  methods: {
    getOption () {
      let xAxisData = Object.keys(this.value).sort((a, b) => {
        let that = this
        return that.value[a][that.choseType] - that.value[b][that.choseType]
      })
      let seriesData = []
      xAxisData.forEach(element => {
        seriesData.push(this.value[element][this.choseType])
      })
      let xAxis = {}
      let yAxis = {}
      if (this.vType === 'horizontal') {
        xAxis = {
          type: 'category',
          data: xAxisData
        }
        yAxis = {
          type: 'value'
        }
      } else {
        yAxis = {
          type: 'category',
          data: xAxisData
        }
        xAxis = {
          type: 'value'
        }
      }
      let option = {
        title: {
          text: this.text,
          subtext: this.subtext,
          x: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        toolbox: {
          right: 20,
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: xAxis,
        yAxis: yAxis,
        series: [{
          data: seriesData,
          type: 'bar'
        }]
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
