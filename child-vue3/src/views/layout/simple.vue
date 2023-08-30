<script setup lang="ts">
import { AppMain, Navbar } from './components'
</script>

<template>
  <div class="app-wrapper">
    <Navbar type="normal" />
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
  padding-top: 64px;
  height: 100%;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.main-container::-webkit-scrollbar {
  display: none;
}
</style>
