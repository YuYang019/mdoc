const express = require('express')
const logger = require('../../utils/logger')
const path = require('path')
const SocketIo = require('socket.io')
const Http = require('http')

module.exports = function createDevServer(ctx) {
  const app = express()
  const http = Http.Server(app)
  const io = SocketIo(http)

  const staticPath = path.relative(process.cwd(), ctx.tempPath)
  logger.debug('命令运行目录到静态资源的相对路径为：', staticPath)

  // io.on('connection', function(socket){
  //   logger.success('开发服务器已连接')
  // })

  // express解析static目录，是通过path.resolve(root)解析
  // 而path.resolve()只有一个参数的时候，相当于path.resolve(process.cwd(), root)
  // 所以我们获取staticPath值的时候，也要基于process.cwd()来取
  app.use(express.static(staticPath))

  http.listen(3000, () => {
    logger.success('开发服务器启动成功，端口为：', 3000)
  })

  return io
}

