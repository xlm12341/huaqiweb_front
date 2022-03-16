<template>
  <div :id="id" :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import { getStock } from '@/api/chart'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    code: {
      type: String,
      default: '000000'
    },
    name: {
      type: String,
      default: 'default'
    }
  },

  data() {
    return {
      chart: null,
      chartData: {
        categoryData: [],
        values: []
      },
      chartTitle: '',
      high: null,
      low: null,
      previous_close: null
    }
  },
  mounted() {
    this.chartTitle = ''
    const sid = this.$route.query.sid
    getStock(sid).then(response => {
      const chart_data = response.data.chart_data
      this.code = response.data.code
      this.name = response.data.name
      this.high = response.data.high
      this.low = response.data.low
      this.previous_close = response.data.previous_close
      for (var i = 0; i < chart_data.length; i++) {
        this.chartData.categoryData.push(chart_data[i].splice(0, 1)[0])
        this.chartData.values.push(chart_data[i])
      }
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
    splitData(rawData) {
      const categoryData = []
      const values = []
      for (let i = 0; i < rawData.length; i++) {
        categoryData.push(rawData[i].splice(0, 1)[0])
        values.push(rawData[i])
      }
      return {
        categoryData: categoryData,
        values: values
      }
    },
    calculateMA(dayCount) {
      var result = []
      for (var i = 0, len = this.chartData.values.length; i < len; i++) {
        if (i < dayCount) {
          result.push('-')
          continue
        }
        var sum = 0
        for (var j = 0; j < dayCount; j++) {
          sum += +this.chartData.values[i - j][1]
        }
        result.push(sum / dayCount)
      }
      return result
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      //  month
      // const xData = (function() {
      //   const data = []
      //   for (let i = 1; i < 13; i++) {
      //     data.push(i + 'month')
      //   }
      //   return data
      // }())
      // full test data
      // setOption

      this.chart.setOption({
        title: {
          text: this.name + ' ' + this.code,
          left: 20,
          top: 20
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['Daily-K', 'MA5', 'MA10', 'MA20', 'MA30']
        },
        graphic: [
          {
            type: 'text',

            enterFrom: {
              style: { opacity: 0 }
            },
            style: {
              x: 600,
              y: 35,
              text: 'high: ' + this.high + ' low: ' + this.low + ' previous close: ' + this.previous_close,
              font: '18px Microsoft YaHei',
              fill: 'black'
            }
          }
        ],
        grid: {
          left: '10%',
          right: '10%',
          bottom: '15%'
        },
        xAxis: {
          type: 'category',
          data: this.chartData.categoryData,
          scale: true,
          boundaryGap: false,
          axisLine: {
            onZero: false
          },
          splitLine: {
            show: false
          },
          splitNumber: 20,
          min: 'dataMin',
          max: 'dataMax'
        },
        yAxis: {
          scale: true,
          splitArea: {
            show: true
          }
        },
        dataZoom: [{
          type: 'inside',
          start: 50,
          end: 100
        }, {
          show: true,
          type: 'slider',
          y: '90%',
          start: 50,
          end: 100
        }],
        series: [{
          name: 'Daily-K',
          type: 'candlestick',
          data: this.chartData.values,
          markPoint: {
            label: {
              normal: {
                formatter: function(param) {
                  return param != null ? Math.round(param.value) : ''
                }
              }
            },
            data: [{
              name: 'Mark',
              coord: ['2013/5/31', 2300],
              value: 2300,
              itemStyle: {
                normal: {
                  color: 'rgb(41,60,85)'
                }
              }
            }, {
              name: 'highest value',
              type: 'max',
              valueDim: 'highest'
            }, {
              name: 'lowest value',
              type: 'min',
              valueDim: 'lowest'
            }, {
              name: 'average value on close',
              type: 'average',
              valueDim: 'close'
            }],
            tooltip: {
              formatter: function(param) {
                return param.name + '<br>' + (param.data.coord || '')
              }
            }
          },
          markLine: {
            symbol: ['none', 'none'],
            data: [
              [{
                name: 'from lowest to highest',
                type: 'min',
                valueDim: 'lowest',
                symbol: 'circle',
                symbolSize: 10,
                label: {
                  normal: {
                    show: false
                  },
                  emphasis: {
                    show: false
                  }
                }
              }, {
                type: 'max',
                valueDim: 'highest',
                symbol: 'circle',
                symbolSize: 10,
                label: {
                  normal: {
                    show: false
                  },
                  emphasis: {
                    show: false
                  }
                }
              }], {
                name: 'min line on close',
                type: 'min',
                valueDim: 'close'
              }, {
                name: 'max line on close',
                type: 'max',
                valueDim: 'close'
              }
            ]
          }
        }, {
          name: 'MA5',
          type: 'line',
          data: this.calculateMA(5),
          smooth: true,
          lineStyle: {
            normal: {
              opacity: 0.5
            }
          }
        }, {
          name: 'MA10',
          type: 'line',
          data: this.calculateMA(10),
          smooth: true,
          lineStyle: {
            normal: {
              opacity: 0.5
            }
          }
        }, {
          name: 'MA20',
          type: 'line',
          data: this.calculateMA(20),
          smooth: true,
          lineStyle: {
            normal: {
              opacity: 0.5
            }
          }
        }, {
          name: 'MA30',
          type: 'line',
          data: this.calculateMA(30),
          smooth: true,
          lineStyle: {
            normal: {
              opacity: 0.5
            }
          }
        }
        ]
      })
    }
  }
}
</script>
