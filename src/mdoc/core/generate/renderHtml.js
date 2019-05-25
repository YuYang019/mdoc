const nunjucks = require('nunjucks')
const path = require('path')
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
      env = injectTemplateHelper(env, ctx)
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
      env = injectTemplateHelper(env, ctx)
    }

    logger.debug('theme config: ', themeConfig)

    return env.renderString(pageTemplate, {
      content,
      isDev: !isProd,
      theme: themeConfig
    })
  }
}

function injectTemplateHelper(env, ctx) {
  const base = ctx.siteConfig.base
  const isProd = ctx.isProd

  env.addGlobal('css', stylesheets => {
    const urlFor = env.getGlobal('url_for')
    let result = ''

    if (Array.isArray(stylesheets)) {
      stylesheets.forEach(stylesheet => {
        result += `<link rel="stylesheet" href=${urlFor(stylesheet)}></link>`
      })
    } else if (typeof stylesheets === 'string') {
      result = `<link rel="stylesheet" href=${urlFor(stylesheets)}></link>`
    } else {
      result = ''
    }
    return result
  })

  env.addGlobal('js', scripts => {
    const urlFor = env.getGlobal('url_for')
    let result = ''

    if (Array.isArray(scripts)) {
      scripts.forEach(script => {
        result += `<script src=${urlFor(script)}></script>`
      })
    } else if (typeof scripts === 'string') {
      result = `<script src=${urlFor(scripts)}></link>`
    } else {
      result = ''
    }
    return result
  })

  // 这是个很偷懒的方法，模板直接调用这个方法，就能修正链接
  env.addGlobal('url_for', url => {
    if (isProd && base) {
      return path.join(base, url)
    } else {
      return url
    }
  })

  return env
}

module.exports = { renderPage: renderPage(), renderIndex: renderIndex() }
