## Codenazi - code quality tool for javascript.

Codenazi doesn't implement validators - it utilizes free available quality tools. 
Javascript lang is too flexible and it becomes very hard to work in larger teams, especially if some of members are newbie on javascript.
Codenazi is highly configurable, so if you don't want to use some rules, you can create your own conf file.
You can easily add more quality tools.

## Features
- all rules can be defined in one configuration ".json" file
- you can create many conf. files, because you might have different rules for different environments f.e. server and client.
- it uses all available linter, if you have one more - you can add it
- unified errors reporting format

## Currently used tools
  - JSLint http://www.jslint.com/lint.html
  - Closure Linter http://code.google.com/p/closure-linter
  - Closure Compiler http://code.google.com/p/closure-compiler

## Installation
	npm install codenazi

## Usage

### command line - print help and read about usage
	
	$ codenazi -h 

### api		
	var codenazi = require('codenazi');
	
	codenazi.run({
		files: "/path/to/file" // can be an array or directory
		config: "conf/server.json" // can be a json object or path to conf json, see ./conf/*
		recursive: false, // read dir recursively, default to false
		// callback functions, which is called on complete and errors array is passed
		// see ./bin/cli.js
		callback: function(errors) {
			console.log(errors);
		},
	});

## Config file
- You can create a config which contains all rules for every validator. See ./conf/*.json
- *.json configs can have comments in it	
	
## Unified error format
Errors array passed to callback contains objects in this format:

	{
		linter: "validator name",
		file: "file name",
		message: "error message",
		line: "line number"
	}

## How to add more linters

- put the linter into ./deps/litner-name
- write a wrapper for it and put it into ./lib/linter/linter-name.js
  - wrapper should implement one function:
  
	module.exports = function(file, options, callback){
	
	};
  - wrapper should talk with validator and on complete call the callback and pass errors array in unified error format
  - see ./lib/linter/jslint.js
  - options for this validator in json should be named
  
	{
		"validator-name": {
			//options
		}
	}  	