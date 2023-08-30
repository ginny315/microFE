<template>
  <div class="navbar-wrapper">
    <div class="navbar" :class="isActive ? '' : 'navbar-close'">
      <div class="left-logo">
        <div class="home" @click="backUMS">
          <img src="@/assets/img/ico-menu.png" alt="" />
        </div>
        <div class="logo" @click="backHome">
          <img :src="getImageURL(sysLogo)" alt="" />
        </div>
        <div class="sys" @click="backHome">
          <span class="title-en">{{ sysTitleEn }}</span>
          <span class="title-split">|</span>
          <span class="title-cn">{{ sysTitle }}</span>
        </div>
      </div>
      <!-- <Hamburger
        v-if="props.type === 'normal'"
        id="hamburger-container"
        class="hamburger-container"
        :is-active="isActive"
        @click="toggleSideBar()"
      /> -->
      <div class="right-menu">
        <div class="help" @click="toHelp">
          <div class="help-img">
            <img src="@/assets/img/icon-help.png" alt="" />
          </div>
          <span>帮助</span>
          <span class="help-split">|</span>
        </div>
        <Avatar />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Hamburger from '@/components/Hamburger/index.vue'
import { useAppStoreWithOut } from '@/store/modules/app'
import { getImageURL } from '@/utils/importImages'
import Avatar from './avatar.vue'
const appStore = useAppStoreWithOut()
const route = useRoute()
const router = useRouter()
const props = defineProps<{
  type: string
}>()

const state = reactive({
  sysTitle: '',
  sysTitleEn: '',
  sysLogo: ''
})
const { sysTitle, sysTitleEn, sysLogo } = toRefs(state)

onMounted(() => {
  getData()
})

const getData = () => {
  const sysPath = window.location.href
  console.log('sysPath=', sysPath)
  if (sysPath.indexOf('oms') !== -1) {
    state.sysTitle = '订单管理系统'
    state.sysTitleEn = 'OMS'
    state.sysLogo = 'oms.svg'
    // state.sysLogo = '@/assets/img/oms.svg'
  } else {
    state.sysTitle = '产品追溯系统'
    state.sysTitleEn = 'PTS'
    state.sysLogo = 'pts.svg'
    // state.sysLogo = '@/assets/img/pts.svg'
  }
}

const backUMS = () => {
  // window.open(window.location.origin + '/ums/', '_blank')
  window.location.replace(window.location.origin + '/ums/')
}

const backHome = () => {
  router.push({ path: '/' })
}

const toHelp = () => {
  router.push({ path: '/help' })
}

const toggleSideBar = () => {
  const opened = appStore.getSidebar?.opened
  console.log('toggleSideBar!!!', opened)
  appStore.toggleSideBar(!opened)
}

const isActive = computed(() => {
  const isActive = appStore.getSidebar?.opened
  return isActive
})
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
  height: 100%;
  overflow: hidden;
  position: relative;
  background: #333e4a;
  color: #fff;
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
    .logo {
      width: 24px;
      margin: 0 8px;
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
  .home {
    width: 40px;
    height: 40px;
    border-right: 1px solid #979797;
    cursor: pointer;
    padding: 8px;
    img {
      width: 100%;
    }
  }
  .sys {
    cursor: pointer;
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
  .help-split {
    margin-left: 12px;
    margin-right: 4px;
    font-size: 16px;
    color: #979797;
  }
}
</style>
