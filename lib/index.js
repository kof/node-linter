var fs = require("fs");

var confPath = __dirname + "/../conf/";

/**
 * Run all checker
 * @param {Array|String} files
 * @param {String} confName
 * @param {Function} callback
 */
exports.run = function( files, confName, callback ) {
    var options = JSON.parse( fs.readFileSync(confPath + confName + ".json") ),
        validator,
        progress = {
            all: 0,
            done: 0
        }, 
        errors = [];
    
    if ( typeof files === "string" ) {
        files = [files];    
    }
    
    for ( validator in options ) {
        require(validator).run( files, options[validator], function( err ) {
            if ( err ) {
                errors.push(err);    
            }
            
            progress.done++;
            
            if ( progress.all === progress.done ) {
                callback( errrors.length ? errors : false );
            }
        });
        progress.all++;
    }
};


