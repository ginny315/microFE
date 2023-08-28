<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :default-active="activeMenu"
      text-color="#5E6166"
      active-text-color="#467EFF"
      background-color="#fff"
      :collapse="isCollapse"
      unique-opened="false"
      collapse-transition
    >
      <sidebar-item
        v-for="menu in menuList"
        :key="menu.path"
        :item="menu"
        :is-collapse="isCollapse"
        :activeMenu="activeMenu"
      />
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import SidebarItem from './sidebar-item.vue'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
let menuList = router.options.routes
// const activeMenu = computed(() => {
//   const { meta, path } = route
//   if (meta.activeMenu) {
//     return meta.activeMenu
//   }
//   return path
// })
const isCollapse = computed(() => {
  const sidebar = appStore.getSidebar
  const isCollapse = !sidebar.opened
  return isCollapse
})

const activeMenu = computed(() => {
  return route.matched[0].path
})
</script>

<style lang="scss">
.sidebar-container {
  .horizontal-collapse-transition {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
  }
  .scrollbar-wrapper {
    overflow-x: hidden !important;
  }
  .el-scrollbar__view {
    height: 100%;
  }
  .el-scrollbar__bar {
    &.is-vertical {
      right: 0px;
    }
    &.is-horizontal {
      display: none;
    }
  }
}
.el-scrollbar {
  height: 100%;
  position: relative;
}
.el-menu {
  border: none;
  height: 100%;
  width: 100% !important;
  padding-top: 4px;
}
</style>
