<script setup>
import { useUserStore } from '@/store/modules/user'
import { useCasdoor } from 'casdoor-vue-sdk'

const { signin } = useCasdoor()
const router = useRouter()
const route = useRoute()

const userStore = useUserStore()
onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  if (code) {
    initPage() // casdoor signin
  } else {
    // router.push({ path: '/login' })
    userStore.autoOut()
  }
})

const currentEnv = import.meta.env.VITE_APP_TITLE
const env = import.meta.env
let backend
if (env.VITE_APP_MULTI === 'true') {
  backend = window.g.backend
} else {
  backend = window.APP_CONFIG[currentEnv]?.backend
}
console.log('currentEnv=', currentEnv, 'backend=', backend)
const initPage = async () => {
  signin(backend).then(async (res) => {
    console.log('init page res=', res)
    if (res.status === 'ok') {
      const token = res.data.accessToken
      if (inIframe()) {
        const message = { tag: 'Casdoor', type: 'SilentSignin', data: 'success' }
        window.parent.postMessage(message, '*')
      }
      await userStore.casdoorLogin(token)
      console.log('Login success')
      router.push({ path: '/' })
    } else {
      console.log('Login failed')
      ElMessage.error('登录失败')
      await userStore.autoOut()
      router.push({ path: '/login' })
      window.location.reload()
    }
  })
}

const inIframe = () => {
  try {
    return window !== window.parent
  } catch (e) {
    return true
  }
}
</script>

<style scoped></style>
