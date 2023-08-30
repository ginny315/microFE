<template>
  <div class="container">
    <div class="head-box">22222管理</div>
  </div>
</template>

<script lang="ts" setup>
console.log('222222', window.$wujie.props.name)
window.$wujie.bus.$emit('vue3', '我是子应用传递的参数')
</script>

<style lang="scss" scoped>
.container {
  width: 1000px;
}
.el-input {
  width: 200px !important;
  margin-right: 20px;
}
</style>
