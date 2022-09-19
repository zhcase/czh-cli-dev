'use strict'
const Command=require("@czh-cli-dev/command");

class InitCommand extends Command{

}

function init(argv){
  console.log(12);
  console.log(argv);
   return  new InitCommand(argv);
}

module.exports.InitCommand = InitCommand

module.exports=init