const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const globby = require('globby')
const { renderPage, renderIndex } = require('./renderHtml')
const { injectDevcode } = require('./injectDevcode')
const logger = require('../../utils/logger')

module.exports = class GenerateProcess {
  constructor(ctx) {
    this.context = ctx
    this.isProd = ctx.isProd
  }

  async generate() {
    await Promise.all([
      this.generateIndex(),
      this.generatePages(),
      this.generateSourceAssets(),
      this.generateThemeAssets()
    ])
  }

  async generateDist() {
    const { outDir, tempPath } = this.context
    logger.debug('拷贝.temp目录文件到dist文件夹')
    await fs.copy(tempPath, outDir)
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

  // 生成首页
  async generateIndex() {
    const { writeTemp } = this.context
    let html = renderIndex(this.context)

    if (!this.context.isProd) {
      logger.debug('inject dev code')
      html = injectDevcode(html)
    }

    await writeTemp('index.html', html)
  }

  async generatePage(page) {
    const { writeTemp } = this.context
    const pageRelativePath = page.path
    let html

    html = renderPage(page, this.context)

    if (!this.context.isProd) {
      logger.debug('inject dev code')
      html = injectDevcode(html)
    }

    await writeTemp(pageRelativePath, html)
  }

  async generateSourceAssets() {
    const { tempPath, sourceDir } = this.context

    // 防止source里的文件夹和theme的static文件夹重名
    // theme的static名称是约定好的，而source里文件夹除了_posts，其余没有固定，所以可能会冲突
    const staticPath = path.resolve(sourceDir, 'static')
    if (fs.pathExistsSync(staticPath)) {
      logger.error(
        '[mdoc]:',
        `source目录下的 ${chalk.red('static')} 文件夹名称与主题文件夹冲突`,
        `或许您可以重命名为 ${chalk.cyan('assets')} ?`
      )
      throw new Error()
    }

    // 匹配不以_开头的文件
    const patterns = ['**/!(_)*.*', '!.DS_Store']
    // 防止拷贝带下划线的文件夹，仅考虑第一层
    const dirs = await fs.readdir(sourceDir)
    const copiedDirs = []
    for (let i = 0; i < dirs.length; i++) {
      if (/^_\w+/.test(dirs[i])) {
        if (dirs[i] !== '_posts') {
          logger.warn(
            '[mdoc]:',
            `${chalk.cyan('source')} 目录下的 ${chalk.red(
              dirs[i]
            )} 文件夹将被忽略`
          )
        }
        patterns.push('!' + dirs[i])
      } else {
        // 记录被拷贝的文件夹
        copiedDirs.push(dirs[i])
      }
    }

    const assets = await globby(patterns, {
      cwd: sourceDir
    })

    logger.debug('拷贝source静态资源到.temp', assets)

    // 复制的时候，先清空.temp里之前被复制的文件
    copiedDirs.forEach(dir => {
      const existsPath = path.resolve(tempPath, dir)
      if (fs.existsSync(existsPath)) {
        logger.debug(`清空temp目录下的 ${chalk.red(dir)} 文件夹`)
        fs.removeSync(existsPath)
      }
    })

    await Promise.all(
      assets.map(async file => {
        await fs.copy(
          path.resolve(sourceDir, file),
          path.resolve(tempPath, file)
        )
      })
    )
  }

  async generateThemeAssets() {
    const {
      theme: { sourcePath },
      tempPath
    } = this.context

    // 拷贝时包含父文件夹, 静态资源默认放static
    await fs.copy(sourcePath, path.join(tempPath, 'static'))

    logger.debug('拷贝主题静态文件到temp目录')
  }
}
