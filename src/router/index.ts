import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '@/views/Index.vue'
import Login from '@/views/login/login.vue'
import Main from '@/views/vweb/main.vue'
import AppMain from '@/views/vapp/main.vue'

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
    
    /** App Begin */
    {
      path: '/app/main',
      name: 'app_main',
      component: AppMain,
      children: [
        {
          path: '/app/menu',
          name: 'app_menu',
          component: () => import('@/views/vapp/menu.vue')
        },
        {
          path: '/app/cggl/cggl',
          name: 'app_cggl_cggl',
          component: () => import('@/views/vapp/pcggl/cggl.vue')
        },
        {
          path: '/app/cggl/cgd_xx',
          name: 'app_cggl_cgd_xx',
          component: () => import('@/views/vapp/pcggl/cgd_xx.vue')
        },
        {
          path: '/app/cggl/gys',
          name: 'app_cggl_gys',
          component: () => import('@/views/vapp/pcggl/gys.vue')
        },
        {
          path: '/app/cggl/cgth',
          name: 'app_cggl_cgth',
          component: () => import('@/views/vapp/pcggl/cgth.vue')
        },
        {
          path: '/app/cggl/cgcx',
          name: 'app_cggl_cgcx',
          component: () => import('@/views/vapp/pcggl/cgcx.vue')
        },
        {
          path: '/app/xsgl/xsgl',
          name: 'app_xsgl_xsgl',
          component: () => import('@/views/vapp/pxsgl/xsgl.vue')
        },
        {
          path: '/app/xsgl/khgl',
          name: 'app_xsgl_khgl',
          component: () => import('@/views/vapp/pxsgl/khgl.vue')
        },
        {
          path: '/app/xsgl/khgh',
          name: 'app_xsgl_khgh',
          component: () => import('@/views/vapp/pxsgl/khgh.vue')
        },
        {
          path: '/app/xsgl/kehu_xx',
          name: 'app_xsgl_kehu_xx',
          component: () => import('@/views/vapp/pxsgl/kehu_xx.vue')
        },
        {
          path: '/app/xsgl/xsd_xx',
          name: 'app_xsgl_xsd_xx',
          component: () => import('@/views/vapp/pxsgl/xsd_xx.vue')
        },
        {
          path: '/app/kcgl/kczl',
          name: 'app_kcgl_kczl',
          component: () => import('@/views/vapp/pkcgl/kczl.vue')
        },
        {
          path: '/app/kcgl/kcmx',
          name: 'app_kcgl_kcmx',
          component: () => import('@/views/vapp/pkcgl/kcmx.vue')
        },
        {
          path: '/app/kcgl/cpdy',
          name: 'app_kcgl_cpdy',
          component: () => import('@/views/vapp/pkcgl/cpdy.vue')
        },
      ]
    },

    /** App End */

    {
      path: '/main',
      name: 'main',
      component: Main,
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('@/views/vweb/home.vue')
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
          path: '/platform/log',
          name: 'platform_log',
          component: () => import('@/views/platform/log.vue')
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
          component: () => import('@/views/vweb/device/device.vue')
        },        
        {
          path: '/device/version',
          name: 'device_version',
          component: () => import('@/views/vweb/device/version.vue')
        },
        /** 数据 */
        {
          path: '/data/datalist',
          name: 'data_datalist',
          component: () => import('@/views/vweb/data/datalist.vue')
        },
        {
          path: '/data/sensorfield',
          name: 'data_sensorfield',
          component: () => import('@/views/vweb/data/sensorfield.vue')
        },
        {
          path: '/data/sensorview',
          name: 'data_sensorview',
          component: () => import('@/views/vweb/data/sensorview.vue')
        },
        /** 应用 */
        { /** AI */
          path: '/ext/tgzt/eotai',
          name: 'ext_tgzt_eotai',
          component: () => import('@/views/vweb/ext/tgzt/eotai.vue')
        },
        { /** 产品类别 */
          path: '/ext/kcgl/cplb',
          name: 'ext_kcgl_cplb',
          component: () => import('@/views/vweb/ext/tkcgl/cplb.vue')
        },
        { /** 产品类别 */
          path: '/ext/kcgl/cplb',
          name: 'ext_kcgl_cplb',
          component: () => import('@/views/vweb/ext/tkcgl/cplb.vue')
        },
        { /** 产品定义 */
          path: '/ext/kcgl/cpdy',
          name: 'ext_kcgl_cpdy',
          component: () => import('@/views/vweb/ext/tkcgl/cpdy.vue')
        },
        { /** 库存整理 */
          path: '/ext/kcgl/kczl',
          name: 'ext_kcgl_kczl',
          component: () => import('@/views/vweb/ext/tkcgl/kczl.vue')
        },
        { /** 库存统计 */
          path: '/ext/kcgl/kctj',
          name: 'ext_kcgl_kctj',
          component: () => import('@/views/vweb/ext/tkcgl/kctj.vue')
        },
        { /** 库存变更 */
          path: '/ext/kcgl/kcbg',
          name: 'ext_kcgl_kcbg',
          component: () => import('@/views/vweb/ext/tkcgl/kcbg.vue')
        },
        { /** 库存整理 */
          path: '/ext/kcgl/kczl',
          name: 'ext_kcgl_kczl',
          component: () => import('@/views/vweb/ext/tkcgl/kczl.vue')
        },
        { /** 供应商 */
          path: '/ext/cggl/gys',
          name: 'ext_cggl_gys',
          component: () => import('@/views/vweb/ext/tcggl/gys.vue')
        },
        { /** 采购管理 */
          path: '/ext/cggl/cggl',
          name: 'ext_cggl_cggl',
          component: () => import('@/views/vweb/ext/tcggl/cggl.vue')
        },
        { /** 采购退货 */
          path: '/ext/cggl/cgth',
          name: 'ext_cggl_cgth',
          component: () => import('@/views/vweb/ext/tcggl/cgth.vue')
        },
        { /** 采购查询 */
          path: '/ext/cggl/cgcx',
          name: 'ext_cggl_cgcx',
          component: () => import('@/views/vweb/ext/tcggl/cgcx.vue')
        },
        { /** 物流公司 */
          path: '/ext/cwgl/wlgs',
          name: 'ext_cwgl_wlgs',
          component: () => import('@/views/vweb/ext/tcwgl/wlgs.vue')
        },
        { /** 客户管理 */
          path: '/ext/xsgl/khgl',
          name: 'ext_xsgl_khgl',
          component: () => import('@/views/vweb/ext/txsgl/khgl.vue')
        },
        { /** 客户公海 */
          path: '/ext/xsgl/khgh',
          name: 'ext_xsgl_khgh',
          component: () => import('@/views/vweb/ext/txsgl/khgh.vue')
        },
        { /** 订单管理 */
          path: '/ext/xsgl/xsgl',
          name: 'ext_xsgl_xsgl',
          component: () => import('@/views/vweb/ext/txsgl/xsgl.vue')
        },
        { /** 销售退货 */
          path: '/ext/xsgl/xsth',
          name: 'ext_xsgl_xsth',
          component: () => import('@/views/vweb/ext/txsgl/xsth.vue')
        },
        { /** 销售查询 */
          path: '/ext/xsgl/xscx',
          name: 'ext_xsgl_xscx',
          component: () => import('@/views/vweb/ext/txsgl/xscx.vue')
        },
        { /** 生产工艺 */
          path: '/ext/scgl/scgy',
          name: 'ext_scgl_scgy',
          component: () => import('@/views/vweb/ext/tscgl/scgy.vue')
        },
        { /** 生产管理 */
          path: '/ext/scgl/scgl',
          name: 'ext_scgl_scgl',
          component: () => import('@/views/vweb/ext/tscgl/scgl.vue')
        },
        { /** 生产物料 */
          path: '/ext/scgl/scwl',
          name: 'ext_scgl_scwl',
          component: () => import('@/views/vweb/ext/tscgl/scwl.vue')
        },
        { /** 生产记录 */
          path: '/ext/scgl/scjl',
          name: 'ext_scgl_scjl',
          component: () => import('@/views/vweb/ext/tscgl/scjl.vue')
        },
        { /** 借用管理 */
          path: '/ext/kcgl/jygl',
          name: 'ext_kcgl_jygl',
          component: () => import('@/views/vweb/ext/tkcgl/jygl.vue')
        },
      ]
    },
    {
      path: '/test',
      name: 'test',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/vweb/test/test.vue')
    }
  ]
})

router.beforeEach((to, from, next)=>{

  let toNext = true;

  const filterList = [
    "index", "login" 
  ]
  const toName = to.name as string | "";
  if (filterList.includes(toName)) {
    next();
    return;
  }

  if (TGlobal.userData["f_user_id"] <= 0) {
    next();
    return;
  }

  const menu = TGlobal.menuMap[toName];
  //console.log(from, to, menu);
  if (menu == undefined) {
    next();
    return;
  }
    
  if (menu.role_list.length > 0) {
    toNext = TLogic.checkRoleList(menu.role_list);
  }

  if (toNext) {
    next();
  } else {
    router.replace({name: "index"});
  }

});

export default router
