/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0 */
/*eslint-env node, es6 */

"use strict";
var express = require("express");

module.exports = function () {
	var app = express.Router();
	const util = require("util");
	const readFilePromisified = util.promisify(require("fs").readFile);

	//Hello Router
	app.get("/", (req, res) => {
		let output =
			`<H1>ES6 Features</H1></br>
			<a href="${req.baseUrl}/promisesFinally">/promisesFinally</a> - promisesFinally</br>
			<a href="${req.baseUrl}/for-await-of-loops">/for-await-of-loops</a> - for-await-of-loops</br>	
			<a href="${req.baseUrl}/async-generator">/async-generator</a> - async-generator</br>	
			<a href="${req.baseUrl}/regex2018">/regex2018</a> - regex2018</br>` +
			require(global.__base + "utils/exampleTOC").fill();
		res.type("text/html").status(200).send(output);
	});

	/* Demonstrates the use of Promise.prototype.finally(), after a promise is settled
	finally() is called. Finally() does not recieve an argument.*/
	app.get("/promisesFinally", async(req, res) => {
		var output = "";
		var fileName = "async/missing.txt";
		await readFilePromisified(global.__base + fileName)
			.then(text => {
				return;
			})
			.catch(error => {
				output += "First file error: " + error + '<br>';
				return error.toString();
			})
			.finally(() => {
				output += "First promise settled, changing file name." + '<br>';
				fileName = "async/file.txt";
				return;
			});

		await readFilePromisified(global.__base + fileName)
			.then(text => {
				output += "Second file success: " + text + '<br>';
				return;
			})
			.catch(error => {
				return error.toString();
			})
			.finally(() => {
				output += "Second promise settled." + '<br>';
				return;
			});

		res.type("text/html").status(200).send(output);
	});

	app.get("/for-await-of-loops", async(req, res) => {
		let output = "";
		let i = 0;
		var fileNames = ["async/file.txt", "async/file2.txt"];

		const asyncIterator = {
			next: async() => {
				let fileText = "";
				if (i === fileNames.length) {
					return {
						done: true
					};
				}
				await readFilePromisified(global.__base + fileNames[i])
					.then(text => {
						fileText = text;
					});
				i++;
				return Promise.resolve({
					value: fileText,
					done: false
				});
			}
		};

		const asyncIterable = {
			[Symbol.asyncIterator]: () => asyncIterator
		};
		for await (const value of asyncIterable) {
			output += value.toString() + "<br>";
		}

		res.type("text/html").status(200).send(output);

	});

	app.get("/async-generator", async(req, res) => {
		let output = "";
		let i = 0;

		//Async generator function returns Object [AsyncGenerator]
		//Calling .next() returns a Promise that resolves to {value, done}
		async function* getFileText(fileNames) {
			var fileText = "";
			while (true) {
				if (i === 2) break;
				await readFilePromisified(fileNames[i])
					.then(text => {
						fileText = text;
					});
				i++;
				yield fileText;
			}
		}

		let fileText = {
			fileTextGenerator: await getFileText(["async/file.txt", "async/file2.txt"]),
			getNextFile: async function () {
				var next = await this.fileTextGenerator.next();
				var value = next.value;
				return value.toString('utf8');
			}
		}
		output += "<p>First file text: " + await fileText.getNextFile() + "</p>";
		output += "<p>Second file text: " + await fileText.getNextFile() + "</p>";

		res.type("text/html").status(200).send(output);
	});

	/* Regexp additions */
	app.get("/regex2018", (req, res) => {

		//START OF S FLAG
		var output = "<div style='width:35%'><h2>ES2018's New RegExp Features</h2>";
		output +=
			"<h3 style='margin-bottom: 0;'>1. s (dotAll) flag</h3><h4 style='margin-top: 0;'> allows the '.' to match new line characters. Below are the results of using the expression /^.*/ on a string with and without the 's' flag</h4>";
		var testStr = "This is my string \n this part is on a new line";

		var RE = /^.*/; //match all
		var RE2 = /^.*/s; //match all with 's' flag
		output += "<ul>";
		output += "<p><strong>The string:</strong></p><p> This is my string<br>this part is on a new line</p>";
		output += "<p><strong>Results without dotAll flag:</strong> " + testStr.match(RE) + "</p>";
		output += "<p><strong>Results using dotAll flag:</strong> ";
		output += testStr.match(RE2) + "</p>";
		output += "</ul>";

		//START OF NAME CAPTURE GROUPS
		output +=
			"<h3 style='margin-bottom: 0;'>2. Name Captured Groups</h3><h4 style='margin-top: 0;'> allows you to capture sections of a string and store them inside a match object by name:</h4>";
		//Matches multiple sets of digits between hyphens and assigns them to names year, month, day
		const RE_DATE = /(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2})/;
		const matchObj = "1997-08-12".match(RE_DATE);
		const year = matchObj.groups.year;
		const month = matchObj.groups.month;
		const day = matchObj.groups.day;
		output += "<ul>";
		output += "<p><strong>String: </strong> 1997-08-12</p>";
		output += "<p><strong>Year: </strong>" + year + "</p><p><strong>Month: </strong>" + month + "</p><p><strong>Day: </strong>" + day +
			"</p>";
		output +=
			"<h4>Name capture groups also allow for backreferences. Backreferences allow for matching a name captured group making it easier to match repeated patterns:</h4>";
		const RE_BACKREF = /(?<chars>[a-zA-Z]{3})[:]\k<chars>/;
		output += "<p><strong>String: </strong> cat:cat</p>"
		var backRefStr = "cat:cat";
		output += backRefStr.match(RE_BACKREF);
		output +=
			"<h4>Name capture groups can also be used within the replace() method for doing tasks like changing our date string's order:</h4>";
		output += "1997-08-12".replace(RE_DATE, "$<month>/$<day>/$<year>"); //uses name groups to swap the date order
		output += "</ul>";

		//START OF LOOKBEHINDS
		output +=
			"<h3 style='margin-bottom: 0;'>3. Look Behind Assertions</h3><h4 style='margin-top: 0;'> allows you to match sections of a string by setting a condition the preceding characters:</h4>";
		output += "<ul><p>Our regex looks for the 'text' string that is preceded by 'REPLACE: '</p>"
		output += "<p><strong>Starting string: </strong>" + "REPLACE: text, LEAVE: text</p>";
		output += "<p><strong>Ending string: </strong>" + "REPLACE: text, LEAVE: text".replace(/(?<=REPLACE: )text/, "new text") + "</p>";

		output += "<p>We can also use \"Negative Lookbehinds\". Our regex looks for the 'text' string that is NOT preceded by 'REPLACE: '</p>"
		output += "<p><strong>Starting string: </strong>" + "REPLACE: text, LEAVE: text</p>";
		output += "<p><strong>Ending string: </strong>" + "REPLACE: text, LEAVE: text".replace(/(?<!REPLACE: )text/, "new text") + "</p>";
		output += "</ul>";

		//START OF UNICODE PROPERTY ESCAPES
		output +=
			"<h3 style='margin-bottom: 0;'>4. Unicode Property Excapes</h3><h4 style='margin-top: 0;'>allows you to match characters using their Unicode character properties.</h4>";
		var unicodeString = "!@#$%^&*";
		output += "<ul>";
		output += "<p><strong>String: </strong>" + unicodeString + "</p>";
		// \p{<property>=<value>} matches unicode symbol with the corresponding property and value
		var unicodeRE = /\p{General_Category=Currency_Symbol}.*/u; //OUT: $%^&*
		output += "<p>Match output: " + unicodeString.match(unicodeRE) + "</p>";

		// \P{<property>=<value>} matches all character that DO NOT have the corresponding property and value
		unicodeRE = /\P{General_Category=Currency_Symbol}*/u; //OUT: !@#*
		output += "<p>Match output: " + unicodeString.match(unicodeRE) + "</p>";

		output += "</ul></div>"
		res.type("text/html").status(200).send(output);
	});

	return app;
};