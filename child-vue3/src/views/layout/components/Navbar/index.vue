<template>
  <div class="navbar-wrapper">
    <div class="navbar" :class="isActive ? '' : 'navbar-close'">
      <div class="left-logo">
        <div class="logo">
          <img src="@/assets/img/admin.png" alt="" />
        </div>
        <span>XXX系统</span>
      </div>
      <Hamburger
        v-if="props.type === 'normal'"
        id="hamburger-container"
        class="hamburger-container"
        :is-active="isActive"
        @click="toggleSideBar()"
      />
      <div class="right-menu">
        <Avatar @handleDrawer="handleDrawer" />
      </div>
    </div>
  </div>
  <Drawer :show="showDrawer" :type="drawerType" @handleDrawer="handleDrawer" />
</template>

<script setup lang="ts">
import Hamburger from '@/components/hamburger/index.vue'
import { useAppStoreWithOut } from '@/store/modules/app'
import Avatar from './avatar.vue'
import Drawer from './drawer.vue'
const appStore = useAppStoreWithOut()

const props = defineProps<{
  type: string
}>()

const toggleSideBar = () => {
  console.log('toggleSideBar!!!')
  const opened = appStore.getSidebar?.opened
  appStore.toggleSideBar(!opened)
}

const isActive = computed(() => {
  const isActive = appStore.getSidebar?.opened
  return isActive
})

const showDrawer = ref(false)
const drawerType = ref(0)

// drawer总控制器
const handleDrawer = (action: any, type?: number) => {
  showDrawer.value = action
  drawerType.value = type || 0
  console.log('type=', type)
}
</script>

<style lang="scss" scoped>
.navbar-wrapper {
  width: 100vw;
  position: fixed;
  z-index: 999;
  height: 64px;
}
.navbar-close {
  transition: 0.1s padding-left ease-in-out;
}
.navbar {
  height: 100%;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .hamburger-container {
    color: #000;
    height: 100%;
    display: flex;
    align-items: center;
    float: left;
    margin-left: 20px;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;
  }
  .left-logo {
    float: left;
    height: 100%;
    display: flex;
    align-items: center;
    width: 208px;
    // border-bottom: 1px solid #eee;
    .logo {
      width: 32px;
      margin: 0 8px;
      img {
        display: flex;
        align-items: center;
        width: 100%;
      }
    }
    span {
      line-height: 64px;
      font-size: 16px;
      color: #262729;
      font-weight: 500;
    }
  }
  .right-menu {
    float: right;
    height: 100%;
    display: flex;
    align-items: center;
    &:focus {
      outline: none;
    }
  }
}
.question {
  width: 20px;
  height: 20px;
  margin-right: 24px;
  img {
    width: 100%;
  }
}
</style>
