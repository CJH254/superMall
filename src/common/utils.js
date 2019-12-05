
// 事件监听
// 防抖动、节流 => 对于执行非常频繁的行为，等一会再一起执行
// 如果我们直接执行refresh，那么refresh函数会被执行30次.
// 可以将refresh函数传入到debounce函数中，生成一个新的函数.
// 之后在调用非常颁繁的时候，就使用新生成的函数而新生成的函数，并不会非常频繁的调用，如果下一次执行来的非常快，那么会将上一次取消掉
export function debounce(func, delay = 50) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    // 规定时间内
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// 格式化事件字符串,正则表达式是字符串匹配利器
// 时间戳单位是秒,date单位是毫秒，为了避免误差，需要将时间戳乘1000
export function formatDate(date, fmt) {
  // 1.获取年份 y+ -> 一个或多个y / y*->0个或者多个y / y?->0个或者1个y
  if (/(y+)/.test(fmt)) {
    // RegExp.$1就是匹配到的y+ 即2019，然后将date对象获取年份即2019，截取0位
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};

function padLeftZero(str) {
  // 04 拼接 0004 截取2位 -> 04
  return ('00' + str).substr(str.length);
};

