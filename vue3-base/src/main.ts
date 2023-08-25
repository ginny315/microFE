import { createApp } from 'vue'
import 'normalize.css'
import ElementUI from 'element-plus'
import zh from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElIconModules from '@element-plus/icons-vue'
import App from './App.vue'
import { setupStore } from '@/store'
import router from './router'
import '@/permission'
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

let app: VueApp<Element>
console.log('qiankun???', qiankunWindow.__POWERED_BY_QIANKUN__, qiankunWindow)
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  app = createApp(App)
  app.use(ElementUI, {
    locale: zh
  })
  Object.keys(ElIconModules).forEach((key) => {
    app.component(key, ElIconModules[key])
  })
  setupStore(app)
  app.use(router).mount('#app')
  // .use(router).use(ElementPlus).use(createPinia()).mount('#app');
} else {
  renderWithQiankun({
    mount(props) {
      console.log('--mount')

      app = createApp(App)
      app.use(ElementUI, {
        locale: zh
      })
      Object.keys(ElIconModules).forEach((key) => {
        app.component(key, ElIconModules[key])
      })
      setupStore(app)
      app
        .use(router)
        .mount(
          (props.container
            ? props.container.querySelector('#app')
            : document.getElementById('app')) as Element
        )
    },
    bootstrap() {
      console.log('--bootstrap')
    },
    update() {
      console.log('--update')
    },
    unmount() {
      console.log('--unmount')
      app?.unmount()
    }
  })
}

// const app = createApp(App)
// app.use(ElementUI, {
//   locale: zh
// })
// Object.keys(ElIconModules).forEach((key) => {
//   app.component(key, ElIconModules[key])
// })
// setupStore(app)
// app.use(router).mount('#app')
