/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0 */
/*eslint-env node, es6 */
"use strict";
// use test spec file name as description to allow navigation from the test results view
describe(__filename, () => {
	this.base = __dirname + "/";
	this.test = require("../../utils/tests");

	beforeEach(async(done) => {
		try {
			this.db = await this.test.getDBClass(await this.test.getClient());
			let sp = await this.test.getStoredProc(this.db, "jsonInitializeTest1");
			await this.db.callProcedurePromisified(sp, {});
			done();
		} catch (err) {
			done.fail(err);
		}
	});

	afterEach(async(done) => {
		try {
			await this.test.execSQL(this.db.client, "TRUNCATE TABLE \"jsonExamples.jsonTbl1\"");
			done();
		} catch (err) {
			done.fail(err);
		}
	});

	it("jsonFormattedColumn", async(done) => {
		try {
			let sp = await this.test.getStoredProc(this.db, "jsonFormattedColumn");
			let results = await this.db.callProcedurePromisified(sp, {});
			expect(results.results.length).not.toBeLessThan(1);
			done();
		} catch (err) {
			done.fail(err);
		}
	});

	it("jsonNestedColumn", async(done) => {
		try {
			let sp = await this.test.getStoredProc(this.db, "jsonNestedColumn");
			let results = await this.db.callProcedurePromisified(sp, {});
			expect(results.results.length).not.toBeLessThan(1);
			done();
		} catch (err) {
			done.fail(err);
		}
	});


	it("jsonOrdinalityNested", async(done) => {
		try {
			let sp = await this.test.getStoredProc(this.db, "jsonOrdinalityNested");
			let results = await this.db.callProcedurePromisified(sp, {});
			expect(results.results.length).not.toBeLessThan(1);
			done();
		} catch (err) {
			done.fail(err);
		}
	});

	it("jsonQuery", async(done) => {
		try {
			let sp = await this.test.getStoredProc(this.db, "jsonQuery");
			let results = await this.db.callProcedurePromisified(sp, {});
			expect(results.results0.length).not.toBeLessThan(1);
			expect(results.results1.length).not.toBeLessThan(1);
			expect(results.results2.length).not.toBeLessThan(1);	
			expect(results.results3.length).not.toBeLessThan(1);	
			expect(results.results4.length).not.toBeLessThan(1);	
			expect(results.results5.length).not.toBeLessThan(1);		
			expect(results.results6.length).not.toBeLessThan(1);				
			done();
		} catch (err) {
			done.fail(err);
		}
	});

	it("jsonTableOrdinalityRegular", async(done) => {
		try {
			let sp = await this.test.getStoredProc(this.db, "jsonTableOrdinalityRegular");
			let results = await this.db.callProcedurePromisified(sp, {});
			expect(results.results.length).not.toBeLessThan(1);
			done();
		} catch (err) {
			done.fail(err);
		}
	});

	it("jsonValue", async(done) => {
		try {
			let sp = await this.test.getStoredProc(this.db, "jsonValue");
			let results = await this.db.callProcedurePromisified(sp, {});
			expect(results.results0.length).not.toBeLessThan(1);
			expect(results.results1.length).not.toBeLessThan(1);
			expect(results.results2.length).not.toBeLessThan(1);	
			expect(results.results3.length).not.toBeLessThan(1);	
			done();
		} catch (err) {
			done.fail(err);
		}
	});
	
});