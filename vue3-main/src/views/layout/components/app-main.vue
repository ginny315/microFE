<template>
  <section class="app-main">
    <transition name="slide-fade" type="transition" mode="out-in">
      <router-view />
    </transition>
  </section>
</template>

<script lang="ts" setup></script>
<style lang="scss" scoped></style>
