/*eslint no-console: 0, no-unused-vars: 0, no-undef:0, no-process-exit:0, new-cap:0*/
/*eslint-env node, es6 */

"use strict";

const uuid = require("uuid/v4");
const cds = require("@sap/cds");

/**
 * Register handlers to events.
 * @param {Object} entities
 * @param {Object} entities.POs
 * @param {Object} entities.POItems
 * @param {Object} entities.POItemsView
 * @param {Object} entities.Buyer
 * @param {Object} entities.User
 */
module.exports = function (entities) {
	const {
		Catalog
	} = entities;

	/*	this.before("READ", entities.POs, (entity) =>{
			
		});*/

	this.after("READ", "POItems", (entity) => {
		if (entity.length > 0) {
			let now = new Date();
			let nextMonth = new Date();
			nextMonth.setDate(now.getDate() + 30);
			entity[0].DELIVERYDATE = nextMonth.toJSON();
		}
	});

	this.after("READ", "CURRENCY", (entity) => {
		if (entity.length > 0) {
			for (let item of entity) {
				if (item.CODE === null) {
					item.CODE = "NUL"; //remove the NULL value
				}
			}
		}
	});

	this.before("CREATE", "POs", (Orders) => {
		console.log("Before Create");
		const {
			data,
			run
		} = Orders;
		//data.ID = uuid();
		var now = new Date();
		data.HISTORY_CREATEDAT = now.toJSON();
	});

	this.after("CREATE", "POs", (Orders) => {
		console.log("After Create");
	});

	function validateEmail(email) {
		var re =
			/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}

	this.on("CREATE", "User", async(User) => {
		console.log("Before User Create");
		const {
			data
		} = User;
		if (data.length < 1) {
			return null;
		}

		if (!validateEmail(data.EMAIL)) {
			throw new Error(`Invalid email for ${data.FIRSTNAME}. No Way! E-Mail must be valid and ${data.EMAIL} has problems`);
		}

		const dbClass = require(global.__base + "utils/dbPromises");
		var client = await dbClass.createConnection();
		let db = new dbClass(client);
		const insStatement = await db.preparePromisified(
			`INSERT INTO "UserData.User" 
			        ("FirstName", "LastName", "Email")
			        VALUES (?,?,?)`
		);
		const updResults = await db.statementExecPromisified(insStatement, [data.FIRSTNAME, data.LASTNAME, data.EMAIL]);

		const statement = await db.preparePromisified(
			`SELECT CURRENT_IDENTITY_VALUE() AS ID
						 FROM DUMMY`);
		const userResults = await db.statementExecPromisified(statement, []);
		data.USERID = userResults[0].ID;
		console.log(JSON.stringify(data));
		return data;

	});

	this.on("UPDATE", "User", async(User) => {
		console.log("Before User Update");
		const {
			data
		} = User;
		if (data.length < 1) {
			return null;
		}

		const dbClass = require(global.__base + "utils/dbPromises");
		var client = await dbClass.createConnection();
		let db = new dbClass(client);
		const statement = await db.preparePromisified(
			`SELECT * FROM USER_DETAILS 
						  WHERE USERID = ?`);
		const userResults = await db.statementExecPromisified(statement, [data.USERID]);
		Object.keys(data).forEach(function (key) {
			userResults[0][key] = data[key];
		});
		const updStatement = await db.preparePromisified(
			`UPDATE "UserData.User" SET
			              "FirstName" = ?,
			              "LastName" = ?,
			              "Email" = ?
						  WHERE "UserId" = ?`
		);
		const updResults = await db.statementExecPromisified(updStatement, [userResults[0].FIRSTNAME, userResults[0].LASTNAME, userResults[0].EMAIL,
			userResults[0].USERID
		]);
		return userResults[0];

	});
};