const { Md } = require('./util')
const addBaseToLink = require('../lib/addBaseToLink')
const { dataReturnable } = require('../index')

const base = '/Test/'
const mdL = Md().use(addBaseToLink(base))

dataReturnable(mdL)

const linkMap = {
  '/foo/bar.html': `${base}foo/bar.html`,

  './foo/bar.html': './foo/bar.html',
  '../foo/bar.html': '../foo/bar.html',
  'https://www.baidu.com': 'https://www.baidu.com'
}

describe('add base to link', () => {
  test('should add base to img src correctly', done => {
    for (const before in linkMap) {
      const input = `![${before}](${before})`
      const output = mdL.render(input)
      const after = getCompiledLink(output)
      expect(after).toBe(linkMap[before])
    }
    done()
  })

  test('should add base to a href correctly', done => {
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
