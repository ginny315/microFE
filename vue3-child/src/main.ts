import { createApp } from 'vue'
import 'normalize.css'
import ElementUI from 'element-plus'
import zh from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElIconModules from '@element-plus/icons-vue'
import App from './App.vue'
import { setupStore } from '@/store'
import router from './router'
import '@/permission'

const app = createApp(App)
app.use(ElementUI, {
  locale: zh
})
Object.keys(ElIconModules).forEach((key) => {
  app.component(key, ElIconModules[key])
})
setupStore(app)
app.use(router).mount('#app')
