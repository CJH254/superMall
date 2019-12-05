<template>
  <div class="recommend">
    <div v-for="item in recommends" :key="item.id" class="recommend-item">
      <a :href="item.link">
        <img :src="item.image" alt="" />
        <div>{{ item.title }}</div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecommandView",
  // 父组件通过props将信息传递给子组件
  props: {
    recommends: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  components: {},
  data() {
    return {};
  }
};
</script>
<style scoped>
.recommend {
  display: flex;
  font-size: 12px;
  width: 100%;
  text-align: center;
  padding: 10px 0 20px;
  border-bottom: 10px solid #eee;
}
.recommend-item {
  flex: 1;
}
.recommend-item img {
  width: 70px;
  height: 70px;
  margin-bottom: 10px;
}
</style>
