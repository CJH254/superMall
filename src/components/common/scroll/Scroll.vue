<template>
  <!-- ref -> 拿到某一个子组件 -->
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  name: "Scroll",
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scroll: null
    };
  },
  mounted() {
    // 创建better-scroll对象
    this.scroll = new BScroll(this.$refs.wrapper, {
      // 有div包含的时候该属性必须设置为true
      click: true,
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad
    });

    // 监听滚动的位置
    if (this.probeType === 2 || this.probeType === 3) {
      this.scroll.on("scroll", position => {
        this.$emit("scroll", position);
      });
    }

    // 监听上拉事件
    if (this.pullUpLoad) {
      this.scroll.on("pullingUp", () => {
        this.$emit("pullingUp");
      });
    }
  },
  methods: {
    // 滚动到指定位置
    scrollTo(x, y, time = 300) {
      this.scroll && this.scroll.scrollTo(x, y, time);
    },
    // 完成一次上拉，便于再次刷新
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp();
    },
    // 重新刷新页面
    refresh() {
      console.log("重新刷新...");
      this.scroll && this.scroll.refresh();
    },
    // 获得Y轴的高度
    getScrollY() {
      return this.scroll ? this.scroll.y : 0;
    }
  }
};
</script>
<style scoped></style>
