<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-row>
          <el-col :span="24">
            <el-button
              type="primary"
              @click="jump"
            >登陆后台</el-button>
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
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        show-overflow-tooltip
      >
        <el-table-column prop="version" label="版本号" align="center" width="100" />
        <el-table-column prop="name" label="名称" align="center" width="300" />
        <el-table-column prop="type" label="类型" align="center" width="150">
          <template slot-scope="scope">{{ scope.row.type | typeFormat }}</template>
        </el-table-column>
        <el-table-column prop="release_version" label="发布版" align="center" width="120">
          <template slot-scope="scope">{{ scope.row.release_version | releaseFormat }}</template>
        </el-table-column>
        <el-table-column prop="node" label="简介" align="center" />
        <el-table-column prop="timestamp" label="创建时间" align="center" width="180">
          <template slot-scope="scope">{{ scope.row.timestamp | dateFormat }}</template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-link target="_blank" type="primary" :href="baseUrl + scope.row.path" :underline="false">
              <el-button size="mini" type="primary">下载</el-button>
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { API_BASE_URL, SUCCESS_CODE } from '@/config/constants'
import { productsApi } from '@/config/api'

export default {
  name: 'download-list',
  filters: {
    dateFormat (val) {
      return new Date(val).Format('yyyy-MM-dd hh:mm:ss')
    },
    typeFormat (val) {
      return val === 1
        ? '调试工具'
        : val === 2
          ? '测试工具'
          : val === 3
            ? '生产工具'
            : val === 4
              ? 'Android APK'
              : '无效类型'
    },
    releaseFormat (val) {
      return val === 1 ? 'Release' : val === 2 ? 'Debug' : ''
    }
  },
  data () {
    return {
      baseUrl: API_BASE_URL,
      loading: false,
      pageNum: 1,
      pageSize: 50,
      tableData: []
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      this.loading = true
      this.$axios
        .get(
          productsApi +
            `?limit=${this.pageSize}&offset=${
              this.pageNum - 1
            }`
        )
        .then((res) => {
          const { data, message, code } = res.data
          if (code !== SUCCESS_CODE) {
            return this.$message.error(message)
          }
          if (data) {
            this.tableData = data.products
          }
        })
        .catch((error) => {
          this.$message.error(error.message)
        })
        .finally(() => {
          this.loading = false
        })
    },
    jump () {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.table {
  width: 100%;
  font-size: 14px;
}
::v-deep .jv-container .jv-code {
  padding: 0px;
}
.el-row {
  text-align: right
}
</style>
