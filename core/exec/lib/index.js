'use strict'

module.exports = exec
const Package = require('@czh-cli-dev/package')
const log = require('@czh-cli-dev/log')

const SETTINGS = {
  init: '@czh-cli-dev/init',
}
function exec() {
  let targetPath = process.env.CLI_TARGET_PATH
  const homePath = process.env.CLI_HOME_PATH
  log.verbose('targetPath', targetPath)
  log.verbose('homePath', homePath)
  const comdObj = arguments[arguments.length - 1]
  const cmdName = comdObj.name()
  const packageName = SETTINGS[cmdName]
  console.log('packageName', packageName)
  const packageVersion = 'latest'
  if (!targetPath) {
    //生成缓存路径
    targetPath = '' //生成缓存路径
  }
  const pkg = new Package({
    targetPath,
    packageName,
    packageVersion,
  })
  console.log(pkg.exists())
  const rootFile=pkg.getRootFilePath();
  if(rootFile){
    require(rootFile).apply(null,arguments)
  }
  // TODO
}
