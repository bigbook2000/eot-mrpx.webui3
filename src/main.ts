import './assets/prj.scss'
import './assets/eoui.scss'

import { createApp } from 'vue'

import ElementPlus from 'element-plus'
// env.d.ts declare module 'element-plus/dist/locale/zh-cn.mjs';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'


import './assets/element/element.scss'
import './assets/element/button.scss'
import './assets/element/input.scss'
import './assets/element/table.scss'
import './assets/element/tabs.scss'
import './assets/element/tree.scss'
import './assets/element/menu.scss'
import './assets/element/loading.scss'
import './assets/element/page.scss'
import './assets/element/select.scss'
import './assets/element/datetime.scss'
import './assets/element/check.scss'
import './assets/element/dialog.scss'
import './assets/element/upload.scss'

//import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.provide("__GPF_", __GPF_);
app.config.globalProperties.$__GPF_ = __GPF_;

app.use(ElementPlus, {
  locale: zhCn,
})
app.use(router)

app.mount('#app')
