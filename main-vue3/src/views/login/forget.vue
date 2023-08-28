<template>
  <div class="back">
    <span @click="toLogin"
      ><el-icon><Back /></el-icon> 返回登录</span
    >
  </div>
  <div class="container-forget">
    <div class="forget-content">
      <div class="step-bar">
        <el-steps :active="dialogStep - 1" finish-status="success" align-center class="steps">
          <el-step title="验证身份" />
          <el-step title="设置密码" />
          <el-step title="重置完成" />
        </el-steps>
      </div>
      <div class="step-content">
        <template v-if="dialogStep == 1">
          <el-form
            :model="emailForm"
            :rules="emailRules"
            ref="emailFormRef"
            label-width="100px"
            label-position="top"
          >
            <el-form-item label="邮箱：" prop="email">
              <el-input
                v-model="emailForm.email"
                name="email"
                type="text"
                placeholder="请输入绑定的邮箱"
                ref="emailInputRef"
              >
                <template #suffix>
                  <el-button
                    v-if="notSend"
                    :disabled="disCode || disCode5Min"
                    @click.stop="handleSendCode"
                    class="btn-sendcode"
                    >获取验证码</el-button
                  >
                  <el-button v-else class="btn-sendcode" disabled>
                    {{ countDownTimeSendCode }}s后再获取
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="邮箱验证码：" prop="code">
              <el-input v-model="emailForm.code" placeholder="请输入邮箱验证码" />
            </el-form-item>
          </el-form>
        </template>
        <template v-if="dialogStep == 2">
          <el-form
            :model="pwdForm"
            :rules="pwdRules"
            ref="pwdFormRef"
            label-width="100px"
            label-position="top"
          >
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
        </template>
        <template v-if="dialogStep == 3">
          <div class="finish-content">
            <div class="ok"><img src="@/assets/img/ok.png" alt="" /></div>
            <p class="msg1">重置成功</p>
            <p class="msg2">您可以使用新密码登录了</p>
            <el-button type="primary" @click="toLogin">登录 ({{ countDownTime }}s) </el-button>
          </div>
        </template>
        <div class="handle-box">
          <el-button v-if="dialogStep == 2" @click="ToPrevious()">上一步</el-button>
          <el-button
            v-if="dialogStep == 1"
            type="primary"
            @click="ToNext(emailFormRef)"
            :disabled="errorEmail || errorCode"
            >下一步</el-button
          >
          <el-button
            v-if="dialogStep == 2"
            type="primary"
            @click="handleResetPwd(pwdFormRef)"
            :disabled="errorPwd || errorPwdRe"
            >确认重置</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isValidPassword, isValidEmail2 } from '@/utils/validate'
import { sendCode, verifyCode, setPwd } from '@/api/user'
import { debounce } from 'lodash-es'
const router = useRouter()

const state = reactive({
  dialogStep: 1,
  disCode: true,
  disCode5Min: false,
  notSend: true,
  sendCount: 0, // 点击“获取验证码”次数统计
  emailForm: {
    email: '',
    code: ''
  },
  errorEmail: true,
  errorCode: true,
  pwdForm: {
    new_password: '',
    repassword: ''
  },
  passwordType2: 'password',
  passwordType3: 'password',
  errorPwd: true,
  errorPwdRe: true,
  countDownTime: 3, // 成功后跳转登录页面倒计时
  countDownTimeSendCode: 60, // 获取验证码倒计时
  pageInterval: null
})
const {
  dialogStep,
  disCode,
  disCode5Min,
  notSend,
  pwdForm,
  emailForm,
  errorEmail,
  errorCode,
  passwordType2,
  passwordType3,
  errorPwd,
  errorPwdRe,
  countDownTime,
  countDownTimeSendCode,
  pageInterval
} = toRefs(state)

const emailFormRef = ref<typeof FormInstance>()
const pwdFormRef = ref<typeof FormInstance>()
const emailInputRef = ref()

onMounted(() => {})
onUnmounted(() => {
  localStorage.removeItem('comeTime')
  localStorage.removeItem('lastClickTime')
  state.pageInterval && clearInterval(state.pageInterval)
})

const ToPrevious = () => {
  state.dialogStep = state.dialogStep - 1
}

// 下一步：验证邮箱+验证码
const ToNext = debounce((formEl: typeof FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid: boolean) => {
    if (valid) {
      verifyCode({
        email: state.emailForm.email,
        verificationCode: state.emailForm.code
      })
        .then((res) => {
          const { status, data, msg } = res
          console.log('data=', data)
          if (status == 'ok') {
            console.log('邮箱验证成功')
            state.dialogStep = state.dialogStep + 1
            console.log('step=', state.dialogStep)
            localStorage.setItem('comeTime', new Date().getTime().toString())
            state.pageInterval = setInterval(checkTimeout, 3 * 60 * 1000)
          } else {
            ElMessage.error(msg)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      return false
    }
  })
}, 1000)

const checkTimeout = () => {
  if (timeDiffStay()) {
    clearInterval(state.pageInterval)
    toLogin()
  }
}

const clearAll = () => {
  state.pwdForm = {
    new_password: '',
    repassword: ''
  }
  state.errorPwd = true
  state.errorPwdRe = true
}

// 点击获取验证码
const handleSendCode = () => {
  console.log('点击获取验证码')
  unref(emailFormRef).validateField('email', (valid: boolean) => {
    if (valid) {
      state.disCode = true // 防止点击两次
      state.sendCount = state.sendCount + 1
      console.log('获取次数：', state.sendCount)
      if (state.sendCount == 1) {
        localStorage.removeItem('lastClickTime')
        localStorage.setItem('lastClickTime', new Date().getTime().toString())
      } else if (state.sendCount == 4) {
        const diffMin = timeDifference()
        console.log('diffMin=', diffMin)
        if (diffMin <= 5) {
          ElMessage('请求过于频繁，建议5分钟后再试')
          state.sendCount = 0
          state.disCode5Min = true
          const times = setTimeout(() => {
            console.log('禁止时间到了')
            nextTick(() => {
              state.disCode5Min = false
              state.disCode = false
            })
            clearInterval(times)
          }, 1000 * 60 * 5)
          return
        }
      }
      // 触发倒计时
      state.notSend = false
      handleCountDownTimeSendCode()
      sendCode({
        email: state.emailForm.email
      })
        .then((res) => {
          const { status, data, msg } = res
          console.log('data=', data)
          if (status == 'ok') {
            console.log('验证码已发送')
          } else {
            ElMessage.error(msg)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      return false
    }
  })
}

// 重置密码操作
const handleResetPwd = (formEl: typeof FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid: boolean) => {
    if (valid) {
      setPwd({
        email: state.emailForm.email,
        verificationCode: state.emailForm.code,
        password: state.pwdForm.new_password
      })
        .then((res) => {
          const { status, data, msg } = res
          console.log('data=', data)
          if (status == 'ok') {
            console.log('重置密码成功')
            state.dialogStep = state.dialogStep + 1
            console.log('step=', state.dialogStep)
            handleCountDownTime()
          } else {
            ElMessage.error(msg)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      return false
    }
  })
}

// 3s倒计时返回
const handleCountDownTime = () => {
  const times = setInterval(() => {
    state.countDownTime-- //递减
    if (state.countDownTime === 0) {
      clearInterval(times)
      toLogin()
    }
  }, 1000)
}

// 发送验证码60s倒计时
const handleCountDownTimeSendCode = () => {
  state.countDownTimeSendCode = 60
  const times = setInterval(() => {
    state.countDownTimeSendCode-- //递减
    if (state.countDownTimeSendCode === 0) {
      clearInterval(times)
      state.notSend = true
      state.disCode = false
    }
  }, 1000)
}

const toLogin = () => {
  router.push({ path: '/login' })
}

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

const validateEmail = (_rule: any, value: string, callback: Function) => {
  if (!isValidEmail2(value)) {
    callback(new Error('请输入正确的邮箱'))
    state.disCode = true
  } else if (/\s/.test(value)) {
    // 包含空格
    callback(new Error('请输入正确的邮箱'))
    state.disCode = true
  } else if (value.length > 64) {
    callback(new Error('邮件地址过长，建议不超过 64 个字符'))
    state.disCode = true
  } else {
    state.errorEmail = false
    state.disCode = false
    callback()
  }
}

const validateCode = (_rule: any, value: string, callback: Function) => {
  if (value) {
    state.errorCode = false
    callback()
  }
}

const emailRules = reactive({
  email: [
    { required: true, message: '请输入绑定的邮箱', trigger: 'blur' },
    { validator: validateEmail, trigger: ['blur', 'change'] }
  ],
  code: [
    { required: true, message: '请输入邮箱验证码', trigger: 'blur' },
    { validator: validateCode, trigger: ['blur', 'change'] }
  ]
})
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

// 返回间隔分钟数
const timeDifference = () => {
  const lastTime = Number(localStorage.getItem('lastClickTime'))
  const currentTime = new Date().getTime()
  let diff = currentTime - lastTime
  console.log('diff=', diff, diff / (60 * 1000))
  return diff / (60 * 1000)
}

// 返回true-停留时间已满30min
const timeDiffStay = () => {
  const timeOut = 30 * 60 * 1000 // 设置超时时间： 30分种
  const lastTime = Number(localStorage.getItem('comeTime'))
  const currentTime = new Date().getTime()
  let diff = currentTime - lastTime
  console.log('diff=', diff, timeOut)
  if (diff > timeOut) {
    return true
  } else {
    return false
  }
}
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
    flex-basis: 33% !important;
    .el-step__line {
      background-color: rgba(0, 0, 0, 0.15);
      margin-right: 20px !important;
      margin-left: 90px !important;
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
      top: calc(50% - 18px);
      left: calc(50% + 20px);
    }
  }
}
.step-content {
  width: 370px;
  margin: 0 auto;
  margin-top: 32px;
}
.forget-content {
  width: 600px;
  margin: 0 auto;
  padding: 28px 0;
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
.is-disabled.btn-sendcode {
  background-color: #f6f8fa;
}
.btn-sendcode.is-disabled:hover {
  background-color: #f6f8fa;
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
.handle-box {
}
.finish-content {
  text-align: center;
  .ok {
    width: 42px;
    height: 42px;
    margin: 0 auto;
    img {
      width: 100%;
    }
  }
}
.msg1 {
  font-size: 16px;
  font-weight: 500;
  margin-top: 16px;
}
.msg2 {
  font-size: 14px;
  color: #606266;
  margin: 8px 0 32px;
}
.back {
  width: 80%;
  margin: 0 auto;
  padding: 16px 0;
  cursor: pointer;
  color: #303133;
}
.container-forget {
  width: 80%;
  min-width: 978px;
  height: 100%;
  margin: 0 auto;
  background-color: #fff;
}
</style>
