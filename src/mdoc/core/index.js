const App = require('./app')

function createApp(options) {
  return new App(options)
}

async function build(options) {
  const app = createApp(options)
  await app.process()
  return app.build()
}

async function dev(options) {
  const app = createApp(options)
  await app.process()
  return app.dev()
}

exports.dev = dev
exports.build = build
