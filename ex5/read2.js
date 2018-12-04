/*eslint no-console: 0, no-unused-vars: 0, no-undef:0, no-process-exit:0, new-cap:0*/
/*eslint-env node, es6 */

"use strict";

const uuid = require("uuid/v4");
const cds = require("@sap/cds");


module.exports = function (entities) {
	const {
		catalog
	} = entities;

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


};	
