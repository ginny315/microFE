<template>
  <div class="container-simple">
    <div class="info-header">
      <span v-if="showType == 1">修改密码</span>
      <span v-if="showType == 2">修改手机号</span>
      <span v-if="showType == 3">修改邮箱</span>
    </div>
    <div class="info-form pwd" v-if="showType == 1">
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
    <div class="info-form phone" v-if="showType == 2">
      <el-form :model="mobileForm" :rules="mobileRules" ref="mobileFormRef" label-width="100px">
        <el-form-item label="原手机号：" prop="old_mobile">
          <!-- <el-input
            v-model="mobileForm.old_mobile"
            autocomplete="off"
            placeholder="请输入原手机号"
          /> -->
          <span class="show-info"> {{ userInfo.phone }}</span>
        </el-form-item>
        <el-form-item label="新手机号：" prop="mobile">
          <el-input v-model="mobileForm.mobile" autocomplete="off" placeholder="请输入新手机号" />
        </el-form-item>
      </el-form>
    </div>
    <div class="info-form email" v-if="showType == 3">
      <el-form :model="emailForm" :rules="emailRules" ref="emailFormRef" label-width="100px">
        <el-form-item label="原邮箱：" prop="old_email">
          <!-- <el-input
            v-model="emailForm.old_email"
            autocomplete="off"
            placeholder="请输入原邮箱地址"
          /> -->
          <span class="show-info"> {{ userInfo.email }}</span>
        </el-form-item>
        <el-form-item label="新邮箱：" prop="email">
          <el-input v-model="emailForm.email" autocomplete="off" placeholder="请输入新邮箱地址" />
        </el-form-item>
      </el-form>
    </div>
    <div class="handle-box">
      <el-button
        v-if="showType == 1"
        type="primary"
        @click="Sumbit(pwdFormRef)"
        :disabled="errorPwd || errorPwdRe"
        >确 定</el-button
      >
      <el-button
        v-if="showType == 2"
        type="primary"
        @click="Sumbit(mobileFormRef)"
        :disabled="errorPhone"
        >确 定</el-button
      >
      <el-button
        v-if="showType == 3"
        type="primary"
        @click="Sumbit(emailFormRef)"
        :disabled="errorEmail"
        >确 定</el-button
      >
      <el-button @click="cancelForm">取 消</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user'
import { updateUserPwd, updateUserInfo } from '@/api/user'
import { isValidPhoneStrict, isValidEmail2, isValidPassword } from '@/utils/validate'
import { formItemValidateStates } from 'element-plus'

const router = useRouter()
const route = useRoute()

const userStore = useUserStore()
const userInfo = userStore.userInfo
console.log('userInfo=', userInfo)

const showType = ref('')
const pwdFormRef = ref<typeof FormInstance>()
const mobileFormRef = ref<typeof FormInstance>()
const emailFormRef = ref<typeof FormInstance>()

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const type = params.get('type')
  console.log('type=', type)
  if (type == '1' || type == '2' || type == '3') {
    showType.value = type
  } else {
    router.push({ path: '/' })
  }
})

// const showType = computed(() => {
//   const params = new URLSearchParams(window.location.search)
//   console.log('params=', params)
//   return params.get('type')
// })

// TODO:待优化
watch(route, () => {
  console.log(route.query.type)
  showType.value = route.query.type
})

const state = reactive({
  drawActive: 'first',
  pwdForm: {
    new_password: '',
    repassword: '',
    oldPwdError: false
  },
  mobileForm: {
    mobile: ''
  },
  emailForm: {
    email: ''
  },
  passwordType1: 'password',
  passwordType2: 'password',
  passwordType3: 'password',
  errorPwd: true,
  errorPwdRe: true,
  errorEmail: true,
  errorPhone: true
})
const {
  pwdForm,
  mobileForm,
  emailForm,
  passwordType1,
  passwordType2,
  passwordType3,
  errorPwd,
  errorPwdRe,
  errorEmail,
  errorPhone
} = toRefs(state)

// const disSubmitPwd = computed(() => {
//   if (!state.pwdForm.new_password || !state.pwdForm.repassword) {
//     return true
//   } else {
//     return false
//   }
// })

// const disSubmitPhone = computed(() => {
//   if (!state.mobileForm.mobile) {
//     return true
//   } else {
//     return false
//   }
// })

// const disSubmitEmail = computed(() => {
//   if (!state.emailForm.email) {
//     return true
//   } else {
//     return false
//   }
// })

const clearAll = () => {
  state.pwdForm = {
    new_password: '',
    repassword: '',
    oldPwdError: false
  }
  state.mobileForm = {
    mobile: ''
  }
  state.emailForm = {
    email: ''
  }
  state.errorPwd = true
  state.errorPwdRe = true
  state.errorEmail = true
  state.errorPhone = true
}

const handleShowPwd = (index: number) => {
  console.log('handleShowPwd')
  if (state['passwordType' + index] === 'password') {
    state['passwordType' + index] = ''
  } else {
    state['passwordType' + index] = 'password'
  }
}

const cancelForm = () => {
  clearAll()
  router.push({ path: '/' })
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

const validatePhoneStrict = (rule: any, value: string, callback: Function) => {
  if (!isValidPhoneStrict(value)) {
    callback(new Error('请输入正确的手机号'))
  } else if (value === userInfo.phone) {
    callback(new Error('新手机号与原手机号相同'))
  } else {
    callback()
    state.errorPhone = false
  }
}

const validateEmail = (rule: any, value: string, callback: Function) => {
  if (!isValidEmail2(value)) {
    callback(new Error('请输入正确的邮箱'))
  } else if (/\s/.test(value)) {
    // 包含空格
    callback(new Error('请输入正确的邮箱'))
  } else if (value.length > 64) {
    callback(new Error('邮件地址过长，建议不超过 64 个字符'))
  } else if (value === userInfo.email) {
    callback(new Error('邮箱地址相同'))
  } else {
    callback()
    state.errorEmail = false
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

const mobileRules = reactive({
  mobile: [
    { required: true, message: '请输入新手机号', trigger: 'blur' },
    { validator: validatePhoneStrict, trigger: ['blur', 'change'] }
  ]
})

const emailRules = reactive({
  email: [
    { required: true, message: '请输入新邮箱地址', trigger: 'blur' },
    { validator: validateEmail, trigger: ['blur', 'change'] }
  ]
})

// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

// 提交表单，status ok成功，error失败，其中invalid JWT token 需要重新登录
const Sumbit = (formEl: typeof FormInstance | undefined) => {
  if (!formEl) return
  console.log('showType=', showType.value)
  formEl.validate((valid: boolean) => {
    if (valid) {
      if (showType.value == 1) {
        let fd: { new_password: string }
        fd = {
          new_password: state.pwdForm.new_password
        }
        updateUserPwd(fd)
          .then((res: any) => {
            const { status, data, msg } = res
            if (status == 'ok') {
              ElMessage.success('密码修改成功，请重新登录')
              // resetForm(formEl)
              TimeLogout()
            } else if (status == 'error' && msg.indexOf('invalid JWT token') > -1) {
              ElMessage.info('token已过期，请重新登录')
              TimeLogout()
            } else {
              ElMessage.info(msg)
            }
          })
          .catch((error: any) => {
            console.log(error)
          })
      } else if (showType.value == 2) {
        let fd: { phone: string }
        fd = {
          phone: state.mobileForm.mobile
        }
        updateUserInfo(fd)
          .then((res: any) => {
            const { status, data, msg } = res
            if (status == 'ok') {
              // ElMessage.success('手机号修改成功')
              ElMessage.success('手机号修改成功，请重新登录')
              // resetForm(formEl)
              TimeLogout()
            } else if (status == 'error' && msg.indexOf('invalid JWT token') > -1) {
              ElMessage.info('token已过期，请重新登录')
              TimeLogout()
            } else {
              ElMessage.info(msg)
            }
          })
          .catch((error: any) => {
            console.log(error)
          })
      } else if (showType.value == 3) {
        let fd: { email: string }
        fd = {
          email: state.emailForm.email
        }
        updateUserInfo(fd)
          .then((res: any) => {
            const { status, data, msg } = res
            if (status == 'ok') {
              // ElMessage.success('邮箱修改成功')
              ElMessage.success('邮箱修改成功，请重新登录')
              // resetForm(formEl)
              TimeLogout()
            } else if (status == 'error' && msg.indexOf('invalid JWT token') > -1) {
              ElMessage.info('token已过期，请重新登录')
              TimeLogout()
            } else {
              ElMessage.info(msg)
            }
          })
          .catch((error: any) => {
            console.log(error)
          })
      } else {
      }
    } else {
      return false
    }
  })
}

const TimeLogout = () => {
  setTimeout(() => {
    userStore.userLogOut()
  }, 3000)
}
</script>

<style lang="scss" scoped>
.info-header {
  font-size: 18px;
  font-weight: 500;
  color: #5e6166;
  text-align: center;
  padding: 48px 0 24px;
  transform: translateX(-200px);
}
.el-input {
  width: 352px;
}
.info-form {
  width: 460px;
  margin: 0 auto;
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
.el-card {
  box-sizing: border-box;
  cursor: pointer;
  height: 100%;
  img {
    width: 100%;
  }
}
.show-info {
  color: #606266;
}
.el-col {
  margin-bottom: 20px;
}
.handle-box {
  transform: translateX(-58px);
  background-color: transparent;
}
</style>
