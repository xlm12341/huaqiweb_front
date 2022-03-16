<template>
  <div>
    <el-tabs
      v-model="editableTabsValue"
      type="card"
      editable
      style="margin-left: 10px; width: 95%"
      @edit="handleTabsEdit"
    >
      <el-tab-pane
        v-for="(item,index) in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        <span slot="label"><i class="el-icon-folder" />{{ ' ' + item.title }}</span>
        <el-table
          border
          height="300"
          :data="item.comboData"
          class="table"
          stripe
        >
          <el-table-column prop="code" label="Stock code" />
          <el-table-column prop="name" label="Stock name" />
          <el-table-column prop="price" label="Stock price" />
          <el-table-column label="action" align="center">
            <template slot="header" slot-scope="scope">
              <el-input
                v-model="stock_code"
                style="width: 150px; margin-right: 10px"
                size="mini"
                placeholder="input stock code"
                type="number"
                @blur="inputCheck()"
              />
              <el-button class="el-icon-plus" type="primary" size="mini" @click.prevent="addStock(index)" />
            </template>
            <template slot-scope="scope">
              <i
                class="el-icon-delete"
                style="font-size:18px;cursor: pointer;"
                @click="handleDelete(scope.$index, scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
export default {
  data() {
    return {
      stock_code: '',
      editableTabsValue: '1',
      currentIndex: 1,
      addIndex: 1,
      editableTabs: [{
        title: 'Combo1',
        name: '1',
        comboData: []
      }],
      tabIndex: 1
    }
  },
  mounted() {
    const combo1 =
      {
        code: '111111',
        name: 'xxxxx',
        price: '123.456'
      }
    const combo2 = {
      code: '222222',
      name: 'yyy',
      price: '123.456'
    }
    const combo3 = {
      code: '333333',
      name: 'zz',
      price: '123.456'
    }
    this.editableTabs[0].comboData.push(combo1)
    this.editableTabs[0].comboData.push(combo2)
    this.editableTabs[0].comboData.push(combo3)
    console.log(this.editableTabs)
  },
  methods: {
    inputCheck() {
      if (this.stock_code.length !== 6) {
        this.$message({
          type: 'error',
          message: 'stock code length should be 6'
        })
        return false
      } else {
        return true
      }
    },
    addStock(index) {
      if (this.stock_code.length !== 6) {
        return
      }
      const stockRow = {
        code: this.stock_code,
        name: 'xxxxxx',
        price: '' + 100 + Math.round(Math.random() * 1000)
      }
      this.editableTabs[index].comboData.push(stockRow)
      this.stock_code = ''
    },
    handleDelete(index, row) {
      this.$confirm('sure to delete this stock?', 'tips', {
        confirmButtonText: 'confirm',
        cancelButtonText: 'cancel',
        type: 'warning'
      }).then(() => {
        this.editableTabs[index].comboData.splice(index, 1)
        this.$message({
          type: 'success',
          message: 'delete successfully!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'cancel delete'
        })
      })
    },
    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        // if (this.tabIndex > 9) {
        //   this.$message({
        //     type: 'warning',
        //     message: 'too many combos !'
        //   })
        //   return
        // }
        const newTabIndex = ++this.tabIndex + ''
        this.editableTabs.push(
          {
            title: 'Combo' + ++this.addIndex,
            name: newTabIndex,
            comboData: []
          })
        this.editableTabsValue = newTabIndex
        this.currentIndex = newTabIndex
        console.table(this.editableTabs.comboData)
      }
      if (action === 'remove') {
        if (this.editableTabs.length <= 1) {
          return false
        }
        const self = this
        const tabs = self.editableTabs
        let activeName = self.editableTabsValue
        console.log('a:' + activeName)
        if (activeName === targetName) {
          console.log('aaa')
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              const nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.name
              }
            }
          })
        }
        self.editableTabsValue = activeName
        self.editableTabs = tabs.filter(tab => tab.name !== targetName)
        self.editableTabs.map((tab, index) => {
          tab.title = 'Comb' + (index + 1)
          self.addIndex = (index + 1)
        })
        self.currentIndex = self.editableTabsValue
        self.editableTabs.map((tab, index) => {
          console.log(tab, index, self.currentIndex)
          if (self.currentIndex === tab.name) {
            self.currentFlag = index
          }
        })
        console.log(targetName)
        // this.comboData.splice(targetName - 1, 1)
        self.$message({
          type: 'success',
          message: 'delete successfully !'
        })
        // const tabs = this.editableTabs
        // let activeName = this.editableTabsValue
        // if (activeName === targetName) {
        //   tabs.forEach((tab, index) => {
        //     if (tab.name === targetName) {
        //       const nextTab = tabs[index + 1] || tabs[index - 1]
        //       if (nextTab) {
        //         activeName = nextTab.name
        //       }
        //     }
        //   })
        // }
        //
        // this.editableTabsValue = activeName
        // this.editableTabs = tabs.filter(tab => tab.name !== targetName)
      }
    }
  }
}
</script>

