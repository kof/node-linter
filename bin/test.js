var join = require('path').join,
    root = join(__dirname, '..'),
    qunit = require('qunit');

//qunit.options.coverage = false;

qunit.run({
    code: join(root, 'lib', 'linter.js'),
    tests: join(root, 'test', 'test.js')
});
