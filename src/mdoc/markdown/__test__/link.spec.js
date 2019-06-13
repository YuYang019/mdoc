const { Md } = require('./util')
const link = require('../lib/link')
const { dataReturnable } = require('../index')

const mdL = Md().use(link)

dataReturnable(mdL)

const linkMap = {
  '/foo/bar.html': '/foo/bar.html',
  './foo/bar.html': './foo/bar.html',
  '../foo/bar.html': '../foo/bar.html',

  'bar.md': 'bar.html',
  '/foo/bar.md': '/foo/bar.html',
  './foo/bar.md': './foo/bar.html',
  '../foo/bar.md': '../foo/bar.html',

  // no change the README.md
  'README.md': 'README.html',
  './README.md': './README.html',
  '/foo/README.md': '/foo/README.html',
  './foo/README.md': './foo/README.html',

  'https://www.baidu.com': 'https://www.baidu.com'
}

describe('link', () => {
  test('should convert link correctly', done => {
    for (const before in linkMap) {
      const input = `[${before}](${before})`
      const output = mdL.render(input)
      const after = getCompiledLink(output)
      expect(after).toBe(linkMap[before])
    }
    done()
  })
})

function getCompiledLink(output) {
  const {
    data: { links }
  } = output
  return links[0]
}
