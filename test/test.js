var a = require("assert"),
    fs = require("fs"),
    path = require("path"),
    root = path.join(__dirname, ".."),
    codenazi = require( path.join(root, "lib", "codenazi") ),
    fixture = path.join(root, "test", "fixture.js");

var errors;

codenazi.run(fixture, "server", function(err) {
    errors = err;    
});

a.ok(!errors, "jslint has detected an error");

require("util").print("All tests passed...\n");
