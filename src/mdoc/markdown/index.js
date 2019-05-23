const MarkdownIt = require('markdown-it')
const normalizeLink = require('./lib/link')
const highlight = require('./lib/highlight')

function createMarkdown(options) {
  const md = new MarkdownIt({
    highlight
  })

  md.use(normalizeLink)

  return md
}

module.exports = createMarkdown
