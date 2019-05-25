const globby = require('globby')
const chalk = require('chalk')
const path = require('path')

const BuildProcess = require('./build')
const DevProcess = require('./dev')
const GenerateProcess = require('./generate')
const createTemp = require('./createTemp')
const createMarkdown = require('./createMarkdown')
const logger = require('../utils/logger')
const loadTheme = require('./loadTheme')

const Page = require('./Page')

class App {
  constructor(options = {}) {
    this.options = options
    this.docDir = this.options.docDir
    logger.debug('options: ', this.options)
    logger.debug('文档源文件所在目录', this.docDir)

    this.pages = []
    this.outDir = path.resolve(this.docDir, './dist')
    logger.debug('构建产物所在目录', this.outDir)

    this.pageDir = path.resolve(this.docDir, './source/_posts')
    logger.debug('md文件夹所在目录', this.pageDir)

    this.sourceDir = path.resolve(this.docDir, './source')
    logger.debug('source文件夹所在目录', this.pageDir)

    const { tempPath, writeTemp, removeTemp } = createTemp(this)
    this.tempPath = tempPath
    this.writeTemp = writeTemp
    this.removeTemp = removeTemp
    logger.debug('tempPath:', this.tempPath)

    this.markdown = createMarkdown(this)
  }

  async process() {
    this._startTime = new Date().getTime()

    this.theme = await loadTheme(this)

    await this.resolvePage()

    await this.generate()
  }

  async resolvePage() {
    const patterns = ['**/!(_)*.md', '!node_modules']

    const pageFile = await globby(patterns, {
      cwd: this.pageDir
    })
    logger.debug('pageFile', pageFile)

    // all并行解析添加
    await Promise.all(
      pageFile.map(async relative => {
        const filePath = path.resolve(this.pageDir, relative)
        await this.addPage({ filePath, relative })
      })
    )
  }

  async generate() {
    this.generateProcess = new GenerateProcess(this)
    await this.generateProcess.generate()
  }

  async addPage(options) {
    const page = new Page(options, this)
    await page.process({
      markdown: this.markdown
    })
    const index = this.pages.findIndex(({ path }) => path === page.path)
    if (index >= 0) {
      logger.warn('覆盖已存在的page：', chalk.yellow(page.path))
      this.pages.splice(index, 1, page)
    } else {
      this.pages.push(page)
    }

    return page
  }

  async dev() {
    this.isProd = false
    this.devProcess = new DevProcess(this)
    await this.devProcess.process()

    try {
      this.devProcess
        .createServer(this)
        .on('fileChanged', ({ type, target, from }) => {
          logger.tip(
            `Reload due to ${chalk.red(type)} ${chalk.cyan(
              path.relative(this.docDir, target)
            )}`
          )
          this.devProcess.handleFileChange({ type, target, from })
        })
    } catch (err) {
      throw err
    }

    return this
  }

  async build() {
    this.isProd = true
    this.buildProcess = new BuildProcess(this)
    await this.buildProcess.process()
  }
}

module.exports = App
