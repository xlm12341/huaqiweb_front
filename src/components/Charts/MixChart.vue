<template>
  <div :id="id" :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import { getChartData } from '@/api/chart'

const upColor = '#ec0000'
const upBorderColor = '#8A0000'
const downColor = '#00da3c'
const downBorderColor = '#008F28'

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
    chartType: {
      type: String,
      default: 'ssec'
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
    if (this.chartType === 'ssec') {
      this.chartTitle = 'Shanghai Stock Exchange Composite Index'
    } else if (this.chartType === 'szec') {
      this.chartTitle = 'ShenZhen Stock Exchange Composite Index'
    } else if (this.chartType === 'gei') {
      this.chartTitle = 'Growth Enterprise Index'
    }
    getChartData(this.chartType).then(response => {
      this.high = response.data.high
      this.low = response.data.low
      this.previous_close = response.data.previous_close
      const chart_data = response.data.chart_data
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
        backgroundColor: '#344b58',
        title: {
          text: this.chartTitle,
          // subtext: 'aaa',
          x: '20',
          top: '20',
          textStyle: {
            color: '#fff',
            fontSize: '22'
          },
          subtextStyle: {
            color: '#90979c',
            fontSize: '16'
          }
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
              fill: '#90979c'
            }
          }
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            textStyle: {
              color: '#fff'
            }
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          borderWidth: 0,
          top: 100,
          bottom: 95,
          textStyle: {
            color: '#fff'
          }
        },
        toolbox: {
          feature: { saveAsImage: { title: 'save as image', pixelRatio: 1, type: 'jpeg', excludeComponents: ['legend'] }}
        },
        legend: {
          x: '2%',
          top: '10%',
          textStyle: {
            color: '#90979c'
          },
          data: ['Daily-KLine', 'MA5', 'MA10', 'MA20', 'MA30']
        },
        xAxis: [{
          type: 'category',
          axisLine: {
            onZero: false,
            lineStyle: {
              color: '#90979c'
            }
          },
          boundaryGap: false,
          splitLine: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            // interval: 0,
            show: true
          },
          min: 'dataMin',
          max: 'dataMax',
          data: this.chartData.categoryData
        }],
        yAxis: [{

          scale: true,
          type: 'value',
          splitLine: {
            show: true
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 'auto'
          },
          splitArea: {
            show: false
          }
        }],
        dataZoom: [{
          show: true,
          height: 20,
          xAxisIndex: [
            0
          ],
          bottom: 20,
          start: 10,
          end: 80,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            color: '#d3dee5'

          },
          textStyle: {
            color: '#fff'
          },
          borderColor: '#90979c'

        }, {
          type: 'inside',
          show: true,
          height: 15,
          start: 10,
          end: 35
        }],
        series: [
          {
            name: 'Daily-KLine',
            type: 'candlestick',
            data: this.chartData.values,
            itemStyle: {
              color: upColor,
              color0: downColor,
              borderColor: upBorderColor,
              borderColor0: downBorderColor
            },
            markPoint: {
              label: {
                formatter: function(param) {
                  return param != null ? Math.round(param.value) + '' : ''
                }
              },
              data: [
                {
                  name: 'Mark',
                  coord: ['2013/5/31', 2300],
                  value: 2300,
                  itemStyle: {
                    color: 'rgb(41,60,85)'
                  }
                },
                {
                  name: 'highest value',
                  type: 'max',
                  valueDim: 'highest'
                },
                {
                  name: 'lowest value',
                  type: 'min',
                  valueDim: 'lowest'
                },
                {
                  name: 'average value on close',
                  type: 'average',
                  valueDim: 'close'
                }
              ],
              tooltip: {
                formatter: function(param) {
                  return param.name + '<br>' + (param.data.coord || '')
                }
              }
            },
            markLine: {
              symbol: ['none', 'none'],
              data: [
                [
                  {
                    name: 'from lowest to highest',
                    type: 'min',
                    valueDim: 'lowest',
                    symbol: 'circle',
                    symbolSize: 10,
                    label: {
                      show: false
                    },
                    emphasis: {
                      label: {
                        show: false
                      }
                    }
                  },
                  {
                    type: 'max',
                    valueDim: 'highest',
                    symbol: 'circle',
                    symbolSize: 10,
                    label: {
                      show: false
                    },
                    emphasis: {
                      label: {
                        show: false
                      }
                    }
                  }
                ],
                {
                  name: 'min line on close',
                  type: 'min',
                  valueDim: 'close'
                },
                {
                  name: 'max line on close',
                  type: 'max',
                  valueDim: 'close'
                }
              ]
            }
          },
          {
            name: 'd',
            type: 'bar',
            stack: 'total',
            itemStyle: {
              normal: {
                color: 'rgba(0,191,183,1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'top',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: []
          },
          {
            name: 'MA5',
            type: 'line',
            // stack: 'total',
            symbolSize: 5,
            symbol: 'circle',
            lineStyle: {
              opacity: 0.5
            },
            itemStyle: {
              normal: {
                color: 'rgba(252,230,48,1)',
                barBorderRadius: 0,
                label: {
                  show: false,
                  position: 'top',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            smooth: true,
            data: this.calculateMA(5)
          },
          {
            name: 'MA10',
            type: 'line',
            // stack: 'total',
            symbolSize: 5,
            symbol: 'circle',
            lineStyle: {
              opacity: 0.5
            },
            itemStyle: {
              normal: {
                color: 'rgba(0,230,130,1)',
                barBorderRadius: 0,
                label: {
                  show: false,
                  position: 'top',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            smooth: true,
            data: this.calculateMA(10)
          },
          {
            name: 'MA20',
            type: 'line',
            // stack: 'total',
            symbolSize: 5,
            symbol: 'circle',
            lineStyle: {
              opacity: 0.5
            },
            itemStyle: {
              normal: {
                color: 'rgba(0,255,255,1)',
                barBorderRadius: 0,
                label: {
                  show: false,
                  position: 'top',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            smooth: true,
            data: this.calculateMA(20)
          },
          {
            name: 'MA30',
            type: 'line',
            // stack: 'total',
            symbolSize: 5,
            symbol: 'circle',
            lineStyle: {
              opacity: 0.5
            },
            itemStyle: {
              normal: {
                color: 'rgba(118,43,226,1)',
                barBorderRadius: 0,
                label: {
                  show: false,
                  position: 'top',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            smooth: true,
            data: this.calculateMA(30)
          }

        ]
      })
    }
  }
}
</script>


