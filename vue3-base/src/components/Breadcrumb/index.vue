<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const breadcrumbs = computed(() => {
  return route.matched
})
const handleClickRouter = (path) => {
  console.log('path=', path)
  router.push({ path })
}
</script>

<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
        <span v-if="index == 0" class="redirect" @click="handleClickRouter(item.path)">{{
          item.meta.title
        }}</span>
        <span v-else class="no-redirect" @click="handleClickRouter(item.path)">{{
          item.meta.title
        }}</span>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
.el-breadcrumb__inner,
.el-breadcrumb__inner a {
  font-weight: 400 !important;
}
.el-breadcrumb__separator {
  color: #262729;
}
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 64px;
  .redirect {
    font-weight: 500;
    color: #262729;
    cursor: pointer;
  }
  .no-redirect {
    cursor: text;
  }
}
</style>
