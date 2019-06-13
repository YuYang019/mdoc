module.exports = md => {
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const hrefIndex = token.attrIndex('href')
    if (hrefIndex >= 0) {
      const link = token.attrs[hrefIndex]
      const href = link[1]
      // const isExternal = /^https?:/.test(href)
      const isSourceLink = /(\/|\.md|\.html)(#.*)?$/.test(href)
      // expose link for testing
      const routerLinks = md.$data.links || (md.$data.links = [])

      if (isSourceLink) {
        // xxx.md -> xxx.html
        const newHref = href.replace(/\.md$/, '.html')
        // .replace(/README\.html$/, 'index.html')
        link[1] = newHref
        routerLinks.push(newHref)
      } else {
        routerLinks.push(href)
      }
    }
    return self.renderToken(tokens, idx, options)
  }
}
