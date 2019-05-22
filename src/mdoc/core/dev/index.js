const EventEmiiter = require('events').EventEmitter
const chokidar = require('chokidar')
const logger = require('../../utils/logger')
const createDevServer = require('./devServer/createDevServer')

class DevProcess extends EventEmiiter {
  constructor(ctx) {
    super()
    this.context = ctx
  }

  async process() {
    this.watchSourceFile()
    this.watchThemeFile()
  }

  watchSourceFiles() {
    this.pagesWatcher = chokidar.watch(['**/*.md'], {
      cwd: this.context.sourceDir,
      ignored: ['node_modules'],
      ignoreInitial: true
    })

    this.pagesWatcher.on('change', target =>
      this.handleUpdate('change', target, 'source')
    )
    this.pagesWatcher.on('add', target =>
      this.handleUpdate('add', target, 'source')
    )
    this.pagesWatcher.on('unlink', target =>
      this.handleUpdate('unlink', target, 'source')
    )
    // this.pagesWatcher.on('addDir', target => this.handleUpdate('addDir', target))
    // this.pagesWatcher.on('unlinkDir', target => this.handleUpdate('unlinkDir', target))
  }

  // todo 优化，对于静态资源不需要重新构建，涉及到模板的才需要
  watchThemeFiles() {
    const {
      theme: { themePath }
    } = this.context

    this.themeWatcher = chokidar.watch(
      ['source/**/*.js', 'source/**/*.css', 'config.yml', 'layout/**/*.njk'],
      {
        cwd: themePath,
        ignored: ['node_modules'],
        ignoreInitial: true
      }
    )

    logger.debug('watchThemeFiles')

    this.themeWatcher.on('change', target =>
      this.handleUpdate('change', target, 'theme')
    )
    this.themeWatcher.on('add', target =>
      this.handleUpdate('add', target, 'theme')
    )
    this.themeWatcher.on('unlink', target =>
      this.handleUpdate('unlink', target, 'theme')
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
