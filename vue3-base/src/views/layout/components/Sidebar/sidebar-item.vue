<template>
  <!--单级菜单-->
  <div
    class="one-level"
    v-if="!props.item.meta.hidden && item.meta.level == 1"
    :class="['menu-wrapper', isCollapse ? 'simple-mode' : 'full-mode']"
  >
    <sidebar-item-link :to="item.path">
      <el-menu-item :index="item.path">
        <div class="sidebar-icon">
          <img
            :src="
              getImageURL(
                item.path == activeMenu ? `${item.meta.icon}-active.png` : `${item.meta.icon}.png`
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
    v-if="(is_super || item.meta.role != 'admin') && !item.meta.hidden && item.meta.level == 2"
    :class="['menu-wrapper', isCollapse ? 'simple-mode' : 'full-mode']"
  >
    <el-sub-menu :index="item.path">
      <template #title>
        <div class="sidebar-icon">
          <img :src="item.meta.iconImg" alt="" />
        </div>
        <span v-if="!isCollapse">{{ item.meta.title }}</span>
      </template>
      <SidebarItemLink v-for="(subMenu, index) in item.children" :to="subMenu.path" :key="index">
        <el-menu-item :index="subMenu.path">
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
      </SidebarItemLink>
    </el-sub-menu>
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
</script>

<style lang="scss" scoped>
span {
  padding-left: 8px;
}
.el-menu-item {
  width: 100%;
  height: 56px;
  border-color: #467eff;
}
.el-menu-item.is-active {
  border-left: 4px solid #467eff;
  background-color: rgba(70, 126, 255, 0.1);
  .sidebar-icon {
    margin-left: -4px;
  }
}
.el-menu-item:hover,
.el-menu-item:focus {
  background-color: rgba(70, 126, 255, 0.1);
}
.sidebar-icon {
  width: 20px;
  img {
    width: 100%;
    vertical-align: middle;
  }
}
</style>
