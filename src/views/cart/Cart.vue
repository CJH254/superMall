<template>
  <div class="cart">
    <!--  导航-->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{Length}})</div>
    </nav-bar>
    <!--    商品的列表-->
    <cart-list/>
    <!--    底部汇总-->
    <cart-bottom-bar/>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import CartList from "./childComps/CartList";
  import CartBottomBar from "./childComps/CartBottomBar";

  import {mapGetters} from "vuex"

  export default {
    name: "Cart",
    components: {NavBar, CartList, CartBottomBar},
    data() {
      return {};
    },
    computed: {
      //  ...mapGetters辅助函数会对getters.js里的方法进行解构
      //   mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性：
      //  第一种方法：指定相应的getters转换为计算属性
      //   ...mapGetters([
      //     'cartLength'
      //   ])
      //  第二种方法：可以给getters映射到局部属性
      ...mapGetters({
        Length: 'cartLength'
      })
    }
  };
</script>
<style scoped>
  .cart {
    height: 100vh;
  }

  .nav-bar {
    background-color: var(--color-tint);
    color: #ffffff;
  }
</style>
