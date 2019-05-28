const stylus = require('stylus')

function stylusRenderer() {}

stylusRenderer.render = (str, cb) => stylus.render(str, cb)

module.exports = stylusRenderer
