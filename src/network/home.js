import {
  request
} from "./request"

export function getHomeMultidata() {
  return request({
    url: '/home/multidata'
  })
}
//获取数据: http://123.207.32.32:8000/api/vip/home/multidata

// 获取详情数据： http://123.207.32.32:8000/api/vip/home/data?type=new&page=1
export function getHomeGoods(type, page) {
  return request({
    url: '/home/data',
    params: {
      // 简写：参数名和属性名一样
      type,
      page
    }
  })
}
