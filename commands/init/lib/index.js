'use strict'

function init(projectName, cmdObj) {
  console.log('init', projectName, cmdObj.force,cmdObj.parent.targetPath)
}

module.exports = init
