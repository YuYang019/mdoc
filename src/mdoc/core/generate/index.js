const fs = require('fs-extra')
const path = require('path')
const { renderPage, renderIndex } = require('./renderHtml')
const injectDevcode = require('./injectDevcode')
const logger = require('../../utils/logger')

module.exports = class GenerateProcess {
  constructor(ctx) {
    this.context = ctx
  }

  async generate() {
    await this.generatePages()
    await this.generateStaticSource()
  }

  async generatePages() {
    const pages = this.context.pages

    // 并行
    await Promise.all(
      pages.map(async page => {
        await this.generatePage(page)
      })
    )
  }

  async generatePage(page) {
    const writeTemp = this.context.writeTemp
    const pageHtml = page.html
    const pagePath = page.path
    const frontmatter = page.frontmatter
    let html

    if (frontmatter.home) {
      html = renderIndex(pageHtml, this.context)
    } else {
      html = renderPage(pageHtml, this.context)
    }

    if (!this.context.isProd) {
      html = injectDevcode(html)
    }

    await writeTemp(pagePath, html)
  }

  async generateStaticSource() {
    const {
      theme: { sourcePath },
      tempPath
    } = this.context

    await fs.copy(sourcePath, path.join(tempPath, 'static'))

    logger.debug('拷贝静态文件到temp目录')
  }
}
