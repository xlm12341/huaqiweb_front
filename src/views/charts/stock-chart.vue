<template>
  <div class="chart-container">
    <chart :code="code" :name="name" height="100%" width="100%" />
  </div>
</template>

<script>
import Chart from '@/components/Charts/StockChart'

export default {
  name: 'StockChart',
  components: { Chart },
  data() {
    return {
      code: '000000',
      name: ' '
    }
  }
}
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>

