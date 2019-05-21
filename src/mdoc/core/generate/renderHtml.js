const nunjucks = require('nunjucks')
const logger = require('../../utils/logger')

function renderIndex() {
  let env = null

  return (content, ctx) => {
    const {
      theme: { indexHtml, layoutPath },
      isProd
    } = ctx

    if (!env) {
      logger.debug('缓存env')
      env = nunjucks.configure(layoutPath, { autoescape: false })
    }

    return env.renderString(indexHtml, { content, isDev: !isProd })
  }
}

function renderPage() {
  let env = null

  return (content, ctx) => {
    const {
      theme: { pageHtml, layoutPath, themeConfig },
      isProd
    } = ctx

    if (!env) {
      logger.debug('缓存nunjuck env')
      env = nunjucks.configure(layoutPath, { autoescape: false })
    }

    logger.debug('theme config: ', themeConfig)

    return env.renderString(pageHtml, {
      content,
      isDev: !isProd,
      theme: themeConfig
    })
  }
}

module.exports = { renderPage: renderPage(), renderIndex: renderIndex() }
