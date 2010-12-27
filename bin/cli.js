var join = require('path').join,
    root = join(__dirname, '..'),
    args = require(join(root, 'deps', 'argsparser')).parse(),
    codenazi = require(root),
    util = require('util');

var start = Date.now();


/**
* Colorize the given string using ansi-escape sequences.
* Disabled when --boring is set.
*
* @param {String} str string to be colorized.
* @param {String} color name of color.
* @return {String} colorized string.
*/
function colorize(str, color) {
    var colors = { bold: 1, red: 31, green: 32, yellow: 33 };
    return '\x1B[' + colors[color] + 'm' + str + '\x1B[0m';
}

codenazi.run(args['-f'], args['-c'], function(errors) {
    errors.forEach(function(err) {
        util.puts(
            colorize(err.file, 'red'),
            'Line: ' + err.line,
            err.linter + ' says: ' + err.message
        );
    });

    util.puts(
        colorize('\nErrors: ' + errors.length, 'red'),
        'Time: ' + (Date.now() - start) + ' ms'
    );

    if (errors.length === 0) {
        util.puts(colorize('Successfull validated.\x1B[0m', 'green'));
    }
});
