<template>
  <el-input
    v-model="search"
    placeholder="请输入搜索内容..."
    class="handle-input mr10"
    @keyup.enter.native="handleEnter"
    clearable
  ></el-input>
</template>

<script>
export default {
  name: 'search-input',
  data () {
    return {
      search: ''
    }
  },
  methods: {
    handleEnter () {
      this.$emit('enter', this.search)
    }
  }
}
</script>
