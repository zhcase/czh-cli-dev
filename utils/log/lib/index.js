'use strict';


const log=require("npmlog");
log.level=process.env.LOG_LEVEL?process.env.LOG_LEVEL:"info"
log.heading='czh' // 修改前缀

log.addLevel("success",2000,{fg:'green',bold:true}) // 修改自定义命令

function index() {
    log.info("cli","test")
}
module.exports = log;
