#!/usr/bin/env node

const { CLI } = require('./lib/util')
const registerCommands = require('./lib/registerCommands')

CLI({
  async beforeParse(cli) {
    const pkg = require('../../package.json')
    registerCommands(cli)
    cli.version(pkg.version).help()
  }
})
