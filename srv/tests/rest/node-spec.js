/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0 */
/*eslint-env node, es6 */
"use strict";
// use test spec file name as description to allow navigation from the test results view
describe(__filename, () => {
	const request = require("supertest");
	this.test = require("../../utils/tests");
	this.app = this.test.getExpress();
	describe("/node/", () => {
		
		it("/node/Hello", (done) => {
			request(this.app)
				.get("/node/Hello")
				.expect(200)
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect((res) => {
					expect(res.body.EX_TOP_3_EMP_PO_COMBINED_CNT.length).not.toBeLessThan(2);
					expect(res.body.EX_TOP_3_EMP_PO_COMBINED_CNT[0].FULLNAME).toBe("Fisher, Richard Andrew");
				})
				.end((error) => (error) ? done.fail(error) : done());
		});

	});
});