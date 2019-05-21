const globby = require('globby')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs-extra')

// const BuildProcess = require('./build')
const DevProcess = require('./dev')
const GenerateProcess = require('./generate')
const createTemp = require('./createTemp')
const createMarkdown = require('./createMarkdown')
const logger = require('../utils/logger')
const loadTheme = require('./loadTheme')
const fileToPath = require('../utils/fileToPath')

const Page = require('./Page')

class App {
  constructor(options = {}) {
    this.options = options
    this.sourceDir = this.options.sourceDir
    logger.debug('options: ', this.options)
    logger.debug('文档源文件所在目录', this.sourceDir)

    this.pages = []
    this.outDir = path.resolve('./dist')
    logger.debug('构建产物所在目录', this.outDir)

    this.mdocDir = path.resolve(this.sourceDir, '.mdoc')
    logger.debug('mdoc文件夹路径', this.mdocDir)

    const { tempPath, writeTemp } = createTemp(this)
    this.tempPath = tempPath
    this.writeTemp = writeTemp
    logger.debug('tempPath:', this.tempPath)

    this.markdown = createMarkdown(this)
  }

  async process() {
    this.theme = await loadTheme(this)

    await this.resolvePage()

    await this.generate()
  }

  async handleFileChange({ type, target }) {
    switch (type) {
      case 'change':
      case 'add':
        // 获取变动的md文件路径
        const filePath = path.join(this.sourceDir, target)
        logger.debug('文件被修改或添加', filePath, 'target: ', target)
        // 重新生成
        await this.addPage({ filePath, relative: target })
        this.devProcess.refresh()
        break
      case 'unlink':
        // 获取已生成的html文件
        const distHtmlPath = path.join(this.tempPath, fileToPath(target))
        logger.debug('文件被删除', distHtmlPath, 'target: ', target)
        // 删除
        await fs.remove(distHtmlPath)
        break
      default:
        return
    }
  }

  async resolvePage() {
    const patterns = ['**/*.md', '!node_modules']

    const pageFile = await globby(patterns, { cwd: this.sourceDir })
    logger.debug('pageFile', pageFile)

    // all并行解析添加
    await Promise.all(
      pageFile.map(async relative => {
        const filePath = path.resolve(this.sourceDir, relative)
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
  }

  async dev() {
    this.isProd = false
    this.devProcess = new DevProcess(this)
    await this.devProcess.process()

    try {
      this.devProcess
        .createServer(this)
        .on('fileChanged', ({ type, target }) => {
          console.log(
            `Reload due to ${chalk.red(type)} ${chalk.cyan(
              path.relative(this.sourceDir, target)
            )}`
          )
          this.handleFileChange({ type, target })
        })
    } catch (err) {
      throw err
    }

    return this
  }

  build() {
    this.isProd = true
  }
}

module.exports = App
