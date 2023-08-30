<template>
  <div class="footer-wrapper">
    <div class="foot-text">
      <p>©2022 太初（无锡）电子科技有限公司 版权所有</p>
      <p>苏ICP备***号-1</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.footer-wrapper {
  width: 100%;
  margin-left: -208px;
  height: 64px;
  position: relative;
  margin-top: -64px; /*等于footer的高度*/
  text-align: center;
  padding: 10px 0;
  font-size: 1px;
}
.foot-text {
  position: absolute;
  left: calc(50% - 0px);
  transform: translateX(-50%);
}
</style>
