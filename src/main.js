import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import toast from 'components/common/toast/index'
import FastClick from 'fastclick'
import VueLazyload from "vue-lazyload";
// vue实例也可以作为事件总线
//添加事件总线对象
Vue.prototype.$bus = new Vue();
//安装toast插件
Vue.use(toast)
//解决移动端300ms延迟
FastClick.attach(document.body)
//添加图片懒加载的插件
Vue.use(VueLazyload,{
  //图片懒加载占位符，用require导入
  loading:require('./assets/img/common/placeholder.png')
})
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
