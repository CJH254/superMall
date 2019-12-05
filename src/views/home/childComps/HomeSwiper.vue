

<template>
  <swiper>
    <swiper-item v-for="(item, index) in banners" :key="index">
      <a :href="item.link">
        <img :src="item.image" alt @load="imageLoad" />
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
import { Swiper, SwiperItem } from "components/common/swiper";

export default {
  name: "HomeSwiper",
  components: {
    Swiper,
    SwiperItem
  },
  // 父组件通过props将信息传递给子组件
  data() {
    return {};
  },
  props: {
    banners: {
      type: Array,
      default: []
    }
  },
  methods: {
    imageLoad() {
      // 取反为true,允许进来加载一次,然后把isLoad变成true,
      // 取反后为false,该方法最终只会执行一次
      if (!this.isLoad) {
        this.$emit("swiperImageLoad");
      }
    }
  }
};
</script>

<style scoped>
</style>
