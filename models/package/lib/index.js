'use strict'

const path = require('path')
const fse = require('fs-extra')
const npminstall = require('npminstall')
const pkgDir = require('pkg-dir').sync
const pathExists = require('path-exists').sync
const { isObject } = require('@czh-cli-dev/utils')
const formatPath = require('@czh-cli-dev/format-path')
const {
  getDefaultRegistry,
  getNpmLatestVersion,
} = require('@czh-cli-dev/get-npm-info')
class Package {
  constructor(options) {
    if (!options || !isObject(options)) {
      throw new Error('packgae类的options参数不能为空！')
    }

    if (!isObject(options)) {
      throw new Error('packgae类的options参数必须为对象')
    }
    // package的目标路径
    this.targetPath = options.targetPath
    //缓存的package的路径
    this.storeDir = options.storeDir
    //package的存储路径
    // this.storePath = options.storePath
    //package的name
    this.packageName = options.packageName
    // package的version
    this.packageVersion = options.packageVersion
    //package的缓存目录前缀
    this.cacheFilePathPrefix = this.packageName.replace('/', '_')
  }

  async prepare() {
    if (this.storeDir && !pathExists(this.storeDir)) {
      fse.mkdirpSync(this.storeDir)
    }
    if (this.packageVersion === 'latest') {
      this.packageVersion = await getNpmLatestVersion(this.packageName)
    }
    // _@czh-cli-init@1.1.2@czh-cli/
    // @czh-cli/init 1.1.2
    // _@czh-cli_init@1.1.2@@czh-cli
  }

  get cacheFilePath() {
    return path.resolve(
      this.storeDir,
      `_${this.cacheFilePathPrefix}@${this.packageVersion}@${this.packageName}`,
    )
  }

  getSpecifiCacheFilePath(packageVersion) {
    return path.resolve(
      this.storeDir,
      `_${this.cacheFilePathPrefix}@${packageVersion}@${this.packageName}`,
    )
  }

  // 判断当前package是否存在
  async exists() {
    console.log('this.storeDir', this.storeDir)
    if (this.storeDir) {
      await this.prepare()
      return pathExists(this.cacheFilePath)
    } else {
      return pathExists(this.targetPath)
    }
  }
  // 安装package
  async install() {
    await this.prepare()
    return npminstall({
      root: this.targetPath,
      storeDir: this.storeDir,
      registry: getDefaultRegistry(),
      pkgs: [
        {
          name: this.packageName,
          version: this.packageVersion,
        },
      ],
    })
  }
  //更新package
  async update() {
    await this.prepare()
    // 1. 获取最新的npm 模块版本号
    const latestPackageVersion = await getNpmLatestVersion(this.packageName)
    // 2. 查询最新版本号对应的路径是否存在
    const latestFilePath = this.getSpecifiCacheFilePath(latestPackageVersion)
    console.log('latestFilePath', latestFilePath)
    // 3.如果不存在，则直接安装最新版本
    if (!pathExists(latestFilePath)) {
      return npminstall({
        root: this.targetPath,
        storeDir: this.storeDir,
        registry: getDefaultRegistry(),
        pkgs: [
          {
            name: this.packageName,
            version: latestPackageVersion,
          },
        ],
      })
    }
  }
  // 获取入口文件的路径
  getRootFilePath() {
    function _getRootFile(targetPath) {
      //1. 获取package.json 的所在目录 - pkg-dir
      const dir = pkgDir(targetPath)
      if (dir) {
        //2. 读取package.json - require() js/json/node
        const pkgFile = require(path.resolve(dir, 'package.json'))
        //3.寻找 main/lib -path
        if (pkgFile && (pkgFile.main || pkgFile.lib)) {
          //4.路径的兼容(macos/windows)
          console.log('formatPath', formatPath(path.resolve(dir, pkgFile.main)))
          return formatPath(path.resolve(dir, pkgFile.main))
        }
      }
    }
    if (this.storeDir) {
      return _getRootFile(this.cacheFilePath)
    } else {
      return _getRootFile(this.targetPath)
    }

    return null
  }
}

module.exports = Package
