const path = require('path')
const { dev, build } = require('../../mdoc/core')
const { wrapCommand } = require('./util')

module.exports = function registerCommands(cli, options) {
  // []和<>的区别在于[]选项可选，<>必填
  cli
    .command('dev [sourceDir]', '启动开发服务')
    .option('--port <port>', '指定服务器端口')
    .option('--debug', '调试模式')
    .action((sourceDir = '.', options) => {

      wrapCommand(dev)({
        sourceDir: path.resolve(sourceDir),
        ...options
      })

    })

  cli
    .command('build [sourceDir]', '启动构建服务')
    .option('--port <port>', '指定服务器端口')
    .option('--debug', '调试模式')
    .action((sourceDir = '.', options) => {
      
      wrapCommand(build)({
        sourceDir: path.resolve(sourceDir),
        ...options
      })
      
  })
} 