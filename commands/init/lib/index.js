'use strict'
const fs = require('fs')
const fse = require('fs-extra')
const inquirer = require('inquirer')
const semver =require("semver")
const Command = require('@czh-cli-dev/command')
const log = require('@czh-cli-dev/log')
const getProjectTemplate=require("./getProjectTemplate")


const TYPE_PROJECT='project';
const TYPE_COMPONENT="component"

class InitCommand extends Command {
  init() {
    this.projectName = this._argv[0] || ''
    this.force = !!this._cmd.force
    log.verbose('projectName', this.projectName)
    log.verbose('force', this.force)
  }
 async exec() {
    //1. 准备阶段
    try {
     const projectInfo= await this.prepare()
     if(projectInfo){
      //2.下载模板
      this.projectInfo=projectInfo;
      this.downLoadTemplate();
     }
    } catch (error) {
      log.error(error.message)
    }
    //2.安装模板
    // 3. 安装模板
  }
  downLoadTemplate(){
    console.log(this.projectInfo);
    //1.通过项目模板api获取项目模板信息
    //1.1 通过egg.js 搭建一套后端系统
    //1.2 通过npm 存储项目
    //1.3 讲项目模板信息存储到mongodb数据库中
    //1.4 通过egg.js 获取mongodb中的数据并且通过APi返回
  }

  async prepare() {
    const localPath = process.cwd()
    //判断项目模板是否存在
    // const template=[];
    // if(!template||template.length===0){
    //   throw new Error("项目模板不存在")
    // }
    // this.template=template;

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
           //2.是否启动强制更新
        if (confirmDelete) {
          //清空当前目录
          fse.emptyDirSync(localPath)
        }else{
          return;
        }
      }
    }

    return this.getProjectInfo();

    //3.获取项目的基本信息
    //4. 获取项目的基本信息
  }

 async getProjectInfo(){
     let projectInfo={};
     //1.选择创建项目或者组件
     const { type }=await inquirer.prompt({
      type:"list",
      name:"type",
      message:"请选择初始化类型",
      default:TYPE_PROJECT,
      choices:[{
        name:"项目",
        value:TYPE_PROJECT
      },{
        name:"组件",
        value:TYPE_COMPONENT
      }]
    })
    log.verbose('type',type)
    // 2.获取项目基本信息
    if(type===TYPE_PROJECT){
      const o=await inquirer.prompt([{
        type:"input",
        name:"projectName",
        message:"请输入项目名称",
        default:"",
        validate:function(v){
          //1. 输入的首字符必须为英文字符
          //2. 字符必须为英文或数字 不能为字符
          //3.字符仅允许-_
          const done = this.async();

          setTimeout(function() {
            if (!/^[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(v)) {
              done('请输入正确的项目名称');
              return;
            }
            // Pass the return value in the done callback
            done(null, true);
          }, 0);

        },
        filter:(v)=>{
          return v
        }
      },{
        type:"input",
        name:"projectVersion",
        message:"请输入项目版本号",
        default:"1.0.0",
        validate:function(v){
          const done = this.async();

          setTimeout(function() {
            if (!(!!semver.valid(v))) {
              done('请输入正确的版本号');
              return;
            }
            // Pass the return value in the done callback
            done(null, true);
          }, 0);
          return
          // return  /^[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(v);
        },
        filter:(v)=>{
          if(!!semver.valid(v)){
            return semver.valid(v)

          }else{
            return v
          }
        }
      }])
     projectInfo={
      type,
      ...o
     }
    }else if(type===TYPE_COMPONENT){

    }
    console.log(projectInfo);
    return projectInfo
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
