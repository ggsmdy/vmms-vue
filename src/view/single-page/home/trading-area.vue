<template>
    <div ref="dom"></div>
</template>

<script>
import echarts from 'echarts'
import { on, off } from '@/libs/tools'
export default {
  name: 'TradingArea',
  data () {
    return {
      dom: null,
      series: {}
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    }
  },
  mounted () {
    setTimeout(() => {
      this.series = [
        {
          name: '商圈一',
          type: 'line',
          stack: '总量',
          areaStyle: {normal: {
            color: '#2d8cf0'
          }},
          data: [220, 225, 125, 245, 169, 268, 472]
        },
        {
          name: '商圈二',
          type: 'line',
          stack: '总量',
          areaStyle: {normal: {
            color: '#10A6FF'
          }},
          data: [257, 358, 278, 234, 290, 330, 310]
        },
        {
          name: '商圈三',
          type: 'line',
          stack: '总量',
          areaStyle: {normal: {
            color: '#0C17A6'
          }},
          data: [379, 268, 354, 269, 310, 478, 358]
        },
        {
          name: '商圈四',
          type: 'line',
          stack: '总量',
          areaStyle: {normal: {
            color: '#4608A6'
          }},
          data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
          name: '商圈五',
          type: 'line',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
          areaStyle: {normal: {
            color: '#398DBF'
          }},
          data: [820, 645, 546, 745, 872, 624, 258]
        }
      ]
      const option = {
        title: {
          text: '商圈统计',
          textStyle: {
            color: '#516B91'
          },
          left: '48%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          top: '10%',
          left: '1.2%',
          right: '1%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: this.series
      }
      this.$nextTick(() => {
        this.dom = echarts.init(this.$refs.dom)
        this.dom.setOption(option)
        on(window, 'resize', this.resize)
      })
    }, 2000)
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
