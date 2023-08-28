<template>
  <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="hover">
    <div class="avatar-wrapper">
      <img v-if="is_superuser" src="@/assets/img/admin.png" class="user-avatar" />
      <img v-else src="@/assets/img/user.png" class="user-avatar" />
      <span>{{ userName }}</span>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="openPwd">
          <div class="left-img">
            <img src="@/assets/img/editpwd.png" alt="" />
          </div>
          <p>修改密码</p>
        </el-dropdown-item>
        <el-dropdown-item @click="openPhone" :disabled="is_superuser">
          <div class="left-img">
            <img src="@/assets/img/phone.png" alt="" />
          </div>
          <p>修改手机号</p>
        </el-dropdown-item>
        <el-dropdown-item divided @click="logout">
          <div class="left-img">
            <img src="@/assets/img/logout.png" alt="" />
          </div>
          <p>退出登录</p>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useUserStoreWithOut } from '@/store/modules/user'

const userStore = useUserStoreWithOut()
const is_superuser = userStore.getUserInfo?.is_superuser || false
const userName = userStore.getUserInfo?.username || 'User'
const state = reactive({
  hoverInfo: false,
  hoverLogout: false
})

const logout = () => {
  userStore.logOut()
}

const handleHover = (flag: Number, action: any) => {
  if (flag == 1) {
    state.hoverInfo = action
  } else if (flag == 2) {
    state.hoverLogout = action
  }
}
const myEmit = defineEmits(['handleDrawer'])
const openPwd = () => {
  myEmit('handleDrawer', true, 1)
}
const openPhone = () => {
  myEmit('handleDrawer', true, 2)
}
</script>

<style lang="scss" scoped>
.right-menu-item {
  display: inline-block;
  padding: 0 8px;
  height: 100%;
  font-size: 18px;
  color: #5a5e66;
  vertical-align: text-bottom;
  &.hover-effect {
    cursor: pointer;
    transition: background 0.3s;
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
}
.avatar-container {
  margin-right: 30px;
  vertical-align: middle;
  .avatar-wrapper {
    position: relative;
    height: 64px;
    display: flex;
    align-items: center;
    .user-avatar {
      cursor: pointer;
      width: 24px;
      height: 24px;
      border-radius: 12px;
      vertical-align: middle;
    }
    span {
      font-size: 14px;
      padding-left: 8px;
    }
    .el-icon-caret-bottom {
      cursor: pointer;
      position: absolute;
      right: -20px;
      top: 25px;
      font-size: 12px;
    }
  }
}
.left-img {
  width: 16px;
  height: 16px;
  margin-right: 16px;
  img {
    width: 100%;
  }
}
</style>
