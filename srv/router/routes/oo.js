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
			`<H1>JavaScript Object Oriented</H1></br>
			<a href="${req.baseUrl}/classes1">/classses1</a> - Classes</br>
			<a href="${req.baseUrl}/classes1Error">/classses1Error</a> - Classes, catch errors</br>
			<a href="${req.baseUrl}/classes2a">/classes2a</a> - Classes with Static Methods #1</br>
			<a href="${req.baseUrl}/classes2b">/classes2b</a> - Classes with Static Methods #2</br>
			<a href="${req.baseUrl}/classes3a">/classes3a</a> - Classes with Instance Methods #1</br>
			<a href="${req.baseUrl}/classes3b">/classes3b</a> - Classes with Instance Methods #2</br>	
			<a href="${req.baseUrl}/classes4a">/classes4a</a> - Classes with Inherited Methods #1</br>
			<a href="${req.baseUrl}/classes4b">/classes4b</a> - Classes with Inherited Methods #2</br>`;
		res.type("text/html").status(200).send(output);
	});

	app.get("/classes1", (req, res) => {
		let class1 = new ooTutorial1("first example");
		return res.type("text/html").status(200).send(`Call First Method: ${class1.myFirstMethod(5)}`);
	});

	app.get("/classes1Error", (req, res) => {
		let class1 = new ooTutorial1("first example");
		try {
			return class1.myFirstMethod(20);
		} catch (e) {
			return res.type("application/json").status(200).send(`Call and catch errors: ${JSON.stringify(e)}`);
		}
	});

	app.get("/classes2a", async(req, res) => {
		try {
			const results = await ooTutorial2.getFlightDetails(req.db, "AA", "0017", "20100421");
			return res.type("text/html").status(200).send(
				`Call Static Method: ${JSON.stringify(results)}`);
		} catch (e) {
			return res.type("application/json").status(200).send(`Call and catch errors: ${JSON.stringify(e)}`);
		}

	});

	app.get("/classes2b", async(req, res) => {
		try {
			const results = await ooTutorial2.calculateFlightPrice(req.db, "AA", "0017", "20100421");
			return res.type("text/html").status(200).send(
				`Call Static Method - Calc Price: ${results.toString()}`);
		} catch (e) {
			return res.type("application/json").status(200).send(`Call and catch errors: ${JSON.stringify(e)}`);
		}
	});

	app.get("/classes3a", async(req, res) => {
		try {
			let class3 = new ooTutorial3(req.db);
			const results = await class3.getFlightDetails("AA", "0017", "20100421");
			return res.type("text/html").status(200).send(
				`Call Instance Method: ${JSON.stringify(results)}`);
		} catch (e) {
			return res.type("application/json").status(200).send(`Call and catch errors: ${JSON.stringify(e)}`);
		}
	});

	app.get("/classes3b", async(req, res) => {
		try {
			let class3 = new ooTutorial3(req.db);
			await class3.getFlightDetails("AA", "0017", "20100421");
			const results = await class3.calculateFlightPrice();
			return res.type("text/html").status(200).send(
				`Call Instance Method - Calc Price: ${results.toString()}`);
		} catch (e) {
			return res.type("application/json").status(200).send(`Call and catch errors: ${JSON.stringify(e)}`);
		}
	});

	app.get("/classes4a", async(req, res) => {
		try {
			let class4 = new ooTutorial4(req.db);
			const results = await class4.getFlightDetails("AA", "0017", "20100421");
			return res.type("text/html").status(200).send(
				`Call Inherited Method: ${JSON.stringify(results)}`);
		} catch (e) {
			return res.type("application/json").status(200).send(`Call and catch errors: ${JSON.stringify(e)}`);
		}
	});

	app.get("/classes4b", async(req, res) => {
		try {
			let class4 = new ooTutorial4(req.db);
			await class4.getFlightDetails("AA", "0017", "20100421");
			const results = await class4.calculateFlightPrice();
			return res.type("text/html").status(200).send(
				`Call Overridden Method - Calc Price: ${results.toString()}`);
		} catch (e) {
			return res.type("application/json").status(200).send(`Call and catch errors: ${JSON.stringify(e)}`);
		}
	});

	return app;
};