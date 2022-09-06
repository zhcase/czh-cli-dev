'use strict'

const path = require('path')
const pkgDir = require('pkg-dir').sync
const { isObject } = require('@czh-cli-dev/utils')
const formatPath = require('@czh-cli-dev/format-path')
class Package {
  constructor(options) {
    if (!options || !isObject(options)) {
      throw new Error('packgae类的options参数不能为空！')
    }

    if (!isObject(options)) {
      throw new Error('packgae类的options参数必须为对象')
    }
    // package的路径
    this.targetPath = options.targetPath
    //package的存储路径
    // this.storePath = options.storePath
    //package的name
    this.packageName = options.packageName
    // package的version
    this.packageVersion = options.packageVersion
    console.log('package constructor')
  }

  // 判断当前package是否存在
  exists() {}
  // 安装package
  install() {}
  //更新package
  update() {}
  // 获取入口文件的路径
  getRootFilePath() {
    //1. 获取package.json 的所在目录 - pkg-dir
    const dir = pkgDir(this.targetPath)
    if (dir) {
      //2. 读取package.json - require() js/json/node
      const pkgFile = require(path.resolve(dir, 'package.json'))
      console.log(pkgFile)
      //3.寻找 main/lib -path
      if (pkgFile && (pkgFile.main || pkgFile.lib)) {
        //4.路径的兼容(macos/windows)
        return formatPath(path.resolve(dir, pkgFile.main))
      }
    }
    return null
  }
}

module.exports = Package
