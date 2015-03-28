.PHONY: serve
serve: target/main.js target/index.html
	cd target && python -m SimpleHTTPServer

target/main.js: src/*.js package.json
	browserify src/main.js -o target/main.js
