const { Md } = require('./util')
const { getFragment } = require('../../test-utils')
const highlight = require('../lib/highlight')

const md = Md()
const mdH = Md().set({ highlight })

describe('highlight', () => {
  test('should highlight the code', done => {
    const input = getFragment(__dirname, 'code.md')
    const output1 = md.render(input)
    const output2 = mdH.render(input)
    expect(output1 === output2).toBe(false)
    expect(output2).toMatchSnapshot()
    done()
  })
})
