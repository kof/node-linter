var fs = require("fs"),
    path = require("path"),
    vm = require("vm"),
    o;

o = exports.options = {
    confRoot: path.join(__dirname, "..", "conf")    
};

// configs cache
var conf = {};

/**
 * Run all checker
 * @param {Array|String} files
 * @param {String} confName
 * @param {Function} callback
 */
exports.run = function( files, confName, callback ) {
    var options,
        confPath,
        confJSON,
        confSandbox = {},
        validator,
        progress = {
            all: 0,
            done: 0
        }, 
        errors = [];
    
    if (conf[confName]) {
        options = conf[confName];
    } else {
        confPath = path.join(o.confRoot, confName);
        confJSON = fs.readFileSync(confPath + ".json");
        // don't use JSON.parse to be able to have comments
        vm.runInNewContext("o = " + confJSON, confSandbox, confPath);
        options = conf[confName] = confSandbox.o;
    }
    
    if (typeof files === "string") {
        files = [files];    
    }
    
    progress.all = files.length;
    
    Object.keys(options).forEach(function(validator) {
        var validatorPath = path.join(__dirname, validator);
        files.forEach(function(file) {
            require(validatorPath)( file, options[validator], function( err ) {
                if ( err ) {
                    errors.push(err);    
                }
                
                progress.done++;
                
                if ( progress.all === progress.done ) {
                    callback( errors.length>0 ? errors : null );
                }
            });
        });
    });
};


