const fs = require('fs-extra')
const path = require('path')
const logger = require('../utils/logger')

async function loadTheme() {
  const layoutPath = path.resolve(__dirname, '../theme/layout.njk')
  const layoutHtml = await fs.readFile(layoutPath, 'utf-8')

  logger.debug('layout文件所在路径：', layoutPath)

  return { layoutHtml, layoutPath }
}

module.exports = loadTheme