const path = require('path')
const fs = require('fs-extra')
const App = require('../App')

const docsBaseDir = path.resolve(__dirname, 'fixtures')
const docsName = fs.readdirSync(docsBaseDir)
const docsModes = docsName.map(name => {
  const docsPath = path.resolve(docsBaseDir, name)
  const docsTempPath = path.resolve(docsPath, '.temp')
  const docsSourcePath = path.resolve(docsPath, 'source')
  const docsPostPath = path.resolve(docsSourcePath, '_posts')

  return { name, docsPath, docsTempPath, docsSourcePath, docsPostPath }
})

const docsWithConfig = docsModes.filter(docs => docs.name === 'docs-config')[0]

describe('App', () => {
  test('should process path correctly', async () => {
    await Promise.all(
      docsModes.map(
        async ({ docsPath, docsTempPath, docsSourcePath, docsPostPath }) => {
          const app = new App({
            docDir: docsPath
          })
          await app.process()

          expect(app.docDir).toBe(docsPath)
          expect(app.pageDir).toBe(docsPostPath)
          expect(app.tempPath).toBe(docsTempPath)
          expect(app.sourceDir).toBe(docsSourcePath)
        }
      )
    )
  })

  test('should process siteConfig correctly', async () => {
    const { docsPath } = docsWithConfig
    const app = new App({ docDir: docsPath })
    await app.process()

    expect(app.siteConfig).not.toBeNull()
    expect(app.siteConfig).not.toBeUndefined()
    expect(app.siteConfig).toHaveProperty('base', '/Test/')
  })
})
