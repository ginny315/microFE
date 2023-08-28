<template>
  <div class="code" @click="refreshCode" title="刷新验证码">
    <img class="verification-code" :src="verificationUrl" alt="验证码" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{}>()
// 验证码请求地址
const verificationUrl = ref()

/**
 * 点击刷新
 */
const refreshCode = () => {
  // TODO: 加入请求二进制图片流
  const data = ''
  let bytes = new Uint8Array(data)
  let storeData = ''
  let len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    storeData += String.fromCharCode(bytes[i])
  }
  verificationUrl.value = 'data:image/png;base64,' + window.btoa(storeData)
}

defineExpose({
  refreshCode
})
</script>

<style lang="scss" scoped>
.verification-code {
  vertical-align: middle;
  cursor: pointer;
}
</style>
