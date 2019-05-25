# mdoc 一个静态站点生成器学习项目

inspired from Vuepress/Hexo

## Features

- 基于MarkDown语法书写
- 基于字符串的纯静态站点生成器
- 顺畅书写体验，dev模式下，可实时预览刷新
- build模式下，自动生成压缩后的`html`,`js`,`css`,`img`等静态站点文件

## Usage

``` js
  mdoc dev /path/to/your/doc
  mdoc dev /path/to/your/doc --debug // debug模式

  mdoc build /path/to/your/doc
  mdoc build /path/to/your/doc --debug // debug模式
```

## Todos

- 插件系统
- 主题系统
- 更加可配置