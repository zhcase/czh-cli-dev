'use strict'
const Command = require("@czh-cli-dev/command");
const log = require("@czh-cli-dev/log");
class InitCommand extends Command{
   init(){
      this.projectName=this._argv[0]||''; 
      this.force=!!this._cmd.force;
      log.verbose("projectName",this.projectName);
      log.verbose("force",this.force);
   }  
   exec(){
      
   }
}

function init(argv){
  
   return  new InitCommand(argv);
}

module.exports.InitCommand = InitCommand

module.exports=init