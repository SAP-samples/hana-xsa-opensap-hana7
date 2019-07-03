/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0, no-redeclare: 0*/
"use strict";

$.import("sap.hana.democontent.epm.services", "session");
var SESSIONINFO = $.sap.hana.democontent.epm.services.session;

function validateEmail(email) {
	var re =
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

/**
@param {connection} Connection - The SQL connection used in the OData request
@param {beforeTableName} String - The name of a temporary table with the single entry before the operation (UPDATE and DELETE events only)
@param {afterTableName} String -The name of a temporary table with the single entry after the operation (CREATE and UPDATE events only)
*/
function usersCreate(param) {

	try {
		var after = param.afterTableName;

		//Get Input New Record Values
		var pStmt = param.connection.prepareStatement("select * from \"" + after + "\"");
		var rs = null;
		var User = SESSIONINFO.recordSetToJSON(pStmt.executeQuery(), "Details");
		pStmt.close();
		console.log(JSON.stringify(User));
		console.log(User.Details[0].FirstName);
		//Validate Email
		if (!validateEmail(User.Details[0].Email)) {
			throw "Invalid email for " + User.Details[0].FirstName +
				" No Way! E-Mail must be valid and " + User.Details[0].Email + " has problems";
		}

		pStmt = param.connection.prepareStatement("insert into \"UserData.User\" (\"FirstName\", \"LastName\", \"Email\") values(?,?,?)");

		pStmt.setString(1, User.Details[0].FirstName.toString());
		pStmt.setString(2, User.Details[0].LastName.toString());
		pStmt.setString(3, User.Details[0].Email.toString());

		pStmt.executeUpdate();
		pStmt.close();
		//		}
	} catch (e) {
		console.error(e);
		throw e;
	}
}