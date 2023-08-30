<template>
  <!--单级菜单 && item.meta.multiple == false-->
  <div
    class="one-level"
    v-if="!props.item.meta.hidden"
    :class="['menu-wrapper', isCollapse ? 'simple-mode' : 'full-mode']"
  >
    <sidebar-item-link :to="item.path">
      <el-menu-item :index="item.path">
        <div class="sidebar-icon">
          <img
            :src="
              getImageURL(
                item.path == activeMenu ? `${item.meta.icon}-active.svg` : `${item.meta.icon}.svg`
              )
            "
            alt=""
          />
        </div>
        <span v-if="!isCollapse">{{ item.meta.title }}</span>
      </el-menu-item>
    </sidebar-item-link>
  </div>
  <!--多级菜单-->
  <div
    class="multi-level"
    v-if="!item.meta.hidden && item.meta.multiple == true"
    :class="['menu-wrapper', isCollapse ? 'simple-mode' : 'full-mode']"
  >
    <sidebar-item-link to="">
      <!-- <sidebar-item-link :to="item.path"> -->
      <el-sub-menu :index="item.path">
        <template #title>
          <div class="sidebar-icon">
            <img
              :src="
                getImageURL(
                  item.path == activeMenu ? `${item.meta.icon}-active.svg` : `${item.meta.icon}.svg`
                )
              "
              alt=""
            />
          </div>
          <span v-if="!isCollapse" :style="item.path == activeMenu ? 'color:#467EFF' : ''">{{
            item.meta.title
          }}</span>
        </template>
        <sidebar-item-link
          v-for="(subMenu, index) in item.children"
          :to="subMenu.path"
          :key="index"
        >
          <el-menu-item
            :index="subMenu.path"
            v-if="!subMenu.meta.hidden"
            :class="subMenu.path == activeMenu2 ? 'sub-menu is-active' : 'sub-menu'"
          >
            <div class="sub-split"></div>
            <div class="sub-block">
              <span :style="subMenu.path == activeMenu2 ? 'color:#467EFF' : ''">{{
                subMenu.meta.title
              }}</span>
            </div>
          </el-menu-item>
        </sidebar-item-link>
      </el-sub-menu>
    </sidebar-item-link>
    <!-- <el-sub-menu :index="item.path">
      <template #title>
        <span v-if="!isCollapse">{{ item.meta.title }}</span>
      </template>
      <sidebar-item-link v-for="(subMenu, index) in item.children" :to="subMenu.path" :key="index">
        <el-menu-item :index="subMenu.path" v-if="!subMenu.meta.hidden">
          <div class="sidebar-icon">
            <img
              :src="
                getImageURL(
                  subMenu.path == activeMenu
                    ? `${subMenu.meta.icon}-active.png`
                    : `${subMenu.meta.icon}.png`
                )
              "
              alt=""
            />
          </div>
          <span>{{ subMenu.meta.title }}</span>
        </el-menu-item>
      </sidebar-item-link>
    </el-sub-menu> -->
  </div>
</template>

<script setup lang="ts">
import SidebarItemLink from './sidebar-item-link.vue'
import { useUserStore } from '@/store/modules/user'
import { getImageURL } from '@/utils/importImages'

const props = defineProps<{
  item: any
  isCollapse: Boolean
}>()

const route = useRoute()
const userStore = useUserStore()
const is_super = userStore.getUserInfo?.is_super || false

// const activeMenu = computed(() => {
//   const { meta, path } = route
//   if (meta.activeMenu) {
//     return meta.activeMenu
//   }
//   return path
// })

const activeMenu = computed(() => {
  return route.matched[0].path
})

const activeMenu2 = computed(() => {
  return route.matched[1].path
})
</script>

<style lang="scss" scoped>
span {
  padding-left: 8px;
}
.el-menu-item {
  width: 192px;
  margin: 0 auto;
  height: 40px;
  // margin-top: 4px;
  border-radius: 4px;
  overflow: hidden;
}
.el-menu-item.is-active {
  background: #f5f7fa;
  span {
    // color: #000;
    // font-weight: 500;
    color: #4580ff;
  }
  // .sidebar-icon {
  //   margin-left: -4px;
  // }
}
.el-menu-item:hover,
.el-menu-item:focus {
  background-color: #f5f7fa;
}
.el-sub-menu__title {
  height: 40px;
}
.el-sub-menu .el-menu-item {
  height: 40px;
}
.sidebar-icon {
  width: 20px;
  img {
    width: 20px; // 这里是为了防止收缩时不显示
    vertical-align: middle;
  }
}
.sub-menu {
  padding: 0 16px;
  background-color: transparent;
  // margin: -16px 0 0;
  background: transparent !important;
  position: relative;
  .sub-split {
    width: 1px;
    height: 40px;
    background-color: #e4e7ed;
    position: absolute;
    left: 16px;
    bottom: 0;
  }
  .sub-block {
    width: 100%;
  }
}
.is-active {
  > .sub-block {
    background: rgba(69, 128, 255, 0.05);
  }
}
</style>
