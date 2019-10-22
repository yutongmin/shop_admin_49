import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Index from './components/Index.vue'
import Users from './components/users/Users.vue'
import Roles from './components/rights/Rights.vue'
import Rights from './components/rights/Roles.vue'
import Categories from './components/products/Categories.vue'
import Goods from './components/products/Goods.vue'
import GoodsAdd from './components/products/GoodsAdd.vue'

Vue.use(Router)

const originalPush = Router.prototype.push
// eslint-disable-next-line space-before-function-paren
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

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
      name: 'users',
      component: Users
    }, {
      path: '/roles',
      name: 'roles',
      component: Roles
    }, {
      path: '/rights',
      name: 'rights',
      component: Rights
    }, {
      path: '/categories',
      name: 'categories',
      component: Categories
    }, {
      path: '/goods',
      name: 'goods',
      component: Goods
    }, {
      path: '/goods-add',
      name: 'goods-add',
      component: GoodsAdd
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
