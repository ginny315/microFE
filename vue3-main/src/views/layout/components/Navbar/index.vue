<template>
  <div class="navbar-wrapper">
    <div class="navbar" :class="isActive ? '' : 'navbar-close'">
      <div class="left-logo" @click="toHome">
        <div class="logo">
          <img src="@/assets/img/plcs.svg" alt="" />
        </div>
        <div class="sys">
          <span class="title-en">{{ sysTitleEn }}</span>
          <span class="title-split">|</span>
          <span class="title-cn">{{ sysTitle }}</span>
        </div>
        <!-- <div class="nav-title" :class="homeActive ? 'nav-active' : ''" @click="toHome">首页</div> -->
      </div>
      <div class="right-menu">
        <span class="help-split2">|</span>
        <div class="help" @click="toHelp">
          <div class="help-img">
            <img src="@/assets/img/icon-help.png" alt="" />
          </div>
          <span>帮助</span>
        </div>
        <span class="help-split">|</span>
        <Avatar />
      </div>
      <ul class="nav-tab">
        <li
          v-for="(item, index) in navList"
          :key="index"
          class="nav-title"
          :class="navActive == item.tag ? 'nav-active' : ''"
          @click="toUrl(item.link)"
        >
          <span>{{ item.name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStoreWithOut } from '@/store/modules/app'
import Avatar from './avatar.vue'
import { useUserStore } from '../../../../store/modules/user'
const appStore = useAppStoreWithOut()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const props = defineProps<{
  type: string
}>()

const state = reactive({
  sysTitle: '产品全生命周期系统',
  sysTitleEn: 'PLCS'
})
const { sysTitle, sysTitleEn } = toRefs(state)

const navActive = computed(() => {
  let activeTag = null
  if (route.path == '/') {
    activeTag = 'index'
  } else if (route.path == '/user') {
    activeTag = 'user'
  } else if (route.path == '/sys' || route.path == '/apiConfig') {
    activeTag = 'sys'
  } else if (route.path == '/role' || route.path == '/roleDetail') {
    activeTag = 'role'
  } else if (route.path == '/menu') {
    activeTag = 'menu'
  } else if (route.path == '/opLog') {
    activeTag = 'log'
  } else {
  }
  console.log('activeTag=', activeTag)
  return activeTag
})

const isActive = computed(() => {
  const isActive = appStore.getSidebar?.opened
  return isActive
})

const toUrl = (path) => {
  router.push({ path: path })
}

const toHome = () => {
  router.push({ path: '/' })
}

const toHelp = () => {
  router.push({ path: '/help' })
}

// common
const router3 = [
  {
    name: '首页',
    link: '/',
    tag: 'index'
  },
  {
    name: '操作日志',
    link: '/opLog',
    tag: 'log'
  }
]
const navList = ref([])
watch(
  () => userStore.userInfo,
  () => {
    navList.value = router3
  },
  {
    immediate: true,
    deep: true
  }
)
</script>

<style lang="scss" scoped>
.navbar-wrapper {
  width: 100vw;
  position: fixed;
  z-index: 999;
  height: 40px;
}
.navbar-close {
  transition: 0.1s padding-left ease-in-out;
}
.navbar {
  width: 100%;
  min-width: 1220px;
  height: 100%;
  overflow: hidden;
  position: relative;
  background: #333e4a;
  color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .left-logo {
    cursor: pointer;
    float: left;
    height: 100%;
    display: flex;
    align-items: center;
    .logo {
      width: 24px;
      margin: 0 8px;
      border-radius: 16px;
      overflow: hidden;
      cursor: pointer;
      img {
        display: flex;
        align-items: center;
        width: 100%;
      }
    }
    .title-en {
      line-height: 40px;
      font-size: 16px;
      font-weight: 500;
    }
    .title-split {
      margin: 0 8px;
      color: #979797;
    }
    .title-cn {
      font-size: 14px;
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
.nav-tab {
  float: right;
  display: inline-flex;
  vertical-align: top;
  height: 100%;
  .nav-title {
    font-size: 14px;
    color: #ffffff;
    opacity: 0.8;
    line-height: 40px;
    margin-left: 48px;
    padding: 0 8px;
    cursor: pointer;
  }
  .nav-active {
    color: #fff;
    opacity: 1;
    border-bottom: 3px solid #467eff;
  }
}
.help {
  display: flex;
  align-items: center;
  cursor: pointer;
  .help-img {
    width: 24px;
    height: 24px;
    img {
      width: 100%;
    }
  }
  span {
    line-height: 40px;
    font-size: 12px;
  }
}
.help-split {
  margin-left: 12px;
  margin-right: 4px;
  font-size: 16px;
  color: #979797;
}
.help-split2 {
  margin: 0 12px;
  font-size: 16px;
  color: #979797;
}
</style>
