import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '@/views/Index.vue'
import Login from '@/views/frame/login.vue'
import Main from '@/views/frame/main0.vue'
import Home from '@/views/frame/home.vue'

import TGlobal from '@/logic/TGlobal'
import TLogic from '@/logic/TLogic'


const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL), // createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      props: {
        "mode": false
      },
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
          component: () => import('@/views/frame/ext/tkcgl/cplb.vue')
        },
        { /** 产品定义 */
          path: '/ext/kcgl/cpdy',
          name: 'ext_kcgl_cpdy',
          component: () => import('@/views/frame/ext/tkcgl/cpdy.vue')
        },
        { /** 库存整理 */
          path: '/ext/kcgl/kczl',
          name: 'ext_kcgl_kczl',
          component: () => import('@/views/frame/ext/tkcgl/kczl.vue')
        },
        { /** 库存统计 */
          path: '/ext/kcgl/kctj',
          name: 'ext_kcgl_kctj',
          component: () => import('@/views/frame/ext/tkcgl/kctj.vue')
        },
        { /** 库存变更 */
          path: '/ext/kcgl/kcbg',
          name: 'ext_kcgl_kcbg',
          component: () => import('@/views/frame/ext/tkcgl/kcbg.vue')
        },
        { /** 库存整理 */
          path: '/ext/kcgl/kczl',
          name: 'ext_kcgl_kczl',
          component: () => import('@/views/frame/ext/tkcgl/kczl.vue')
        },
        { /** 供应商 */
          path: '/ext/cggl/gys',
          name: 'ext_cggl_gys',
          component: () => import('@/views/frame/ext/tcggl/gys.vue')
        },
        { /** 采购管理 */
          path: '/ext/cggl/cggl',
          name: 'ext_cggl_cggl',
          component: () => import('@/views/frame/ext/tcggl/cggl.vue')
        },
        { /** 采购退货 */
          path: '/ext/cggl/cgth',
          name: 'ext_cggl_cgth',
          component: () => import('@/views/frame/ext/tcggl/cgth.vue')
        },
        { /** 采购查询 */
          path: '/ext/cggl/cgcx',
          name: 'ext_cggl_cgcx',
          component: () => import('@/views/frame/ext/tcggl/cgcx.vue')
        },
        { /** 物流公司 */
          path: '/ext/cwgl/wlgs',
          name: 'ext_cwgl_wlgs',
          component: () => import('@/views/frame/ext/tcwgl/wlgs.vue')
        },
        { /** 客户管理 */
          path: '/ext/xsgl/khgl',
          name: 'ext_xsgl_khgl',
          component: () => import('@/views/frame/ext/txsgl/khgl.vue')
        },
        { /** 客户公海 */
          path: '/ext/xsgl/khgh',
          name: 'ext_xsgl_khgh',
          component: () => import('@/views/frame/ext/txsgl/khgh.vue')
        },
        { /** 订单管理 */
          path: '/ext/xsgl/xsgl',
          name: 'ext_xsgl_xsgl',
          component: () => import('@/views/frame/ext/txsgl/xsgl.vue')
        },
        { /** 销售退货 */
          path: '/ext/xsgl/xsth',
          name: 'ext_xsgl_xsth',
          component: () => import('@/views/frame/ext/txsgl/xsth.vue')
        },
        { /** 销售查询 */
          path: '/ext/xsgl/xscx',
          name: 'ext_xsgl_xscx',
          component: () => import('@/views/frame/ext/txsgl/xscx.vue')
        },
        { /** 生产工艺 */
          path: '/ext/scgl/scgy',
          name: 'ext_scgl_scgy',
          component: () => import('@/views/frame/ext/tscgl/scgy.vue')
        },
        { /** 生产管理 */
          path: '/ext/scgl/scgl',
          name: 'ext_scgl_scgl',
          component: () => import('@/views/frame/ext/tscgl/scgl.vue')
        },
        { /** 生产物料 */
          path: '/ext/scgl/scwl',
          name: 'ext_scgl_scwl',
          component: () => import('@/views/frame/ext/tscgl/scwl.vue')
        },
        { /** 生产记录 */
          path: '/ext/scgl/scjl',
          name: 'ext_scgl_scjl',
          component: () => import('@/views/frame/ext/tscgl/scjl.vue')
        },
        { /** 借用管理 */
          path: '/ext/kcgl/jygl',
          name: 'ext_kcgl_jygl',
          component: () => import('@/views/frame/ext/tkcgl/jygl.vue')
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

router.beforeEach((to, from, next)=>{

  let toNext = true;

  const filterList = [
    "index", "login", "main"
  ]
  const toName = to.name as string | "";
  if (filterList.includes(toName)) {
    next();
    return;
  }

  const menu = TGlobal.menuMap[toName];
  //console.log(from, to, menu);
  if (menu == undefined) {
    router.replace({name: "index"});
    return;
  }
    
  if (menu.role_list.length > 0) {
    if (TGlobal.userData["f_user_id"] > 0) {
      toNext = TLogic.checkRoleList(menu.role_list);
    } else {
      toNext = false;
    }
  }

  if (toNext) {
    next();    
  } else {
    router.replace({name: "index"});
  }

});

export default router
