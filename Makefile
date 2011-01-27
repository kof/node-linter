test:
	node bin/test.js

lint:
	linter -f lib -r

install:
	cd ./deps/closure-linter && python ./setup.py install 

.PHONY: test install lint