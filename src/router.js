import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Index from './components/Index.vue'
import Users from './components/Users.vue'
import Roles from './components/Roles.vue'
import Rights from './components/Rights.vue'

Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/',
    redirect: '/index'
  }, {
    path: '/login',
    name: 'login',
    component: Login
  }, {
    path: '/index',
    name: 'index',
    component: Index,
    children: [{
      path: '/users',
      component: Users
    }, {
      path: '/roles',
      component: Roles
    }, {
      path: '/rights',
      component: Rights
    }]
  }]
})
// 给路由对象注册导航守卫, 守卫导航
// to: 到哪去
// from: 从哪来
// next()  next() 放行,  next('/login')
router.beforeEach((to, from, next) => {
  // 所有的导航的跳转都要经过导航守卫
  // 关注to, 如果to表示去登陆, 直接放行
  // 如果to不是去登陆, 去其他组件, 判断是否有token, 有就放行, 没有就去登陆
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})

export default router
