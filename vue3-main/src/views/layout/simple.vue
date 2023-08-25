<script setup lang="ts">
import { AppMain, Navbar, Footer } from './components'
</script>

<template>
  <div class="app-wrapper">
    <Navbar type="simple" />
    <div class="main-wrapper">
      <div class="main-container">
        <AppMain />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  background-color: #f1f5fb;
}
.main-wrapper {
  height: 100%;
  min-height: 100%;
  width: 100%;
  min-width: 1200px;
  position: relative;
}
.main-container {
  width: 100%;
  padding-top: 40px;
  height: 100%;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.main-container::-webkit-scrollbar {
  display: none;
}
</style>
