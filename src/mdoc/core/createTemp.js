const path = require('path')
const fs = require('fs-extra')
const LRU = require('lru-cache')
const logger = require('../utils/logger')

function createTemp(ctx) {
  const tempPath = path.join(ctx.docDir, '.temp')
  const cache = new LRU()

  if (!fs.existsSync(tempPath)) {
    fs.ensureDirSync(tempPath)
  } else {
    fs.emptyDirSync(tempPath)
  }

  async function writeTemp(file, content) {
    const destPath = path.join(tempPath, file)
    // 如果md文件存在文件夹层级。那么生成对应html的文件夹层级也应该相同
    await fs.ensureDir(path.parse(destPath).dir)

    logger.debug('写入文件的路径：', destPath)

    const cached = cache.get(destPath)
    if (cached !== content) {
      try {
        cache.set(file, content)
        await fs.writeFile(destPath, content)
      } catch (e) {
        logger.error(e)
      }
    }
    return destPath
  }

  return {
    tempPath,
    writeTemp
  }
}

module.exports = createTemp
