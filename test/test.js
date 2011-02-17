var fs = require('fs'),
    join = require('path').join;

var root = join(__dirname, '..'),
    lib = join(root, 'lib'),
    fixtures = join(root, 'test', 'fixtures');

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

test('javascriptlint', 1, function() {
    stop();
    run({
        files: join(fixtures, 'javascriptlint.js'),
        config: join(fixtures, 'javascriptlint.json'),
        callback: function(err) {
            equal(err.length, 1, 'errors count');
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
            equal(err.length, 18, 'errors count');
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
            equal(err.length, 20, 'errors count');
            start();
        }
    });
});
