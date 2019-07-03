/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0 */
/*eslint-env node, es6 */
"use strict";
// use test spec file name as description to allow navigation from the test results view
describe(__filename, () => {
	this.base = __dirname + "/";
	this.test = require("../../utils/tests");

	beforeEach(async(done) => {
		this.db = await this.test.getDBClass(await this.test.getClient());
		done();
	});

	it("get_address", async(done) => {
		try {
			let sp = await this.test.getStoredProc(this.db, "get_address");
			let results = await this.db.callProcedurePromisified(sp, {IM_ADDRESSID: "1000000001" });
			expect(results.results.length).not.toBeLessThan(1);
			expect(results.results[0].ADDRESSID).toBe(1000000001);
			done();

		} catch (err) {
			done.fail(err);
		}
	});

	it("get_bp_addresses_by_role", async(done) => {
		try {
			let sp = await this.test.getStoredProc(this.db, "get_bp_addresses_by_role");
			let results = await this.db.callProcedurePromisified(sp, {IM_PARTNERROLE: "1"});
			expect(results.results.length).not.toBeLessThan(39);
			expect(results.results[0].PARTNERID).toBe("100000000");
			expect(results.results[0].CITY).toBe("Walldorf");			
			done();

		} catch (err) {
			done.fail(err);
		}
	});	

	it("get_addresses_map_merge", async(done) => {
		try {
			let sp = await this.test.getStoredProc(this.db, "get_addresses_map_merge");
			let results = await this.db.callProcedurePromisified(sp, { });
			expect(results.results.length).not.toBeLessThan(33);
			done();

		} catch (err) {
			done.fail(err);
		}
	});		
	
});	