<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>
          用户列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-row>
          <el-col :span="12">
            <refresh-button :loading="loading" @click="getData" />
            <el-button type="primary" @click="handleOpenDialog()" class="mr10">新增</el-button>
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
        @cell-click="onCellClicked"
        show-overflow-tooltip
      >
        <el-table-column prop="account" label="账号" align="center" />
        <el-table-column prop="name" label="姓名" align="center" />
        <el-table-column prop="state" label="账号状态" align="center">
          <template slot-scope="scope">
            {{
            scope.row.state | stateFormat(that)
            }}
          </template>
        </el-table-column>
        <el-table-column prop="timestamp" label="创建时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.timestamp | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button
              :type="scope.row.state === 0 ? 'info' : 'success'"
              size="mini"
              icon="el-icon-coordinate"
              @click="activateUser(scope.row)"
            >{{scope.row.state === 0 ? '禁用' : '激活'}}</el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteUser(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <create-or-update
      @close="handleCloseDialog"
      @refresh="getData"
      :visible="dialogVisible"
      :type="dialogType"
      :formData="form"
    />
  </div>
</template>

<script>
import CreateOrUpdate from './CreateOrUpdate'
import { SUCCESS_CODE } from '@/config/constants'
import { usersApi } from '@/config/api'

export default {
  name: 'users',
  components: {
    CreateOrUpdate
  },
  filters: {
    dateFormat (val) {
      return new Date(val).Format('yyyy-MM-dd hh:mm:ss')
    },
    stateFormat (val, that) {
      return val === 0 ? '正常' : val === 1 ? '待激活' : val === 2 ? '被禁用' : '异常'
    }
  },
  data () {
    return {
      that: this,
      loading: false,
      pageNum: 1,
      pageSize: 20,
      query: '',
      tableData: [],
      tableDataCount: 0,
      dialogType: 1, // 1：创建 0：更新
      form: {
        account: '',
        password: '',
        name: '',
        phone: '',
        country: '',
        city: '',
        address: ''
      },
      dialogVisible: false
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
        .get(usersApi + `?query=${this.query}&limit=${this.pageSize}&offset=${this.pageNum - 1}`)
        .then(res => {
          const { data, message, code } = res.data
          if (code !== SUCCESS_CODE) {
            return this.$message.error(message)
          }
          if (data) {
            this.tableData = data.users
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
    // 账号激活
    activateUser (rowData) {
      const { state, account } = rowData
      this.$confirm(state === 1 ? '此操作将激活当前用户, 是否继续?' : '此操作将禁用当前用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      })
        .then(() => {
          this.$axios
            .patch(usersApi, { account, state: state === 0 ? 2 : 0 })
            .then(res => {
              const { code, message } = res.data
              if (code !== SUCCESS_CODE) {
                return this.$message.error(message)
              }
              this.$message.success(message)
              this.getData()
            })
            .catch(err => {
              this.$message.error(err.message)
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
    },
    handleOpenDialog (rowData) {
      if (rowData) {
        this.form = rowData
      }
      this.dialogVisible = true
    },
    handleCloseDialog () {
      this.dialogType = 1
      this.dialogVisible = false
    },
    deleteUser (rowData) {
      this.$confirm('此操作将删除当前用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      })
        .then(() => {
          const { account } = rowData
          this.$axios
            .delete(usersApi, { data: { account } })
            .then(res => {
              const { code, message } = res.data
              if (code !== SUCCESS_CODE) {
                return this.$message.error(message)
              }
              this.$message.success(message)
              this.getData()
            })
            .catch(err => {
              this.$message.error(err.message)
            })
        })
        .catch(() => {
          this.$message.info('已取消')
        })
    },
    onCellClicked (row, column, cell, event) {
      if (column.property !== 'operation') {
        this.dialogType = 0
        return this.handleOpenDialog(row)
      }
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
