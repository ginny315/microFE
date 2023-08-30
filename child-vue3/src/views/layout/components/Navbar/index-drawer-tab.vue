<template>
  <div>
    <div class="navbar-wrapper">
      <div class="navbar" :class="isActive ? '' : 'navbar-close'">
        <div class="left-logo">
          <div class="logo">
            <img src="@/assets/img/logo.png" alt="" />
          </div>
          <span>生命周期管理平台</span>
        </div>
        <Hamburger
          v-if="props.type === 'normal'"
          id="hamburger-container"
          class="hamburger-container"
          :is-active="isActive"
          @click="toggleSideBar()"
        />
        <div class="right-menu">
          <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="hover">
            <div class="avatar-wrapper">
              <img v-if="is_super" src="@/assets/img/admin.png" class="user-avatar" />
              <img v-else src="@/assets/img/user.png" class="user-avatar" />
              <span>User</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  @click="openMyInfo"
                  @mouseenter="handleHover(1, true)"
                  @mouseleave="handleHover(1, false)"
                >
                  <div class="left-img">
                    <img v-if="!state.hoverInfo" src="@/assets/img/my-info.png" alt="" />
                    <img v-else src="@/assets/img/my-info-active.png" alt="" />
                  </div>
                  <span style="display: block">个人中心</span>
                </el-dropdown-item>
                <el-dropdown-item
                  divided
                  @click="logout"
                  @mouseenter="handleHover(2, true)"
                  @mouseleave="handleHover(2, false)"
                >
                  <div class="left-img">
                    <img v-if="!state.hoverLogout" src="@/assets/img/logout.png" alt="" />
                    <img v-else src="@/assets/img/logout-active.png" alt="" />
                  </div>
                  <span style="display: block">退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
    <el-drawer
      ref="drawerRef"
      v-model="dialog"
      title="修改个人信息"
      :before-close="handleClose"
      direction="rtl"
      :close-on-click-modal="false"
    >
      <div class="drawer__content">
        <el-tabs v-model="drawActive" type="card">
          <el-tab-pane label="修改密码" name="first">
            <el-form :model="pwdForm" :rules="pwdRules" ref="pwdFormRef">
              <el-form-item label="新密码" label-width="80px" prop="password">
                <el-input v-model="pwdForm.password" type="password" autocomplete="off" />
              </el-form-item>
              <el-form-item label="确认密码" label-width="80px" prop="repassword">
                <el-input v-model="pwdForm.repassword" type="password" autocomplete="off" />
              </el-form-item>
              <div class="drawer__footer">
                <el-button @click="cancelForm">取消</el-button>
                <el-button type="primary" :loading="loading" @click="Sumbit(pwdFormRef, 1)">{{
                  loading ? '提交中 ...' : '确认'
                }}</el-button>
              </div>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="修改手机号" name="second">
            <el-form :model="phoneForm" :rules="phoneRules" ref="phoneFormRef">
              <el-form-item label="新手机号" label-width="80px" prop="phone">
                <el-input v-model="phoneForm.phone" autocomplete="off" />
              </el-form-item>
              <div class="drawer__footer">
                <el-button @click="cancelForm">取消</el-button>
                <el-button type="primary" :loading="loading" @click="Sumbit(phoneFormRef, 2)">{{
                  loading ? '提交中 ...' : '确认'
                }}</el-button>
              </div>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import Hamburger from '@/components/Hamburger/index.vue'
import { useAppStoreWithOut } from '@/store/modules/app'
import { useUserStoreWithOut } from '@/store/modules/user'
import FormInstance from 'element-plus'
import { validatePhone } from '@/utils/validate'
import { ElMessage, ElNotification, ElDrawer } from 'element-plus'
import { updateUserPwd } from '@/api/user'

const props = defineProps<{
  type: string
}>()
const userStore = useUserStoreWithOut()
const is_super = userStore.getUserInfo?.is_super || false
const router = useRouter()
const state = reactive({
  hoverInfo: false,
  hoverLogout: false,
  drawActive: 'first',
  pwdForm: {
    password: '',
    repassword: ''
  },
  phoneForm: {
    phone: ''
  }
})
const { hoverInfo, hoverLogout, drawActive, pwdForm, phoneForm } = toRefs(state)
const dialog = ref(false)
const loading = ref(false)
const pwdFormRef = ref<typeof FormInstance>()
const phoneFormRef = ref<typeof FormInstance>()
const drawerRef = ref<InstanceType<typeof ElDrawer>>()

var validatePass2 = (rule: any, value: string, callback: Function) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== state.pwdForm.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const openMyInfo = () => {
  dialog.value = true
}

const logout = () => {
  userStore.logOut()
}

const handleHover = (flag: Number, action: any) => {
  if (flag == 1) {
    state.hoverInfo = action
  } else if (flag == 2) {
    state.hoverLogout = action
  }
}
const handleClose = () => {
  if (loading.value) {
    return
  }
  drawerRef.value!.close()
}

const cancelForm = () => {
  dialog.value = false
  drawerRef.value!.close()
}
const appStore = useAppStoreWithOut()

const toggleSideBar = () => {
  console.log('toggleSideBar!!!')
  const opened = appStore.getSidebar?.opened
  appStore.toggleSideBar(!opened)
}

const isActive = computed(() => {
  const isActive = appStore.getSidebar?.opened
  return isActive
})

const pwdRules = reactive({
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  repassword: [{ required: true, validator: validatePass2, trigger: 'blur' }]
})

const phoneRules = reactive({
  phone: [
    { required: true, message: '请输入手机号', trigger: ['blur', 'change'] },
    { validator: validatePhone, trigger: ['blur', 'change'] }
  ]
})

const Sumbit = (formEl: FormInstance | undefined, type: number) => {
  if (!formEl) return
  let fd: { password: string }
  fd = { ...state.pwdForm }
  formEl.validate((valid: boolean) => {
    if (valid) {
      updateUserPwd(fd)
        .then((res: { data: { status: any; data: any; msg: any } }) => {
          const { status, data, msg } = res.data
          console.log('data=', data)
          if (status == 200) {
            ElNotification({
              title: '操作成功',
              message: h('i', { style: 'color: teal' }, '用户信息已更新！')
            })
          } else {
            ElMessage.error(msg + '无法更新，请重试！')
          }
        })
        .catch((error: any) => {
          console.log(error)
        })
      state.pwdForm = { password: '', repassword: '' }
      drawerRef.value!.close()
    } else {
      return false
    }
  })
  // logout();
}
</script>

<style lang="scss" scoped>
.navbar-wrapper {
  width: 100vw;
  position: fixed;
  z-index: 999;
  height: 64px;
}
.navbar-close {
  transition: 0.1s padding-left ease-in-out;
}
.navbar {
  height: 100%;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .hamburger-container {
    color: #000;
    height: 100%;
    display: flex;
    align-items: center;
    float: left;
    margin-left: 20px;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;
  }
  .left-logo {
    float: left;
    height: 100%;
    display: flex;
    align-items: center;
    width: 208px;
    // border-bottom: 1px solid #eee;
    .logo {
      width: 32px;
      margin: 0 8px;
      img {
        display: flex;
        align-items: center;
        width: 100%;
      }
    }
    span {
      line-height: 64px;
      font-size: 18px;
      color: #262729;
      font-weight: 500;
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
  .right-menu-item {
    display: inline-block;
    padding: 0 8px;
    height: 100%;
    font-size: 18px;
    color: #5a5e66;
    vertical-align: text-bottom;
    &.hover-effect {
      cursor: pointer;
      transition: background 0.3s;
      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
  }
  .avatar-container {
    margin-right: 30px;
    vertical-align: middle;
    .avatar-wrapper {
      position: relative;
      height: 64px;
      display: flex;
      align-items: center;
      .user-avatar {
        cursor: pointer;
        width: 24px;
        height: 24px;
        border-radius: 12px;
        vertical-align: middle;
      }
      span {
        font-size: 14px;
        padding-left: 8px;
      }
      .el-icon-caret-bottom {
        cursor: pointer;
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
}
.drawer__footer {
  text-align: right;
}
.left-img {
  width: 24px;
  height: 24px;
  margin-right: 10px;
  img {
    width: 100%;
  }
}
</style>
