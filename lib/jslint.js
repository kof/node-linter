/**
 * jslint wrapper for nodejs
 * 
 * @author Oleg Slobodskoi aka Kof
 */

var fs = require("fs"),
    util = require("util"),
    path = require("path");

var jslintPath = path.join(__dirname, "..", "deps/JSLint/fulljslint.js");

// eval jslint in this content because of instanceof issue
require("vm").runInThisContext(fs.readFileSync( jslintPath ), jslintPath);    

/**
 * Run jslint checker
 * @param {String} file
 * @param {Object} options
 * @param {Function} callback
 */
module.exports = function jslint( file, options, callback ) {
    fs.readFile(file, "utf-8", function(err, code) {
        if (err) {
            throw new Error(err);
        }
        
        var errors = [];
        // there are errors 
        if ( JSLINT(code, options) === false ) {
             // standartize error reporting
            JSLINT.data().errors.forEach(function(err) {
               err && errors.push({
                    reason: err.reason,
                    evidence: err.evidence,
                    line: err.line,
                    character: err.character                    
                });
            });
            
            callback({
                message: "jslint errors in file " + file,
                errors: errors
            });
        } else {
            callback();
        }        
          
    });
};