import './assets/eoui.scss'
import './assets/prj.scss'
import './assets/app.scss'

import { createApp } from 'vue'

import ElementPlus from 'element-plus'
// env.d.ts declare module 'element-plus/dist/locale/zh-cn.mjs';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'


import './assets/element/element.scss'
// autocomplete button carousel checkbox
import './assets/element/element1.scss'
import './assets/element/element2.scss'
// date picker time 
import './assets/element/element3.scss'
// dialog dropdown
import './assets/element/element4.scss'
// textarea input 
import './assets/element/element5.scss'
// textarea input menu
import './assets/element/element6.scss'
// page radio select switch
import './assets/element/element7.scss'
// table tree
import './assets/element/element8.scss'

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
