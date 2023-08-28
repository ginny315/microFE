<template>
  <div class="login-container">
    <div class="login-box">
      <div class="left">
        <img src="@/assets/img/login-left.png" />
      </div>
      <div class="right">
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          autocomplete="off"
          label-position="left"
        >
          <div class="title-container">
            <div class="title-main">
              <div class="logo">
                <img src="@/assets/img/logo.png" alt="" />
              </div>
              <span>太初产品生命周期系统</span>
            </div>
            <p class="title-welcome">欢迎登录</p>
          </div>

          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              name="username"
              type="text"
              placeholder="请输入用户名或手机号"
              autocomplete="off"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              placeholder="请输入密码"
              name="password"
              :type="passwordType"
              autocomplete="off"
              @keyup.enter="handleLogin(loginFormRef)"
            />
            <el-icon class="show-pwd" @click.prevent="handleShowPwd">
              <component :is="passwordType === 'password' ? 'hide' : 'view'" />
            </el-icon>
          </el-form-item>
          <el-checkbox v-model="checked" label="下次自动登录" name="type" />
          <el-button
            type="primary"
            style="width: 100%; margin-bottom: 30px"
            @click.prevent="handleLogin(loginFormRef)"
            >登 录</el-button
          >
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import FormInstance from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { Base64 } from 'js-base64'

const userStore = useUserStore()
const state = reactive({
  loginForm: {
    username: '',
    password: ''
  },
  passwordType: 'password',
  checked: false
})
const { loginForm, passwordType, checked } = toRefs(state)

onMounted(() => {
  let username = localStorage.getItem('username')
  if (username) {
    state.loginForm.username = localStorage.getItem('username') || ''
    state.loginForm.password = Base64.decode(localStorage.getItem('password')) || '' // base64解密
    state.checked = true
  }
})

const handleLogin = (formEl: typeof FormInstance) => {
  console.log('start login')
  formEl.validate((valid: boolean) => {
    if (valid) {
      /* ------ 账号密码的存储 ------ */
      if (state.checked) {
        let password = Base64.encode(state.loginForm.password) // base64加密
        localStorage.setItem('username', state.loginForm.username)
        localStorage.setItem('password', password)
      } else {
        localStorage.removeItem('username')
        localStorage.removeItem('password')
      }
      // const loginParams = {
      //   username: state.loginForm.username,
      //   password: Base64.encode(state.loginForm.password)
      // }
      userStore.login(state.loginForm)
    } else {
      return false
    }
  })
}

const handleShowPwd = () => {
  console.log('handleShowPwd')
  if (state.passwordType === 'password') {
    state.passwordType = ''
  } else {
    state.passwordType = 'password'
  }
}

const loginFormRef = ref<typeof FormInstance>()

const loginRules = {
  username: [{ required: true, message: '请输入用户名或手机号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}
</script>

<style lang="scss">
@supports (-webkit-mask: none) and (not (caret-color: #fff)) {
  .login-container .el-input {
    input {
      color: #fff;
    }
    input::first-line {
      color: #eee;
    }
  }
}
.login-container {
  .el-input {
    display: inline-block;
    // height: 47px !important;
    //width: 85%;
    input {
      height: 100% !important;
      background: transparent;
      border: 0px;
      border-radius: 0px;
      // padding: 12px 5px 12px 15px;
      padding: 8px 5px 8px 15px;
      caret-color: #889aa4;
      -webkit-appearance: none;
    }
    .el-input__wrapper {
      width: 100%;
      background-color: #fff;
      box-shadow: none;
      padding: 3px 11px;
    }
    .el-input__inner {
      background-color: #fff;
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
.login-container::-webkit-scrollbar {
}
.login-container {
  display: flex;
  align-items: center;
  position: relative;
  // height: 100%;
  // width: 100%;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  background-image: url('@/assets/img/login-bg.png');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  .login-form {
    position: relative;
    width: 100%;
    padding: 100px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .icon-container {
    padding: 6px 5px 6px 15px;
    color: #889aa4;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title-container {
    position: relative;
    .title-welcome {
      font-size: 16px;
      color: #262729;
      text-align: center;
      padding: 16px 0;
    }
    .title-main {
      font-size: 18px;
      line-height: 26px;
      display: flex;
      justify-content: center;
      padding: 16px 0;
    }
    .logo {
      width: 26px;
      margin-right: 8px;
      img {
        width: 100%;
      }
    }
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
}
.el-button {
  margin-top: 16px;
  padding: 20px !important;
}
.login-box {
  display: flex;
  align-items: center;
  width: 880px;
  min-width: 880px;
  height: 550px;
  min-height: 550px;
  margin: 0px auto;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 0px 20px 12px rgba(70 126 255 / 12%);
  .left {
    width: 600px;
    img {
      width: 100%;
    }
  }
  .right {
    width: 380px;
    height: 100%;
    background-color: #fff;
  }
}
</style>
