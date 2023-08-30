<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :default-active="activeMenu"
      :default-openeds="['/']"
      text-color="#5E6166"
      active-text-color="#467EFF"
      background-color="#fff"
      :collapse="isCollapse"
      :unique-opened="false"
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
    <!-- <div class="sidebar-blue">
      <img src="@/assets/img/sidebar-blue.png" alt="" />
    </div> -->
  </el-scrollbar>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import SidebarItem from './sidebar-item.vue'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

// const menuList = computed(() => {
//   // return router.getRoutes()
//   const routes = router.options.routes || []
//   const menus = permissionStore.dynamicRoutes || []
//   return routes.concat(menus)
// })

const menuList = router.options.routes
console.log('menuList=', menuList)

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
    padding-top: 16px;
    background: #fff;
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
  // background-image: url('@/assets/img/sidebar-blue.png');
}
// .el-scrollbar__view {
//   background-image: url('@/assets/img/sidebar-blue.png');
// }
.sidebar-blue {
  position: absolute;
  bottom: 0;
  width: 208px;
  img {
    width: 100%;
  }
}
</style>
