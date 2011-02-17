/**
 * closure-compiler wrapper for nodejs
 *
 * @author Oleg Slobodskoi aka Kof
 */

var fs = require('fs'),
    join = require('path').join,
    spawn = require('child_process').spawn,
    root = join(__dirname, '..', '..');

/**
 * Run closure-compiler
 * @param {String} file path to file.
 * @param {Object} options linter options.
 * @param {Function} callback callback function.
 * @export
 */
module.exports = function(file, options, callback) {
    var linter,
        errors = [],
        name,
        opts;


    opts = [
        '-jar', join(root, 'deps', 'closure-compiler', 'compiler.jar'),
        '--js', file,
        '--js_output_file', '/dev/null'
    ];


    // convert options to args
    for (name in options) {
        if (options[name]) {
            opts.push('--' + name);
            if (typeof options[name] !== 'boolean') {
                opts.push(options[name]);
            }
        }
    }

    linter = spawn('java', opts);

    linter.stderr.on('data', function(data) {
        data = data.toString().split('\n');
        data.forEach(function(str) {
            if (!/ERROR|WARNING/.test(str)) {
                return;
            }

            str = str.split(':');

            var msg = str[2] + (str[3] ? ':' + str[3] : '');

            errors.push({
                linter: 'closure-compiler',
                file: file,
                message: msg || 'no message found',
                line: str[1] || 'no line found'
            });
        });
    });

    linter.on('exit', function(code) {
        callback(errors);
    });
};
