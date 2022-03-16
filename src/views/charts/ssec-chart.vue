<template>
  <div class="chart-container">
    <chart :chartType="type" height="100%" width="100%" />
  </div>
</template>

<script>
import Chart from '@/components/Charts/MixChart'

export default {
  name: 'SSECChart',
  components: { Chart },
  data() {
    return {
      type: 'ssec'
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

