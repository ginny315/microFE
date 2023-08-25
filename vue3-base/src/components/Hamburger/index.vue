<script setup lang="ts">
const props = defineProps<{
  isActive: Boolean
}>()
</script>

<template>
  <div :class="[{ 'is-active': !props.isActive }]">
    <div class="fold"><img src="@/assets/img/fold.png" alt="" /></div>
  </div>
</template>

<style lang="scss" scoped>
.el-icon {
  vertical-align: middle;
  color: #000;
}
.fold {
  width: 24px;
  img {
    display: flex;
    align-items: center;
    width: 100%;
  }
}
.is-active {
  transform: rotate(180deg);
}
</style>
