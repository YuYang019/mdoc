const chalk = require('chalk')

class Logger {
  constructor(options = {}) {
    this.options = Object.assign(
      {
        logLevel: process.argv.includes('--debug') ? 2 : 1
      },
      options
    )
  }

  success(...args) {
    console.log(chalk.green('success'), ...args)
  }

  error(...args) {
    console.error(chalk.red('error'), ...args)
  }

  wait(...args) {
    console.log(chalk.cyan('wait'), ...args)
  }

  warn(...args) {
    console.warn(chalk.yellow('warn'), ...args)
  }

  tip(...args) {
    console.log(chalk.blue('tip'), ...args)
  }

  debug(...args) {
    if (this.options.logLevel < 2) return
    console.log(chalk.magenta('debug'), ...args)
  }
}

module.exports = new Logger()
