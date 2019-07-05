/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";
var express = require("express");

module.exports = function() {
	var app = express.Router();

	function query(req, res, dbQuery, logger, tracer) {
		tracer.entering("/client/query", req, res);
		let client = require("@sap/hana-client");
		const xsenv = require("@sap/xsenv");
		let hanaOptions = xsenv.getServices({
			hana: {
				plan: "hdi-shared"
			}
		});
		let conn = client.createConnection();
		var connParams = {
			serverNode: hanaOptions.hana.host + ":" + hanaOptions.hana.port,
			uid: hanaOptions.hana.user,
			pwd: hanaOptions.hana.password,
			ca: hanaOptions.hana.certificate
		};

		conn.connect(connParams, (err) => {
			if (err) {
				tracer.catching("/client", err);
				logger.error(`ERROR: ${JSON.stringify(err)}`);
				return res.type("text/plain").status(500).send(`ERROR: ${JSON.stringify(err)}`);
			} else {
				conn.exec(dbQuery, (err, result) => {
					if (err) {
						tracer.catching("/client", err);
						logger.error(`ERROR: ${JSON.stringify(err)}`);
						return res.type("text/plain").status(500).send(`ERROR: ${JSON.stringify(err)}`);
					} else {
						console.log(JSON.stringify(result));
						conn.disconnect();
						tracer.exiting("/client/query", result);
						return res.type("application/json").status(200).send(result);
					}
				});
			}
			return null;
		});

	}

	app.get("/toc", (req, res) => {
		let output =
			`<H1>Low Level HANA Client Examples</H1></br>
		    <a href="${req.baseUrl}/">/</a> - Select SESSION_USER</br>	
			<a href="${req.baseUrl}/err">/err</a> - Select and throw error (intentional)</br>
			<a href="${req.baseUrl}/context">/context</a> - Select SESSION_CONTEXT</br>
			<a href="${req.baseUrl}/userstore">/userstore</a> - Select via User Store</br>` +			
			require(global.__base + "utils/exampleTOC").fill();
		res.type("text/html").status(200).send(output);
	});
	app.get("/", (req, res) => {
		let logger = req.loggingContext.getLogger("/Application/comp1");
		let tracer = req.loggingContext.getTracer("/hanaClient.js");
		return query(req, res, "select SESSION_USER from \"DUMMY\" ", logger, tracer);

	});

	app.get("/err", (req, res) => {

		let logger = req.loggingContext.getLogger("/Application");
		let tracer = req.loggingContext.getTracer(__filename);
		return query(req, res, "select SESSION_USER from \"DUMMY1\" ", logger, tracer);
	});
	
	app.get("/context", (req, res) => {
		let logger = req.loggingContext.getLogger("/Application");
		let tracer = req.loggingContext.getTracer(__filename);
		return query(req, res, "SELECT * FROM M_SESSION_CONTEXT WHERE connection_id=current_connection ", logger, tracer);
	});

	app.get("/userstore", (req, res) => {
		let logger = req.loggingContext.getLogger("/Application");
		let tracer = req.loggingContext.getTracer(__filename);
		tracer.entering("/client/query", req, res);
		let client = require("@sap/hana-client");
		var connParams = {
			serverNode: "@KEY2"
		};
		let conn = client.createConnection();
		conn.connect(connParams, (err) => {
			if (err) {
				tracer.catching("/client", err);
				logger.error(`ERROR: ${JSON.stringify(err)}`);
				return res.type("text/plain").status(500).send(`ERROR: ${JSON.stringify(err)}`);
			} else {
				conn.exec("select SESSION_USER from \"DUMMY\" ", (err, result) => {
					if (err) {
						tracer.catching("/client", err);
						logger.error(`ERROR: ${JSON.stringify(err)}`);
						return res.type("text/plain").status(500).send(`ERROR: ${JSON.stringify(err)}`);
					} else {
						console.log(JSON.stringify(result));
						conn.disconnect();
						tracer.exiting("/client/query", result);
						return res.type("application/json").status(200).send(result);
					}
				});
			}
			return null;
		});
	});


	return app;
};