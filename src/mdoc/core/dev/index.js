const EventEmiiter = require('events').EventEmitter
const chokidar = require('chokidar')
const logger = require('../../utils/logger')
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
    this.pagesWatcher = chokidar.watch(['**/*.md'], {
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
