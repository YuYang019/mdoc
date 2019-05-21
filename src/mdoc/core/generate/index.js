const fs = require('fs-extra')
const path = require('path')
const { renderPage } = require('./renderHtml')
const logger = require('../../utils/logger')

module.exports = class GenerateProcess {
  constructor(ctx) {
    this.context = ctx
  }

  async generate() {
    await this.generatePage()
    await this.generateStaticSource()
  }

  async generatePage() {
    const pages = this.context.pages
    const writeTemp = this.context.writeTemp

    // 并行
    await Promise.all(
      pages.map(async page => {
        const pageHtml = page.html
        const pagePath = page.path
        const html = renderPage(pageHtml, this.context)
        await writeTemp(pagePath, html)
      })
    )
  }

  async generateStaticSource() {
    const {
      theme: { sourcePath },
      tempPath
    } = this.context

    await fs.copy(sourcePath, path.join(tempPath, 'source'))

    logger.debug('拷贝静态文件到temp目录')
  }
}
