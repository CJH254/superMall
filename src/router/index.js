import Vue from 'vue'
import Router from 'vue-router'
import VueRouter from 'vue-router'

Vue.use(Router)
// 组件懒加载
const Home = () => import('../views/home/Home');
const Cart = () => import('../views/cart/Cart');
const Category = () => import('../views/category/Category');
const Profile = () => import('../views/profile/Profile');
const Detail = () => import('../views/detail/Detail');
const routes = [{
  path: '',
  redirect: '/home',
},
{
  path: '/home',
  component: Home
},
{
  path: '/category',
  component: Category
},
{
  path: '/cart',
  component: Cart
},
{
  path: '/profile',
  component: Profile
},
  ,
{
  path: '/detail/:iid',
  component: Detail
},


]
const router = new VueRouter({
  routes: routes,
  // url不会出现#号
  mode: 'history'
})

export default router
