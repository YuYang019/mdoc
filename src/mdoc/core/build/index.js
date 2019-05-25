const chalk = require('chalk')
const spawn = require('cross-spawn')
const logger = require('../../utils/logger')
const { generateGulpFile, removeGulpFile } = require('./generateGulpFile')

module.exports = class BuildProcess {
  constructor(ctx) {
    this.context = ctx
  }

  async process() {
    const begin = this.context._startTime
    await this.context.generateProcess.generateDist()
    await this.runGulp()
    await this.context.removeTemp()
    const end = new Date().getTime()
    logger.success('构建成功！', `总耗时 ${chalk.gray((end - begin) / 1000)} s`)
  }

  async runGulp() {
    const gulpFilePath = await generateGulpFile(this.context)
    return new Promise(resolve => {
      const child = spawn('npm', ['run', 'build', gulpFilePath])

      // 显示子进程输出的信息
      child.stdout.setEncoding('utf-8')
      child.stderr.setEncoding('utf-8')
      child.stdout.on('data', data => {
        logger.debug(data)
      })
      child.stderr.on('data', data => {
        logger.debug(data)
      })

      child.on('error', code => {
        logger.debug('gulp process error', 'code:', code)
        resolve()
      })
      child.on('exit', (code, signal) => {
        logger.debug('gulp process exit', 'code:', code, 'signal:', signal)
        resolve()
      })
      child.on('close', code => {
        logger.debug('gulp process close', 'code:', code)
        resolve()
      })
    }).then(() => {
      removeGulpFile()
    })
  }
}
