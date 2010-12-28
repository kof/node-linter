/*global JSLINT: true*/
/**
 * jslint wrapper for nodejs
 *
 * @author Oleg Slobodskoi aka Kof
 */

var fs = require('fs'),
    join = require('path').join;

var jslintPath = join(__dirname, '..', '..', 'deps', 'JSLint', 'fulljslint.js');

// eval jslint in this content because of instanceof issue
require('vm').runInThisContext(fs.readFileSync(jslintPath), jslintPath);

/**
 * Run jslint checker
 * @param {String} file path to a file.
 * @param {Object} options jslint options.
 * @param {Function} callback callback function.
 * @export
 */
module.exports = function jslint(file, options, callback) {
    fs.readFile(file, 'utf-8', function(err, code) {
        if (err) {
            throw new Error(err);
        }

        var errors = [];

        // there are errors
        if (JSLINT(code, options) === false) {
             // standartize error reporting
            JSLINT.data().errors.forEach(function(err) {
                if (err) {
                    errors.push({
                        linter: 'JSLINT',
                        file: file,
                        message: err.reason + ': ' + err.evidence,
                        line: err.line + ':' + err.character
                    });
                }
            });
        }

        callback(errors);
    });
};
