<template>
  <div class="navbar-wrapper">
    <div class="navbar">
      <div class="left-logo">
        <div class="logo">
          <img src="@/assets/img/plcs.svg" alt="" />
        </div>
        <div class="sys">
          <span class="title-en">{{ sysTitleEn }}</span>
          <span class="title-split">|</span>
          <span class="title-cn">{{ sysTitle }}</span>
        </div>
      </div>
      <div class="right-menu">
        <div class="help">
          <div class="help-img">
            <img src="@/assets/img/icon-help.png" alt="" />
          </div>
          <span>帮助</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const state = reactive({
  sysTitle: '产品全生命周期系统',
  sysTitleEn: 'PLCS'
})
const { sysTitle, sysTitleEn } = toRefs(state)
</script>

<style lang="scss" scoped>
.navbar-wrapper {
  width: 100vw;
  position: fixed;
  z-index: 999;
  height: 40px;
}
.navbar-close {
  transition: 0.1s padding-left ease-in-out;
}
.navbar {
  width: 100%;
  min-width: 1220px;
  height: 100%;
  overflow: hidden;
  position: relative;
  background: #333e4a;
  color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .left-logo {
    // cursor: pointer;
    float: left;
    height: 100%;
    display: flex;
    align-items: center;
    .logo {
      width: 24px;
      margin: 0 8px;
      border-radius: 16px;
      overflow: hidden;
      cursor: pointer;
      img {
        display: flex;
        align-items: center;
        width: 100%;
      }
    }
    .title-en {
      line-height: 40px;
      font-size: 16px;
      font-weight: 500;
    }
    .title-split {
      margin: 0 8px;
      color: #979797;
    }
    .title-cn {
      font-size: 14px;
    }
  }
  .right-menu {
    float: right;
    height: 100%;
    display: flex;
    align-items: center;
    &:focus {
      outline: none;
    }
  }
}
.help {
  display: flex;
  align-items: center;
  // cursor: pointer;
  padding-right: 16px;
  .help-img {
    width: 24px;
    height: 24px;
    img {
      width: 100%;
    }
  }
  span {
    line-height: 40px;
    font-size: 12px;
  }
}
</style>
