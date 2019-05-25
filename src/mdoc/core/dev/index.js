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
    this.watchSourceFiles()
    this.watchThemeFiles()
  }

  watchSourceFiles() {
    this.pagesWatcher = chokidar.watch(['**/!(_)*.md'], {
      cwd: this.context.sourceDir,
      ignored: ['node_modules'],
      ignoreInitial: true
    })

    this.staticFilesWatcher = chokidar.watch(['**/!(_)*.*'], {
      cwd: this.context.sourceDir,
      ignored: ['node_modules'],
      ignoreInitial: true
    })

    this.pagesWatcher.on('change', target =>
      this.handleUpdate('change', target, CHANGE_FROM.SOURCE)
    )
    this.pagesWatcher.on('add', target =>
      this.handleUpdate('add', target, CHANGE_FROM.SOURCE)
    )
    this.pagesWatcher.on('unlink', target =>
      this.handleUpdate('unlink', target, CHANGE_FROM.SOURCE)
    )

    this.staticFilesWatcher.on('change', target =>
      this.handleUpdate('change', target, CHANGE_FROM.SOURCE_STATIC)
    )
    this.staticFilesWatcher.on('add', target =>
      this.handleUpdate('add', target, CHANGE_FROM.SOURCE_STATIC)
    )
    this.staticFilesWatcher.on('unlink', target =>
      this.handleUpdate('unlink', target, CHANGE_FROM.SOURCE_STATIC)
    )
    // this.pagesWatcher.on('addDir', target => this.handleUpdate('addDir', target))
    // this.pagesWatcher.on('unlinkDir', target => this.handleUpdate('unlinkDir', target))
  }

  watchThemeFiles() {
    const {
      theme: { themePath }
    } = this.context

    this.themeStaticFilesWatcher = chokidar.watch(
      ['static/**/*.js', 'static/**/*.css'],
      {
        cwd: themePath,
        ignored: ['node_modules'],
        ignoreInitial: true
      }
    )

    this.themeWatcher = chokidar.watch(['config.yml', 'layout/**/*.njk'], {
      cwd: themePath,
      ignored: ['node_modules'],
      ignoreInitial: true
    })

    logger.debug('watchThemeFiles')

    this.themeStaticFilesWatcher.on('change', target =>
      this.handleUpdate('change', target, CHANGE_FROM.THEME_STATIC)
    )
    this.themeStaticFilesWatcher.on('add', target =>
      this.handleUpdate('add', target, CHANGE_FROM.THEME_STATIC)
    )
    this.themeStaticFilesWatcher.on('unlink', target =>
      this.handleUpdate('unlink', target, CHANGE_FROM.THEME_STATIC)
    )

    this.themeWatcher.on('change', target =>
      this.handleUpdate('change', target, CHANGE_FROM.THEME)
    )
    this.themeWatcher.on('add', target =>
      this.handleUpdate('add', target, CHANGE_FROM.THEME)
    )
    this.themeWatcher.on('unlink', target =>
      this.handleUpdate('unlink', target, CHANGE_FROM.THEME)
    )
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
          const filePath = path.join(this.context.sourceDir, target)
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
    } else if (from === CHANGE_FROM.THEME) {
      // 主题模板改变时，重新编译
      await this.context.process()
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
