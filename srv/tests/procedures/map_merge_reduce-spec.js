/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0 */
/*eslint-env node, es6 */
"use strict";
// use test spec file name as description to allow navigation from the test results view
describe(__filename, () => {
	this.base = __dirname + "/";
	this.test = require("../../utils/tests");

	beforeEach(async(done) => {
		this.db = await this.test.getDBClass(await this.test.getClient());
		this.sp = await this.test.getStoredProc(this.db, "count_characters_map_merge");
		this.sp2 = await this.test.getStoredProc(this.db, "count_characters_map_reduce");		
		done();
	});

	it("Merge Test", async(done) => {
		try {
			let results = await this.db.callProcedurePromisified(this.sp, {});
			expect(results.results.length).not.toBeLessThan(12);
			expect(results.results[0].VAL).toBe("A");
			done();

		} catch (err) {
			done.fail(err);
		}
	});
	
	it("Reduce Test", async(done) => {
		try {
			let results = await this.db.callProcedurePromisified(this.sp2, {});
			expect(results.results.length).not.toBeLessThan(5);
			expect(results.results[0].VAL).toBe("A");
			done();

		} catch (err) {
			done.fail(err);
		}
	});
	
});