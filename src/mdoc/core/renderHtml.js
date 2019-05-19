const nunjucks = require('nunjucks')

nunjucks.configure({ autoescape: false })

async function renderHtml(content, pageCtx) {
  const { layoutHtml } = pageCtx._context.theme
  const html = nunjucks.renderString(layoutHtml, { content })
  return html
}

module.exports = renderHtml