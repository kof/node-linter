var fs = require('fs'),
    join = require('path').join;

var root = join(__dirname, '..'),
    lib = join(root, 'lib'),
    fixtures = join(root, 'test', 'fixtures');

options.linter.jslint = join(lib, 'linter', 'jslint');
options.linter['closure-linter'] = join(lib, 'linter', 'closure-linter');
options.linter['closure-compiler'] = join(lib, 'linter', 'closure-compiler');

test('jslint', 1, function() {
    stop();
    run({
        files: join(fixtures, 'jslint.js'),
        config: join(fixtures, 'jslint.json'),
        callback: function(err) {
            equal(err.length, 1, 'errors count');
            start();
        }
    });
});

test('closure-linter', 1, function() {
    stop();
    run({
        files: join(fixtures, 'closure-linter.js'),
        config: join(fixtures, 'closure-linter.json'),
        callback: function(err) {
            equal(err.length, 4, 'errors count');
            start();
        }
    });    
});

test('closure-compiler', 1, function() {
    stop();
    run({
        files: join(fixtures, 'closure-compiler.js'),
        config: join(fixtures, 'closure-compiler.json'),
        callback: function(err) {
            equal(err.length, 2, 'errors count');
            start();
        }
    });    
});

test('dir lint with all linters', 1, function() {
    stop();
    run({
        files: fixtures,
        config: join(root, 'conf', 'server.json'),
        callback: function(err) {
            equal(err.length, 11, 'errors count');
            start();
        }
    });    
});

test('dir lint with all linters recursively', 1, function() {
    stop();
    run({
        files: fixtures,
        config: join(root, 'conf', 'server.json'),
        recursive: true,
        callback: function(err) {
            equal(err.length, 13, 'errors count');
            start();
        }
    });
});
