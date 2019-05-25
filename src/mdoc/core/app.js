const globby = require('globby')
const chalk = require('chalk')
const path = require('path')

const BuildProcess = require('./build')
const DevProcess = require('./dev')
const GenerateProcess = require('./generate')
const createTemp = require('./createTemp')
const createMarkdown = require('./createMarkdown')
const logger = require('../utils/logger')
const parseConfig = require('../utils/parseConfig')
const loadTheme = require('./loadTheme')

const fixBaseLinkCreator = require('../markdown/lib/fixBaseLink')

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

    this.appPath = path.resolve(__dirname, '../../../')

    this.generateProcess = new GenerateProcess(this)

    this.markdown = createMarkdown(this)
  }

  async process() {
    this.siteConfig = await this.resolveConfig()
    logger.debug('siteConfig', this.siteConfig)

    this.theme = await loadTheme(this)

    await this.resolvePage()
  }

  async resolveConfig() {
    const configPath = path.resolve(this.docDir, 'config.yml')
    return parseConfig(configPath)
  }

  async resolvePage() {
    const patterns = ['**/!(_)*.md', '!node_modules']

    const pageFile = await globby(patterns, {
      cwd: this.pageDir
    })
    logger.debug('pageFile', pageFile)

    // 如果是生产模式，且设置了base，需要注册md插件来处理base
    if (this.isProd && this.siteConfig.base) {
      this.markdown.use(fixBaseLinkCreator(this))
    }

    // all并行解析添加
    await Promise.all(
      pageFile.map(async relative => {
        const filePath = path.resolve(this.pageDir, relative)
        await this.addPage({ filePath, relative })
      })
    )
  }

  async generate() {
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
    this.devProcess = new DevProcess(this)
    await this.devProcess.process()
    await this.generate()

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
    this.buildProcess = new BuildProcess(this)
    await this.buildProcess.process()
  }
}

module.exports = App
