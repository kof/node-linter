/**
 * jslint wrapper for nodejs
 * 
 * @author Oleg Slobodskoi aka Kof
 */

var fs = require( "fs" ),
    util = require( "util" ),
    Script = process.binding( "evals" ).Script;

var jslintPath = __dirname + "/../tools/JSLint/fulljslint.js";

// exec jslint
new Script.runInThisContext( fs.readFileSync( jslintPath ), jslintPath );    



/**
 * Run jslint checker
 * @param {Array} files
 * @param {String} confName
 * @param {Function} callback
 */
exports.run = function( files, options, callback ) {

    var err = [];

    files.forEach( function( file ) {
        var code = fs.readFileSync(file).toString().trim();
         
        // there are errors 
        if ( JSLINT(code, options) === false ) {
            err.push({
                message: "jslint errors in file " + path,
                errors: JSLINT.data().errors
            });
        }          
    });
    
    callback(err.length>0 ? err : false);
};