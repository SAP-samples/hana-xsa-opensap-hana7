/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";
var express = require("express");
var xsenv = require("@sap/xsenv");

module.exports = () => {
	var app = express.Router();
	app.get("/", (req, res) => {
		let options = {};
		//Add SMTP
		try {
			options = Object.assign(options, xsenv.getServices({
				mail: {
					"name": "dat260.smtp"
				}
			}));
		} catch (err) {
			console.log("[WARN]", err.message);
		}
		const nodemailer = require("nodemailer");
		// create reusable transporter object using the default SMTP transport
		console.log(JSON.stringify(options.mail));
		let transporter = nodemailer.createTransport(options.mail);

		// setup email data with unicode symbols
		let mailOptions = {
			from: "\"DAT260\" <dat260@sap.teched.com", // sender address
			to: "Dummy <dummy@mail.com>", // list of receivers
			subject: "Mail Test from Pure Node.js using NodeMailer", // Subject line
			text: "The body of the mail from Pure Node.js using NodeMailer" // plain text body
				//        html: '<b>Hello world?</b>' // html body
		};

		// send mail with defined transport object
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
			console.log("Message sent: %s", info.messageId);
			console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
			let output = `Preview URL: <a href="${nodemailer.getTestMessageUrl(info)}">${nodemailer.getTestMessageUrl(info)}</a>`;
			return res.type("text/html").status(200).send(output);
		});
	});

	return app;
};