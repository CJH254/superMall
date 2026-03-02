<template>
  <div id="app" class="wrapper">
    <!-- 离开页面时不销毁对象 -->
    <keep-alive exclude="Detail">
      <router-view></router-view>
    </keep-alive>

    <main-tab-bar />
  </div>
</template>

<script>
import MainTabBar from "./components/content/MainTabBar/MainTabBar";

export default {
  name: "app",
  components: { MainTabBar }
};
</script>

<style>
@import "assets/css/base.css";
</style>
