test:
	node bin/test.js

install:
	cd ./deps/closure-linter && python ./setup.py install 

.PHONY: test install