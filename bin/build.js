#!/usr/bin/env node
var shell = require("shelljs");
shell.exec("npm run compile");
shell.exec("gulp");