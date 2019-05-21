# 开发记录

- 5.19 最初始demo版本
- 5.20
  - 默认README.md为入口文件
  - 处理md链接，修正内部链接引入`.md`后缀和`README.md`文件时，html的a标签href属性渲染结果
  - 引入husky, lint-statged, commitizen优化工作流
- 5.21
  - 支持theme config, 格式为yml
  - 支持theme模板引入静态资源，静态资源文件夹默认为source
  - theme模板自动注入辅助函数 (nunjunks里叫macro)