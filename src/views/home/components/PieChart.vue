<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>

  export default {
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '300px'
      }
    },
    data() {
      return {
        chart: null
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.initChart()
      })
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$el, 'light')

        this.chart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            left: 'center',
            bottom: '10',
            data: ['海珠区', '越秀区', '白云区', '天河区', '番禺区']
          },
          series: [
            {
              name: '房源数',
              type: 'pie', // 饼状图
              roseType: 'radius',
              radius: [15, 95],
              center: ['50%', '38%'],
              data: [
                { value: 320, name: '海珠区' },
                { value: 240, name: '越秀区' },
                { value: 149, name: '白云区' },
                { value: 100, name: '天河区' },
                { value: 59, name: '番禺区' }
              ],
              animationEasing: 'cubicInOut',
              animationDuration: 2600
            }
          ]
        })
      }
    }
  }
</script>
