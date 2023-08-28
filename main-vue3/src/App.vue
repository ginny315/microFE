<template>
  <router-view />
</template>

<script lang="ts" setup>
console.log('This is the parent app!')
import { useUserStore } from '@/store/modules/user'
import { getUserInfo } from '@/api/user'

const router = useRouter()
const userStore = useUserStore()

onMounted(() => {})
</script>

<style lang="scss" scoped></style>
