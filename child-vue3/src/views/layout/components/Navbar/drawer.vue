<template>
  <el-drawer
    ref="drawerRef"
    v-model="showDrawer"
    :title="props.type == 1 ? '修改密码' : '修改手机号'"
    :before-close="handleClose"
    direction="rtl"
    :close-on-click-modal="false"
  >
    <div class="drawer__content">
      <div class="pwd" v-if="props.type == 1">
        <el-form :model="pwdForm" :rules="pwdRules" ref="pwdFormRef" label-width="100px">
          <el-form-item label="原密码：" prop="old_password">
            <el-input
              v-model="pwdForm.old_password"
              :type="passwordType1"
              autocomplete="off"
              placeholder="请输入原密码"
              @change="changeOldPwd"
            />
            <div class="my-error" v-if="pwdForm.old_password && state.pwdForm.oldPwdError">
              原密码错误
            </div>
            <el-icon class="show-pwd" @click.prevent="handleShowPwd(1)">
              <component :is="passwordType1 === 'password' ? 'hide' : 'view'" />
            </el-icon>
          </el-form-item>
          <el-form-item label="新密码：" prop="new_password">
            <el-input
              v-model="pwdForm.new_password"
              :type="passwordType2"
              autocomplete="off"
              placeholder="8~20位含有数字、字母、符号三项的组合"
            />
            <el-icon class="show-pwd" @click.prevent="handleShowPwd(2)">
              <component :is="passwordType2 === 'password' ? 'hide' : 'view'" />
            </el-icon>
          </el-form-item>
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
      <div class="phone" v-if="props.type == 2">
        <el-form :model="mobileForm" :rules="mobileRules" ref="mobileFormRef" label-width="100px">
          <el-form-item label="新手机号：" prop="mobile">
            <el-input v-model="mobileForm.mobile" autocomplete="off" placeholder="请输入手机号" />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <template #footer>
      <el-button @click="cancelForm">取消</el-button>
      <el-button
        v-if="props.type == 1"
        type="primary"
        @click="Sumbit(pwdFormRef)"
        :disabled="disSubmitPwd"
        >提交</el-button
      >
      <el-button
        v-if="props.type == 2"
        type="primary"
        @click="Sumbit(mobileFormRef)"
        :disabled="disSubmitPhone"
        >提交</el-button
      >
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import FormInstance from 'element-plus'
import { ElMessage, ElNotification, ElDrawer } from 'element-plus'
import { updateUserPwd, updateUserPhone } from '@/api/user'
import { useUserStore } from '@/store/modules/user'
import { validatePhone } from '@/utils/validate'

const userStore = useUserStore()

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: Number,
    default: 1
  }
})
const myEmit = defineEmits(['handleDrawer'])

const pwdFormRef = ref<typeof FormInstance>()
const mobileFormRef = ref<typeof FormInstance>()
const drawerRef = ref<InstanceType<typeof ElDrawer>>()

const state = reactive({
  drawActive: 'first',
  pwdForm: {
    old_password: '',
    new_password: '',
    repassword: '',
    oldPwdError: false
  },
  mobileForm: {
    mobile: ''
  },
  passwordType1: 'password',
  passwordType2: 'password',
  passwordType3: 'password'
})
const { drawActive, pwdForm, mobileForm, passwordType1, passwordType2, passwordType3 } =
  toRefs(state)

const showDrawer = computed({
  get: () => props.show,
  set: () => {}
})

const disSubmitPwd = computed(() => {
  if (!state.pwdForm.old_password || !state.pwdForm.new_password || !state.pwdForm.repassword) {
    return true
  } else {
    return false
  }
})

const disSubmitPhone = computed(() => {
  if (!state.mobileForm.mobile) {
    return true
  } else {
    return false
  }
})

const clearAll = () => {
  state.pwdForm = {
    old_password: '',
    new_password: '',
    repassword: '',
    oldPwdError: false
  }
  state.mobileForm = {
    mobile: ''
  }
}

const handleShowPwd = (index: number) => {
  console.log('handleShowPwd')
  if (state['passwordType' + index] === 'password') {
    state['passwordType' + index] = ''
  } else {
    state['passwordType' + index] = 'password'
  }
  console.log('state===', state)
}

const changeOldPwd = () => {
  state.pwdForm.oldPwdError = false
}

const handleClose = () => {
  clearAll()
  myEmit('handleDrawer', false)
}

const cancelForm = () => {
  clearAll()
  myEmit('handleDrawer', false)
}

const validatePassword = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入新密码'))
  } else if (/\s/.test(value)) {
    // 包含空格
    callback(new Error('密码不能含有空格'))
  } else if (value == state.pwdForm.old_password) {
    callback(new Error('新密码和原密码不可相同'))
  } else if (!isValidPassword(value)) {
    callback(new Error('请输入8~20位含有数字、字母、符号三项的组合'))
  } else {
    callback()
  }
}
var validatePass2 = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入新密码'))
  } else if (value !== state.pwdForm.new_password) {
    callback(new Error('两次输入的新密码不同'))
  } else {
    callback()
  }
}
// 8~20位含有数字、字母、符号三项的组合
//“”"‘’'-()（）!！[]。.,，；;:：/`/
// /^[0-9\u4e00-\u9fa5a-zA-Z0-9“”"‘’/'\-()\[\]!！@#$￥%^&*{}<>《》·`。.,，；;：【】:（）]{0,50}$/
const isValidPassword = (str: string) => {
  const reg =
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[“”"‘’/'\-()\[\]!！@#$￥%^&*{}<>《》·`。.,，；;：【】:（）]).{8,20}$/g
  // const reg = /^[a-zA-Z0-9“”"‘’/'\-()\[\]!！@#$￥%^&*{}<>《》·`。.,，；;：【】:（）]{8,20}$/
  const v1 = reg.test(str)
  return v1
}
// const isValidPhone = (str: string) => {
//   const reg1 = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
//   const v1 = reg1.test(str)
//   return v1
// }

// const validatePhone = (rule: any, value: string, callback: Function) => {
//   if (!isValidPhone(value)) {
//     callback(new Error('请输入正确的手机号'))
//   } else {
//     callback()
//   }
// }

const pwdRules = reactive({
  old_password: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  new_password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' },
    { validator: validatePassword, trigger: 'change' }
  ],
  repassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { validator: validatePass2, trigger: 'blur' },
    { validator: validatePass2, trigger: 'change' }
  ]
})

const mobileRules = reactive({
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { validator: validatePhone, trigger: 'blur' },
    { validator: validatePhone, trigger: 'change' }
  ]
})

//重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const Sumbit = (formEl: typeof FormInstance | undefined) => {
  if (!formEl) return

  formEl.validate((valid: boolean) => {
    if (valid) {
      console.log(8888, props.type)
      if (props.type == 1) {
        let fd: { new_password: string; old_password: string; op: string }
        fd = Object.assign(state.pwdForm, {
          op: 'change_pwd',
          id: userStore.userInfo.id
        })
        console.log(777, fd)
        updateUserPwd(fd)
          .then((res: any) => {
            const { status, data, msg } = res
            if (status == 200) {
              resetForm(formEl)
              myEmit('handleDrawer', false)
              ElMessage.success('密码修改成功，请重新登录')
              setTimeout(() => {
                userStore.autoOut()
              }, 3000)
            } else if (status == 100) {
              ElMessage.error(msg)
              resetForm(formEl)
            } else {
              ElMessage.error(msg)
            }
          })
          .catch((error: any) => {
            console.log(error)
          })
      } else if (props.type == 2) {
        console.log(999)
        let fd: { mobile: string; op: string }
        fd = Object.assign(state.mobileForm, {
          op: 'update_phone',
          id: userStore.userInfo.id
        })
        console.log(777, fd)
        updateUserPhone(fd)
          .then((res: any) => {
            const { status, data, msg } = res
            if (status == 200) {
              resetForm(formEl)
              myEmit('handleDrawer', false)
              ElMessage.success('手机号修改成功')
              // ElMessage.success('手机号修改成功，请重新登录')
              // setTimeout(() => {
              //   userStore.autoOut()
              // }, 3000)
            } else if (status == 100) {
              ElMessage.error(msg)
              resetForm(formEl)
            } else {
              ElMessage.error(msg)
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

// const onInputOldPwd = (value: string) => {
//   const formData = unref(pwdFormRef)?.formModel
//   oldPwdDisable.value = !value || !isValidPwd(value) || value == formData.password
// }
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
}
.left-img {
  width: 24px;
  height: 24px;
  margin-right: 10px;
  img {
    width: 100%;
  }
}
.el-form-item {
  margin-bottom: 24px;
}

.show-pwd {
  position: absolute;
  right: 10px;
  top: calc(50% - 8px);
  font-size: 16px;
  color: #889aa4;
  cursor: pointer;
  user-select: none;
}
</style>
