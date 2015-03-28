watchify src/main.js -o target/main.js &
cd target && python -m SimpleHTTPServer
