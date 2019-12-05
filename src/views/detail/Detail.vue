<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <!-- 属性：detailInfo 传入值：detail-info -->
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :topImages="topImages"></detail-swiper>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @detailImageLoad="detailImageLoad"/>
      <!-- 第一种防抖才需要加@detailImageLoad="detailImageLoad" -->
      <detail-param-info :param-info="paramInfo" ref="params"/>
      <detail-comment-info :comment-info="commentInfo" ref="comment"/>
      <goods-list :goods="recommends" ref="recommend"/>
    </scroll>

    <back-top @click.native="backTop" v-show="isShowBackTop"/>
    <detail-bottom-bar @addToCart="addToCart"/>
  </div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNav";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import DetailBottomBar from "./childComps/DetailBottomBar";
  import Toast from "components/common/toast/Toast";

  import Scroll from "components/common/scroll/Scroll";
  import GoodsList from "components/content/goods/GoodsList";

  import {
    getDetail,
    Goods,
    Shop,
    GoodsParam,
    getRecommend
  } from "network/detail";

  import {debounce} from "common/utils";
  import {itemListenerMixin, backTopMixin} from "common/mixin";
  import {mapActions} from 'vuex'
  import toast from "../../components/common/toast";

  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      Scroll,
      GoodsList,
      DetailBottomBar,
      Toast
    },
    mixins: [itemListenerMixin, backTopMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0,
        // message: '',
        // show: false
      };
    },
    created() {
      // 1.保存传入的id
      this.iid = this.$route.params.iid;
      // 2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        console.log(res);
        const data = res.result;
        // 1.获取顶部的图片轮播数据
        this.topImages = data.itemInfo.topImages;
        // 2.获取商品信息
        this.goods = new Goods(
          data.itemInfo,
          data.columns,
          data.shopInfo.services
        );
        // 3.获取店铺信息
        this.shop = new Shop(data.shopInfo);
        // 4.获取详情图片
        this.detailInfo = data.detailInfo;
        // 5.获取商品参数属性
        this.paramInfo = new GoodsParam(
          data.itemParams.info,
          data.itemParams.rule
        );
        // 6.取出评论信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0];
        }
        // 拿到数据也不是马上就看到效果的，还需要一些时间渲染,更新DOM之后才会把数据渲染出来.
        // 渲染和真实的js代码不是在同一个线程里的
        // 过程:数据来了之后 -> 异步渲染 -> 继续往下执行 -> 渲染慢的话拿到的相关属性就是还没渲染出来的值,很大概率就时undefined
        // 数据渲染完之后会调用这个
        // 1.压根没有渲染
        // this.themeTopYs = [];
        // this.themeTopYs.push(0);
        // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        // console.log(this.themeTopYs);
        // 2.值不对，图片高度没有算在里面
        // this.$nextTick(() => {
        //   console.log("updated...");
        // 先赋数组为空。避免添加重复的值
        // 根据最新的数据,对应的DOM是已经被渲染出来
        // 但是图片还没完全加载完（目前获取到的offsetTop是不包含图片的）
        // offsetTop值不对的时候，都是后面未加载的图片的问题
        // this.themeTopYs = [];
        // this.themeTopYs.push(0);
        // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        // console.log(this.themeTopYs);
        // });
      });
      // 3.请求推荐数据:推荐数据不需要iid，所以可以独立出来
      getRecommend().then(res => {
        this.recommends = res.data.list;
      });
      // 4.给getThemeTopY赋值
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = [];
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop - 44);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop - 44);
        this.themeTopYs.push(Number.MAX_VALUE);
        // console.log(this.themeTopYs);
        console.log("详情页防抖...");
      }, 100);
    },
    // 有了数据后，准备渲染时才会到这个生命周期
    updated() {
    },
    destroyed() {
      // 路由不活跃时
      console.log("Detail destroyed");
      console.log("itemImgListerner取消监听Detail...");
      // 1.保存Y值
      // this.saveY = this.$refs.scroll.getScrollY();
      // console.log("Y轴偏移量" + this.saveY);
      // 2.取消全局监听事件
      this.$bus.$off("itemImageLoad", this.itemImgListener);
    },
    methods: {
      ...mapActions(['addCart']),
      ...mapActions({add: 'addCart'}),
      addToCart() {
        console.log("addToCart...");
        // 1.获取购物车需要展示的信息
        const product = {};
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.nowPrice;
        product.iid = this.iid;
        console.log(this.goods);

        console.log(product);
        // 2.将商品添加到购物车里
        // this.$store.cartList.push(product);
        // this.$store.dispatch("addCart", product).then(res =>{
        this.addCart(product).then(res => {
          //1.普通组件方式
          // this.show = true;
          // this.message = res;
          // setTimeout(() => {
          //   this.show = false;
          //   this.message = ''
          // }, 1500)
          //2.自定义组件
          console.log(this.$toast)
          this.$toast.show(res, 1500)
        })
      },
      contentScroll(position) {
        // 1.获取Y值
        const positionY = -position.y;
        // 2.positionY和主题中的值进行比较
        let length = this.themeTopYs.length;
        for (let i = 0; i < length - 1; i++) {
          // this.currentIndex !== i 避免重复赋值，前面下标不等时才证明在不同的主题区域
          // (i < length - 1 && positionY >= this.themeTopYs[i] && this.themeTopYs[i + 1]) i<2 并且大于大于i本身的高度小于i+1主题的高度
          // (i === length - 1 && positionY >= this.themeTopYs[i]) i=2 并且 高度 大于 下标为2第3个主题高度时
          // &&前面的条件都是为了避免数组越界，后面的则是确定主题高度范围
          // 第一种方法
          // if (
          //   this.currentIndex !== i &&
          //   ((i < length - 1 &&
          //     positionY >= this.themeTopYs[i] &&
          //     this.themeTopYs[i + 1]) ||
          //     (i === length - 1 && positionY >= this.themeTopYs[i]))
          // ) {
          //   this.currentIndex = i;
          //   this.$refs.nav.currentIndex = this.currentIndex;
          // }
          // 第二种方法
          if (
            this.currentIndex !== i &&
            (positionY >= this.themeTopYs[i] &&
              positionY < this.themeTopYs[i + 1])
          ) {
            this.currentIndex = i;
            this.$refs.nav.currentIndex = this.currentIndex;
          }
          // 3.判断BackTop是否显示
          this.listenShowBackTop(position);
        }
      },
      titleClick(index) {
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100);
      },
      detailImageLoad() {
        // 方法2的防抖
        this.refresh();
        this.getThemeTopY();
        // detailImageLoad() {
        // 在混入里使用的都是指向同一个对象，重复调用也不会存在重复赋值的情况
        // 拿的了这个属性是因为进行了混入
        // this.refresh();
        // }
      }
    }
  };
</script>
<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .content {
    /* 如果用这个的话标签导航会有44的误差 */
    height: calc(100% - 44px - 49px);
    /* position: absolute;
    top: 44px;
    bottom: 60px; */
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  /* 防抖1：mixin混入里写好方法在mounted生命周期中使用，监听GoodsListItem的总线事件 */
  /* 防抖2：监听DetailGoodsInfo的img加载，用条件判断全部加载后再向组件传递方法detailImageLoad，在组件的接受方法中调用refresh方法 */
  /* 防抖3：监听DetailGoodsInfo的img加载,每完成一次img向父组件传递方法detailImageLoad，再调用用mixins里的debounce方法 */
</style>


