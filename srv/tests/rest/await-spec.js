/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0 */
/*eslint-env node, es6 */
"use strict";
// use test spec file name as description to allow navigation from the test results view
describe(__filename, () => {
	const request = require("supertest");
	this.test = require("../../utils/tests");
	this.app = this.test.getExpress();
	describe("/node/await", () => {

		it("/node/await/await", (done) => {
			request(this.app)
				.get("/node/await/await")
				.expect(200)
				.expect("Content-Type", "text/html; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/await/awaitError", (done) => {
			request(this.app)
				.get("/node/await/awaitError")
				.expect(200)
				.expect("Content-Type", "text/html; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/await/awaitDB1", (done) => {
			request(this.app)
				.get("/node/await/awaitDB1")
				.expect(200)
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect((res) => {
					expect(res.body.Objects.length).not.toBeLessThan(1);
					expect(res.body.Objects[0].SESSION_USER.indexOf("OPENSAPHANA_HDI_CONTAINER") !== -1).toBe(true);
				})
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/await/awaitDB2", (done) => {
			request(this.app)
				.get("/node/await/awaitDB2")
				.expect(200)
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect((res) => {
					expect(res.body.EX_TOP_3_EMP_PO_COMBINED_CNT.length).not.toBeLessThan(3);
					expect(res.body.EX_TOP_3_EMP_PO_COMBINED_CNT[0].FULLNAME.indexOf("Fisher, Richard Andrew") !== -1).toBe(true);
				})
				.end((error) => (error) ? done.fail(error) : done());
		});
		
	});
});