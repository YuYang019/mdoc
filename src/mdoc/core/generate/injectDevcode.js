const cheerio = require('cheerio')

module.exports = function injectDevcode(html) {
  const $ = cheerio.load(html)

  $('head').append('<script src="/socket.io/socket.io.js"></script>')
  $('head').append(
    `<script>window.onload=function(){var socket=io();socket.on('refresh',function(){window.location.reload(true)})}</script>`
  )

  return $.html()
}
