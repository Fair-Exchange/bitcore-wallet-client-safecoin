.PHONY: cover

BIN_PATH:=node_modules/.bin/

all:	bitcore-wallet-client-safecoin.min.js

clean:
	rm bitcore-wallet-client-safecoin.js
	rm bitcore-wallet-client-safecoin.min.js

bitcore-wallet-client-safecoin.js: index.js lib/*.js
	${BIN_PATH}browserify $< > $@

bitcore-wallet-client-safecoin.min.js: bitcore-wallet-client-safecoin.js
	uglify  -s $<  -o $@

cover:
	./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha -- --reporter spec test
