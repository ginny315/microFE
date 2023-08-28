<template>
  <section class="app-main">
    <transition name="slide-fade" type="transition" mode="out-in">
      <router-view />
    </transition>
    <WujieVue name="vue3" url=" http://127.0.0.1:8081/"></WujieVue>
  </section>
</template>

<script lang="ts" setup></script>
<style lang="scss" scoped></style>
