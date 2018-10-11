/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0, no-inner-declarations:0 */
/*eslint-env node, es6 */
var ooTutorial3 = require("./ooTutorial3");
module.exports = class extends ooTutorial3 {
	constructor(db) {
		super(db);
	}

	async calculateFlightPrice() {
		return new Promise(async(resolve, reject) => {
			try {
				let price = await super.calculateFlightPrice();
				resolve(price * 1.25);
			} catch (err) {
				reject(err);
			}
		});
	}
};