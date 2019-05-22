const nunjucks = require('nunjucks')
const logger = require('../../utils/logger')

// 渲染首页布局
function renderIndex() {
  let env = null

  return (content, ctx) => {
    const {
      theme: { indexTemplate, layoutPath, themeConfig },
      isProd
    } = ctx

    if (!env) {
      logger.debug('缓存nunjuck env')
      // 设置主题模板所在路径
      env = nunjucks.configure(layoutPath, { autoescape: false })
    }

    return env.renderString(indexTemplate, {
      content,
      isDev: !isProd,
      theme: themeConfig
    })
  }
}

// 渲染文章布局
function renderPage() {
  let env = null

  return (content, ctx) => {
    const {
      theme: { pageTemplate, layoutPath, themeConfig },
      isProd
    } = ctx

    if (!env) {
      logger.debug('缓存nunjuck env')
      env = nunjucks.configure(layoutPath, { autoescape: false })
    }

    logger.debug('theme config: ', themeConfig)

    return env.renderString(pageTemplate, {
      content,
      isDev: !isProd,
      theme: themeConfig
    })
  }
}

module.exports = { renderPage: renderPage(), renderIndex: renderIndex() }
