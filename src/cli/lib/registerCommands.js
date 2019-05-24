const path = require('path')
const { dev, build } = require('../../mdoc/core')
const { wrapCommand } = require('./util')

module.exports = function registerCommands(cli, options) {
  // []和<>的区别在于[]选项可选，<>必填
  cli
    .command('dev [docDir]', '启动开发服务')
    .option('--port <port>', '指定服务器端口')
    .option('--debug', '调试模式')
    .action((docDir = '.', options) => {
      wrapCommand(dev)({
        docDir: path.resolve(docDir),
        ...options
      })
    })

  cli
    .command('build [docDir]', '启动构建服务')
    .option('--port <port>', '指定服务器端口')
    .option('--debug', '调试模式')
    .action((docDir = '.', options) => {
      wrapCommand(build)({
        docDir: path.resolve(docDir),
        ...options
      })
    })
}
