import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// axios 优化 - 绑定到 vue 的原型
import axios from 'axios'
import moment from 'moment'
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor) /* { default global options } */

Vue.config.productionTip = false

Vue.use(ElementUI)

// axios 优化 - 绑定到 vue 的原型
Vue.prototype.$axios = axios
//  配置baseURL基准地址
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 需求：每次请求都要带上token，麻烦，可以利用请求拦截器
// 配置请求拦截器：将每次的请求，进行拦截，可以对每次的请求进行处理
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 每次真正需要的  res.data
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  response = response.data
  // 在响应拦截器中，直接判断status是否是401，如果是401，则是无效token的时候，跳到登录页
  if (response.meta.status === 401) {
    response.meta.msg = '尊敬的用户，token已过期，请重新登录'
    localStorage.removeItem('token')
    router.push('/login')
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

// 配置过滤器
Vue.filter('time', value => {
  return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
