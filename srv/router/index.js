/*eslint-env node, es6 */
"use strict";

module.exports = (app, server) => {
	app.use("/node", require("./routes/node")());
	app.use("/node/cdsConv", require("./routes/cdsConv")());
	app.use("/node/myNode", require("./routes/myNode")());
	app.use("/node/ex1", require("./routes/ex1")());
	app.use("/node/ex2", require("./routes/ex2")());
	app.use("/node/auth", require("./routes/auth")());

	if (server !== null) {
		app.use("/node/excAsync", require("./routes/exerciseAsync")(server));
	}
	app.use("/node/JavaScriptBasics", require("./routes/JavaScriptBasics")());
	app.use("/node/textBundle", require("./routes/textBundle")());
	if (server !== null) {
		app.use("/node/chat", require("./routes/chatServer")(server));
	}
	app.use("/node/excel", require("./routes/excel")());
	app.use("/node/xml", require("./routes/xml")());
	app.use("/node/zip", require("./routes/zip")());
	app.use("/node/smtp", require("./routes/smtp")());
	app.use("/node/oo", require("./routes/oo")());

	var express = require("express");
	app.use("/node/os/web", express.static("os_web"));
	app.use("/node/os", require("./routes/os")());
	app.use("/node/client", require("./routes/hanaClient")());
	app.use("/sap/bc/lrep", require("./routes/lrep")());
	app.use("/node/annotations", require("./routes/annotations")());
	app.use("/node/auditLog", require("./routes/auditLog")());
	app.use("/node/promises", require("./routes/promises")());
	app.use("/node/await", require("./routes/await")());
	app.use("/node/es6", require("./routes/es6")());
	app.use("/node/dcl", require("./routes/dcl")());
	app.use("/node/codeCoverage", require("./routes/codeCoverage")());
	app.use("/node/secureStore", require("./routes/secureStore")());

};