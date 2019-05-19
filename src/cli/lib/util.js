const cac = require('cac')
const chalk = require('chalk')

async function CLI({
  beforeParse,
  afterParse
}) {
  const cli = cac()
  beforeParse && beforeParse(cli)
  cli.parse(process.argv)
  afterParse && afterParse(cli)
}

// 包装命令，使得能捕获错误
function wrapCommand(fn) {
  return (...args) => {
    return fn(...args).catch(err => {
      console.error(chalk.red(err.stack))
      process.exitCode = 1
    })
  }
}

module.exports = {
  CLI,
  wrapCommand
}