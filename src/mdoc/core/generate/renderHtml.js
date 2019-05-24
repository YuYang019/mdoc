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
      env = nunjucks.configure(layoutPath, { autoescape: false, noCache: true })
      env = injectTemplateHelper(env)
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
      env = nunjucks.configure(layoutPath, { autoescape: false, noCache: true })
      env = injectTemplateHelper(env)
    }

    logger.debug(ctx.path, 'theme config: ', themeConfig)

    return env.renderString(pageTemplate, {
      content,
      isDev: !isProd,
      theme: themeConfig
    })
  }
}

function injectTemplateHelper(env) {
  env.addGlobal('css', stylesheets => {
    let result = ''
    if (Array.isArray(stylesheets)) {
      stylesheets.forEach(stylesheet => {
        result += `<link rel="stylesheet" href=${stylesheet}></link>`
      })
    } else if (typeof stylesheets === 'string') {
      result = `<link rel="stylesheet" href=${stylesheets}></link>`
    } else {
      result = ''
    }
    return result
  })

  env.addGlobal('js', scripts => {
    let result = ''
    if (Array.isArray(scripts)) {
      scripts.forEach(script => {
        result += `<script src=${script}></script>`
      })
    } else if (typeof scripts === 'string') {
      result = `<script src=${scripts}></link>`
    } else {
      result = ''
    }
    return result
  })

  return env
}

module.exports = { renderPage: renderPage(), renderIndex: renderIndex() }
