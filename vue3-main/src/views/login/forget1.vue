<template>
  <el-form-item prop="captcha" label="">
    <div class="captcha-text">
      <el-input placeholder="请输入验证码" v-model="userForm.captcha"></el-input>
    </div>
    <div class="captcha-code">
      <captcha ref="captchaRef"></captcha>
    </div>
  </el-form-item>
  <p>手机验证码</p>
  <security-code v-model="userForm.code"></security-code>
  <captcha-fe></captcha-fe>
</template>

<script setup lang="ts">
import captcha from '@/components/Code/captcha.vue'
import captchaFe from '@/components/Code/captchaFe.vue'
import securityCode from '@/components/Code/securityCode.vue'

const captchaRef = ref()
const loading = ref(false)
const state = reactive({
  userForm: {
    captcha: '',
    code: ''
  }
})
const { userForm } = toRefs(state)

onMounted(() => {
  loadVerifyCode()
})

const loadVerifyCode = () => {
  captchaRef.value.refreshCode()
  state.userForm.captcha = ''
}
</script>

<style lang="scss" scoped></style>
