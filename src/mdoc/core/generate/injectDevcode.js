const cheerio = require('cheerio')

function injectDevcode(html) {
  const $ = cheerio.load(html)

  $('head').append('<script src="/socket.io/socket.io.js"></script>')
  $('head').append(
    `<script>window.onload=function(){var socket=io();socket.on('refresh',function(){window.location.reload(true)})}</script>`
  )

  return $.html()
}

module.exports = { injectDevcode }
