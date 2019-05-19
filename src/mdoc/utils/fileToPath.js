module.exports = function fileToPath(relative) {
  // foo.md -> /foo.html
  // foo/bar.md -> /foo/bar.html
  return `/${relative.replace(/\.md$/, '')}.html`
}