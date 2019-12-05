import {ADD_COUNTER, ADD_TO_CART} from './mutations-types'

export default {
  // 异步请求和复杂的条件判断都可以放在action里
  addCart(context, payload) {
    return new Promise((resolve, reject) => {
      // 1.查找之前数组钟是否有符合该商品，返回符合条件的
      let oldProduct = context.state.cartList.find(item => {
        return item.iid === payload.iid
      })
      // 2.对结果进行判断
      if (oldProduct) {
        context.commit(ADD_COUNTER, oldProduct)
        resolve("当前商品数量+1")
      } else {
        payload.count = 1
        context.commit(ADD_TO_CART, payload)
        resolve("当前商品添加进购物车")
      }
    })
  }
}
