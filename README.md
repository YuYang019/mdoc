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

## 备忘

- source文件夹copy策略：_post文件夹下的直接复制到temp, 不包含_post文件夹本身。其余文件原样复制，包含文件夹本身。忽略其余下划线开头的文件
- theme目录，规定静态资源文件夹为static, static会被原样复制到temp, 包含本身