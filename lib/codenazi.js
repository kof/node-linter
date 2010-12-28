var fs = require('fs'),
    vm = require('vm'),
    join = require('path').join;

/**
 * Runner options object
 * @type {Object}
 * @export
 */
exports.options = {
    files: [],
    config: {},
    callback: function() {},
    recursive: false,
    linter: {
        jslint: join(__dirname, 'linter', 'jslint'),
        'closure-linter': join(__dirname, 'linter', 'closure-linter')
    }
};

function readdir(path, r) {
    var files = [],
        rjs = /\.js$/;

    fs.readdirSync(path).forEach(function(name) {
        var file = join(path, name);
        if (fs.statSync(file).isDirectory()) {
            if (r) {
                files = files.concat(readdir(file, r));
            }
        } else if (rjs.test(file)) {
            files.push(file);
        }
    });

    return files;
}

/**
 * Run all checker
 * @param {Object} opts runner options: files, config, callback.
 * @export
 */
exports.run = function(opts) {
    var o = exports.options,
        sandbox = {},
        linter,
        errors = [],
        done = 0,
        linters = 0,
        key;

    if (opts) {
        for (key in opts) {
            o[key] = opts[key];
        }
    }

    if (typeof o.files === 'string') {
        if (fs.statSync(o.files).isDirectory()) {
            o.files = readdir(o.files, o.recursive);
        // its a file
        } else {
            o.files = [o.files];
        }
    }

    // its a path to the config
    if (typeof o.config === 'string') {
        // don't use JSON.parse to be able to have comments
        vm.runInNewContext('o=' + fs.readFileSync(o.config), sandbox, o.config);
        o.config = sandbox.o;
    }

    function lint(file) {
        require(o.linter[linter])(file, o.config[linter], function(err) {

            if (err && err.length > 0) {
                errors = errors.concat(err);
            }

            done++;

            if (done === o.files.length * linters) {
                o.callback(errors);
            }
        });
    }

    Object.keys(o.config).forEach(function(name) {
        linter = name;
        linters++;
        o.files.forEach(lint);
    });
};
