/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0 */
/*eslint-env node, es6 */
"use strict";
// use test spec file name as description to allow navigation from the test results view
describe(__filename, () => {
	this.base = __dirname + "/";
	this.test = require("../../utils/tests");

	beforeEach(async(done) => {
		this.db = await this.test.getDBClass(await this.test.getClient());
		this.sp = await this.test.getStoredProc(this.db, "ServerCookiesWrapper");
		done();
	});

	it("Application Var", async(done) => {
		try {
			var now = new Date();
			var nextMonth = new Date();
			nextMonth.setDate(now.getDate() + 30);
			let results = await this.db.callProcedurePromisified(this.sp, {
				IM_OPERATION: "SET_APP_VAR",
				IM_APPLICATION: "ATEST",
				IM_EXPIRY: nextMonth.toJSON(),
				IM_DATA: "APP TEST",
				IM_NAME: "TESTVAR"
			});
			let results2 = await this.db.callProcedurePromisified(this.sp, {
				IM_OPERATION: "GET_APP_VAR",
				IM_APPLICATION: "ATEST",
				IM_NAME: "TESTVAR"
			});
			expect(results2.results.length).not.toBeLessThan(1);
			expect(results2.results[0].DATA.toString("utf8")).toBe("APP TEST");
			let results3 = await this.db.callProcedurePromisified(this.sp, {
				IM_OPERATION: "GET_APP_VARS",
				IM_APPLICATION: "ATEST"
			});
			expect(results3.results.length).not.toBeLessThan(1);
			done();
		} catch (err) {
			done.fail(err);
		}
	});

	it("Session Var", async(done) => {
		try {
			var now = new Date();
			var nextMonth = new Date();
			nextMonth.setDate(now.getDate() + 30);

			let results = await this.db.callProcedurePromisified(this.sp, {
				IM_OPERATION: "SET_SESSION_VAR",
				IM_SESSIONID: "123",
				IM_APPLICATION: "STEST",
				IM_EXPIRY: nextMonth.toJSON(),
				IM_DATA: "SESS TEST",
				IM_NAME: "TESTVAR"
			});
			let results2 = await this.db.callProcedurePromisified(this.sp, {
				IM_OPERATION: "GET_SESSION_VAR",
				IM_SESSIONID: "123",
				IM_APPLICATION: "STEST",
				IM_NAME: "TESTVAR"
			});
			expect(results2.results.length).not.toBeLessThan(1);
			expect(results2.results[0].DATA.toString("utf8")).toBe("SESS TEST");
			let results3 = await this.db.callProcedurePromisified(this.sp, {
				IM_OPERATION: "GET_SESSION_VARS",
				IM_SESSIONID: "123",
				IM_APPLICATION: "STEST"
			});
			expect(results3.results.length).not.toBeLessThan(1);
			done();
		} catch (err) {
			done.fail(err);
		}
	});

	it("Clean Up", async(done) => {
		try {
			let results = await this.db.callProcedurePromisified(this.sp, {
				IM_OPERATION: "CLEAN_UP"
			});
			done();
		} catch (err) {
			done.fail(err);
		}
	});

});