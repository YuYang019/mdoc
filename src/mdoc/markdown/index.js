const MarkdownIt = require('markdown-it')

module.exports = (options) => {
  const md = new MarkdownIt()

  return md
}