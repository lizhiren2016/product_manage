<template>
  <el-button
    icon="el-icon-refresh"
    type="primary"
    :loading="loading"
    @click="handleClick"
    class="mr10"
  >刷新</el-button>
</template>

<script>
export default {
  name: 'refresh-button',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick () {
      this.$emit('click')
    }
  }
}
</script>

<style scoped>
.mr10 {
  margin-right: 10px;
}
</style>
