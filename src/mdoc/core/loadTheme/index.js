const fs = require('fs-extra')
const path = require('path')
const yamlParser = require('js-yaml')
const logger = require('../../utils/logger')

async function loadTheme() {
  const layoutPath = path.resolve(__dirname, '../../theme/layout')
  const pagePath = path.resolve(__dirname, '../../theme/layout/page.njk')
  const indexPath = path.resolve(__dirname, '../../theme/layout/index.njk')
  const sourcePath = path.resolve(__dirname, '../../theme/source')

  const pageHtml = await fs.readFile(pagePath, 'utf-8')
  const indexHtml = await fs.readFile(indexPath, 'utf-8')

  logger.debug('layout文件夹所在路径：', layoutPath)
  logger.debug('source文件夹所在路径：', sourcePath)

  const themeConfig = loadThemeConfig()

  return {
    layoutPath,
    indexHtml: addTemplateHelper(indexHtml),
    pageHtml: addTemplateHelper(pageHtml),
    sourcePath,
    indexPath,
    pagePath,
    themeConfig
  }
}

function addTemplateHelper(html) {
  const helperPath = path.resolve(__dirname, './templateHelper/helper.njk')
  const helper = fs.readFileSync(helperPath, 'utf-8')

  return helper + '\n' + html
}

function loadThemeConfig() {
  const configPath = path.resolve(__dirname, '../../theme/config.yml')

  let themeConfig = {}
  if (fs.existsSync(configPath)) {
    themeConfig = parseConfig(configPath)
  }

  return themeConfig
}

function parseConfig(configPath) {
  const content = fs.readFileSync(configPath, 'utf-8')

  const data = yamlParser.safeLoad(content)

  return data || {}
}

module.exports = loadTheme