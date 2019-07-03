/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0 */
/*eslint-env node, es6 */
"use strict";
// use test spec file name as description to allow navigation from the test results view
describe(__filename, () => {
	this.base = __dirname + "/";
	this.test = require("../../utils/tests");

	beforeEach(async(done) => {
		this.db = await this.test.getDBClass(await this.test.getClient());
		this.sp = await this.test.getStoredProc(this.db, "between_two_integers");
		done();
	});

	it("true", async(done) => {
		try {
			let results = await this.db.callProcedurePromisified(this.sp, {
				IM_INT: 5,
				IM_LOW: 3,
				IM_HIGH: 9
			});
			expect(results.outputScalar.EX_VALID).toBe(true);
			done();
		} catch (err) {
			done.fail(err);
		}
	});

	it("false", async(done) => {
		try {
			let results = await this.db.callProcedurePromisified(this.sp, {
				IM_INT: 1,
				IM_LOW: 3,
				IM_HIGH: 9
			});
			expect(results.outputScalar.EX_VALID).toBe(false);
			done();
		} catch (err) {
			done.fail(err);
		}
	});

});