/**
 * closure-linter wrapper for nodejs
 *
 * @author Oleg Slobodskoi aka Kof
 */

var spawn = require('child_process').spawn;

/**
 * Run closure-linter
 * @param {String} file path to file.
 * @param {Object} options linter options.
 * @param {Function} callback callback function.
 * @export
 */
module.exports = function(file, options, callback) {
    var linter,
        errors = [],
        rmessage = /: (.*)/,
        rline = /Line (.*),/,
        name, opts = [];

    // convert options to args
    for (name in options) {
        if (options[name] === true) {
            opts.push('--' + name);
        }
    }

    opts.push(file);

    linter = spawn('gjslint', opts);

    linter.stdout.on('data', function(data) {
        data = data.toString().split('\n');
        // remove file name
        data.shift();
        data.forEach(function(str) {
            // only add errors - they start always with "Line"
            if (str.substr(0, 4) !== 'Line') {
                return;
            }

            var message = rmessage.exec(str),
                line = rline.exec(str);

            errors.push({
                linter: 'closure-linter',
                file: file,
                message: message ? message[1] : 'no message found',
                line: line ? line[1] : 'no line found'
            });
        });
    });

    linter.stderr.on('data', function(data) {
        require('util').debug('closure-linter errored: ' + data);
    });

    linter.on('exit', function(code) {
        callback(errors);
    });
};
