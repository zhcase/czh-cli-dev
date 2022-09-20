"use strict";

module.exports = exec;
const path = require("path");
const cp = require("child_process");
const Package = require("@czh-cli-dev/package");
const log = require("@czh-cli-dev/log");
const SETTINGS = {
  init: "@imooc-cli/init",
};

const CACHE_DIR = "dependencies";
async function exec() {
  let targetPath = process.env.CLI_TARGET_PATH;
  const homePath = process.env.CLI_HOME_PATH;
  let storeDir = "";
  let pkg;
  log.verbose("targetPath", targetPath);
  log.verbose("homePath", homePath);
  const comdObj = arguments[arguments.length - 1];
  const cmdName = comdObj.name();
  const packageName = SETTINGS[cmdName];
  const packageVersion = "latest";
  if (!targetPath) {
    //生成缓存路径
    targetPath = path.resolve(homePath, CACHE_DIR); //生成缓存路径
    storeDir = path.resolve(targetPath, "node_modules");
    log.verbose("targetPath", targetPath);
    log.verbose("storeDir", storeDir);
  }
  pkg = new Package({
    targetPath,
    storeDir,
    packageName,
    packageVersion,
  });
  if (await pkg.exists()) {
    //更新package
    await pkg.update();
  } else {
    // 安装package
    await pkg.install();
  }

  const rootFile = pkg.getRootFilePath();
  if (rootFile) {
    //在当前进程中调用
    // require(rootFile).call(null, Array.from(arguments))
    // 在Node 子进程中调用
    const args=Array.from(arguments);
    const cmd=args[args.length-1];
    const o=Object.create(null);
    Object.keys(cmd).forEach(key=>{
      if(cmd.hasOwnProperty(key)&&!key.startsWith("_")&&key!="parent"){
        o[key]=cmd[key]
      }
    })
    args[args.length-1]=o;
    const code=`require('${rootFile}').call(null,${JSON.stringify(args)})`;
    const child = cp.spawn("node",['-e',code],{
      cwd:process.cwd(),
      stdio:"inherit"
    }); 
    child.on('error',e=>{
       log.error(e.message)
       process.exit(1);
    })
    child.on('exit',e=>{
      log.verbose("命令执行成功:"+e)
      process.exit(e);
    })
    // child.stdout.on('data',(chunk=>{

    // }))
    // child.stderr.on('data',(chunk)=>{

    // })
  }
  // TODO
}
