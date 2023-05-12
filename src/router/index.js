import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   // 当设置 true 的时候该路由不会在侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               i// 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           //当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'/'el-icon-x' // 设置该路由的图标，对应路径src/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 *  公共路由
 */
export const constantRoutes = [
  {path: '/login',component: () => import('@/views/login/index'),hidden: true},
  {path: '/404',component: () => import('@/views/error/404'),hidden: true},
  {path: '/401',component: () => import('@/views/error/401'),hidden: true},

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'dashboard',affix: true }
    }]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/sys/user/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  }
]

// 动态路由，基于用户权限动态去加载
export  const dynamicRoutes = [
  {
    path: '/system/dict-data',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: () => import('@/views/sys/dict/data'),
        name: 'Data',
        meta: { title: '字典数据', activeMenu: '/system/dict' }
      }
    ]
  },
  {
    path: '/system/role-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:role:edit'],
    children: [
      {
        path: 'user/:roleId(\\d+)',
        component: () => import('@/views/sys/role/authUser'),
        name: 'AuthUser',
        meta: { title: '分配用户', activeMenu: '/sys/role' }
      }
    ]
  },
  {
    path: '/house/add-room',
    component: Layout,
    hidden: true,
    permissions: ['house:apartment:edit'],
    children: [
      {
        path: 'room/:apartmentId(\\d+)',
        component: () => import('@/views/house/room/components/addRoom'),
        name: 'AddRoom',
        meta: { title: '添加房源', activeMenu: '/house/room' }
      }
    ]
  },
]

const createRouter = () => new Router({
  //mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
