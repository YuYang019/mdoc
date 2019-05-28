const chalk = require('chalk')
const logger = require('../../utils/logger')
const stylusRenderer = require('./stylus-renderer')

class Renderer {
  constructor(ctx) {
    this.context = ctx
    this.renderers = {}

    this.registerDefaultRenderer()
  }

  // 指定特殊结尾文件对应的renderer和渲染后的文件后缀
  register(from, to, renderer) {
    if (this.renderers[from]) {
      logger.warn(`${chalk.cyan(from)} renderer 已存在, 该 renderer 将被替换`)
    }
    this.renderers[from] = { to, renderer }
  }

  registerDefaultRenderer() {
    this.register('styl', 'css', stylusRenderer)
  }
}

module.exports = Renderer
