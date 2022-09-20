'use strict'
const fs = require('fs')
const fse = require('fs-extra')
const inquirer = require('inquirer')
const Command = require('@czh-cli-dev/command')
const log = require('@czh-cli-dev/log')
class InitCommand extends Command {
  init() {
    this.projectName = this._argv[0] || ''
    this.force = !!this._cmd.force
    log.verbose('projectName', this.projectName)
    log.verbose('force', this.force)
  }
  exec() {
    //1. 准备阶段
    try {
      this.prepare()
    } catch (error) {
      log.error(error.message)
    }
    //2.安装模板
    // 3. 安装模板
  }

  async prepare() {
    const localPath = process.cwd()
    //1. 判断当前目录为空
    console.log(!this.isDirEmpty(localPath))
    if (!this.isDirEmpty(localPath)) {
      let ifContinue = false

      if (!this.force) {
        //1.1询问是否继续创建
        ifContinue = (
          await inquirer.prompt({
            type: 'confirm',
            name: 'ifContinue',
            default: false,
            message: '当前文件夹不为空，是否继续创建?',
          })
        ).ifContinue
        console.log(ifContinue)
        if (!ifContinue) {
          return
        }
      }
      console.log(ifContinue)
      if (ifContinue || this.force) {
        // 给用户做二次确认
        const { confirmDelete } = await inquirer.prompt({
          type: 'confirm',
          name: 'confirmDelete',
          default: false,
          message: '是否确认清空当前目录下的文件',
        })
        if (confirmDelete) {
          //清空当前目录
          fse.emptyDirSync(localPath)
        }
      }
    }
    //2.是否启动强制更新
    //3.选择创建项目或者组件
    //3.获取项目的基本信息
    //4. 获取项目的基本信息
  }

  // 判断目录是否为空
  isDirEmpty(localPath) {
    let fileList = fs.readdirSync(localPath)
    //文件过滤
    fileList = fileList.filter(
      file => !file.startsWith('.') && ['node_modules'].indexOf(file) < 0,
    )
    console.log(fileList)
    return !fileList || fileList.length <= 0
  }
}

function init(argv) {
  return new InitCommand(argv)
}

module.exports.InitCommand = InitCommand

module.exports = init
