import { createApp } from 'vue'
import 'normalize.css'
// import '@/assets/scss/index.scss'
import ElementUI from 'element-plus'
import zh from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElIconModules from '@element-plus/icons-vue'
// import '@/assets/scss/element-variables.scss'
import App from './App.vue'
import { setupStore } from '@/store'
import router from './router'
// import router from './router/index1'
import '@/permission'
import Casdoor from 'casdoor-vue-sdk'
import { registerMicroApps, start } from 'qiankun'

// const redirectPath = import.meta.env.MODE == 'dev' ? '/cb' : '/ums/cb'
const env = import.meta.env
const currentEnv = env.VITE_APP_TITLE
let config = console.log(env, currentEnv)
if (env.VITE_APP_MULTI === 'true') {
  config = window.g.casdoor
} else {
  config = window.APP_CONFIG[currentEnv]?.casdoor
}
// console.log('casdoor config=', config)

const app = createApp(App)
app.use(ElementUI, {
  locale: zh
})
app.use(Casdoor, config)

Object.keys(ElIconModules).forEach((key) => {
  app.component(key, ElIconModules[key])
})
setupStore(app)
app.directive('loadmore', {
  mounted(el, binding) {
    console.log(el, binding)
    const dom = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
    console.log(dom)
    // const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
    // SELECTWRAP_DOM.addEventListener('scroll', function () {
    //   const condition = this.scrollHeight - this.scrollTop <= this.clientHeight
    //   if (condition) {
    //     binding.value()
    //   }
    // })
  }
})
app.use(router).mount('#app')

registerMicroApps([
  {
    name: 'app-demo',
    entry: 'http://localhost:8081',
    container: '#subApp',
    activeRule: '/app-demo'
  }
])

start()
