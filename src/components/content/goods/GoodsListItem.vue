<template>
  <div class="goods-item" @click="itemClick">
    <!-- @load检测标签是否加载完成 -->
    <!--    v-lazy用了vuelazyload插件，让图片懒加载，减轻了服务器的压力-->
    <img v-lazy="showImage" alt @load="imageLoad"/>
    <div class="goods-info">
      <p>{{ goodsItem.title }}</p>
      <span class="price">{{ goodsItem.price }}</span>
      <span class="collect">{{ goodsItem.cfav }}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "GoodsListItem",
    components: {},
    data() {
      return {};
    },
    props: {
      goodsItem: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    methods: {
      imageLoad() {
        this.$bus.$emit("itemImageLoad");
      },
      itemClick() {
        // 详情页之间是可以来回跳转的，所以选择用push
        this.$router.push("/detail/" + this.goodsItem.iid);
      }
    },
    computed: {
      showImage() {
        // 逻辑或，前面为false进行下个条件判断
        return this.goodsItem.image || this.goodsItem.show.img;
      }
    }
  };
</script>
<style scoped>
  .goods-item {
    padding-bottom: 40px;
    position: relative;
    width: 48%;
  }

  .goods-item img {
    width: 100%;
    border-radius: 5px;
  }

  .goods-info {
    font-size: 12px;
    position: absolute;
    bottom: 5px;
    left: 0;
    right: 0;
    overflow: hidden;
    text-align: center;
  }

  .goods-info p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 3px;
    padding-top: 5px;
  }

  .goods-info .price {
    color: var(--color-high-text);
    margin-right: 20px;
  }

  .goods-info .collect {
    position: relative;
  }

  .goods-info .collect::before {
    content: "";
    position: absolute;
    left: -15px;
    top: -1px;
    width: 14px;
    height: 14px;
    background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
  }
</style>
