<template>
  <el-pagination
    style="float:right;"
    background
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page.sync="pageIndex"
    :page-sizes="pageSizes"
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
    :disabled="disabled"
  ></el-pagination>
</template>

<script>
export default {
  name: 'pagination',
  props: {
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default: function () {
        return [10, 20, 50, 100]
      }
    },
    total: {
      type: Number
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      pageIndex: this.currentPage
    }
  },
  methods: {
    handleSizeChange (val) {
      this.$emit('sizeChange', val)
    },
    handleCurrentChange (val) {
      this.$emit('currentChange', val)
    }
  }
}
</script>

<style scoped>
.mr10 {
  margin-right: 10px;
}
</style>
