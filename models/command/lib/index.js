'use strict'
const semver = require('semver')
const colors = require('colors/safe')
const log = require('@czh-cli-dev/log')
// const {isObject}=require('@czh-cli-dev/utils')
const LOWEST_NODE_VERSION = '12.0.0'

class Command {
  constructor(argv) {
    // log.verbose('Command constructor', argv)
    if (!argv) {
      throw new Error(colors.red('参数不能为空!'))
    }
    if (!Array.isArray(argv)) {
      throw new Error(colors.red('参数必须是一个数组!'))
    }
    if (argv.length < 1) {
      throw new Error(colors.red('参数列表为空!'))
    }
    this._argv = argv
    let runner = new Promise((resolve, reject) => {
      let chain = Promise.resolve()
      chain = chain.then(() => this.checkNodeVersion())
      chain = chain.then(() => this.initArgs())
      chain = chain.then(() => this.init())
      chain = chain.then(() => this.exec())
      chain.catch(err => {
        log.error(err.message)
      })
    })
    console.log(runner)
  }

  initArgs() {
    this._cmd = this._argv[this._argv.length - 1]
    this._argv = this._argv.slice(0, this._argv.length - 1)
  }
  // 检查node版本
  checkNodeVersion() {
    // 第一步获取当前node版本号
    const currentVersion = process.version
    // 第二步 比对最低版本号
    const lowestVersion = LOWEST_NODE_VERSION
    if (!semver.gte(currentVersion, lowestVersion)) {
      throw new Error(
        colors.red(`czh-cli 需要安装 v${lowestVersion}以上版本的Node.js`),
      )
    }
  }

  init() {
    throw new Error('init 必须实现')
  }

  exec() {
    throw new Error('exec 必须实现')
  }
}

module.exports = Command
