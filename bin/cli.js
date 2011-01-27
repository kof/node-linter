var join = require('path').join,
    util = require('util'),
    root = join(__dirname, '..'),
    args = require('argsparser').parse(),
    linter = require(root);

var o = linter.options;

var help = [
    '\nUsage: linter [options]',
    'Options:',
    '-f, --file, --files path to file, files (space separated) ' +
    'or directory to be validated',
    '-c, --config path to the config file',
    '-r, --recursive read dir recursively',
    '-h, --help show this help\n'
];

// print help if no args
if (process.argv.length <= 2) {
    args['-h'] = true;
}

for (var key in args) {
    switch (key) {
        case '-f':
        case '--file':
        case '--files':
            /**
             * @see linter.options.files
             */
            o.files = args[key];
            break;
        case '-c':
        case '--config':
            /**
             * @see linter.options.config
             */
            o.config = args[key];
            break;
        case '-r':
        case '--recursive':
            /**
             * @see linter.options.recursive
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

o.format = true;
o.callback = function(str) {
    util.puts(str);
};

linter.run();
