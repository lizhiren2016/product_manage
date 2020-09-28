<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>
          工厂管理
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
        @cell-click="onCellClicked"
        show-overflow-tooltip
      >
        <el-table-column prop="factoryId" label="工厂号" align="center" />
        <el-table-column prop="name" label="工厂名称" align="center" />
        <el-table-column prop="location" label="工厂位置" align="center" />
        <el-table-column prop="createdAt" label="创建时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createdAt | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteStation(scope.row)"
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
import { factorysApi } from '@/config/api'

export default {
  name: 'factory',
  components: {
    CreateOrUpdate
  },
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
      dialogType: 1, // 1：创建 0：更新
      form: {
        factoryId: '',
        name: '',
        location: ''
      },
      dialogVisible: false
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
        .get(factorysApi + `?query=${this.query}&limit=${this.pageSize}&offset=${this.pageNum - 1}`)
        .then(res => {
          const { data, message, code } = res.data
          if (code !== SUCCESS_CODE) {
            return this.$message.error(message)
          }
          if (data) {
            this.tableData = data.factorys
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
    deleteStation (rowData) {
      this.$confirm('此操作将删除当前工位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      })
        .then(() => {
          this.$axios
            .delete(factorysApi + `/${rowData.factoryId}`)
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
    handleOpenDialog (rowData) {
      if (rowData) {
        this.dialogType = 0
        this.form = {
          factoryId: rowData.factoryId,
          name: rowData.name,
          location: rowData.remark
        }
      } else {
        this.dialogType = 1
      }
      this.dialogVisible = true
    },
    handleCloseDialog () {
      this.dialogVisible = false
      this.form = {
        factoryId: '',
        name: '',
        location: ''
      }
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
    onCellClicked (row, column, cell, event) {
      if (column.property !== 'operation') {
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
