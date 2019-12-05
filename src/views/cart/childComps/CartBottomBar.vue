<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button :is-checked="isSelectAll" class="check-button" @click.native="checkClick"/>
      <span>全选</span>
    </div>
    <div class="price">{{totalPrice}}</div>
    <div class="calculate" @click="calcClick">
      去计算：({{checkLength}})
    </div>
  </div>
</template>

<script>
  import CheckButton from "components/content/checkButton/CheckButton";
  import {mapGetters} from 'vuex'

  export default {
    name: "CartBottomBar",
    components: {
      CheckButton
    },
    methods: {
      checkClick() {
        if (this.isSelectAll) {   //全部选中
          this.cartList.forEach(item => item.checked = false)
        } else {                  //部分或全部选中
          this.cartList.forEach(item => item.checked = true)
        }
      },
      calcClick() {
        if (!this.isSelectAll) {
          //如果已经有一个选中的商品，则不提示用户toast
          if (this.cartList.find(item => item.checked)) {
            return;
          }
          this.$toast.show('请选择购买的商品', 2000);
        }
      }
    },
    computed: {
      ...mapGetters(['cartList']),
      totalPrice() {
        return '￥' + this.cartList.filter(item => {
          return item.checked
        }).reduce((preValue, item) => {
          return preValue + item.price * item.count
        }, 0).toFixed(2)
      },
      checkLength() {
        return this.cartList.filter(item => item.checked).length
      },
      isSelectAll() {
        if (this.cartList.length == 0) return false
        //1.使用every，每一项都返回true，有不满足返回false
        // return this.cartList.every(item => item.checked)
        //2.使用find和some两者效果相同，优先选择find，性能高
        return !this.cartList.find(item => !item.checked)
        // return !this.cartList.some(item => !item.checked)
        // undefined取反是true
        //只要未点击，false取反后和!item.checked匹配就退出来，true取反为false
        //3.使用filter
        // return !(this.cartList.filter(item => !item.checked).length)
        //要的就是所以!item.checked.length=0，都要让他们不符合条件，这样才可以符合取反的条件
        //第一个商品不点false，取反后true，符合条件true，true长度为1.(未选中) -> 第二个商品点击true，取反后false，不符合条件true，false长度为1.(已选中) -> 返回值true长度为1，取反为false，不显示样式
        //当有一个没点击时，符合条件，所以!item.checked.length=1，取反后为false
        //第一个商品点击true，取反后false，不符合条件true，true长度为0.(已选中) -> 第二个商品点击true，取反后false，不符合条件true，false长度为2.(已选中) -> 返回值true长度为0，取反为true，显示样式
        //当全部点击后，便不符合条件，所以!item.checked.length=0，取反后为true
        //4.普通遍历
        // console.log(this.cartList)
        // for (let item of this.cartList) {
        //   console.log('----'  + item.checked +'和' + (!item.checked))
        //   if (!item.checked) {  //item.checked默认值为false 取反为true
        //     console.log("++++")
        //     return false
        //   //  说明，只要有一个是未点击的（false），全选按钮都不会亮
        //   }
        // }
        // //只有全部都为true才会走出来
        // console.log('全部都选中,即cartList的checked都是true')
        // return true
      }
    }
  }
</script>

<style scoped>
  .bottom-bar {
    height: 40px;
    background: #eeeeee;
    position: relative;
    line-height: 40px;
    display: flex;
  }

  .check-content {
    display: flex;
    align-items: center;
    margin-left: 10px;
    width: 60px;
    font-size: 14px;
  }

  .check-button {
    width: 20px;
    height: 20px;
    margin-right: 5px;
    line-height: 20px;
  }

  .price {
    margin-left: 30px;
    flex: 1;
  }

  .calculate {
    width: 90px;
    background: red;
    color: white;
    text-align: center;
  }
</style>
