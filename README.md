# supermall

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

项目结构组织：

- assets:资源文件

  - css 样式文件
  - img 图片文件

- components：公共组件

  - common：完全公共组件(跨项目)
  - content：针对当前项目的组件(其他项目不可用)

- common：公共 js 文件

  - const.js:公共常量抽取
  - utils.js:公共工具方法类
  - mixin.js:混入 js 文件

- network：网络请求
- store：状态管理
- router：路由
- views：主要视图
