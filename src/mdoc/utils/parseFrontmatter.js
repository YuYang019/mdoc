const matter = require('gray-matter')

module.exports = function parseFrontmatter(content) {
  return matter(content, {
    excerpt_separator: '<!-- more -->'
  })
}
