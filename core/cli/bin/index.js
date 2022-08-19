#! /usr/bin/env node
const importLocal = require("import-local");
console.log(importLocal(__filename));
if (importLocal(__filename)) {
  require("npmlog").info("cli", "正在使用zehua-cli 本地版本");
} else {
  require("../lib")(process.argv.slice(2));
}
