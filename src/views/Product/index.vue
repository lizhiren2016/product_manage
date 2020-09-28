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
              type="primary"
              class="mr10"
              @click="handleDialog"
            >新增</el-button>
            <el-select
              class="mr10"
              v-model="typeId"
              filterable
              placeholder="产品类型"
              @change="(val)=>handleChangeSelect(val, 'type')"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-select
              class="mr10"
              v-model="releaseId"
              filterable
              placeholder="发布版本"
              @change="(val)=>handleChangeSelect(val, 'release')"
            >
              <el-option
                v-for="item in releaseOptions"
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
        :data="tableData"
        stripe
        border
        fit
        highlight-current-row
        class="table"
        style="width: 100%"
        :cell-style="cellStyle"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        show-overflow-tooltip
      >
        <el-table-column prop="version" label="版本号" align="center" width="100" />
        <el-table-column prop="name" label="名称" align="center" width="300" />
        <el-table-column prop="type" label="类型" align="center" width="150">
          <template slot-scope="scope">
            {{ scope.row.type | typeFormat }}
          </template>
        </el-table-column>
        <el-table-column prop="release_version" label="发布版" align="center" width="120">
          <template slot-scope="scope">
            {{ scope.row.release_version | releaseFormat }}
          </template>
        </el-table-column>
        <el-table-column prop="node" label="简介" align="center" />
        <el-table-column prop="timestamp" label="创建时间" align="center" width="180">
          <template slot-scope="scope">
            {{ scope.row.timestamp | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" align="center" width="250">
          <template slot-scope="scope">
             <el-button
              :type="scope.row.status ? 'info' : 'success'"
              size="mini"
              icon="el-icon-position"
              @click="enableProduct(scope.row)"
            >{{scope.row.status | statusFormat(that)}}</el-button>
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

    <create
      @close="handleDialog"
      @refresh="getData"
      :visible="dialogVisible"
    />

  </div>
</template>

<script>
import Create from './Create'
import { SUCCESS_CODE } from '@/config/constants'
import { productsApi } from '@/config/api'

export default {
  name: 'products',
  components: {
    Create
  },
  filters: {
    dateFormat (val) {
      return new Date(val).Format('yyyy-MM-dd hh:mm:ss')
    },
    typeFormat (val) {
      return val === 1 ? '调试工具' : val === 2 ? '测试工具' : val === 3 ? '生产工具' : val === 4 ? 'Android APK' : '无效类型'
    },
    releaseFormat (val) {
      return val === 1 ? 'Release' : val === 2 ? 'Debug' : ''
    },
    statusFormat (val, that) {
      return val ? '禁用' : '启用'
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
      typeId: 0,
      releaseId: 0,
      typeOptions: [
        {
          value: 0,
          label: '请选择分类'
        },
        {
          value: 1,
          label: '调试工具'
        },
        {
          value: 2,
          label: '测试工具'
        },
        {
          value: 3,
          label: '生产工具'
        },
        {
          value: 4,
          label: 'Android APK'
        }
      ],
      releaseOptions: [
        {
          value: 0,
          label: '请选择版本'
        },
        {
          value: 1,
          label: 'Release'
        },
        {
          value: 2,
          label: 'Debug'
        }
      ],
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
        .get(
          productsApi +
            `?query=${this.query}&limit=${this.pageSize}&offset=${
              this.pageNum - 1
            }&type=${this.typeId}&release=${this.releaseId}`
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
    // 启用/禁用
    enableProduct (row) {
      this.$confirm(row.status ? '此操作将执行禁用, 是否继续?' : '此操作将执行启用, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      })
        .then(() => {
          this.$axios
            .patch(productsApi + '/enableProduct', {
              id: row.id,
              status: row.status ? 0 : 1
            })
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
          this.$message.info(this.$t('1073'))
        })
    },
    deleteProduct (rowData) {
      this.$prompt(
        '请输入操作密码：ecoflow，该操作将执行删除',
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
          this.$axios
            .delete(productsApi + `/${rowData.id}`)
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
    handleChangeSelect (val, fileds) {
      if (fileds === 'type') {
        this.typeId = val
      } else {
        this.releaseId = val
      }
      this.getData()
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
    handleDialog () {
      this.dialogVisible = !this.dialogVisible
    },
    cellStyle ({ row, column, rowIndex, columnIndex }) {
      if (!row.status) {
        return 'font-weight:bold;cursor:pointer;color:#C0C0C0'
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
.el-select {
  width: 150px;
}
</style>
