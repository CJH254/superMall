module.exports = {
  plugins: {
    autoprefixer: {},
    "postcss-px-to-viewport":{
      viewportWidth: 375,   //视窗的宽度，对应的是我们设计稿的宽度
      viewportHeight: 667,  //视窗的高度，对应的是我们设计稿的高度(可以不配置)
      unitPrecision: 5,     //指定'px'转换未视窗单位值的小数位数(很多时候无法整除)
      viewportUnit: 'vw',   //指定需要转换成视窗的单位，建议使用vw
      selectorBlackList: ['ignore','tab-bar','tab-bar-item'], //指定不需要转换的类，可以在组件的元素上加上ignore关键字
      minPixelValue: 1, //小于或等于'1px'不转换为视窗单位
      mediaQuery: false, //允许再媒体查询钟转换'px'
      exclude:[/TabBar/] //必须是正则表达式
    }
  }
}
