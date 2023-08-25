<template>
  <div id="subApp">这里是app1</div>
  <router-view />
</template>

<script lang="ts" setup>
console.log('This is version v0.1.0.13 Thanks PLMM ginny!')
import { useUserStore } from '@/store/modules/user'
import { getUserInfo } from '@/api/user'

const router = useRouter()
const userStore = useUserStore()

onMounted(() => {
  // const userInfo = userStore.userInfo
  // console.log('userInfo=', userInfo)
  // if (!userInfo || (userInfo.id === null && userInfo.name === '')) {
  //   getData()
  // }
})

// const getData = () => {
//   getUserInfo({})
//     .then((res: any) => {
//       const { status, data } = res
//       if (status == 'ok') {
//         console.log(data)
//         userStore.updateUserInfo(data)
//       } else if (status == 'error') {
//         console.log(data)
//         router.push({ path: '/login' })
//       } else {
//         console.log(res)
//       }
//     })
//     .catch((error: any) => {
//       console.log(error)
//     })
// }
</script>

<style lang="scss" scoped></style>
