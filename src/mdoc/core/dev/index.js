const EventEmiiter = require('events').EventEmitter
const chokidar = require('chokidar')
const fs = require('fs-extra')
const path = require('path')
const logger = require('../../utils/logger')
const fileToPath = require('../../utils/fileToPath')
const CHANGE_FROM = require('./constants')
const createDevServer = require('./devServer/createDevServer')

class DevProcess extends EventEmiiter {
  constructor(ctx) {
    super()
    this.context = ctx
  }

  async process() {
    this.watchSiteConfig()
    this.watchSourceFiles()
    this.watchThemeFiles()
  }

  watchSiteConfig() {
    this.configWatcher = chokidar.watch(['config.yml'], {
      cwd: this.context.docDir,
      ignored: ['node_modules'],
      ignoreInitial: true
    })

    this.addWatcherListener(this.configWatcher, CHANGE_FROM.SITE_CONFIG)
  }

  watchSourceFiles() {
    // 为什么这里cwd不用sourceDir, 原因是对于md文件，复制时是不包含_posts文件夹的
    // 如果cwd是sourceDir, 那么生成的target路径会包含_posts, 不方便后续的复制操作
    this.pagesWatcher = chokidar.watch(['**/!(_)*.md'], {
      cwd: this.context.pageDir,
      ignored: ['node_modules'],
      ignoreInitial: true
    })

    this.staticFilesWatcher = chokidar.watch(['**/!(_)*.*'], {
      cwd: this.context.sourceDir,
      ignored: ['node_modules', '_posts', '.DS_Store'],
      ignoreInitial: true
    })

    this.addWatcherListener(this.pagesWatcher, CHANGE_FROM.SOURCE)
    this.addWatcherListener(this.staticFilesWatcher, CHANGE_FROM.SOURCE_STATIC)
  }

  watchThemeFiles() {
    const {
      theme: { themePath }
    } = this.context

    this.themeStaticFilesWatcher = chokidar.watch(
      ['static/**/!(_)*.*', '!.DS_Store'],
      {
        cwd: themePath,
        ignored: ['node_modules'],
        ignoreInitial: true
      }
    )

    this.themeWatcher = chokidar.watch(['config.yml', 'layout/**/!(_)*.njk'], {
      cwd: themePath,
      ignored: ['node_modules'],
      ignoreInitial: true
    })

    logger.debug('watchThemeFiles')

    // eslint-disable-next-line
    this.addWatcherListener(this.themeStaticFilesWatcher, CHANGE_FROM.THEME_STATIC)
    this.addWatcherListener(this.themeWatcher, CHANGE_FROM.THEME)
  }

  addWatcherListener(watcher, from) {
    watcher.on('change', target => this.handleUpdate('change', target, from))
    watcher.on('add', target => this.handleUpdate('add', target, from))
    watcher.on('unlink', target => this.handleUpdate('unlink', target, from))
  }

  handleUpdate(type, target, from) {
    logger.debug('文件变动', 'type: ', type, 'target：', target, 'from: ', from)
    this.emit('fileChanged', {
      type,
      target,
      from
    })
  }

  async handleFileChange({ type, target, from }) {
    if (from === CHANGE_FROM.SOURCE) {
      switch (type) {
        case 'change':
        case 'add':
          // 获取变动的md文件路径
          const filePath = path.join(this.context.pageDir, target)
          logger.debug('文件被修改或添加', filePath, 'target: ', target)
          // 重新生成
          const newPage = await this.context.addPage({
            filePath,
            relative: target
          })
          await this.context.generateProcess.generatePage(newPage)
          // 刷新
          this.refresh()
          break
        case 'unlink':
          // 获取已生成的html文件
          const distHtmlPath = path.join(
            this.context.tempPath,
            fileToPath(target)
          )
          logger.debug('文件被删除', distHtmlPath, 'target: ', target)
          // 删除
          await fs.remove(distHtmlPath)
          break
        default:
          return
      }
    } else if (from === CHANGE_FROM.THEME || from === CHANGE_FROM.SITE_CONFIG) {
      // 当站点配置或者主题模板改变时，重新编译生成
      await this.context.process()
      await this.context.generate()
      this.refresh()
    } else if (from === CHANGE_FROM.THEME_STATIC) {
      // 主题静态资源改变时，更新静态文件到temp目录
      await this.context.generateProcess.generateThemeAssets()
      this.refresh()
    } else if (from === CHANGE_FROM.SOURCE_STATIC) {
      // source文件夹的静态资源改变
      await this.context.generateProcess.generateSourceAssets()
      this.refresh()
    }
  }

  createServer(ctx) {
    this.server = createDevServer(ctx)
    return this
  }

  refresh() {
    this.server.emit('refresh')
    logger.success('浏览器成功刷新')
  }
}

module.exports = DevProcess
