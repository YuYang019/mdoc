const path = require('path')

// handle base config
module.exports = base => md => {
  const linkOpen = md.renderer.rules.link_open

  // 处理a标签
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const hrefIndex = token.attrIndex('href')
    if (hrefIndex >= 0) {
      const link = token.attrs[hrefIndex]
      const href = link[1]
      const isSourceAbsoluteLink = /^\/\w*/.test(href)
      // expose link for testing
      const routerLinks = md.$data.links || (md.$data.links = [])

      if (isSourceAbsoluteLink) {
        // /static/foo/bar -> /base/static/foo/bar
        const newHref = path.join(base, href)
        link[1] = newHref
        routerLinks.push(newHref)
        // }
      } else {
        routerLinks.push(href)
      }
    }
    if (linkOpen) {
      return linkOpen(tokens, idx, options, env, self)
    }
    return self.renderToken(tokens, idx, options)
  }

  // 处理image标签
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const srcIndex = token.attrIndex('src')
    if (srcIndex >= 0) {
      const link = token.attrs[srcIndex]
      const src = link[1]
      const isSourceAbsoluteSrc = /^\/\w*/.test(src)
      // expose link for testing
      const routerLinks = md.$data.links || (md.$data.links = [])

      if (isSourceAbsoluteSrc) {
        // /static/foo/bar -> /base/static/foo/bar
        const newSrc = path.join(base, src)
        link[1] = newSrc
        routerLinks.push(newSrc)
      } else {
        routerLinks.push(src)
      }
    }
    return self.renderToken(tokens, idx, options)
  }
}
