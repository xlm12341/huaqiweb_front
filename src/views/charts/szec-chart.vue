<template>
  <div class="chart-container2">
    <chart :chartType="type" height="100%" width="100%" />
  </div>
</template>

<script>
import Chart from '@/components/Charts/MixChart'

export default {
  name: 'szecChart',
  components: { Chart },
  data() {
    return {
      type: 'szec'
    }
  }
}
</script>

<style scoped>
.chart-container2 {
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>

