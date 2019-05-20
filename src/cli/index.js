#!/usr/bin/env node

const { CLI } = require('./lib/util')
const registerCommands = require('./lib/registerCommands')
const logger = require('../mdoc/utils/logger')

logger.success('成功')
logger.error('失败')
logger.tip('提示')
logger.wait('等待')
logger.debug('调试')

CLI({
  async beforeParse(cli) {
    const pkg = require('../../package.json')
    registerCommands(cli)
    cli.version(pkg.version).help()
  }
})
