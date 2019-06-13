const path = require('path')
const fs = require('fs-extra')
const Page = require('../Page')
const createMarkdown = require('../../markdown')

const docsBaseDir = path.resolve(__dirname, 'fixtures/docs')
const docsPostDir = path.resolve(docsBaseDir, 'source/_posts')

function getDocument(name) {
  return {
    filePath: path.resolve(docsPostDir, name),
    relative: name
  }
}

describe('Page', () => {
  test('should process page correctly - with frontmatter and excerpt', async () => {
    const { filePath, relative } = getDocument('post-2.md')
    const page = new Page({ filePath, relative })

    expect(page._filePath).toBe(filePath)
    expect(page.path).toBe('/post-2.html')

    const markdown = createMarkdown()
    await page.process({ markdown })
    expect(page.title).toBe('mdoc title')
    expect(page.frontmatter).toHaveProperty('title', 'mdoc title')
    expect(page.frontmatter).toHaveProperty('author', 'maoyuyang')

    expect(page.excerpt).toBeDefined()

    const content = fs.readFileSync(filePath, 'utf-8')
    expect(page._content).toBe(content)
    expect(page._content.startsWith('---')).toBe(true)
    expect(page._strippedContent.startsWith('---')).toBe(false)
  })

  test('should process page correctly - no frontmatter and excerpt', async () => {
    const { filePath, relative } = getDocument('post-1.md')
    const page = new Page({ filePath, relative })

    expect(page._filePath).toBe(filePath)
    expect(page.path).toBe('/post-1.html')

    const markdown = createMarkdown()
    await page.process({ markdown })
    expect(page.frontmatter).toEqual({})

    const content = fs.readFileSync(filePath, 'utf-8')
    expect(page._content).toBe(content)
    expect(page._strippedContent).toBe(content)
  })
})
