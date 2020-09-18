<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>
          产品列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-row>
          <el-col :span="12">
            <refresh-button :loading="loading" @click="getData" />
            <el-button
              icon="el-icon-download"
              type="primary"
              @click="exportExcel"
              class="mr10"
            >导出Excel</el-button>
            <el-select
              class="mr10"
              v-model="productId"
              filterable
              placeholder="请选择"
              @change="handleChangeSelect"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <search-input @enter="handleEnter" />
          </el-col>
          <el-col :span="12">
            <pagination
              @sizeChange="handleSizeChange"
              @currentChange="handleCurrentChange"
              :currentPage="pageNum"
              :pageSize="pageSize"
              :total="tableDataCount"
              :disabled="loading"
            />
          </el-col>
        </el-row>
      </div>

      <el-table
        :data="data"
        stripe
        border
        fit
        highlight-current-row
        class="table"
        style="width: 100%"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        show-overflow-tooltip
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column prop="sn" label="sn" align="center" />
        <el-table-column prop="app_version" label="app_version" align="center" />
        <el-table-column prop="pd_app" label="pd_app" align="center" />
        <el-table-column prop="inv_app" label="inv_app" align="center" />
        <el-table-column prop="bms_m_app" label="bms_m_app" align="center" />
        <el-table-column prop="bms_s_app" label="bms_s_app" align="center" />
        <el-table-column prop="cpuid" label="cpuid" align="center" width="300" />
        <el-table-column prop="timestamp" label="timestamp" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.timestamp | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteProduct(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { SUCCESS_CODE } from '@/config/constants'
import { productsApi } from '@/config/api'

export default {
  name: 'products',
  filters: {
    dateFormat (val) {
      return new Date(val).Format('yyyy-MM-dd hh:mm:ss')
    }
  },
  data () {
    return {
      loading: false,
      pageNum: 1,
      pageSize: 20,
      query: '',
      tableData: [],
      tableDataCount: 0,
      multipleSelection: [],
      productId: 5,
      options: [
        {
          value: 5,
          label: 'R600_MAX'
        },
        {
          value: 7,
          label: 'R600_PRO'
        },
        {
          value: 8,
          label: 'R600_PRO_1500'
        },
        {
          value: 9,
          label: 'R600_PRO_KIT'
        },
        {
          value: 12,
          label: 'RIVER600_PRO_18650'
        },
        {
          value: 13,
          label: 'Delta_PRO'
        },
      ]
    }
  },
  mounted () {
    this.getData()
  },
  computed: {
    data () {
      return this.tableData
    }
  },
  methods: {
    // 搜索
    handleEnter (val) {
      this.query = val
      this.getData()
    },
    getData () {
      this.loading = true
      this.$axios
        .get(
          productsApi +
            `?query=${this.query}&limit=${this.pageSize}&offset=${
              this.pageNum - 1
            }&product=${this.productId}`
        )
        .then((res) => {
          const { data, message, code } = res.data
          if (code !== SUCCESS_CODE) {
            return this.$message.error(message)
          }
          if (data) {
            this.tableData = data.products
            this.tableDataCount = data.total
          }
        })
        .catch((error) => {
          this.$message.error(error.message)
        })
        .finally(() => {
          this.loading = false
        })
    },
    deleteProduct (rowData) {
      this.$prompt(
        '请输入操作密码：ecoflow，批量更新默认自动升级最新版本',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValidator: (val) => {
            if (val === 'ecoflow') {
              return true
            }
            return false
          },
          inputErrorMessage: '操作密码错误'
        }
      )
        .then(({ value }) => {
          const { sn } = rowData
          this.$axios
            .delete(productsApi, { data: { sn } })
            .then((res) => {
              const { code, message } = res.data
              if (code !== SUCCESS_CODE) {
                return this.$message.error(message)
              }
              this.$message.success(message)
              this.getData()
            })
            .catch((err) => {
              this.$message.error(err.message)
            })
        })
        .catch(() => {
          this.$message('取消输入')
        })
    },
    // 导出的方法
    exportExcel () {
      require.ensure([], () => {
        const { exportJsonToExcel } = require('../../vendor/Export2Excel')
        const tHeader = [
          'sn',
          'app_version',
          'pd_app',
          'inv_app',
          'bms_m_app',
          'bms_s_app',
          'cpuid',
          'timestamp'
        ]
        // 上面设置Excel的表格第一行的标题
        const filterVal = tHeader
        // 上面的是对象的属性
        const list = this.multipleSelection // 把data里的tableData存到list
        const data = this.formatJson(filterVal, list)
        exportJsonToExcel(tHeader, data, '产品列表')
      })
    },
    handleChangeSelect (val) {
      this.productId = val
      this.getData()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]))
    },
    handleSizeChange (val) {
      this.pageNum = 1
      this.pageSize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.getData()
    }
  }
}
</script>

<style scoped>
.table {
  width: 100%;
  font-size: 14px;
}
.mr10 {
  margin-right: 10px;
}
.handle-input {
  width: 150px;
  display: inline-block;
}
::v-deep .jv-container .jv-code {
  padding: 0px;
}
.margin-left {
  margin-left: 10px;
}
</style>
