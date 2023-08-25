<template>
  <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="hover">
    <div class="avatar-wrapper">
      <div v-if="isAdmin" class="user-avatar">
        <img src="@/assets/img/admin.png" />
      </div>
      <div v-else class="user-avatar">
        <img src="@/assets/img/user.png" />
      </div>
      <div v-if="isAdmin" class="admin-tag">
        <img src="@/assets/img/admin-tag.svg" />
      </div>
      <span>{{ userName }}</span>
      <el-icon style="color: #fff; margin-left: 4px"><ArrowDown /></el-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="openInfo(1)" :disabled="isAdmin">
          <div class="left-img">
            <img src="@/assets/img/editpwd.png" alt="" />
          </div>
          <p>修改密码</p>
        </el-dropdown-item>
        <el-dropdown-item @click="openInfo(2)" :disabled="isAdmin">
          <div class="left-img">
            <img src="@/assets/img/phone.png" alt="" />
          </div>
          <p>修改手机号</p>
        </el-dropdown-item>
        <el-dropdown-item @click="openInfo(3)" :disabled="isAdmin">
          <div class="left-img">
            <img src="@/assets/img/email.png" alt="" />
          </div>
          <p>修改邮箱</p>
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
const router = useRouter()
const userStore = useUserStoreWithOut()
const state = reactive({
  hoverInfo: false,
  hoverLogout: false
})

const userName = ref(userStore.getUserInfo?.name)
const isAdmin = ref(userStore.getUserInfo?.isAdmin)
watch(userStore, () => {
  userName.value = userStore.getUserInfo.name
  isAdmin.value = userStore.getUserInfo.isAdmin
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
const openInfo = (flag?: number) => {
  router.push({
    path: '/myinfo',
    query: {
      type: flag
    }
  })
}
</script>

<style lang="scss" scoped>
.right-menu-item {
  display: inline-block;
  padding: 0 8px;
  height: 100%;
  font-size: 18px;
  color: #fff;
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
    height: 40x;
    display: flex;
    align-items: center;
    .admin-tag {
      width: 80px;
      height: 80px;
      position: absolute;
      top: -20px;
      left: -16px;
      img {
        width: 100%;
      }
    }
    .user-avatar {
      cursor: pointer;
      width: 24px;
      height: 24px;
      border-radius: 12px;
      vertical-align: middle;
      position: relative;
      overflow: hidden;
      // &::after {
      //   content: ' ';
      //   display: block;
      //   width: 8px;
      //   height: 8px;
      //   background-size: 100% 100%;
      //   background-image: url('@/assets/img/admin-tag.svg');
      //   position: absolute;
      //   top: 0;
      //   right: 0;
      // }
      img {
        width: 100%;
      }
    }
    span {
      font-size: 12px;
      padding-left: 8px;
      color: #fff;
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
