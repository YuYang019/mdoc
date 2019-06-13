const fs = require('fs-extra')
const hash = require('hash-sum')
const fileToPath = require('../utils/fileToPath')
const parseFrontmatter = require('../utils/parseFrontmatter')
const logger = require('../utils/logger')

class Page {
  constructor({ content, filePath, relative, frontmatter = {} }, ctx = null) {
    this._filePath = filePath
    this._content = content
    this._context = ctx
    this._relative = relative
    this.frontmatter = frontmatter

    this.key = 'm-' + hash(this._filePath)
    this.path = encodeURI(fileToPath(this._relative))
  }

  async process({ markdown }) {
    if (this._filePath) {
      this._content = await fs.readFile(this._filePath, 'utf-8')
    }

    if (this._content) {
      const { content, data, excerpt } = parseFrontmatter(this._content)

      // 提取头部配置后剩余的content
      this._strippedContent = content
      // 渲染的html
      this.html = markdown
        .render(this._strippedContent)
        .html.replace(/<p>&lt;!-- more --&gt;<\/p>/, '')
      Object.assign(this.frontmatter, data)

      const { title } = this.frontmatter
      // 抽取出一些常用的属性
      if (title) {
        this.title = title
      }

      // 内容摘抄
      if (excerpt) {
        // 解析后的html
        this.excerpt = markdown.render(excerpt).html
      }

      logger.debug('frontmatter: ', this.frontmatter)
    }
  }
}

module.exports = Page
