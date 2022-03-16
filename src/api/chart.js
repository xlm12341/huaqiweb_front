import request from '@/utils/request'

export function getChartData(type) {
  return request({
    url: '/chartData',
    methods: 'get',
    params: { type }
  })
}

export function getStock(sid) {
  return request({
    url: '/example/stock',
    methods: 'get',
    params: { sid }
  })
}
