const createMarkdown = require('../markdown')

module.exports = function(ctx) {
  // todo 加上config，可配置markdown-it
  return createMarkdown()
}
