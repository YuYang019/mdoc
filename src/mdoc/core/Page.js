const fs = require('fs-extra')
const hash = require('hash-sum')
const fileToPath = require('../utils/fileToPath')

class Page {
  constructor({ content, filePath, relative }, ctx) {
    this._filePath = filePath
    this._content = content
    this._context = ctx
    this._relative = relative

    this.key = 'm-' + hash(this._filePath)
    this.path = encodeURI(fileToPath(this._relative))
  }

  async process({ markdown }) {
    if (this._filePath) {
      this._content = await fs.readFile(this._filePath, 'utf-8')
    }

    if (this._content) {
      this.html = markdown.render(this._content)
    }
  }
}

module.exports = Page
