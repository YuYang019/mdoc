module.exports = function fileToPath(relative) {
  // foo.md -> /foo.html
  // foo/bar.md -> /foo/bar.html
  relative = relative.replace(/\.md$/, '.html')

  return `/${relative}`
}
