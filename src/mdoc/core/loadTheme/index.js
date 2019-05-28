const fs = require('fs-extra')
const path = require('path')
const logger = require('../../utils/logger')
const parseConfig = require('../../utils/parseConfig')

async function loadTheme(ctx) {
  const themePath = path.resolve(__dirname, '../../theme')
  const layoutPath = path.resolve(__dirname, '../../theme/layout')
  const pagePath = path.resolve(__dirname, '../../theme/layout/page.njk')
  const indexPath = path.resolve(__dirname, '../../theme/layout/index.njk')
  const staticPath = path.resolve(__dirname, '../../theme/static')

  const pageTemplate = await fs.readFile(pagePath, 'utf-8')
  const indexTemplate = await fs.readFile(indexPath, 'utf-8')

  logger.debug('layout文件夹所在路径：', layoutPath)
  logger.debug('static文件夹所在路径：', staticPath)

  const themeConfig = loadThemeConfig(ctx)

  return {
    themePath,
    layoutPath,
    indexTemplate,
    pageTemplate,
    staticPath,
    indexPath,
    pagePath,
    themeConfig
  }
}

function loadThemeConfig(ctx) {
  const configPath = path.resolve(__dirname, '../../theme/config.yml')

  let themeConfig = {}
  if (fs.existsSync(configPath)) {
    themeConfig = parseConfig(configPath)
  }

  return themeConfig
}

module.exports = loadTheme
