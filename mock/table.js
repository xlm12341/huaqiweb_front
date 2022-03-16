const Mock = require('mockjs')

const data = Mock.mock({
  'items|30': [{
    id: '@id',
    'code|100000-700000': 1,
    name: '@sentence(1,2)',
    'marketCapital|4000-10000.1-5': 1,
    'price|600-3000.2': 1,
    'previousClose|600-3000': 1,
    'high|2000-3000.2': 1,
    'low|500-2000': 1,
    'changePercent|1-100.1-2': 1,
    'status|1': ['untrusted', 'normal', 'verified'],
    display_time: '@date'
  }]
})

module.exports = [
  {
    url: '/vue-admin-template/table/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }
]
