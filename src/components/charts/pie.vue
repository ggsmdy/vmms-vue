<template>
  <div ref="dom" class="charts chart-pie"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartPie',
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
      let legend = this.value.map(_ => _.name)
      let option = {
        title: {
          text: this.text,
          subtext: this.subtext,
          x: 'center'
        },
        toolbox: {
          right: 20,
          feature: {
            saveAsImage: {}
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          // orient: 'vertical',
          left: 'center',
          data: legend
        },
        series: [
          {
            type: 'pie',
            radius: '55%',
            name: '饼图',
            center: ['50%', '45%'],
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
