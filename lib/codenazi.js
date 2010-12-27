var fs = require('fs'),
    join = require('path').join,
    o;

/**
 * Options object
 * @type {Object}
 * @export
 */
o = exports.options = {
    confRoot: join(__dirname, '..', 'conf'),
    linter: {
        jslint: join(__dirname, 'linter', 'jslint'),
        'closure-linter': join(__dirname, 'linter', 'closure-linter')
    }
};

var readconf = (function() {
    var vm = require('vm'),
        cache = {};

    return function readconf(name) {
        if (!cache[name]) {
            var path = join(o.confRoot, name + '.json'),
                sandbox = {};
            // don't use JSON.parse to be able to have comments
            vm.runInNewContext('o=' + fs.readFileSync(path), sandbox, path);
            cache[name] = sandbox.o;
        }

        return cache[name];
    };
}());

/**
 * Run all checker
 * @param {Array|String} files array or string of pathes to files or dir.
 * @param {String} confName name of configuration file.
 * @param {Function} callback function which will called after all is done.
 */
exports.run = function(files, confName, callback) {
    var options = readconf(confName),
        linter,
        dir, rjs = /\.js$/,
        errors = [],
        done = 0,
        linters = 0;

    if (typeof files === 'string') {
        if (fs.statSync(files).isDirectory()) {
            dir = files;
            files = [];
            fs.readdirSync(dir).forEach(function(name) {
                if (rjs.test(name)) {
                    files.push(join(dir, name));
                }
            });
        // its a file
        } else {
            files = [files];
        }
    }

    function lint(file) {
        require(o.linter[linter])(file, options[linter], function(err) {

            if (err && err.length > 0) {
                errors = errors.concat(err);
            }

            done++;

            if (done === files.length * linters) {
                callback(errors);
            }
        });
    }

    Object.keys(options).forEach(function(name) {
        linter = name;
        linters++;
        files.forEach(lint);
    });
};
