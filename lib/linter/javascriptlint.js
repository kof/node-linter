/**
 * javascriptlint wrapper for nodejs
 *
 * @author David Trejo aka DTrejo
 */

var fs = require('fs'),
    join = require('path').join,
    spawn = require('child_process').spawn,
    root = join(__dirname, '..', '..');

/**
 * Run javascriptlint
 * @param {String} file path to file.
 * @param {Object} options linter options.
 * @param {Function} callback callback function.
 * @export
 */
module.exports = function(file, options, callback) {
    var linter,
        errors = [],
        name,
        opts = [];

    // convert options to args. this may not act like other linters. oops?
    for (name in options) {
        if (options[name]) {
            opts.push('-' + name);
            if (typeof options[name] !== 'boolean') {
                opts.push(options[name]);
            }
        }
    }

    opts.unshift(
        '-process', file,
        '-nologo'
        // this can be supplied if people want it
        // '-conf', ''
    );

    linter = spawn(root + '/deps/javascriptlint/jsl', opts);
    
    linter.stdout.on('data', function (data) {
        data = data.toString().split(file);
        console.log(data);

        data.forEach(function(str, i) {
            if (i === 0) {
                // of form `jsl-test.js\n`
                // filename = str.replace('\n', '');
                return;
            }
            if (i === data.length - 1) {
                // of form
                // `(22): lint warning: undeclared identifier: z\n\n0 error(s), 11 warning(s)\n`
                // gotta remove the ending.
                str = str.substring(0, str.indexOf('\n\n') + 5);
                return;
            }
            
            var line = /(\d+)/.exec(str)[0];
            
            // handle both cases. This matters b/c a warning is more severe than a lint warning.
            // (9): warning: test for equality (==) mistyped as assignmen ...
            // (23): lint warning: missing default case in ...
            var msg = str.substring(str.indexOf(':') + 2, str.length);
            errors.push({
                linter: 'javasriptlint',
                file: file,
                message: msg || 'no message found',
                line: line || 'no line found'
            });
        });
        
    });
        
    linter.on('exit', function(code) {
        callback(errors);
    });
};

// testing

// var debug = true;
// debug && function() {
//     module.exports(root + '/deps/javascriptlint/jsl-test.js', {}, function(errors) {
//         console.log(errors);
//     });
// }();