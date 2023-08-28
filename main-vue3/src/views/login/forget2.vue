<template>
  <div class="login-container">
    <div class="forget-content">
      <p>重置密码</p>
      <div class="step-bar">
        <el-steps :active="dialogStep - 1" finish-status="success" align-center class="steps">
          <el-step title="账户" />
          <el-step title="验证" />
          <el-step title="重置" />
        </el-steps>
      </div>
      <div class="step" v-if="dialogStep == 1">
        <el-input
          v-model="username"
          name="username"
          type="text"
          placeholder="请输入用户名或手机号"
          autocomplete="off"
        />
      </div>
      <div class="step" v-if="dialogStep == 2">
        <el-input v-model="code" placeholder="请输入验证码">
          <!-- <template #prepend>
            <el-button :icon="Search" />
          </template> -->
          <!-- <template #append>
            <el-button type="primary" @click="sendCode()">发送验证码</el-button>
          </template> -->
          <template #suffix>
            <el-button @click="sendCode()" class="btn-sendcode">发送验证码</el-button>
          </template>
        </el-input>
      </div>
      <div class="step" v-if="dialogStep == 3">
        <el-form :model="pwdForm" :rules="pwdRules" ref="pwdFormRef" label-width="100px">
          <el-form-item label="新密码：" prop="new_password">
            <el-input
              v-model="pwdForm.new_password"
              :type="passwordType2"
              autocomplete="off"
              placeholder="请输入8~20位含有数字、字母、符号三项的组合"
            />
            <el-icon class="show-pwd" @click.prevent="handleShowPwd(2)">
              <component :is="passwordType2 === 'password' ? 'hide' : 'view'" />
            </el-icon>
          </el-form-item>
          <!-- <p class="form-tip">8~20位含有数字、字母、符号三项的组合</p> -->
          <el-form-item label="确认密码：" prop="repassword">
            <el-input
              v-model="pwdForm.repassword"
              :type="passwordType3"
              autocomplete="off"
              placeholder="请再次输入新密码"
            />
            <el-icon class="show-pwd" @click.prevent="handleShowPwd(3)">
              <component :is="passwordType3 === 'password' ? 'hide' : 'view'" />
            </el-icon>
          </el-form-item>
        </el-form>
      </div>
      <el-button v-if="dialogStep == 1 || dialogStep == 2" type="primary" @click="ToNext()"
        >下一步</el-button
      >
      <el-button v-if="dialogStep == 3" type="primary" @click="handleResetPwd()"
        >重置密码</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { isValidPassword } from '@/utils/validate'
const state = reactive({
  dialogStep: 1,
  username: '',
  email: '',
  code: '',
  pwdForm: {
    new_password: '',
    repassword: ''
  },
  passwordType2: 'password',
  passwordType3: 'password',
  errorPwd: true,
  errorPwdRe: true
})
const {
  dialogStep,
  pwdForm,
  username,
  email,
  code,
  passwordType2,
  passwordType3,
  errorPwd,
  errorPwdRe
} = toRefs(state)
onMounted(() => {})

const ToNext = () => {
  if (state.dialogStep == 1) {
    // TODO: 请求邮箱校验接口
  } else if (state.dialogStep == 2) {
    // TODO: 请求邮箱+验证码验证
  }
  state.dialogStep = state.dialogStep + 1
}

const clearAll = () => {
  state.pwdForm = {
    new_password: '',
    repassword: ''
  }
  state.errorPwd = true
  state.errorPwdRe = true
}

// TODO:发送验证码
const sendCode = () => {}

// TODO:重置密码
const handleResetPwd = () => {}

const handleShowPwd = (index: number) => {
  console.log('handleShowPwd')
  if (state['passwordType' + index] === 'password') {
    state['passwordType' + index] = ''
  } else {
    state['passwordType' + index] = 'password'
  }
}

const validatePassword = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入新密码'))
  } else if (/\s/.test(value)) {
    // 包含空格
    callback(new Error('密码不能含有空格'))
  } else if (!isValidPassword(value)) {
    callback(new Error('请输入8~20位含有数字、字母、符号三项的组合'))
  } else {
    callback()
    state.errorPwd = false
  }
}

const validatePass2 = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入新密码'))
  } else if (value !== state.pwdForm.new_password) {
    callback(new Error('两次输入的新密码不同'))
  } else {
    callback()
    state.errorPwdRe = false
  }
}

const pwdRules = reactive({
  new_password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { validator: validatePassword, trigger: ['blur', 'change'] }
  ],
  repassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { validator: validatePass2, trigger: ['blur', 'change'] }
  ]
})
</script>

<style lang="scss" scoped>
$publicHeight: 24px;
.step-bar {
  margin: 16px auto;
}
.steps {
  width: 568px;
  height: $publicHeight;
  :deep(.el-step) {
    height: 100%;
    .el-step__line {
      background-color: rgba(0, 0, 0, 0.15);
      margin-right: 30px !important;
      margin-left: 105px !important;
      top: 50%;
      height: 2px;
    }
    .el-step__icon {
      width: $publicHeight;
      height: $publicHeight;
      font-size: 16px;
      border: 2px solid;
      //   .el-step__icon-inner {
      //     font-weight: unset !important;
      //   }
    }
    .el-step__title {
      position: absolute;
      top: calc((100% - 36px) / 2);
      left: calc(50% + 24px);
    }
  }
}
.login-container {
  display: flex;
  align-items: center;
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  background-image: url('@/assets/img/login-bg.png');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
.forget-content {
  background-color: #fff;
  border: 2px solid #fff;
  border-radius: 7px;
  box-shadow: 0 0 20px rgb(0 0 0 / 20%);
  margin: 30px auto;
  padding: 10px 100px 20px;
}

.show-pwd {
  position: absolute;
  right: 10px;
  top: calc(50% - 8px);
  font-size: 16px;
  color: #889aa4;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}
.btn-sendcode {
  color: #467eff;
  background-color: rgba(70, 126, 255, 0.1);
  border: 0;
  font-size: 12px;
  padding: 0;
  width: 84px;
  height: 24px;
}
</style>
