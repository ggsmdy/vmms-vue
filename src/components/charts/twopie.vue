<template>
  <div ref="dom" class="charts chart-pie"></div>
</template>

<script>
  import echarts from 'echarts'
  import tdTheme from './theme.json'
  import { on, off } from '@/libs/tools'
  echarts.registerTheme('tdTheme', tdTheme)
  export default {
    name: 'ChartTwopie',
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
          tooltip: {
            trigger: 'item',
            formatter: "{b}: {c} ({d}%)"
          },
          series: [
            {
              name:this.itemName,
              type:'pie',
              selectedMode: 'single',
              radius: [0, '30%'],

              label: {
                normal: {
                  position: 'inner'
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data:this.value
            },
            {
              name:this.itemName,
              type:'pie',
              radius: ['40%', '55%'],
              labelLine: {
                normal: {
                  show: false
                }
              },
              data:this.value
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
          tooltip: {
            trigger: 'item',
            formatter: "{b}: {c} ({d}%)"
          },
          series: [
            {
              name:this.itemName,
              type:'pie',
              selectedMode: 'single',
              radius: [0, '30%'],

              label: {
                normal: {
                  position: 'inner'
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data:this.value
            },
            {
              name:this.itemName,
              type:'pie',
              radius: ['40%', '55%'],
              labelLine: {
                normal: {
                  show: false
                }
              },
              data:this.value
            }
          ]
        }
        let dom = echarts.init(this.$refs.dom, 'tdTheme')
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
