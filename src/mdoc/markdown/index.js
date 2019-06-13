const MarkdownIt = require('markdown-it')
const normalizeLink = require('./lib/link')
const highlight = require('./lib/highlight')

function createMarkdown(options) {
  const md = new MarkdownIt({
    highlight
  })

  md.use(normalizeLink)

  module.exports.dataReturnable(md)

  return md
}

module.exports = createMarkdown

// for testing
module.exports.dataReturnable = function dataReturnable(md) {
  const render = md.render
  md.render = (...args) => {
    // 每次调用render, $data就会重置，方便测试
    md.$data = {}
    const html = render.call(md, ...args)
    return {
      html,
      data: md.$data
    }
  }
}
