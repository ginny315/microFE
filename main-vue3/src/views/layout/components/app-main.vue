<template>
  <section class="app-main">
    <transition name="slide-fade" type="transition" mode="out-in">
      <router-view />
    </transition>
    <WujieVue name="vue3" url=" http://127.0.0.1:8081/" :props="{ name: 'ginny' }"></WujieVue>
  </section>
</template>

<script lang="ts" setup>
console.log('This is the parent app!')
import { bus } from 'wujie'

bus.$on('vue3', (data: any) => {
  console.log('parent bus:', data)
})
</script>
<style lang="scss" scoped></style>
