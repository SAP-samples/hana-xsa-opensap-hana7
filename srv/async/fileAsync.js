/*eslint-env node, es6 */
"use strict";
var fs = require("fs");

module.exports = {
	fileDemo: (wss) => {
		fs.readFile("./async/file.txt", "utf8", (error, text) => {
			wss.broadcast(text);
		});
		wss.broadcast("After First Read\n");

		fs.readFile("./async/file2.txt", "utf8", (error, text) => {
			wss.broadcast(text);
		});
		wss.broadcast("After Second Read\n");

	}
};