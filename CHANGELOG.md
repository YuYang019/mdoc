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
- 5.22
  - md文件支持front matter配置（gray-matter）
  - 模板自动注入开发模式所需js代码，无需手动添加。（解析html添加scripts）
  - 开发模式，新增监听主题文件变化，方便主题开发