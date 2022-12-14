'use strict'
const path = require('path')
const semver = require('semver')
const commander = require('commander')
const userHome = require('user-home')
const pathExists = require('path-exists').sync
const colors = require('colors/safe')
const pkg = require('../package.json')
const log = require('@czh-cli-dev/log')
const init = require('@czh-cli-dev/init')
const exec = require('@czh-cli-dev/exec')
const constant = require('./const')

let args, config
const program = new commander.Command()

async function core() {
  try {
    prepare()
    registerCommand()
  } catch (e) {
    log.error(e.message)
    if (process.debug) {
      console.log(e)
    }
  }
}

// 注册命令
function registerCommand() {
  program
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d, --debug', '是否开启调试模式', false)
    .option('-tp,--targetPath <targetPath>', '是否指定本地调试文件路径', '')

  program
    .command('init [projectName]')
    .option('-f,--force', '是否强制初始化项目')
    .action(exec)
  // 开启debug模式
  program.on('option:debug', () => {
    if (program.opts().debug) {
      process.env.LOG_LEVEL = 'verbose'
    } else {
      process.env.LOG_LEVEL = 'info'
    }
    log.level = process.env.LOG_LEVEL
    log.verbose('test')
  })

  //指定targetPath
  program.on('option:targetPath', () => {
    process.env.CLI_TARGET_PATH = program.opts().targetPath
  })

  // 对未知命令监听
  program.on('command:*', obj => {
    const availableCommands = program.commands.map(cmd => cmd.name())
    console.log(colors.red('未知的命令' + obj[0]))
    if (availableCommands.length > 0) {
      console.log(colors.red('可用命令:' + availableCommands.join(',')))
    }
  })
  if (program.args && program.args.length < 1) {
    program.outputHelp()
    console.log()
  }
  program.parse(process.argv)
}

async function prepare() {
  checkPkgVersion()
  checkNodeVersion()
  checkRoot(); //后面恢复 目前他只在mac上有用
  checkUserHome()
  // checkInputArgs()
  checkEnv()
  await checkGlobalUpdate()
}

// 检查是否需要全局更新
async function checkGlobalUpdate() {
  // 1.获取当前版本号合模块名
  const currentVersion = pkg.version
  const npmName = pkg.name
  // 2.调用Npm Api 获取所有模块
  const { getNpmSemverVersion } = require('@czh-cli-dev/get-npm-info')
  // 3.提取所有版本号，比对哪些版本号是大于当前版本号的
  let lastVersion = await getNpmSemverVersion(currentVersion, npmName)
  // 4. 获取最新版本号，提示用户更新到该版本
  if (lastVersion && semver.gt(lastVersion, currentVersion)) {
    log.warn(
      colors.yellow(`请手动更新${npmName},当前版本：${currentVersion},最新版本:${lastVersion}
    更新命令：npm install -g ${npmName}`),
    )
  }
}

// 检查环境变量
function checkEnv() {
  const dotenv = require('dotenv')
  let dotenvPath = path.resolve(userHome, '.env')
  if (pathExists(dotenvPath)) {
    dotenv.config({ path: dotenvPath })
  }
  createDefaultConfig()

  log.verbose('环境变量', process.env.CLI_HOME_PATH)
}

// 创建默认配置
function createDefaultConfig() {
  const cliConifg = {
    home: userHome,
  }
  if (process.env.CLI_HOME) {
    cliConifg['cliHome'] = path.join(userHome, process.env.CLI_HOME)
  } else {
    cliConifg['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME)
  }
  //  第二种
  process.env.CLI_HOME_PATH = cliConifg.cliHome
  //  第一种
  //  return cliConifg;
}

// 检查入参是否是debug模式
// function checkInputArgs() {
//   const minimist = require('minimist')
//   args = minimist(process.argv.slice(2))
//   checkArgs()
// }

// 检查参数
// function checkArgs() {
//   if (args.debug) {
//     process.env.LOG_LEVEL = 'verbose'
//   } else {
//     process.env.LOG_LEVEL = 'info'
//   }
//   log.level = process.env.LOG_LEVEL
// }

// 检查是否是root账户启动  注：windows 系统有问题 目前所知只有macOs才生效
function checkRoot() {
  // console.log(process.geteuid());
  const rootCheck = require('root-check')
  // 切换到root账户
  rootCheck()
}

//切换到用户主目录 检查用户主目录是否存在
function checkUserHome() {
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red('当前登录用户主目录不存在!'))
  }
}

// 检查node版本
function checkNodeVersion() {
  // 第一步获取当前node版本号
  const currentVersion = process.version
  // 第二步 比对最低版本号
  const lowestVersion = constant.LOWEST_NODE_VERSION
  if (!semver.gte(currentVersion, lowestVersion)) {
    throw new Error(
      colors.red(`czh-cli 需要安装 v${lowestVersion}以上版本的Node.js`),
    )
  }
}

// 检查package版本
function checkPkgVersion() {
  log.info('cli', pkg.version)
}

module.exports = core
