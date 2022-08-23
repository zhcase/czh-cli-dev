"use strict";

const semver = require("semver");
const colors = require("colors/safe");
const pkg = require("../package.json");
const log = require("@czh-cli-dev/log");
const constant = require("./const");

function core() {
  try {
    checkPkgVersion();
    checkNodeVersion();
    checkRoot();
  } catch (e) {
    log.error(e.message);
  }
}

// 检查是否是root账户启动  注：windows 系统有问题 目前所知只有macOs才生效
function checkRoot(){
    // console.log(process.geteuid());
    const rootCheck=require("root-check");
    // 切换到root账户
    rootCheck();
}



// 检查node版本
function checkNodeVersion() {
  // 第一步获取当前node版本号
  const currentVersion = process.version;
  // 第二步 比对最低版本号
  const lowestVersion = constant.LOWEST_NODE_VERSION;
  if (!semver.gte(currentVersion, lowestVersion)) {
    throw new Error(
      colors.red(`czh-cli 需要安装 v${lowestVersion}以上版本的Node.js`)
    );
  }
}

// 检查package版本
function checkPkgVersion() {
  log.info("cli", pkg.version);
}

module.exports = core;
