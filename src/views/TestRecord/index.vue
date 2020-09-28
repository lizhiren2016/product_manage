<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>
          测试记录列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-row>
          <el-col :span="12">
            <refresh-button :loading="loading" @click="getData" />
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
        :data="tableData"
        stripe
        border
        fit
        highlight-current-row
        class="table"
        style="width: 100%"
        max-height="250"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        show-overflow-tooltip
      >
        <el-table-column prop="sn" label="SN" align="center" width="200" />
        <el-table-column prop="operator" label="操作员" align="center" width="70" />
        <el-table-column prop="factory" label="工厂位置" align="center" width="80" />
        <el-table-column prop="hw_version" label="硬件版本" align="center" />
        <el-table-column prop="sw_version" label="软件版本" align="center" />
        <el-table-column prop="teststatus" label="测试状态" align="center" width="80" />
        <el-table-column prop="content" label="测试过程数据" align="center" width="300">
          <template slot-scope="scope">
            {{scope.row.content && JSON.stringify(scope.row.content)}}
          </template>
        </el-table-column>
        <el-table-column prop="logs" label="测试过程日志" align="center" width="300">
          <template slot-scope="scope">
            {{scope.row.logs && JSON.stringify(scope.row.logs)}}
          </template>
        </el-table-column>
        <el-table-column prop="env" label="测试环境信息" align="center" width="300">
          <template slot-scope="scope">
            {{scope.row.env && JSON.stringify(scope.row.env)}}
          </template>
        </el-table-column>
        <el-table-column prop="start" label="开始测试时间" align="center" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.start | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="finish" label="结束测试时间" align="center" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.finish | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteTestRecord(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { SUCCESS_CODE } from '@/config/constants'
import { testRecordsApi } from '@/config/api'

export default {
  name: 'test-record',
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
      tableDataCount: 0
    }
  },
  mounted () {
    this.getData()
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
        .get(testRecordsApi + `?query=${this.query}&limit=${this.pageSize}&offset=${this.pageNum - 1}`)
        .then(res => {
          const { data, message, code } = res.data
          if (code !== SUCCESS_CODE) {
            return this.$message.error(message)
          }
          if (data) {
            this.tableData = data.records
            this.tableDataCount = data.total
          }
        })
        .catch(error => {
          this.$message.error(error.message)
        })
        .finally(() => {
          this.loading = false
        })
    },
    deleteTestRecord (rowData) {
      this.$confirm('此操作将删除当前记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      })
        .then(() => {
          this.$axios
            .delete(testRecordsApi + `/${rowData._id}`)
            .then(res => {
              const { message, code } = res.data
              if (code !== SUCCESS_CODE) {
                return this.$message.error(message)
              }
              this.$message.success(message)
              this.getData()
            })
            .catch(error => {
              this.$message.error(error.message)
            })
        })
        .catch(() => {
          this.$message.info('已取消')
        })
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
  width: 200px;
  display: inline-block;
}
::v-deep .jv-container .jv-code {
  padding: 0px;
}
.margin-left {
  margin-left: 10px;
}
</style>
