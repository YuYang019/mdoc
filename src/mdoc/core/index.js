const App = require('./App')

function createApp(options) {
  return new App(options)
}

async function build(options) {
  const app = createApp(options)
  app.isProd = true
  await app.process()
  return app.build()
}

async function dev(options) {
  const app = createApp(options)
  app.isProd = false
  await app.process()
  return app.dev()
}

exports.dev = dev
exports.build = build
