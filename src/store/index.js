import vue from 'vue'
import vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from "./getters";
// 1.安装插件
vue.use(vuex)
// 2.创建store对象
const state = {
  cartList: []
}
const store = new vuex.Store({
  state,
  mutations,
  actions,
  getters
})

//3.挂载vue实例
export default store
