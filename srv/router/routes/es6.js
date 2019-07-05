/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0, no-inner-declarations:0 */
/*eslint-env node, es6 */
"use strict";
var express = require("express");
var ooTutorial1 = require("./ooTutorial1");
var ooTutorial2 = require("./ooTutorial2");
var ooTutorial3 = require("./ooTutorial3");
var ooTutorial4 = require("./ooTutorial4");

module.exports = function() {
	var app = express.Router();

	//Hello Router
	app.get("/", (req, res) => {
		let output =
			`<H1>ES6 Features</H1></br>
			<a href="${req.baseUrl}/../promises">/promises</a> - Manual Promisefy readFile</br>
			<a href="${req.baseUrl}/../promises/promisesError">/promisesError</a> - Manual Promisefy readFile and catch error</br> 
			<a href="${req.baseUrl}/../promises/promisesDB1">/promisesDB1</a> - Simple HANA DB Select via Promises</br>
			<a href="${req.baseUrl}/../promises/promisesDB2">/promisesDB2</a> - Simple Database Call Stored Procedure via Promises</br> 
			<a href="${req.baseUrl}/constants">/constants</a> - Constants</br>
			<a href="${req.baseUrl}/blockScoped">/blockScoped</a> - Block-Scoped Variables and Functions</br>	
			<a href="${req.baseUrl}/parameterDefaults">/parameterDefaults</a> - Parameter Defaults</br>	
			<a href="${req.baseUrl}/parameterMultiple">/parameterMultiple</a> - Handling unknown number of input parameters easily</br>		
			<a href="${req.baseUrl}/unicode">/unicode</a> - Unicode Strings and Literals</br>
			<a href="${req.baseUrl}/classes1">/classses1</a> - Classes</br>
			<a href="${req.baseUrl}/classes1Error">/classses1Error</a> - Classes, catch errors</br>
			<a href="${req.baseUrl}/classes2a">/classes2a</a> - Classes with Static Methods #1</br>
			<a href="${req.baseUrl}/classes2b">/classes2b</a> - Classes with Static Methods #2</br>
			<a href="${req.baseUrl}/classes3a">/classes3a</a> - Classes with Instance Methods #1</br>
			<a href="${req.baseUrl}/classes3b">/classes3b</a> - Classes with Instance Methods #2</br>	
			<a href="${req.baseUrl}/classes4a">/classes4a</a> - Classes with Inherited Methods #1</br>
			<a href="${req.baseUrl}/classes4b">/classes4b</a> - Classes with Inherited Methods #2</br>
			<a href="${req.baseUrl}/numFormat">/numFormat</a> - International Number Formatting</br>	
			<a href="${req.baseUrl}/currFormat">/currFormat</a> - International Currency Formatting</br>
			<a href="${req.baseUrl}/dateFormat">/dateFormat</a> - International Date/Time Formatting</br>` +			
			require(global.__base + "utils/exampleTOC").fill();
		res.type("text/html").status(200).send(output);
	});

	//ES6 Constants
	app.get("/constants", function(req, res) {
		const fixVal = 10;
		let newVal = fixVal;
		try {
			newVal++;
			fixVal++;
		} catch (e) {
			res.type("text/html").status(200).send(
				`Constant Value: ${fixVal.toString()}, Copied Value: ${newVal.toString()}, Error: ${e.toString()}`);
		}
	});

	//Block Scoped
	app.get("/blockScoped", function(req, res) {
		let output;

		function foo() {
			return 1;
		}
		output = `Outer function result: ${foo()} `;
		if (foo() === 1) {
			function foo() {
				return 2;
			}
			output += `Inner function results: ${foo()}`;
		}
		res.type("text/html").status(200).send(output);
	});

	//Parameter Defaults
	app.get("/parameterDefaults", function(req, res) {
		function math(a, b = 10, c = 12) {
			return a + b + c;
		}
		res.type("text/html").status(200).send(`With Defaults: ${math(5)}, With supplied values: ${math(5,1,1)}`);

	});

	//Parameter Defaults
	app.get("/parameterMultiple", function(req, res) {
		function getLength(a, b, ...p) {
			return a + b + p.length;
		}
		res.type("text/html").status(200).send(`2 plus 4 parameters: ${getLength(1,1,"stuff","More Stuff",8,"last param")}`);

	});

	//Unicode Strings and Literals
	app.get("/unicode", function(req, res) {
		if ("𠮷".length === 2) {
			res.type("text/html").status(200).send(`Output: ${"𠮷".toString()}, Code Points: ${"𠮷".codePointAt(0)}`);
		}
	});

	app.get("/classes1", function(req, res) {
		let class1 = new ooTutorial1("first example");
		res.type("text/html").status(200).send(`Call First Method: ${class1.myFirstMethod(5)}`);
	});

	app.get("/classes1Error", function(req, res) {
		let class1 = new ooTutorial1("first example");
		try {
			class1.myFirstMethod(20);
		} catch (e) {
			res.type("text/html").status(200).send(`Call and catch errors: ${JSON.stringify(e)}`);
		}
	});

	app.get("/classes2a", function(req, res) {
		ooTutorial2.getFlightDetails(req.db, "AA", "0017", "20100421").then(results => {
				res.type("text/html").status(200).send(
					`Call Static Method: ${JSON.stringify(results)}`);
			})
			.catch(e => {
				res.type("text/html").status(200).send(`Call and catch errors: ${JSON.stringify(e)}`);
			});

	});

	app.get("/classes2b", function(req, res) {
		ooTutorial2.calculateFlightPrice(req.db, "AA", "0017", "20100421").then(results => {
				res.type("text/html").status(200).send(
					`Call Static Method - Calc Price: ${results.toString()}`);
			})
			.catch(e => {
				res.type("text/html").status(200).send(`Call and catch errors: ${JSON.stringify(e)}`);
			});
	});

	app.get("/classes3a", function(req, res) {
		let class3 = new ooTutorial3(req.db);
		class3.getFlightDetails("AA", "0017", "20100421").then(results => {
				res.type("text/html").status(200).send(
					`Call Instance Method: ${JSON.stringify(results)}`);
			})
			.catch(e => {
				res.type("text/html").status(200).send(`Call and catch errors: ${JSON.stringify(e)}`);
			});

	});

	app.get("/classes3b", function(req, res) {
		let class3 = new ooTutorial3(req.db);
		class3.calculateFlightPrice("AA", "0017", "20100421").then(results => {
				res.type("text/html").status(200).send(
					`Call Instance Method - Calc Price: ${results.toString()}`);
			})
			.catch(e => {
				res.type("text/html").status(200).send(`Call and catch errors: ${JSON.stringify(e)}`);
			});
	});

	app.get("/classes4a", function(req, res) {
		let class4 = new ooTutorial4(req.db);
		class4.getFlightDetails("AA", "0017", "20100421").then(results => {
				res.type("text/html").status(200).send(
					`Call Inherited Method: ${JSON.stringify(results)}`);
			})
			.catch(e => {
				res.type("text/html").status(200).send(`Call and catch errors: ${JSON.stringify(e)}`);
			});

	});

	app.get("/classes4b", function(req, res) {
		let class4 = new ooTutorial4(req.db);
		class4.calculateFlightPrice("AA", "0017", "20100421").then(results => {
				res.type("text/html").status(200).send(
					`Call Overridden Method - Calc Price: ${results.toString()}`);
			})
			.catch(e => {
				res.type("text/html").status(200).send(`Call and catch errors: ${JSON.stringify(e)}`);
			});
	});

	//Number 
	app.get("/numFormat", function(req, res) {
		let numEN = new Intl.NumberFormat("en-US");
		let numDE = new Intl.NumberFormat("de-DE");
		res.type("text/html").status(200).send(`US: ${numEN.format(123456789.10)}, DE: ${numDE.format(123456789.10)}`);
	});
	
	//Currency Formatting
	app.get("/currFormat", function(req, res) {
		let curUS = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD"});
		let curDE = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR"});
		res.type("text/html").status(200).send(`US: ${curUS.format(123456789.10)}, DE: ${curDE.format(123456789.10)}`);
	});	

	//Date/Time Formatting
	app.get("/dateFormat", function(req, res) {
		let dateUS = new Intl.DateTimeFormat("en-US");
		let dateDE = new Intl.DateTimeFormat("de-DE");
		res.type("text/html").status(200).send(`US: ${dateUS.format(new Date())}, DE: ${dateDE.format(new Date())}`);
	});	
	
	return app;
};