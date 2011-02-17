var fs = require('fs'),
    vm = require('vm'),
    $ = require('sharedjs'),
    join = require('path').join;

var start;


/**
 * Runner options object
 * @type {Object}
 * @export
 */
exports.options = {
    files: [],
    // use server.json if no config passed
    config: 'server',
    confRoot: join(__dirname, '..', 'conf'),
    linterRoot: __dirname + '/linter',
    callback: function() {},
    recursive: false,
    // format errors report for console
    format: false
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
* Colorize the given string using ansi-escape sequences.
* Disabled when --boring is set.
*
* @param {string} str string to be colorized.
* @param {string} color name of color.
* @return {string} colorized string.
*/
function colorize(str, color) {
    var colors = { bold: 1, red: 31, green: 32, yellow: 33 };
    return '\x1B[' + colors[color] + 'm' + str + '\x1B[0m';
}

/**
 * Format errors for console output.
 * @param {Array} errors report.
 * @return {string} formatted errors.
 */
function format(errors) {
    var arr = [];
    errors.forEach(function(err) {
        var i, sep = '';

        for (i = 0; i < 100; ++i) {
            sep += '-';
        }

        arr.push(
            sep,
            colorize(err.file, 'red'),
            'Line: ' + err.line,
            err.linter + ' says: ' + err.message
        );
    });

    arr.push(
        colorize('\nErrors: ' + errors.length, 'red'),
        'Time: ' + (Date.now() - start) + ' ms'
    );

    if (errors.length === 0) {
        arr.push(colorize('Successfull validated.\x1B[0m', 'green'));
    }

    return arr.join('\n');
}


/**
 * Run all checker
 * @param {Object} opts runner options: files, config, callback.
 * @export
 */
exports.run = function(opts) {
    start = Date.now();
    var o = $.extend({}, exports.options, opts),
        sandbox = {},
        errors = [],
        done = 0,
        linters = 0,
        key;

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
        // its not a path, its predefined config name
        if (!/\.json$/.test(o.config)) {
            o.config = o.confRoot + '/' + o.config + '.json';
        }
        // don't use JSON.parse to be able to have comments
        vm.runInNewContext('o=' + fs.readFileSync(o.config), sandbox, o.config);
        o.config = sandbox.o;
    }

    Object.keys(o.config).forEach(function(linter) {
        var linterPath = o.linterRoot + '/' + linter;
        linters++;
        o.files.forEach(function(file) {
            require(linterPath)(file, o.config[linter], function(err) {
                if (err && err.length > 0) {
                    errors = errors.concat(err);
                }

                done++;

                if (done === o.files.length * linters) {
                    o.callback(o.format ? format(errors) : errors);
                }
            });
        });
    });
};
