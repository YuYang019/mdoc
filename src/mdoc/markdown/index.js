const MarkdownIt = require('markdown-it')
const normalizeLink = require('./plugins/link')

function createMarkdown (options) {
  const md = new MarkdownIt()

  md.use(normalizeLink)

  return md
}

module.exports = createMarkdown
