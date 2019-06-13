const path = require('path')
const fs = require('fs-extra')

exports.getFragment = (dirname, name, fragmentDir = 'fragments') => {
  const fragmentPath = path.resolve(dirname, `${fragmentDir}/${name}`)
  const fragment = fs.readFileSync(fragmentPath, 'utf-8')

  return fragment
}
