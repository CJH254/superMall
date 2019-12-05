// 混入 (mixins) 是一种分发 Vue 组件中可复用功能的非常灵活的方式。混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被混入该组件本身的选项。
// 针对于对象而言需要用到混入技术，如果是类的话可以用继承
// 很多地方都会用到的公用方法，用混入的方法可以减少代码量，实现代码重用
import { debounce } from "./utils"
import BackTop from "components/common/backTop/BackTop";


export const backTopMixin = {
  components: {
    BackTop,
  },
  data() {
    return {
      isTabFixed: false,
      isShowBackTop: false,
    }
  },
  methods: {
    backTop() {
      console.log("回到顶部...");
      this.$refs.scroll.scrollTo(0, 0, 300)
    },
    listenShowBackTop(position) {
      // console.log("监听到BackTop按钮位置...");
      this.isShowBackTop = - position.y > 1000;
      this.isTabFixed = -position.y > this.tabOffSetTop;
    }
  }
}

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null,
      refresh: null
    }
  },
  mounted() {
    // 注意：闭包里应用的都是同一个变量，每次调用就会生成新的内存
    // 1..监听item中图片加载完成
    // 因为在created获取元素的话，可能会因为网络原因导致拿到的是null
    this.refresh = debounce(this.$refs.scroll.refresh, 200);
    // 对监听事件进行保存
    // 这里之所以要用this.itemImgListener引用就是为了离开页面时，取消这个事件
    this.itemImgListener = () => {
      this.refresh();
      // 这里肯定是每次发生DOM改变时都会调用的，改变多少调用多少
      // console.log("refresh...");
    };
    this.$bus.$on("itemImageLoad", this.itemImgListener);
  },
}

// 真正需要用到刷新挂在的组件有两个：GoodsListItem、DetailGoodsInfo
// 之所以挂载这个两个组件的原因是，他们都太多图片，渲染前和渲染后的需要空间差距很大

// 挂载这个函数，最主要的时候接受到itemImageLoad发送的信号时进行一次刷新
// 但是每次收到信号都会刷新一次对函数的请求过于频繁，所以就把refresh刷新的函数放在debounce里，
// 当全部挂载完成后才进行一次刷新,这里的刷新主要better-scroll插件自带的刷新,不需要刷新整个页面.
// refresh:
// 作用：重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。

// 第一次应用是GoodsListItem的所有图片加载完后,每次加载成功一张图片时,通过事件总线发送信号给视图组件，（因为两个组件之间还有其他组件，用组建通信的话会比较复杂）让其重新刷新.但是为了不让刷新过于频繁也用debounce

// ------------------------------------------------------------------------------------

// 第二次应用是DetailGoodsInfo的所有图片加载完后。
// 方法1：Detail视图检测到了有新的图片渲染，触发了mounted生命周期，但是每次收到信号都会刷新一次对函数的请求过于频繁，所以就把refresh刷新的函数放在debounce里。
// 方法2：给img加上@Load属性，当加载完一张图片，向父组件传递一个方法，该方法加上条件判断，当加载个数等于加载完成图片个数时才发送$emit给父组件detailImageLoad，也就是说不存在频繁调用refresh方法，因为只会在全部图片加载完成后才$emit，这样就不需要用到了debounce.因为用的是组件通信，也不需要用到事件总线
// 方法3：给img加上@Load属性，加载完一张图片，向父组件传递一个方法,但是这一种方法是每次加载完一张图片都会向父组件发送detailImageLoad,为了不让refresh请求过于频繁就需要用到debounce,这里就需要用到mixin<混入>了,
// 这里不明白为什么有了混入,还需要再用这种方法.这和第一种方法感觉每什么区别，都是只重新刷新了一次




// 总结：检测端可以发送多次方法，接收端可以通过算法只刷新一次
// 也可以检测端做好判断，只发送一次方法，这样接收端也可以只刷新一次