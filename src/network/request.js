import axios from "axios";


export function request(config) {
  // 1.创建axios的实例
  const instance = axios.create({
    // baseURL: 'http://123.207.32.32:8000/api/vip',
    baseURL: "http://123.207.32.32:8000/api/v2",
    timeout: 5000
  })

  // 2.axios的拦截器
  instance.interceptors.request.use(config => {
    return config
  }, err => { })

  // 响应拦截
  instance.interceptors.response.use(result => {
    return result.data
  },
    err => { })


  // 3.发送真正的网络请求
  return instance(config)
}
