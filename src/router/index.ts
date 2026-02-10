import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '@/views/Index.vue'
import Login from '@/views/frame/login.vue'
import Main from '@/views/frame/main0.vue'
import Home from '@/views/frame/home.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL), // createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/main',
      name: 'main',
      component: Main,
      children: [
        {
          path: '/home',
          name: 'home',
          component: Home
        },

        {
          path: '/platform/menu',
          name: 'platform_menu',
          component: () => import('@/views/platform/menu.vue')
        },        
        {
          path: '/platform/user',
          name: 'platform_user',
          component: () => import('@/views/platform/user.vue')
        },
        {
          path: '/platform/dept',
          name: 'platform_dept',
          component: () => import('@/views/platform/dept.vue')
        },
        {
          path: '/platform/permit',
          name: 'platform_permit',
          component: () => import('@/views/platform/permit.vue')
        },
        {
          path: '/platform/role',
          name: 'platform_role',
          component: () => import('@/views/platform/role.vue')
        },
        {
          path: '/platform/setting',
          name: 'platform_setting',
          component: () => import('@/views/platform/setting.vue')
        },
        {
          path: '/platform/dic',
          name: 'platform_dic',
          component: () => import('@/views/platform/dic.vue')
        },
        {
          path: '/platform/file',
          name: 'platform_file',
          component: () => import('@/views/platform/file.vue')
        },
        {
          path: '/platform/flow',
          name: 'platform_flow',
          component: () => import('@/views/platform/flow.vue')
        },
        {
          path: '/platform/my',
          name: 'platform_my',
          component: () => import('@/views/platform/my.vue')
        },
        /** 设备 */
        {
          path: '/device/list',
          name: 'device_list',
          component: () => import('@/views/frame/device/device.vue')
        },        
        {
          path: '/device/version',
          name: 'device_version',
          component: () => import('@/views/frame/device/version.vue')
        },
        /** 数据 */
        {
          path: '/data/datalist',
          name: 'data_datalist',
          component: () => import('@/views/frame/data/datalist.vue')
        },
        {
          path: '/data/sensorfield',
          name: 'data_sensorfield',
          component: () => import('@/views/frame/data/sensorfield.vue')
        },
        {
          path: '/data/sensorview',
          name: 'data_sensorview',
          component: () => import('@/views/frame/data/sensorview.vue')
        },
        /** 应用 */
        { /** 产品类别 */
          path: '/ext/kcgl/cplb',
          name: 'ext_kcgl_cplb',
          component: () => import('@/views/frame/ext/kcgl/cplb.vue')
        },
        { /** 产品定义 */
          path: '/ext/kcgl/cpdy',
          name: 'ext_kcgl_cpdy',
          component: () => import('@/views/frame/ext/kcgl/cpdy.vue')
        },
        { /** 库存整理 */
          path: '/ext/kcgl/kczl',
          name: 'ext_kcgl_kczl',
          component: () => import('@/views/frame/ext/kcgl/kczl.vue')
        },
        { /** 库存统计 */
          path: '/ext/kcgl/kctj',
          name: 'ext_kcgl_kctj',
          component: () => import('@/views/frame/ext/kcgl/kctj.vue')
        },
        { /** 库存变更 */
          path: '/ext/kcgl/kczljl',
          name: 'ext_kcgl_kczljl',
          component: () => import('@/views/frame/ext/kcgl/kczljl.vue')
        },
        { /** 库存整理 */
          path: '/ext/kcgl/kczl',
          name: 'ext_kcgl_kczl',
          component: () => import('@/views/frame/ext/kcgl/kczl.vue')
        },
        { /** 供应商 */
          path: '/ext/cggl/gys',
          name: 'ext_cggl_gys',
          component: () => import('@/views/frame/ext/cggl/gys.vue')
        },
        { /** 采购管理 */
          path: '/ext/cggl/cggl',
          name: 'ext_cggl_cggl',
          component: () => import('@/views/frame/ext/cggl/cggl.vue')
        },
        { /** 物流公司 */
          path: '/ext/cwgl/wlgs',
          name: 'ext_cwgl_wlgs',
          component: () => import('@/views/frame/ext/cwgl/wlgs.vue')
        },
        { /** 客户管理 */
          path: '/ext/xsgl/khgl',
          name: 'ext_xsgl_khgl',
          component: () => import('@/views/frame/ext/xsgl/khgl.vue')
        },
        { /** 跟进记录 */
          path: '/ext/xsgl/gjjl',
          name: 'ext_xsgl_gjjl',
          component: () => import('@/views/frame/ext/xsgl/gjjl.vue')
        },
        { /** 订单管理 */
          path: '/ext/xsgl/ddgl',
          name: 'ext_xsgl_ddgl',
          component: () => import('@/views/frame/ext/xsgl/ddgl.vue')
        },
        { /** 生产工艺 */
          path: '/ext/scgl/scgy',
          name: 'ext_scgl_scgy',
          component: () => import('@/views/frame/ext/scgl/scgy.vue')
        },
        { /** 生产管理 */
          path: '/ext/scgl/scgl',
          name: 'ext_scgl_scgl',
          component: () => import('@/views/frame/ext/scgl/scgl.vue')
        },
        { /** 生产物料 */
          path: '/ext/scgl/scwl',
          name: 'ext_scgl_scwl',
          component: () => import('@/views/frame/ext/scgl/scwl.vue')
        },
        { /** 借用管理 */
          path: '/ext/kcgl/jygl',
          name: 'ext_kcgl_jygl',
          component: () => import('@/views/frame/ext/kcgl/jygl.vue')
        },
        { /** 入库记录 */
          path: '/ext/kcgl/rkjl',
          name: 'ext_kcgl_rkjl',
          component: () => import('@/views/frame/ext/kcgl/rkjl.vue')
        },
        { /** 出库记录 */
          path: '/ext/kcgl/ckjl',
          name: 'ext_kcgl_ckjl',
          component: () => import('@/views/frame/ext/kcgl/ckjl.vue')
        },
      ]
    },
    {
      path: '/test',
      name: 'test',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/frame/test/test.vue')
    }
  ]
})

var indexPath = false;
router.beforeEach((to, from, next)=>{

  //console.log(indexPath, to);
  if (indexPath) {
    next();
  } else {
    if (to.name == "index") {
      indexPath = true;
      next();
    } else {
      router.replace({name: "index"});
    }
  }
});

export default router
