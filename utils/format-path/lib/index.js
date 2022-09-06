'use strict'
const path = require('path')
module.exports = formatPath

function formatPath(p) {
  if (p) {
    const sep = path.sep
    console.log(sep)
    if (sep === '/') {
      return sep
    } else {
      return p.replace(/\\/g, '/')
    }
  }
  return p
}
