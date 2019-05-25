const path = require('path')

module.exports = ctx => md => {
  const linkOpen = md.renderer.rules.link_open
  const siteConfig = ctx.siteConfig

  // 处理a标签
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const hrefIndex = token.attrIndex('href')
    if (hrefIndex >= 0) {
      const link = token.attrs[hrefIndex]
      const href = link[1]
      const isSourceAbsoluteLink = /^\/\w*/.test(href)
      if (isSourceAbsoluteLink) {
        // /static/foo/bar -> /base/static/foo/bar
        const newHref = path.join(siteConfig.base, href)
        link[1] = newHref
      }
    }
    return linkOpen(tokens, idx, options, env, self)
  }

  // 处理image标签
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const srcIndex = token.attrIndex('src')
    if (srcIndex >= 0) {
      const link = token.attrs[srcIndex]
      const src = link[1]
      const isSourceAbsoluteSrc = /^\/\w*/.test(src)
      if (isSourceAbsoluteSrc) {
        // /static/foo/bar -> /base/static/foo/bar
        const newSrc = path.join(siteConfig.base, src)
        link[1] = newSrc
      }
    }
    return self.renderToken(tokens, idx, options)
  }
}
