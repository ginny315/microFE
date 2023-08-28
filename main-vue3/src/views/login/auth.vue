<script setup lang="ts">
import { useCasdoor } from 'casdoor-vue-sdk'
import { getAccount } from '@/api/user'

const { getSigninUrl } = useCasdoor()
// const signinUrl = getSigninUrl()
const login = () => {
  window.location.href = getSigninUrl()
}

onMounted(() => {
  console.log('This is login page')
  login()
  // getAccount().then((res) => {
  //   console.log('res=', res)
  //   login()
  //   // if (res['status'] === 'ok') {
  //   //   console.log('success:', res)
  //   // } else {
  //   //   console.log('fail:', res)
  //   //   login()
  //   // }
  // })
})
</script>

<template>
  <div></div>
</template>
