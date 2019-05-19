const fs = require('fs-extra')
const hash = require('hash-sum')
const renderHtml = require('./renderHtml')
const fileToPath = require('../utils/fileToPath')

class Page {
  constructor({
    content,
    filePath,
    relative,
  }, ctx) {
    this._filePath = filePath
    this._content = content
    this._context = ctx
    this._relative = relative

    this.key = 'm-' + hash(this._filePath)
    this.path = encodeURI(fileToPath(this._relative))
  }

  async process({
    markdown
  }) {
    if (this._filePath) {
      this._content = await fs.readFile(this._filePath, 'utf-8')
    }

    if (this._content) {
      const mdHtml = markdown.render(this._content)
      const html = await renderHtml(mdHtml, this)
      await this._context.writeTemp(fileToPath(this._relative), html)
    }
  }
}

module.exports = Page