<template>
  <div id="stock_table" class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      height=600px
      highlight-current-row
      :header-cell-style="{

        'background-color': 'lightblue',

        'color': 'black',

        'border-bottom': '2px black solid'

      }"
      @row-click="handle"
    >
      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="Code">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column label="Name" width="60">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="Market Capital">
        <template slot-scope="scope">
          {{ scope.row.marketCapital }}
        </template>
      </el-table-column>
      <el-table-column label="Price">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column label="Previous Close" width="90">
        <template slot-scope="scope">
          {{ scope.row.previousClose }}
        </template>
      </el-table-column>
      <el-table-column label="High" width="60">
        <template slot-scope="scope">
          {{ scope.row.high }}
        </template>
      </el-table-column>
      <el-table-column label="Low" width="60">
        <template slot-scope="scope">
          {{ scope.row.low }}
        </template>
      </el-table-column>
      <el-table-column label="ChangePercent">
        <template slot-scope="scope">
          {{ scope.row.changePercent }}
        </template>
      </el-table-column>
      <el-table-column
        class-name="status-col"
        label="Eval"
        width="110"
        align="center"
        :filters="[{ text: 'verified', value: 'verified' }, { text: 'normal', value: 'normal' }, { text: 'untrusted', value: 'untrusted'}]"
        :filter-method="filterTag"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="IPO" width="150">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Actions" width="120">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-circle-check-outline"
            @click.stop="stockClick(scope.row)"
          >
            add to cart
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList } from '@/api/table'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        verified: 'success',
        normal: 'gray',
        untrusted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    stockClick(row) {
    },
    filterTag(value, row) {
      return row.status === value
    },
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    handle(row, event, column) {
      this.$router.push({ path: '/example/stock', query: { sid: row.code }})
    }
  }
}
</script>

<style scoped>
.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: oldlace;
  opacity: 0.7;
}

.el-table {
  background: oldlace;
}

.el-table__body tr.current-row>td{

  background-color: tomato   !important;

}

</style>
