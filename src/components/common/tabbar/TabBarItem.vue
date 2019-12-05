<template>
  <div class="tab-bar-item" @click="itemClick">
    <div v-if="!isActive">
      <slot name="item-icon"></slot>
    </div>
    <div v-else>
      <slot name="item-icon-active"></slot>
    </div>
    <div :style="activeStyle">
      <slot name="item-text"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "TabBarItem",
  components: {},
  props: {
    path: String,
    activeColor: {
      type: String,
      default: "red"
    }
  },
  data() {
    return {
      // isActive: true
    };
  },
  computed: {
    isActive() {
      // /home->iteml(/home)=true
      // /home->item1(/category)=false
      // /home->iteml(/cart)=false
      // /home->iteml(/profile)=false
      // console.log("aa" + this.$route.path.indexOf(this.path));
      // console.log("点击后活跃的组件： " + this.$route.path);
      // console.log("传进来的path： " + this.path);
      // 通过路由的路径名和传进来的path来判断点击的是否为同一个元素来确定是否显示active
      return this.$route.path.indexOf(this.path) !== -1;
    },
    activeStyle() {
      return this.isActive ? { color: this.activeColor } : {};
    }
  },
  methods: {
    itemClick() {
      // this.$router.replace(this.path).catch(err => {
      //   console.log("all good");
      // });
      // 路由跳转相应的页面
      if (this.$route.path != this.path) {
        // console.log("点击后活跃的组件： " + this.$route.path);
        // console.log("传进来的path： " + this.path);
        this.$router.replace(this.path);
      }
    }
  }
};
</script>
<style scoped>
.tab-bar-item {
  flex: 1;
  text-align: center;
  height: 49px;
  font-size: 14px;
}
.tab-bar-item img {
  width: 24px;
  height: 24px;
  margin-top: 3px;
  margin-bottom: 2px;
  vertical-align: middle;
}
/* 组件的含义就是为了不让用户直接操作源码，要做好封装，要让用户动态决定 */
.active {
  color: red;
}
</style>
