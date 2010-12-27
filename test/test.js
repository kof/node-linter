var fs = require("fs"),
    join = require("path").join;


    
var root = join(__dirname, ".."),
    lib = join(root, "lib"),
    fixtures = join(root, "test", "fixtures");

options.confRoot = fixtures;
options.linter.jslint = join(lib, "linter", "jslint");
options.linter["closure-linter"] = join(lib, "linter", "closure-linter");

test("jslint", 1, function() {
    stop();
    run( join(fixtures, "jslint.js"), "jslint", function(err) {
        equal(err.length, 1, "errors count");
        start();
    });
});

test("closure-linter", 1, function() {
    stop()
    run( join(fixtures, "closure-linter.js"), "closure-linter", function(err) {
        equal(err.length, 4, "errors count");
        start();
    });
});

test("dir lint with all linters", 1, function() {
    stop()
    run( fixtures, "all", function(err) {
        equal(err.length, 7, "errors count");
        start();
    });
});