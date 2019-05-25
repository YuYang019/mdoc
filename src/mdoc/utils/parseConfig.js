const fs = require('fs-extra')
const yamlParser = require('js-yaml')

module.exports = function parseConfig(configPath) {
  const content = fs.readFileSync(configPath, 'utf-8')

  const data = yamlParser.safeLoad(content)

  return data || {}
}
