var fs = require('fs'),
    join = require('path').join;

var root = join(__dirname, '..'),
    lib = join(root, 'lib'),
    fixtures = join(root, 'test', 'fixtures');

options.linter.jslint = join(lib, 'linter', 'jslint');
options.linter['closure-linter'] = join(lib, 'linter', 'closure-linter');

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

test('dir lint with all linters', 1, function() {
    stop();
    run({
        files: fixtures,
        config: join(fixtures, 'all.json'),
        callback: function(err) {
            equal(err.length, 7, 'errors count');
            start();
        }
    });    
});

test('dir lint with all linters recursively', 1, function() {
    stop();
    run({
        files: fixtures,
        config: join(fixtures, 'all.json'),
        recursive: true,
        callback: function(err) {
            equal(err.length, 9, 'errors count');
            start();
        }
    });
});