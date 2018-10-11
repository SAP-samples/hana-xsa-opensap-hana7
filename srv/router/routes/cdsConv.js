/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";
var express = require("express");

async function getView(db, viewId) {
	//Select View
	const statement = await db.preparePromisified(
		`SELECT * FROM VIEWS 
				  WHERE SCHEMA_NAME = (SELECT CURRENT_SCHEMA FROM DUMMY)
				    AND VIEW_NAME = ?`);
	const object = await db.statementExecPromisified(statement, [viewId]);
	if (object.length < 1) {
		throw new Error("Invalid Input View");
	}
	return object;
}

async function getViewFields(db, viewOid) {
	//Select Fields
	const statement = await db.preparePromisified(
		`SELECT * FROM VIEW_COLUMNS 
				  WHERE VIEW_OID = ?`);
	const fields = await db.statementExecPromisified(statement, [viewOid]);
	return fields;
}

async function getTable(db, tableId) {
	//Select View
	const statement = await db.preparePromisified(
		`SELECT * FROM TABLES 
				  WHERE SCHEMA_NAME = (SELECT CURRENT_SCHEMA FROM DUMMY)
				    AND TABLE_NAME = ?`);
	const object = await db.statementExecPromisified(statement, [tableId]);
	if (object.length < 1) {
		throw new Error("Invalid Input Table");
	}
	return object;
}

async function getTableFields(db, tableOid) {
	//Select Fields
	const statement = await db.preparePromisified(
		`SELECT * FROM TABLE_COLUMNS 
				  WHERE TABLE_OID = ?`);
	const fields = await db.statementExecPromisified(statement, [tableOid]);
	return fields;
}

async function getConstraints(db, object) {
	//Select Constraints
	const statement = await db.preparePromisified(
		`SELECT * from CONSTRAINTS 
	          WHERE SCHEMA_NAME = ? 
	           AND TABLE_NAME = ? 
	           AND IS_PRIMARY_KEY = ? 
	         ORDER BY POSITION `
	);
	const constraints = await db.statementExecPromisified(statement, [object[0].SCHEMA_NAME, object[0].TABLE_NAME, "TRUE"]);
	return constraints;
}

async function formatHDBCDS(object, fields, constraints, type) {
	let cdstable = "";
	cdstable += "@cds.persistence.exists \n";
	if (type === "view") {
		cdstable += `Entity ${object[0].VIEW_NAME} {\n `;
	} else {
		cdstable += `Entity ${object[0].TABLE_NAME} {\n `;
	}

	var isKey = "FALSE";
	for (let field of fields) {

		isKey = "FALSE";
		if (type === "table") {
			if (object[0].HAS_PRIMARY_KEY === "TRUE") {
				for (let constraint of constraints) {
					if (field.COLUMN_NAME === constraint.COLUMN_NAME) {
						cdstable += "key ";
						isKey = "TRUE";
					}
				}
			}
		}
		cdstable += "\t";
		cdstable += field.COLUMN_NAME + ": ";

		switch (field.DATA_TYPE_NAME) {
		case "NVARCHAR":
			cdstable += `String(${field.LENGTH})`;
			break;
		case "VARCHAR":
			cdstable += `String(${field.LENGTH})`;
			break;
		case "NCLOB":
			cdstable += "LargeString";
			break;
		case "VARBINARY":
			cdstable += `Binary(${field.LENGTH})`;
			break;
		case "BLOB":
			cdstable += "LargeBinary";
			break;
		case "INTEGER":
			cdstable += "Integer";
			break;
		case "BIGINT":
			cdstable += "Integer64";
			break;
		case "DECIMAL":
			cdstable += `Decimal(${field.LENGTH}, ${field.SCALE})`;
			break;
		case "DOUBLE":
			cdstable += "Double";
			break;
		case "DATE":
			cdstable += "Date";
			break;
		case "TIME":
			cdstable += "Time";
			break;
		case "SECONDDATE":
			cdstable += "Timestamp";
			break;
		case "TIMESTAMP":
			cdstable += "Timestamp";
			break;
		case "BOOLEAN":
			cdstable += "Boolean";
			break;
		default:
			// cdstable += `
			// 		hana.$ {
			// 			field.DATA_TYPE_NAME
			// 		}
			// 		`;
			cdstable += `**UNSUPPORTED TYPE - ${field.DATA_TYPE_NAME}`;

		}

		if (field.DEFAULT_VALUE) {
			cdstable += `default "${field.DEFAULT_VALUE}"`;
		}

		if (field.IS_NULLABLE === "FALSE") {
			if (isKey === "FALSE") {
				cdstable += " not null";
			}
		} else {
			if (isKey === "TRUE") {
				cdstable += " null";
			}
		}
		cdstable += "; ";

		cdstable += "\n";
	}
	cdstable += "}\n";
	return cdstable;
}

module.exports = function () {
	var app = express.Router();

	app.get("/view/:viewId", async(req, res) => {
		let client = req.db;
		let viewId = req.params.viewId;
		try {
			const dbClass = require(global.__base + "utils/dbPromises");
			let db = new dbClass(req.db);

			let object = await getView(db, viewId);
			let fields = await getViewFields(db, object[0].VIEW_OID);
			let output = await formatHDBCDS(object, fields, null, "view");
			return res.type("text/plain").status(200).send(output.toString());
		} catch (e) {
			return res.type("text/plain").status(500).send(`ERROR: ${e.toString()}`);
		}
	});

	app.get("/table/:tableId", async (req, res) => {
		let client = req.db;
		let tableId = req.params.tableId;
		try {
			const dbClass = require(global.__base + "utils/dbPromises");
			let db = new dbClass(req.db);

			let object = await getTable(db, tableId);
			let fields = await getTableFields(db, object[0].TABLE_OID);
			let constraints = await getConstraints(db, object);
			let output = await formatHDBCDS(object, fields, constraints, "table");
			return res.type("text/plain").status(200).send(output.toString());
		} catch (e) {
			return res.type("text/plain").status(500).send(`ERROR: ${e.toString()}`);
		}
	});

	return app;
};