const fileToPath = require('../fileToPath')

test('fileToPath', () => {
  const map = {
    'README.md': '/README.html',
    'foo/README.md': '/foo/README.html',

    'bar.md': '/bar.html',
    'foo/bar.md': '/foo/bar.html'
  }

  for (const key in map) {
    const input = key
    const output = fileToPath(input)
    expect(output).toBe(map[key])
  }
})
