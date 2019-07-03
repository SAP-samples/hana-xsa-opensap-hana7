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

	it("getPOItemsSQL", async(done) => {
		try {
			let sp = await this.test.getStoredProc(this.db, "getPOItemsSQL");
			let results = await this.db.callProcedurePromisified(sp, {});
			expect(results.results.length).not.toBeLessThan(20);
			expect(results.results[0].PRODUCT).toBe("HT-1000");
			done();

		} catch (err) {
			done.fail(err);
		}
	});

	it("get_po_by_partnerid", async(done) => {
		try {
			let sp = await this.test.getStoredProc(this.db, "get_po_by_partnerid");			
			let results = await this.db.callProcedurePromisified(sp, {IM_PARTNERID: "100000000" });
			expect(results.results.length).not.toBeLessThan(40);
			expect(results.results[0].PRODUCTID).toBe("HT-1000");
			done();

		} catch (err) {
			done.fail(err);
		}
	});	
	
	it("get_po_avg_by_partnerid", async(done) => {
		try {
			let sp = await this.test.getStoredProc(this.db, "get_po_avg_by_partnerid");	
			let results = await this.db.callProcedurePromisified(sp, {});
			expect(results.results.length).not.toBeLessThan(38);
			expect(results.results[0].PARTNERID).toBe("100000000");
			done();

		} catch (err) {
			done.fail(err);
		}
	});	

	it("get_po_grossamount_by_partnerid", async(done) => {
		try {
			let sp = await this.test.getStoredProc(this.db, "get_po_grossamount_by_partnerid");				
			let results = await this.db.callProcedurePromisified(sp, {});
			expect(results.results.length).not.toBeLessThan(1000);
			done();

		} catch (err) {
			done.fail(err);
		}
	});	

	it("get_po_header_data", async(done) => {
		try {
			let sp = await this.test.getStoredProc(this.db, "get_po_header_data");				
			let results = await this.db.callProcedurePromisified(sp, {});
			expect(results.results.length).not.toBeLessThan(3);
			expect(results.results[0].FULLNAME).toBe("Fisher, Richard Andrew");
			done();

		} catch (err) {
			done.fail(err);
		}
	});	
	
});