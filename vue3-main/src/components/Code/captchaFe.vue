<template>
  <el-input
    v-model.trim="code"
    class="root_input_code"
    size="large"
    placeholder="请输入验证码"
    :prefix-icon="Lock"
    maxlength="4"
    @keyup.enter="handleLogin"
  >
    <template #append>
      <div
        class="yzcode"
        :style="{ width: width + 'px', height: height + 'px' }"
        @click="OnRefresh()"
      >
        <p ref="picyzm"></p>
      </div>
    </template>
  </el-input>
</template>

<script setup lang="ts">
import { GVerify } from '@/utils/piccode'

const props = defineProps({
  width: {
    type: Number,
    default: 200
  },
  height: {
    type: Number,
    default: 60
  }
})

let verifyCode = null
const picyzm = ref(null)

const state = reactive({
  loading: false,
  code: ''
})
const { code } = toRefs(state)

const code_content = ref('')

//刷新验证码
const OnRefresh = () => {
  verifyCode.refresh()
  const code = verifyCode.GetCode()
  code_content.value = code
}

onMounted(() => {
  picyzm.value && picyzm.value.focus()
  //初始化验证码
  verifyCode = new GVerify({
    type: 'blend',
    height: props.height,
    con: picyzm.value
  })

  //获取验证码内容
  const code = verifyCode.GetCode()
  code_content.value = code
})

/**
 * @description:登录
 * @param {*}
 * @return {*}
 */
const handleLogin = () => {
  const loading = ElLoading.service({
    lock: true,
    text: '正在加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  if (code_content.value.toLowerCase() !== state.code.toLowerCase()) {
    ElMessage({
      type: 'warning',
      message: '验证码输入不正确'
    })
    loading.close()
    verifyCode.refresh()
    const code = verifyCode.GetCode()
    code_content.value = code
    return
  }
}

const PassWordRandom = (count) => {
  const str = 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,0,1,2,3,4,5,6,7,8,9'
  const arr = str.split(',')
  let rand = ''

  for (var i = 0; i < count; i++) {
    rand += arr[Math.floor(Math.random() * 36)]
  }

  return rand
}
</script>

<style lang="scss" scoped></style>
