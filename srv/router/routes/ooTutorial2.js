/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0, no-inner-declarations:0 */
/*eslint-env node, es6 */
module.exports = class {
	static async getFlightDetails(db, carrierId, connectionId, flightDate) {
		return new Promise(async(resolve, reject) => {
			try {
				const dbPromises = require(global.__base + "utils/dbPromises");
				let dbConn = new dbPromises(db);
				const statement = await dbConn.preparePromisified("select * from SFLIGHT WHERE CARRID = ? AND CONNID = ? and FLDATE = ? ");
				resolve(await dbConn.statementExecPromisified(statement, [carrierId, connectionId, flightDate]));
			} catch (err) {
				let error = {};
				error.message = "Invalid Flight";
				error.carrierId = carrierId;
				error.connectionId = connectionId;
				error.flightDate = flightDate;
				error.details = err; 
				reject(error);
			}
		});
	}

	static async calculateFlightPrice(db, carrierId, connectionId, flightDate) {
		return new Promise(async(resolve, reject) => {
			try {
				const dbPromises = require(global.__base + "utils/dbPromises");
				let dbConn = new dbPromises(db);
				const statement = await dbConn.preparePromisified(
					"select PRICE, CURRENCY, PLANETYPE from SFLIGHT WHERE CARRID = ? AND CONNID = ? and FLDATE = ? ");
				const results = await dbConn.statementExecPromisified(statement, [carrierId, connectionId, flightDate]);
				let price;
				switch (results[0].PLANETYPE) {
					case "747-400":
						price = results[0].PRICE * 1 + 40;
						break;
					case "A310-300":
						price = results[0].PRICE * 1 + 25;
						break;
					default:
						price = results[0].PRICE * 1 + 10;
						break;
				}
				resolve(price);
			} catch (err) {
				let error = {};
				error.message = "Invalid Flight";
				error.carrierId = carrierId;
				error.connectionId = connectionId;
				error.flightDate = flightDate;
				error.details = err; 				
				reject(error);
			}
		});
	}
};