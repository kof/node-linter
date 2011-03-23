test:
	qunit -c ./lib/linter.js -t ./test/test.js --cov false

lint:
	linter -f lib -r

install:
	cd ./deps/closure-linter && python ./setup.py install 

.PHONY: test install lint