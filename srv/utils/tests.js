/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0, quotes:0 */
/*eslint-env node, es6 */

"use strict";
module.exports = {
	getAuthToken: () => {
		return new Promise((resolve, reject) => {
			let user;
			let password;
			process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
			process.argv.forEach(function (val, index, array) {
				if (index === 3) {
					//-user=
					user = val.substring(6);
				}
				if (index === 4) {
					//-pass=
					password = val.substring(6);
				}
			});
			let VCAP = JSON.parse(process.env.VCAP_SERVICES);
			let xsuaa = VCAP.xsuaa;
			var request = require('then-request');
			var auth = 'Basic ' + Buffer.from(xsuaa[0].credentials.clientid + ':' + xsuaa[0].credentials.clientsecret).toString('base64');
			let defaultHeaders = {
				'User-Agent': 'Mozilla/5.0 (X11; Linux i686; rv:7.0.1) Gecko/20100101 Firefox/7.0.1',
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
				'Accept-Language': 'en-us,en;q=0.5',
				'Accept-Encoding': 'gzip, deflate',
				'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.7',
				'Authorization': auth,
				'Content-Type': 'application/x-www-form-urlencoded',
				'Cache-Control': 'max-age=0'
			};
			request('POST', xsuaa[0].credentials.url + '/oauth/token', {
					headers: defaultHeaders,
					body: `grant_type=password` +
						`&username=${user}` +
						`&password=${password}` +
						`&client_id=${xsuaa[0].credentials.clientid}` +
						`&client_secret=${ xsuaa[0].credentials.clientsecret}`
				})
				.done(function (res) {
					var body = JSON.parse(res.getBody());
					resolve(body.access_token);
				});
		});
	},

	getClient: () => {
		return new Promise((resolve, reject) => {
			let hdb = require("@sap/hdbext");
			let xsenv = require("@sap/xsenv");
			let hanaOptions = xsenv.getServices({
				hana: {
					plan: "hdi-shared"
				}
			});
			//	let pool = hdb.getPool(hanaOptions.hana);
			hanaOptions.hana.pooling = true;
			hdb.createConnection(hanaOptions.hana, (error, client) => {
				if (error) {
					reject(console.error(error));
				}
				if (client) {
					resolve(client);
				}
			});
		});
	},

	getDBClass: (dbConn) => {
		return new Promise((resolve, reject) => {
			let base = __dirname + "/";
			const dbClass = require(base + "/dbPromises");
			let db = new dbClass(dbConn);
			resolve(db);
		});

	},

	getStoredProc: (db, procName) => {
		return new Promise((resolve, reject) => {
			let hdbext = require("@sap/hdbext");
			db.loadProcedurePromisified(hdbext, null, procName)
				.then(sp => {
					resolve(sp);
				})
				.catch(err => {
					reject(err);
				});
		});

	},

	execSQL: (dbConn, sql) => {
		return new Promise((resolve, reject) => {
			const dbClass = require(global.__base + "utils/dbPromises");
			let db = new dbClass(dbConn);
			db.preparePromisified(sql)
				.then(statement => {
					db.statementExecPromisified(statement, [])
						.then(results => {
							resolve(results);
						})
						.catch(err => {
							reject(err);
						});
				})
				.catch(err => {
					reject(err);
				});
		});
	},

	getExpress: (secure = false) => {
		process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
		process.setMaxListeners(0);
		global.__base = __dirname;
		global.__base = global.__base.slice(0, -5);
		//	const port = process.env.PORT || 3000;
		//	const server = require("http").createServer();

		const cds = require("@sap/cds");
		//Initialize Express App for XSA UAA and HDBEXT Middleware
		const xsenv = require("@sap/xsenv");
		const passport = require("passport");
		const xssec = require("@sap/xssec");
		const xsHDBConn = require("@sap/hdbext");
		const express = require("express");
		//	xsenv.loadCertificates();
		//logging
		var logging = require("@sap/logging");
		var appContext = logging.createAppContext();

		//Initialize Express App for XS UAA and HDBEXT Middleware
		var app = express();

		//Compression
		app.use(require("compression")({
			threshold: "1b"
		}));

		//Helmet for Security Policy Headers
		const helmet = require("helmet");
		// ...
		app.use(helmet());
		app.use(helmet.contentSecurityPolicy({
			directives: {
				defaultSrc: ["'self'"],
				styleSrc: ["'self'", "sapui5.hana.ondemand.com"],
				scriptSrc: ["'self'", "sapui5.hana.ondemand.com"]
			}
		}));
		// Sets "Referrer-Policy: no-referrer".
		app.use(helmet.referrerPolicy({
			policy: "no-referrer"
		}));

		//Build a JWT Strategy from the bound UAA resource
		passport.use("JWT", new xssec.JWTStrategy(xsenv.getServices({
			uaa: {
				tag: "xsuaa"
			}
		}).uaa));
		app.use(logging.middleware({
			appContext: appContext,
			logNetwork: true
		}));
		app.use(passport.initialize());
		var hanaOptions = xsenv.getServices({
			hana: {
				plan: "hdi-shared"
			}
		});
		hanaOptions.hana.pooling = true;
		if (secure) {
			app.use(
				passport.authenticate("JWT", {
					session: false
				}),
				xsHDBConn.middleware(hanaOptions.hana)
			);
		} else {
			app.use(
				xsHDBConn.middleware(hanaOptions.hana)
			);
		}

		//CDS OData V4 Handler
		var options = {
			driver: "hana",
			logLevel: "error"
		};

		//Use Auto Lookup in CDS 2.10.3 and higher
		//Object.assign(options, hanaOptions.hana, {
		//	driver: options.driver
		//});

		if (!cds.session) {
			cds.connect(options);
		}
		var odataURL = "/odata/v4/opensap.hana.CatalogService/";
		// Main app
		cds.serve("gen/csn.json", {
				crashOnError: false
			})
			.at(odataURL)
			.with(require("../lib/handlers"))
			.in(app)
			.catch((err) => {
				console.log(err);
				//			process.exit(1);
			});

		// Redirect any to service root
		app.get("/", (req, res) => {
			res.redirect(odataURL);
		});
		app.get("/node", (req, res) => {
			res.redirect(odataURL);
		});

		//Setup Additonal Node.js Routes
		require("../router")(app, null);

		return (app);
	}
};