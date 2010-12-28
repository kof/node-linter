var join = require('path').join,
    util = require('util'),
    root = join(__dirname, '..'),
    args = require(join(root, 'deps', 'argsparser')).parse(),
    codenazi = require(root);

var o = codenazi.options;

var help = [
    '\nUsage: codenazi [options]',
    'Options:',
    '-f, --file, --files path to file, files (space separated) ' +
    'or directory to be validated',
    '-c, --config path to the config file',
    '-r, --recursive read dir recursively',
    '-h, --help show this help\n'
];

for (var key in args) {
    switch (key) {
        case '-f':
        case '--file':
        case '--files':
            /**
             * @see codenazi.options.files
             */
            o.files = args[key];
            break;
        case '-c':
        case '--config':
            /**
             * @see codenazi.options.config
             */
            o.config = args[key];
            break;
        case '-r':
        case '--recursive':
            /**
             * @see codenazi.options.recursive
             */
            o.recursive = args[key];
            break;
        case '-h':
        case '-?':
        case '--help':
            util.puts.apply(util, help);
            return;
    }
}


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

var start = Date.now();

/**
 * @see codenazi.options.callback
 */
o.callback = function(errors) {
    errors.forEach(function(err) {
        util.puts(
            '--------------------------------------------------------------------------',
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
};

codenazi.run();
