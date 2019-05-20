const EventEmiiter = require('events').EventEmitter
const chokidar = require('chokidar')
const logger = require('../utils/logger')
const createDevServer = require('./devServer/createDevServer')

class DevProcess extends EventEmiiter {
  constructor(ctx) {
    super()
    this.context = ctx
  }

  async process() {
    this.watchSourceFile()
  }

  watchSourceFile() {
    this.pagesWatcher = chokidar.watch(['**/*.md'], {
      cwd: this.context.sourceDir,
      ignored: ['node_modules'],
      ignoreInitial: true
    })

    this.pagesWatcher.on('change', target =>
      this.handleUpdate('change', target)
    )
    this.pagesWatcher.on('add', target => this.handleUpdate('add', target))
    this.pagesWatcher.on('unlink', target =>
      this.handleUpdate('unlink', target)
    )
    // this.pagesWatcher.on('addDir', target => this.handleUpdate('addDir', target))
    // this.pagesWatcher.on('unlinkDir', target => this.handleUpdate('unlinkDir', target))
  }

  handleUpdate(type, target) {
    logger.debug('文件变动', 'type: ', type, 'target：', target)
    this.emit('fileChanged', {
      type,
      target
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
