<template>
  <div class="container-simple">
    <div class="left">
      <div class="user">
        <div class="user-avatar" v-if="isAdmin">
          <img src="@/assets/img/admin.png" />
        </div>
        <div v-else class="user-avatar">
          <img src="@/assets/img/user.png" />
        </div>
        <div class="des">
          <p>{{ userName }}</p>
          <p>部门</p>
        </div>
      </div>
      <ul class="info">
        <li>
          <div class="key">手机号</div>
          <div class="value">134111111111</div>
        </li>
        <li>
          <div class="key">邮箱</div>
          <div class="value">134@qq.com</div>
        </li>
        <li>
          <div class="key">角色</div>
          <div class="value">UMS负责人</div>
        </li>
      </ul>
    </div>
    <div class="right">右侧内容</div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user'

const router = useRouter()
const route = useRoute()

const userStore = useUserStore()
const userInfo = userStore.userInfo
console.log('userInfo=', userInfo)

onMounted(() => {})

const userName = ref(userStore.getUserInfo?.name)
const isAdmin = ref(userStore.getUserInfo?.isAdmin)
watch(userStore, () => {
  userName.value = userStore.getUserInfo.name
  isAdmin.value = userStore.getUserInfo.isAdmin
})
</script>

<style lang="scss" scoped>
.container-simple {
  display: flex;
  padding: 24px;
}
.left {
  width: 30%;
  border-right: 1px solid #eee;
}
.right {
  width: 70%;
}
.user {
  display: flex;
  .user-avatar {
    width: 60px;
    border-radius: 50%;
    img {
      width: 100%;
      border-radius: 50%;
    }
  }
}
</style>
