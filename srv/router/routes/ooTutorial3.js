/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0, no-inner-declarations:0 */
/*eslint-env node, es6 */
module.exports = class {
	constructor(db) {
		this.db = db;
	}
	async getFlightDetails(carrierId, connectionId, flightDate) {
		const dbPromises = require(global.__base + "utils/dbPromises");
		let dbConn = new dbPromises(this.db);
		return new Promise(async(resolve, reject) => {
			try {
				const statement = await dbConn.preparePromisified("select * from SFLIGHT WHERE CARRID = ? AND CONNID = ? and FLDATE = ? ");
				this.flight = await dbConn.statementExecPromisified(statement, [carrierId, connectionId, flightDate]);
				resolve(this.flight);
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

	calculateFlightPrice() {
		return new Promise(async(resolve, reject) => {
			try {
				let price;
				switch (this.flight[0].PLANETYPE) {
					case "747-400":
						price = this.flight[0].PRICE * 1 + 40;
						break;
					case "A310-300":
						price = this.flight[0].PRICE * 1 + 25;
						break;
					default:
						price = this.flight[0].PRICE * 1 + 10;
						break;
				}
				resolve(price);
			} catch (err) {
				let error = {};
				error.message = "Flight not loaded yet";
				error.details = err;
				reject(error);
			}
		});
	}
};