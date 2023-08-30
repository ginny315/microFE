<template>
  <div class="app-wrapper" :class="classObj">
    <Navbar type="normal" />
    <div class="main-wrapper">
      <Sidebar class="sidebar-container" />
      <div class="main-container" id="mainContainer">
        <AppMain />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppMain, Navbar, Sidebar, Footer } from './components'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()

const classObj = computed(() => {
  const sidebar = appStore.getSidebar
  return {
    hideSidebar: !sidebar.opened,
    openSidebar: sidebar.opened,
    withoutAnimation: sidebar.withoutAnimation
  }
})
</script>

<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  background-color: #f1f5fb;
}
.main-wrapper {
  width: 100%;
  height: 100%;
  min-height: 100%;
  // width: calc(100% - 210px);
  // min-width: 1366px;
  transition: margin-left 0.28s;
  margin-left: 210px;
  position: relative;
}
.main-container {
  padding-top: 40px;
  height: 100%;
  width: calc(100vw - 210px);
  // overflow-y: scroll;
  // overflow-x: hidden;
  overflow: auto;
  // scrollbar-width: none;
  // -ms-overflow-style: none;
}
.main-container::-webkit-scrollbar {
  // width: 0px;
  // height: 0px;
  // display: none;
}
.sidebar-container {
  transition: width 0.28s;
  // width: 196px !important;
  width: 208px !important;
  height: 100%;
  position: fixed;
  font-size: 0px;
  top: 40px;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
}
.openSidebar {
}
.hideSidebar {
  .main-wrapper {
    margin-left: 64px;
    width: calc(100% - 64px);
  }
  .sidebar-container {
    width: 64px !important;
  }
}
/* for mobile response 适配移动端 */
.mobile {
  .main-container {
    margin-left: 0px;
  }
  .sidebar-container {
    transition: transform 0.28s;
  }
  &.openSidebar {
    position: fixed;
    top: 0;
  }
  &.hideSidebar {
    .sidebar-container {
      pointer-events: none;
      transition-duration: 0.3s;
    }
  }
}
.withoutAnimation {
  .main-container,
  .sidebar-container {
    transition: none;
  }
}
</style>
