'use strict'

module.exports = exec
const path = require('path')
const Package = require('@czh-cli-dev/package')
const log = require('@czh-cli-dev/log')
const SETTINGS = {
  init: '@imooc-cli/init',
}

const CACHE_DIR = 'dependencies'
async function exec() {
  let targetPath = process.env.CLI_TARGET_PATH
  const homePath = process.env.CLI_HOME_PATH
  let storeDir = ''
  let pkg
  log.verbose('targetPath', targetPath)
  log.verbose('homePath', homePath)
  const comdObj = arguments[arguments.length - 1]
  const cmdName = comdObj.name()
  const packageName = SETTINGS[cmdName]
  console.log('packageName', packageName)
  const packageVersion = 'latest'
  if (!targetPath) {
    //生成缓存路径
    targetPath = path.resolve(homePath, CACHE_DIR) //生成缓存路径
    storeDir = path.resolve(targetPath, 'node_modules')
    log.verbose('targetPath', targetPath)
    log.verbose('storeDir', storeDir)
  }
  pkg = new Package({
    targetPath,
    storeDir,
    packageName,
    packageVersion,
  })
  if (await pkg.exists()) {
    //更新package
    await pkg.update()
  } else {
    // 安装package
    await pkg.install()
  }

  const rootFile = pkg.getRootFilePath()
  if (rootFile) {
    require(rootFile).apply(null, arguments)
  }
  // TODO
}
