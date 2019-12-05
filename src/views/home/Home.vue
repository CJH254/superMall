<template>
  <div id="home" class="wrapper">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control
      :titles="['流行', '新款', '精选']"
      @tabClick="tabClick"
      ref="tabControl1"
      class="tab-control"
      v-show="isTabFixed"
    />
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
      @pullingUp="loadMore"
      :pull-up-load="true"
    >
      <!-- @scroll是子传父的一种方法，接收数据方为等号右边的父组件方法 -->
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad" />
      <recommand-view :recommends="recommends" />
      <feature-view @featureImageLoad="featureImageLoad" />
      <tab-control :titles="['流行', '新款', '精选']" @tabClick="tabClick" ref="tabControl2" />
      <goods-list :goods="showGoods" />
    </scroll>
    <back-top @click.native="backTop" v-show="isShowBackTop" />
  </div>
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper";
import RecommandView from "./childComps/RecommandView";
import FeatureView from "./childComps/FeatureView";

import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/common/backTop/BackTop";

import { getHomeMultidata, getHomeGoods } from "network/home";
import { debounce } from "common/utils";
import { itemListenerMixin, backTopMixin } from "common/mixin";

export default {
  name: "Home",
  components: {
    HomeSwiper,
    RecommandView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      // 存储请求过来的数据
      banners: [],
      recommends: [],
      goods: {
        // 默认请求第一页数据给用户展示，当上拉加载的时候再去请求。
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] }
      },
      currentType: "pop",
      isShowBackTop: false,
      tabOffSetTop: 0,
      // isTabFixed: false,
      saveY: 0,
      alreadyLoad: [],
      already: null
    };
  },
  activated() {
    // 路由活跃时
    console.log("home activated");
    console.log("Y轴偏移量" + this.saveY);
    this.$refs.scroll.scrollTo(0, this.saveY);
    this.$refs.scroll.refresh();
  },
  deactivated() {
    // 路由不活跃时
    console.log("home deactivated");
    // 1.保存Y值
    this.saveY = this.$refs.scroll.getScrollY();
    console.log("Y轴偏移量" + this.saveY);
    // 2.取消全局事件监听,取消刷新方法让其在Detail页面可刷新，传入需要取消的函数itemImgListener
    // 如果不传的话，就会将itemImageLoad的总线事件所有监听函数都取消
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  },
  // 加载完成前执行
  created() {
    // 创建完页面后立即发送网络请求
    // 1.请求多个数据
    this.getHomeMultidata();
    // 2.请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
    this.already = debounce(() => {
      // 2.获取tabControl2的tabOffSetTop
      // 所有的组件都有一个属性e1：用于获取组件中的元素
      this.alreadyLoad.push(1);
      console.log("首页防抖...");
      // console.log("已经加载的标识符:" + this.alreadyLoad);
      // 检测到数组为2时，证明featureImage和swiperImage(只需要加载一张)都加载完了
      if (this.alreadyLoad.length === 2) {
        this.tabOffSetTop = this.$refs.tabControl2.$el.offsetTop;
        console.log(
          "最后一次获取的swiperImageLoad:" +
            this.$refs.tabControl2.$el.offsetTop
        );
      }
    }, 100);
  },
  // 页面有刷新时
  mounted() {},
  // 获取数据更新后的DOM
  updated() {},
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    }
  },
  methods: {
    // 切换数据列表
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      // 保持最新点击的index一致
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },
    // 监听首页内容滚动显示返回顶部按钮
    contentScroll(position) {
      // 1.判断BackTop是否显示
      this.isShowBackTop = -position.y > 1000;
      // 2.决定tabControl是否吸顶(position：fixed)
      // this.isTabFixed = -position.y > this.tabOffSetTop;
      this.listenShowBackTop(position);
    },
    // 上拉加载更多数据
    loadMore() {
      console.log("上拉加载更多数据...");
      this.getHomeGoods(this.currentType);
    },
    // 监听HomeSwiper中img的加载完成.获取offsetTop的值
    swiperImageLoad() {
      // 这里没加载完一次图片都会被调用一次，总共四次
      this.already();
    },
    featureImageLoad() {
      this.alreadyLoad.push(1);
      console.log("featureImageLoad:" + this.$refs.tabControl2.$el.offsetTop);
    },
    // 网络请求
    // 1.请求多个数据
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        console.log(res);
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
        console.log(this.banners);
        console.log(this.recommends);
      });
    },
    // 2.请求商品数据
    getHomeGoods(type) {
      // 为了获取商品数据接口可复用，page可动态获得
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then(res => {
        // 也可用数组的concat方法
        // 1.this.goods[type].list = this.goods[type].list.concat(res.data.list);
        // 2.for(let n of res.data.list){
        //   this.goods[type].list.push(n)
        // }
        this.goods[type].list.push(...res.data.list);
        console.log(this.goods[type].list);
        this.goods[type].page += 1;
        // 完成上拉加载更多才可以继续加载
        this.$refs.scroll.finishPullUp();
      });
    }
  }
};
</script>
<style scoped>
#home {
  height: 100vh;
  position: relative;
}

.home-nav {
  background-color: var(--color-tint);
  color: #fff;
  /* 在使用浏览器原生滚动时，为了让导航不跟随一起滚动 */
  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
}
.tab-control {
  position: relative;
  z-index: 10;
}
.content {
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
</style>
TODO:切换tab时内容的还是在原来的位置，看不懂新tab前面的新内容
