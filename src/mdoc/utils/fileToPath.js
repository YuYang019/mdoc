module.exports = function fileToPath(relative) {
  // README.md -> index.html
  // foo/README.md -> /foo/index.html
  // foo.md -> /foo.html
  // foo/bar.md -> /foo/bar.html
  relative = relative
    .replace(/\.md$/, '.html')
    .replace(/README\.html$/, 'index.html')

  return `/${relative}`
}
