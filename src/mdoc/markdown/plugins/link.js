module.exports = md => {
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const hrefIndex = token.attrIndex('href')
    if (hrefIndex >= 0) {
      const link = token.attrs[hrefIndex]
      const href = link[1]
      // const isExternal = /^https?:/.test(href)
      const isSourceLink = /(\/|\.md|\.html)(#.*)?$/.test(href)
      if (isSourceLink) {
        // xxx.md -> xxx.html
        // README.html -> index.html
        const newHref = href
          .replace(/\.md$/, '.html')
          .replace(/README\.html$/, 'index.html')
        link[1] = newHref
      }
    }
    return self.renderToken(tokens, idx, options)
  }
}
