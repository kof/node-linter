#!/usr/bin/env node

var join = require("path").join,
    root = join(__dirname, ".."),
    qunit = require("qunit");


qunit.run({
    code: join(root, "lib", "codenazi.js"),
    tests: join(root, "test", "test.js")
});